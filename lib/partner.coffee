$(window).on "scroll", ->
  pos = $(window).scrollTop()
  if pos > 91
    $('th.inner-table').addClass "fixed"
    $('.ui-view-container').css "padding-top": "40px"
  else
    $('th.inner-table').removeClass "fixed"
    $('.ui-view-container').css "padding-top": "0"

app = angular.module("Partner Panel", [
  "restangular"
  "ui.router"
  "ui.bootstrap"
  "angularUtils.directives.dirPagination"
  "ngSanitize"
  "ngAnimate"
])

angular.module("Partner Panel").directive 'ngReallyClick', [ ->
  {
    restrict: 'A'
    link: (scope, element, attrs) ->
      element.bind 'click', ->
        message = attrs.ngReallyMessage
        if message and confirm(message)
          scope.$apply attrs.ngReallyClick
        return
      return
  }
 ]

app.filter "slug", ->
  (input) ->
    input.toLowerCase().replace /[^a-z_]/g, "-"  if input

count = (ary, classifier) ->
  ary.reduce ((counter, item) ->
    p = (classifier or String)(item)
    counter[p] = (if counter.hasOwnProperty(p) then counter[p] + 1 else 1)
    counter
  ), {}

# Inject Restangular into your controller
app.config ($stateProvider, $urlRouterProvider, RestangularProvider) ->

  # If no URL State is specified, load the search area
  $urlRouterProvider.otherwise "/"

  # User List
  $stateProvider.state "home",
    url: "/"
    views: 
      'main':
        templateUrl: "/partner/partials/search"
        controller: (Restangular, $stateParams, $scope, $state, $filter) ->
          Restangular.all("api/v1").customGET("partner/clients/" + $currentUser).then (clients) ->
            $scope.users = clients.data
            $scope.$root.clientsList = clients.data
          Restangular.one("api/v1").customGET("user/" + $currentUser).then (user) ->
            $scope.$root.currentUser = user.data
            $scope.memberSince = new Date(user.data.createdAt)
            utc = Date.parse($scope.memberSince)
            $scope.memberSince = "N/A" unless isNaN(utc) is false
          Restangular.all("api/v1").customGET("partner/keys/" + $currentUser + "/list").then (keys) ->
            $scope.$root.keys = keys.data
            $scope.$root.keys.active = $filter('filter')(keys.data, {status: 'Active'}, true)
            $scope.$root.keys.pending = $filter('filter')(keys.data, {status: 'Pending'}, true)
            $scope.$root.keys.inactive = $filter('filter')(keys.data, {status: 'Inactive'}, true)
          $scope.toggleFilter =  ->
            $scope.search.name.first = true
          $scope.changeState = (state) ->
            $state.go state
          $scope.edit = false
      'sidebarOne': 
        templateUrl: "/partner/partials/keys"
      'sidebarTwo':
        templateUrl: "/partner/partials/staff"
        controller: (Restangular, $stateParams, $scope, $state) ->
          $scope.edit = false
          Restangular.all("api/v1").customGET("partner/staff/" + $currentUser).then (staff) ->
            $scope.staff = staff.data
          $scope.toggleFilter =  ->
            $scope.search.name.first = true
          $scope.changeState = (state) ->
            $state.go state

  # Individual User Page
  $stateProvider.state "client",
    url: "/client/:id"
    views:
      "main":
        templateUrl: "/partner/partials/client"
        controller: (Restangular, $stateParams, $scope, $state, $timeout, $http, $window) ->
          $scope.saving = false
          $scope.saved = false
          $scope.onSubmit = ->
            $scope.saving = true
            $http.post('/api/v1/partner/clients/'+$scope.user._id+'/update', $scope.user)
              .success (data, status, headers, config) ->
                $scope.saving = false
                $scope.saved = true
                $timeout ->
                  $scope.saved = false
                , 1000
              .error (data, status, headers, config) ->
                # Error
                console.log status
          $scope.deleteClient = ->
            $http.delete('/api/v1/partner/clients/'+$scope.user._id+'/delete')
              .success (data, status, headers, config) ->
                # Redirect
                $window.location = '/partner'
              .error (data, status, headers, config) ->
                # Error
                console.log status
          Restangular.one("api/v1").customGET("user/" + $stateParams.id).then (user) ->
            $scope.user = user.data
            $scope.memberSince = new Date(user.data.createdAt)
            utc = Date.parse($scope.memberSince)
            $scope.memberSince = "N/A" unless isNaN(utc) is false

          $scope.changeState = (state) ->
            $state.go state
      "sidebarOne":
        templateUrl: "/partner/partials/client/keys/manage"
        controller: (Restangular, $scope, $stateParams) ->
          # $scope.keys = []
          # $scope.keys.current = 100
          # $scope.keys.new = 10
          # $scope.keys.total = ($scope.keys.current + $scope.keys.new)
          $scope.updateKeys = ->
            if !$scope.keyDistributionForm.$valid
              $scope.fixErrors = true
              return
            else
              console.log 'This is submitting'
          Restangular.one("api/v1").customGET("user/" + $stateParams.id).then (user) ->
            $scope.user = user.data
            $scope.memberSince = new Date(user.data.createdAt)
            utc = Date.parse($scope.memberSince)
            $scope.memberSince = "N/A" unless isNaN(utc) is false
      "sidebarTwo": 
        templateUrl: "/partner/partials/keys"

  # Individual User Page
  $stateProvider.state "staff",
    url: "/staff/:id"
    views:
      "main":
        templateUrl: "/partner/partials/staff/edit"
        controller: (Restangular, $stateParams, $scope, $state, $timeout, $http, $window) ->
          $scope.saving = false
          $scope.saved = false
          $scope.onSubmit = ->
            $scope.saving = true
            $http.post('/api/v1/partner/staff/'+$scope.user._id+'/update', $scope.user)
              .success (data, status, headers, config) ->
                $scope.saving = false
                $scope.saved = true
                $timeout ->
                  $scope.saved = false
                , 1000
              .error (data, status, headers, config) ->
                # Error
                console.log status
          $scope.deleteClient = ->
            $http.delete('/api/v1/partner/staff/'+$scope.user._id+'/delete')
              .success (data, status, headers, config) ->
                # Redirect
                $window.location = '/partner'
              .error (data, status, headers, config) ->
                # Error
                console.log status
          Restangular.one("api/v1").customGET("user/" + $stateParams.id).then (user) ->
            $scope.user = user.data
            $scope.memberSince = new Date(user.data.createdAt)
            utc = Date.parse($scope.memberSince)
            $scope.memberSince = "N/A" unless isNaN(utc) is false
          $scope.changeState = (state) ->
            $state.go state
            
      "staff":
        templateUrl: "/partner/partials/staff"
        controller: (Restangular, $stateParams, $scope) ->
          Restangular.all("api/v1").customGET("partner/staff/" + $currentUser).then (staff) ->
            $scope.staff = staff.data
          $scope.toggleFilter =  ->
            $scope.search.name.first = true

  $stateProvider.state "createClient",
    url: "/client/create"
    views:
      "main":
        templateUrl: "/partner/partials/client/create"
        controller: (Restangular, $stateParams, $scope, $state, $timeout, $http, $window) ->
          $scope.currentUser = $currentUser
          $scope.createClient = ->
            $scope.client.licensePartner = $currentUser
            $http.post('/api/v1/partner/clients', $scope.client)
              .success (data, status, headers, config) ->
                $window.location = '/partner'
              .error (data, status, headers, config) ->
                # Error
                console.log status
          $scope.changeState = (state) ->
            $state.go state

  $stateProvider.state "createStaff",
    url: "/staff/create"
    views:
      "main":
        templateUrl: "/partner/partials/staff/create"
        controller: (Restangular, $stateParams, $scope, $state, $timeout, $http, $window) ->
          $scope.currentUser = $currentUser
          $scope.createStaff = ->
            $scope.staff.licensePartner = $currentUser
            $http.post('/api/v1/partner/staff', $scope.staff)
              .success (data, status, headers, config) ->
                $window.location = '/partner'
              .error (data, status, headers, config) ->
                # Error
                console.log status
          $scope.changeState = (state) ->
            $state.go state
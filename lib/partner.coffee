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

# app.filter "slug", ->
#   (input) ->
#     input.toLowerCase().replace /[^a-z_]/g, "-" if input

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
          Restangular.all("api/v1").customGET("user/" + $currentUser).then (user) ->
            $scope.$root.currentUser = user.data
            $scope.memberSince = new Date(user.data.createdAt)
            utc = Date.parse($scope.memberSince)
            $scope.memberSince = "N/A" unless isNaN(utc) is false
          Restangular.all("api/v1").customGET("partner/clients/" + $currentUser).then (clients) ->
            for client in clients.data
              Restangular.all("api/v1").customGET("client/keys/" + client._id + "/list").then (keys) ->
                client.keys = keys.data.length
            $scope.users = clients.data
            $scope.$root.clientsList = clients.data
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
        templateUrl: "/partner/partials/invoices"
        controller: (Restangular, $stateParams, $scope) ->
          Restangular.all("api/v1").customGET("partner/invoices/" + $currentUser + "/list").then (invoices) ->
            $scope.$root.invoices = invoices.data
      'sidebarTwo': 
        templateUrl: "/partner/partials/keys"
        controller: (Restangular, $stateParams, $scope, $http, $window) ->
          $scope.newKeys = 0
          $scope.generateKeys = ->
            $http.post('/partner/partials/keys', {amount: $scope.newKeys})
              .success (data, status, headers, config) ->
                $window.location = '/partner'
              .error (data, status, headers, config) ->
                console.log status
      'sidebarThree':
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
        controller: (Restangular, $stateParams, $scope, $state, $timeout, $http, $window, $filter) ->
          $scope.saving = false
          $scope.saved = false
          $scope.$root.clientKeys = $filter('filter')($scope.$root.keys, {client: $stateParams.id})
          $scope.$root.clientID = $stateParams.id
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
            Restangular.all("api/v1").customGET("client/keys/" + user.data._id + "/list").then (keys) ->
              $scope.user.noOfKeys = keys.data.length
          $scope.changeState = (state) ->
            $state.go state

      "sidebarOne":
        templateUrl: "/partner/partials/client/keys/manage"
        controller: (Restangular, $scope, $stateParams, $http, $window) ->
          Restangular.one("api/v1").customGET("user/" + $stateParams.id).then (user) ->
            $scope.user = user.data
            $scope.memberSince = new Date(user.data.createdAt)
            utc = Date.parse($scope.memberSince)
            $scope.memberSince = "N/A" unless isNaN(utc) is false
          $scope.updateKeys = ->
            if !$scope.keyDistributionForm.$valid
              $scope.fixErrors = true
              return
            else
              $http.post('partner/partials/client/keys/manage', {licensePartner: $currentUser, client: $scope.$root.clientID, amount: $scope.form.newKeys})
                .success (data, status, headers, config) ->
                  # Success
                  console.log status
                  $window.location = '/partner'
                .error (data, status, headers, config) ->
                  # Error
                  console.log status

      "sidebarTwo": 
        templateUrl: "/partner/partials/keys"
        controller: (Restangular, $stateParams, $scope, $http, $window) ->
          $scope.requestKeys = false
          $scope.generateKeys = ->
            $http.post('/partner/partials/keys', {amount: $scope.newKeys})
              .success (data, status, headers, config) ->
                $window.location = '/partner'
              .error (data, status, headers, config) ->
                console.log status

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

      "sidebarOne":
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
      "sidebarOne":
        templateUrl: "/partner/partials/keys"
        controller: (Restangular, $stateParams, $scope) ->
          $scope.$root.requestKeys = false

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
      "sidebarOne":
        templateUrl: "/partner/partials/staff"
        controller: (Restangular, $stateParams, $scope) ->
          Restangular.all("api/v1").customGET("partner/staff/" + $currentUser).then (staff) ->
            $scope.staff = staff.data
          $scope.toggleFilter =  ->
            $scope.search.name.first = true
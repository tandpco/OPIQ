app = angular.module("Client Center", [
  "restangular"
  "ui.router"
  "ui.bootstrap"
  "angularUtils.directives.dirPagination"
  "ngSanitize"
  "ngAnimate"
])

angular.module("Client Center").directive 'ngReallyClick', [ ->
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
    input.toLowerCase().replace /[^a-z_]/g, "-" if input

# Inject Restangular into your controller
app.config ($stateProvider, $urlRouterProvider, RestangularProvider) ->

  # If no URL State is specified, load the search area
  $urlRouterProvider.otherwise "/"

  # User List
  $stateProvider.state "home",
    url: "/"
    views: 
      'main':
        templateUrl: "/client/partials/search"
        controller: (Restangular, $stateParams, $scope, $state, $filter) ->
          Restangular.all("api/v1").customGET("client/" + $currentUser + "/users").then (users) ->
            $scope.$root.users = users.data
            $scope.$root.users.length = users.data.length
          Restangular.all("api/v1").customGET("client/keys/" + $currentUser + "/list").then (keys) ->
            $scope.$root.keys = keys.data
            $scope.$root.keys.active = $filter('filter')(keys.data, {status: 'Active'}, true)
            $scope.$root.keys.distributed = $filter('filter')(keys.data, {status: 'Distributed'}, true)
            $scope.$root.keys.pending = $filter('filter')(keys.data, {status: 'Pending'}, true)
            $scope.$root.keys.inactive = $filter('filter')(keys.data, {status: 'Inactive'}, true)
          $scope.toggleFilter =  ->
            $scope.search.name.first = true
          $scope.changeState = (state) ->
            $state.go state
          $scope.edit = false
      'sidebarOne': 
        templateUrl: "/client/partials/keys"
      # 'sidebarTwo':
      #   templateUrl: "/client/partials/assessments"
      #   controller: (Restangular, $stateParams, $scope, $state) ->
      #     $scope.edit = false
      #     Restangular.all("api/v1").customGET("client/staff/" + $currentUser).then (staff) ->
      #       $scope.staff = staff.data
      #     $scope.toggleFilter = ->
      #       $scope.search.name.first = true
      #     $scope.changeState = (state) ->
      #       $state.go state

  # Individual User Page
  $stateProvider.state "user",
    url: "/user/:id"
    views:
      "main":
        templateUrl: "/client/partials/client"
        controller: (Restangular, $stateParams, $scope, $state, $timeout, $http, $window, $filter) ->
          $scope.saving = false
          $scope.saved = false
          $scope.$root.userKeys = $filter('filter')($scope.$root.keys, {user: $stateParams.id})
          $scope.$root.userID = $stateParams.id
          $scope.onSubmit = ->
            $scope.saving = true
            $http.post('/api/v1/user/'+$scope.user._id+'/update', $scope.user)
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
            $http.delete('/api/v1/user/'+$scope.user._id+'/remove')
              .success (data, status, headers, config) ->
                # Redirect
                $window.location = '/client-center'
              .error (data, status, headers, config) ->
                # Error
                console.log status
          Restangular.one("api/v1").customGET("user/" + $stateParams.id).then (user) ->
            $scope.user = user.data
            $scope.memberSince = new Date(user.data.createdAt)
            utc = Date.parse($scope.memberSince)
            $scope.memberSince = "N/A" unless isNaN(utc) is false
            Restangular.all("api/v1").customGET("user/" + $stateParams.id + "/keys").then (keys) ->
              $scope.user.noOfKeys = keys.data.length

          # Inject MATH
          $scope.Math = window.Math

          Restangular.all("api/v1").customGET("pages/list").then (pages) ->
            $scope.pages = pages.data
            console.log "Found pages!"

            Restangular.one("api/v1").customGET("user/" + $stateParams.id).then (user) ->
              $scope.user = user.data
              $scope.memberSince = new Date(user.data.createdAt)
              utc = Date.parse($scope.memberSince)
              $scope.memberSince = "N/A" unless isNaN(utc) is false

            Restangular.all("api/v1").customGET("user/" + $stateParams.id + "/assessments").then (assessments) ->
              $scope.assessments = assessments.data
              assessments.data.forEach (assessment) ->
                Restangular.all("api/v1").customGET("assessment/" + assessment._id + "/" + assessment.user).then (answers) ->
                  assessment.answers = answers.data
                  assessment.pages = $scope.pages
                  assessment.percentComplete = Math.round(100*assessment.answers.length/assessment.pages.length)
                  assessment.complete = true unless assessment.percentComplete != 100

                  x = 0
                  test = []
                  totalz = 0

                  while x < answers.length

                    test.push assessment.answers[x].page

                    # Get the total of the answers
                    totalz = Number(total) + Number(assessment.answers[x].answer)

                    x++

                  z = 0
                  testing = []
                  completed = []

                  while z < assessment.pages.length

                    testing.push assessment.pages[z].name

                    if _.contains answers, assessment.pages[z].name

                      $scope.assessment.pages[z].status = 'complete'

                      # Get the number of answered questions
                      completed.push $scope.assessment.pages[z].name

                    z++

          $scope.changeState = (state) ->
            $state.go state

      "sidebarOne":
        templateUrl: "/client/partials/client/keys/manage"
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
              $http.post('client/partials/client/keys/manage', {client: $currentUser, user: $stateParams.id, amount: $scope.form.newKeys})
                .success (data, status, headers, config) ->
                  # Success
                  console.log status
                  $window.location = '/client-center'
                .error (data, status, headers, config) ->
                  # Error
                  console.log status
      "sidebarTwo": 
        templateUrl: "/client/partials/keys"
        controller: (Restangular, $stateParams, $scope, $http, $window) ->
          $scope.requestKeys = false
          $scope.generateKeys = ->
            $http.post('/client/partials/keys', {amount: $scope.newKeys})
              .success (data, status, headers, config) ->
                $window.location = '/client-center'
              .error (data, status, headers, config) ->
                console.log status

  $stateProvider.state "createUser",
    url: "/user/create"
    views:
      "main":
        templateUrl: "/client/partials/client/create"
        controller: (Restangular, $stateParams, $scope, $state, $timeout, $http, $window) ->
          $scope.currentUser = $currentUser
          $scope.createUser = ->
            $scope.user.client = $currentUser
            $http.post('/api/v1/users', $scope.user)
              .success (data, status, headers, config) ->
                $window.location = '/client-center'
              .error (data, status, headers, config) ->
                # Error
                console.log status
          $scope.changeState = (state) ->
            $state.go state
      "sidebarOne":
        templateUrl: "/client/partials/keys"

  $stateProvider.state "createStaff",
    url: "/staff/create"
    views:
      "main":
        templateUrl: "/client/partials/staff/create"
        controller: (Restangular, $stateParams, $scope, $state, $timeout, $http, $window) ->
          $scope.currentUser = $currentUser
          $scope.createStaff = ->
            $scope.staff.licenseclient = $currentUser
            $http.post('/api/v1/client/staff', $scope.staff)
              .success (data, status, headers, config) ->
                $window.location = '/client'
              .error (data, status, headers, config) ->
                # Error
                console.log status
          $scope.changeState = (state) ->
            $state.go state
      "sidebarOne":
        templateUrl: "/client/partials/staff"
        controller: (Restangular, $stateParams, $scope) ->
          Restangular.all("api/v1").customGET("client/staff/" + $currentUser).then (staff) ->
            $scope.staff = staff.data
          $scope.toggleFilter =  ->
            $scope.search.name.first = true
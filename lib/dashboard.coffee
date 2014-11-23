# Add Restangular as a dependency to your app
app = angular.module("Users", [
  "restangular"
  "ui.router"
])


# Inject Restangular into your controller
app.config ($stateProvider, $urlRouterProvider, RestangularProvider) ->

  # If no URL State is specified, load the search area
  $urlRouterProvider.otherwise "/"

  # User List
  $stateProvider.state "search",
    url: "/"
    templateUrl: "partials/search"
    controller: (Restangular, $stateParams, $scope) ->
      Restangular.all("api/v1").customGET("users/list").then (users) ->
        $scope.users = users.data

      $scope.toggleFilter =  ->
        $scope.search.name.first = true

  # Individual User Page
  $stateProvider.state "user",
    url: "/user/:id"
    templateUrl: "partials/user"
    controller: (Restangular, $stateParams, $scope, $state) ->

      # Inject MATH
      $scope.Math = window.Math;

      Restangular.all("api/v1").customGET("pages/list").then (pages) ->
        $scope.pages = pages.data

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

      $scope.changeState = (state) ->
        $state.go state

  # Assessment Report
  $stateProvider.state "assessment",
    url: "/assessment/:id"
    templateUrl: "partials/assessment"
    controller: (Restangular, $stateParams, $scope, $state) ->
      Restangular.all("api/v1").customGET("pages/list").then (pages) ->
        $scope.pages = pages.data
      Restangular.one("api/v1").customGET("assessment/" + $stateParams.id).then (assessment) ->
        $scope.assessment = assessment.data[0]
        # $scope.assessmentData = assessment.data[0]
        Restangular.all("api/v1").customGET("assessment/" + $scope.assessment._id).then (answers) ->
          $scope.assessment.answers = answers.data
          $scope.assessment.pages = $scope.pages
          $scope.assessment.percentComplete = Math.round(100*$scope.assessment.answers.length/$scope.assessment.pages.length)
          $scope.assessment.complete = true unless assessment.percentComplete < 100
        Restangular.one("api/v1").customGET("user/" + $scope.assessment.user).then (user) ->
          $scope.assessment.user = user.data

      $scope.changeState = (state) ->
        $state.go state



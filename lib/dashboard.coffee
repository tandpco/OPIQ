# Add Restangular as a dependency to your app
app = angular.module("Users", [
  "restangular"
  "ui.router"
  "angularUtils.directives.dirPagination"
  "ngSanitize"
])


app.filter "slug", ->
  (input) ->
    input.toLowerCase().replace /[^a-z_]/g, "-"  if input

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
    params: { 'id', 'assessSlug' }
    controller: (Restangular, $stateParams, $scope, $state) ->
      Restangular.all("api/v1").customGET("pages/list").then (pages) ->
        $scope.pages = pages.data
      Restangular.one("api/v1").customGET("assessment/" + $stateParams.id).then (assessment) ->
        $scope.assessment = assessment.data[0]
        $scope.createdOn = new Date($scope.assessment.createdAt)
        utc = Date.parse($scope.createdOn)
        $scope.createdOn = "N/A" unless isNaN(utc) is false
        Restangular.all("api/v1").customGET("assessment/" + $scope.assessment._id + '/' + $scope.assessment.user).then (answers) ->
          $scope.assessment.answers = answers.data
          $scope.assessment.pages = $scope.pages
          $scope.assessment.percentComplete = Math.round(100*$scope.assessment.answers.length/$scope.assessment.pages.length)
          $scope.assessment.complete = true unless assessment.percentComplete < 100

          i = 0
          answers = []
          pages = []

          while i < $scope.assessment.answers.length
            answers.push $scope.assessment.answers[i].page
            i++

          while i < $scope.assessment.pages.length
            pages.push $scope.assessment.pages[i].name
            if _.contains(answers, $scope.assessment.pages[i].name) == true
              console.log _.contains(answers, $scope.assessment.pages[i].name)
              $scope.assessment.pages[i].status = 'complete'
            i++
          
        Restangular.one("api/v1").customGET("user/" + $scope.assessment.user).then (user) ->
          $scope.assessment.user = user.data

      $scope.changeState = (state) ->
        $state.go state

  $stateProvider.state "assessment.child",
    url: "/:slug"
    templateUrl: "partials/page"
    params: { 'id', 'name', 'pageName', 'pageId' }
    controller: (Restangular, $stateParams, $scope, $state) ->
      Restangular.one("api/v1").customGET("answer/" + $scope.assessment._id + "/" + $stateParams.pageName).then (answer) ->
        $scope.answer = answer.data[0]
      Restangular.one("api/v1").customGET("page/" + $stateParams.pageName).then (page) ->
        $scope.page = page.data[0]
        if $scope.answer
          answerText = 'answer' + $scope.answer.answer
          $scope.answerText = $scope.page[answerText]
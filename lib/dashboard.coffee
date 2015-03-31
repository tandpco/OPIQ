$(window).on "scroll", ->
  pos = $(window).scrollTop()
  if pos > 61
    $('#float th.inner-table').addClass "fixed"
    $('#float .ui-view-container').css "padding-top": "40px"
  else
    $('#float th.inner-table').removeClass "fixed"
    $('#float .ui-view-container').css "padding-top": "0"

# Add Restangular as a dependency to your app
app = angular.module("Users", [
  "restangular"
  "ui.router"
  "angularUtils.directives.dirPagination"
  "ngSanitize"
  "ngAnimate"
])


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
      $scope.Math = window.Math

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

  # Assessment Report
  $stateProvider.state "assessment",
    url: "/assessment/:id"
    templateUrl: "partials/assessment"
    params: { 'id', 'assessSlug' }
    controller: (Restangular, $stateParams, $scope, $state) ->

      # Scope Functions
      $scope.submit = ->
        form = document.getElementById('print')
        form.submit()

      window.setTimeout (->
        el = document.getElementById('addressable-market')
        angular.element(el).triggerHandler 'click'
      ), 500

      Restangular.all("api/v1").customGET("pages/list").then (pages) ->
        $scope.pages = pages.data

        Restangular.one("api/v1").customGET("assessment/" + $stateParams.id).then (assessment) ->
          $scope.assessment = assessment.data[0]
          $scope.createdOn = new Date($scope.assessment.createdAt)
          $utc = Date.parse($scope.createdOn)
          $scope.createdOn = "N/A" unless isNaN($utc) is false

          Restangular.one("api/v1").customGET("user/" + $scope.assessment.user).then (user) ->
            $scope.assessment.user = user.data

          Restangular.all("api/v1").customGET("assessment/" + $scope.assessment._id + '/' + $scope.assessment.user).then (answers) ->
            $scope.assessment.answers = answers.data
            $scope.assessment.pages = $scope.pages
            $scope.assessment.percentComplete = Math.round(100*$scope.assessment.answers.length/$scope.assessment.pages.length)
            $scope.assessment.complete = true unless assessment.percentComplete < 100

            i = 0
            l = 0
            j = 0
            total = 0
            answers = []
            pages = []
            complete = []
            categoryTotal = []

            while i < $scope.assessment.answers.length

              answers.push $scope.assessment.answers[i].page

              # Get the total of the answers
              total = Number(total) + Number($scope.assessment.answers[i].answer)

              i++

            while l < $scope.assessment.pages.length

              pages.push $scope.assessment.pages[l].name

              if _.contains answers, $scope.assessment.pages[l].name

                $scope.assessment.pages[l].status = 'complete'

                # Get the number of answered questions
                complete.push $scope.assessment.pages[l].name
                categoryTotal.push $scope.assessment.pages[l].category

              l++

            $scope.assessment.score = Math.round((total / complete.length) * 20)

          $stateProvider.state "assessment.child",
            url: "/:slug"
            templateUrl: "partials/page"
            params: { 'id', 'name', 'pageName', 'pageId', 'slug' }
            controller: (Restangular, $stateParams, $scope, $state) ->

              Restangular.one("api/v1").customGET("answer/" + $scope.assessment._id + "/" + $stateParams.pageName).then (answer) ->
                $scope.answer = answer.data[0]
                $scope.answer.score = Math.round((answer.data[0].answer/5)*100)

              Restangular.one("api/v1").customGET("page/" + $stateParams.pageName).then (page) ->
                $scope.page = page.data[0]
                answerText = 'answer' + $scope.answer.answer
                $scope.answerText = $scope.page[answerText]

      $scope.changeState = (state) ->
        $state.go state
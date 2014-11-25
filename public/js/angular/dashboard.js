(function() {
  var app;

  app = angular.module("Users", ["restangular", "ui.router", "angularUtils.directives.dirPagination", "ngSanitize"]);

  app.filter("slug", function() {
    return function(input) {
      if (input) {
        return input.toLowerCase().replace(/[^a-z_]/g, "-");
      }
    };
  });

  app.config(function($stateProvider, $urlRouterProvider, RestangularProvider) {
    $urlRouterProvider.otherwise("/");
    $stateProvider.state("search", {
      url: "/",
      templateUrl: "partials/search",
      controller: function(Restangular, $stateParams, $scope) {
        Restangular.all("api/v1").customGET("users/list").then(function(users) {
          return $scope.users = users.data;
        });
        return $scope.toggleFilter = function() {
          return $scope.search.name.first = true;
        };
      }
    });
    $stateProvider.state("user", {
      url: "/user/:id",
      templateUrl: "partials/user",
      controller: function(Restangular, $stateParams, $scope, $state) {
        $scope.Math = window.Math;
        Restangular.all("api/v1").customGET("pages/list").then(function(pages) {
          console.log(pages.data);
          return $scope.pages = pages.data;
        });
        Restangular.one("api/v1").customGET("user/" + $stateParams.id).then(function(user) {
          var utc;
          $scope.user = user.data;
          $scope.memberSince = new Date(user.data.createdAt);
          utc = Date.parse($scope.memberSince);
          if (isNaN(utc) !== false) {
            return $scope.memberSince = "N/A";
          }
        });
        Restangular.all("api/v1").customGET("user/" + $stateParams.id + "/assessments").then(function(assessments) {
          $scope.assessments = assessments.data;
          return assessments.data.forEach(function(assessment) {
            return Restangular.all("api/v1").customGET("assessment/" + assessment._id + "/" + assessment.user).then(function(answers) {
              assessment.answers = answers.data;
              assessment.pages = $scope.pages;
              assessment.percentComplete = Math.round(100 * assessment.answers.length / assessment.pages.length);
              if (assessment.percentComplete === 100) {
                return assessment.complete = true;
              }
            });
          });
        });
        return $scope.changeState = function(state) {
          return $state.go(state);
        };
      }
    });
    $stateProvider.state("assessment", {
      url: "/assessment/:id",
      templateUrl: "partials/assessment",
      params: {
        'id': 'id',
        'assessSlug': 'assessSlug'
      },
      controller: function(Restangular, $stateParams, $scope, $state) {
        Restangular.all("api/v1").customGET("pages/list").then(function(pages) {
          return $scope.pages = pages.data;
        });
        Restangular.one("api/v1").customGET("assessment/" + $stateParams.id).then(function(assessment) {
          var $utc;
          $scope.assessment = assessment.data[0];
          $scope.createdOn = new Date($scope.assessment.createdAt);
          $utc = Date.parse($scope.createdOn);
          if (isNaN($utc) !== false) {
            $scope.createdOn = "N/A";
          }
          Restangular.all("api/v1").customGET("assessment/" + $scope.assessment._id + '/' + $scope.assessment.user).then(function(answers) {
            var i, pages, _results;
            $scope.assessment.answers = answers.data;
            $scope.assessment.pages = $scope.pages;
            $scope.assessment.percentComplete = Math.round(100 * $scope.assessment.answers.length / $scope.assessment.pages.length);
            if (!(assessment.percentComplete < 100)) {
              $scope.assessment.complete = true;
            }
            i = 0;
            answers = [];
            pages = [];
            while (i < $scope.assessment.answers.length) {
              answers.push($scope.assessment.answers[i].page);
              i++;
            }
            _results = [];
            while (i < $scope.assessment.pages.length) {
              pages.push($scope.assessment.pages[i].name);
              if (_.contains(answers, $scope.assessment.pages[i].name)) {
                $scope.assessment.pages[i].status = 'complete';
                console.log($scope.assessment.pages[i].name);
              }
              _results.push(i++);
            }
            return _results;
          });
          return Restangular.one("api/v1").customGET("user/" + $scope.assessment.user).then(function(user) {
            return $scope.assessment.user = user.data;
          });
        });
        return $scope.changeState = function(state) {
          return $state.go(state);
        };
      }
    });
    return $stateProvider.state("assessment.child", {
      url: "/:slug",
      templateUrl: "partials/page",
      params: {
        'id': 'id',
        'name': 'name',
        'pageName': 'pageName',
        'pageId': 'pageId'
      },
      controller: function(Restangular, $stateParams, $scope, $state) {
        Restangular.one("api/v1").customGET("answer/" + $scope.assessment._id + "/" + $stateParams.pageName).then(function(answer) {
          return $scope.answer = answer.data[0];
        });
        return Restangular.one("api/v1").customGET("page/" + $stateParams.pageName).then(function(page) {
          var answerText;
          $scope.page = page.data[0];
          if ($scope.answer) {
            answerText = 'answer' + $scope.answer.answer;
            return $scope.answerText = $scope.page[answerText];
          }
        });
      }
    });
  });

}).call(this);

(function() {
  var app;

  app = angular.module("Users", ["restangular", "ui.router"]);

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
    return $stateProvider.state("assessment", {
      url: "/assessment/:id",
      templateUrl: "partials/assessment",
      controller: function(Restangular, $stateParams, $scope, $state) {
        Restangular.all("api/v1").customGET("pages/list").then(function(pages) {
          return $scope.pages = pages.data;
        });
        Restangular.one("api/v1").customGET("assessment/" + $stateParams.id).then(function(assessment) {
          $scope.assessment = assessment.data[0];
          Restangular.all("api/v1").customGET("assessment/" + $scope.assessment._id).then(function(answers) {
            $scope.assessment.answers = answers.data;
            $scope.assessment.pages = $scope.pages;
            $scope.assessment.percentComplete = Math.round(100 * $scope.assessment.answers.length / $scope.assessment.pages.length);
            if (!(assessment.percentComplete < 100)) {
              return $scope.assessment.complete = true;
            }
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
  });

}).call(this);

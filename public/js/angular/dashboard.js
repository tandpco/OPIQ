(function() {
  var app, count;

  $(window).on("scroll", function() {
    var pos;
    pos = $(window).scrollTop();
    if (pos > 61) {
      $('th.inner-table').addClass("fixed");
      return $('.ui-view-container').css({
        "padding-top": "40px"
      });
    } else {
      $('th.inner-table').removeClass("fixed");
      return $('.ui-view-container').css({
        "padding-top": "0"
      });
    }
  });

  app = angular.module("Users", ["restangular", "ui.router", "angularUtils.directives.dirPagination", "ngSanitize"]);

  app.filter("slug", function() {
    return function(input) {
      if (input) {
        return input.toLowerCase().replace(/[^a-z_]/g, "-");
      }
    };
  });

  count = function(ary, classifier) {
    return ary.reduce((function(counter, item) {
      var p;
      p = (classifier || String)(item);
      counter[p] = (counter.hasOwnProperty(p) ? counter[p] + 1 : 1);
      return counter;
    }), {});
  };

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
          $scope.pages = pages.data;
          Restangular.one("api/v1").customGET("user/" + $stateParams.id).then(function(user) {
            var utc;
            $scope.user = user.data;
            $scope.memberSince = new Date(user.data.createdAt);
            utc = Date.parse($scope.memberSince);
            if (isNaN(utc) !== false) {
              return $scope.memberSince = "N/A";
            }
          });
          return Restangular.all("api/v1").customGET("user/" + $stateParams.id + "/assessments").then(function(assessments) {
            $scope.assessments = assessments.data;
            return assessments.data.forEach(function(assessment) {
              return Restangular.all("api/v1").customGET("assessment/" + assessment._id + "/" + assessment.user).then(function(answers) {
                var completed, test, testing, totalz, x, z, _results;
                assessment.answers = answers.data;
                assessment.pages = $scope.pages;
                assessment.percentComplete = Math.round(100 * assessment.answers.length / assessment.pages.length);
                if (assessment.percentComplete === 100) {
                  assessment.complete = true;
                }
                x = 0;
                test = [];
                totalz = 0;
                while (x < answers.length) {
                  test.push(assessment.answers[x].page);
                  totalz = Number(total) + Number(assessment.answers[x].answer);
                  x++;
                }
                z = 0;
                testing = [];
                completed = [];
                _results = [];
                while (z < assessment.pages.length) {
                  testing.push(assessment.pages[z].name);
                  if (_.contains(answers, assessment.pages[z].name)) {
                    $scope.assessment.pages[z].status = 'complete';
                    completed.push($scope.assessment.pages[z].name);
                  }
                  _results.push(z++);
                }
                return _results;
              });
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
      params: {
        'id': 'id',
        'assessSlug': 'assessSlug'
      },
      controller: function(Restangular, $stateParams, $scope, $state) {
        $scope.submit = function() {
          var form;
          form = document.getElementById('print');
          return form.submit();
        };
        window.setTimeout((function() {
          var el;
          el = document.getElementById('addressable-market');
          return angular.element(el).triggerHandler('click');
        }), 500);
        Restangular.all("api/v1").customGET("pages/list").then(function(pages) {
          $scope.pages = pages.data;
          return Restangular.one("api/v1").customGET("assessment/" + $stateParams.id).then(function(assessment) {
            var $utc;
            $scope.assessment = assessment.data[0];
            $scope.createdOn = new Date($scope.assessment.createdAt);
            $utc = Date.parse($scope.createdOn);
            if (isNaN($utc) !== false) {
              $scope.createdOn = "N/A";
            }
            Restangular.one("api/v1").customGET("user/" + $scope.assessment.user).then(function(user) {
              return $scope.assessment.user = user.data;
            });
            Restangular.all("api/v1").customGET("assessment/" + $scope.assessment._id + '/' + $scope.assessment.user).then(function(answers) {
              var categoryTotal, complete, i, j, l, total;
              $scope.assessment.answers = answers.data;
              $scope.assessment.pages = $scope.pages;
              $scope.assessment.percentComplete = Math.round(100 * $scope.assessment.answers.length / $scope.assessment.pages.length);
              if (!(assessment.percentComplete < 100)) {
                $scope.assessment.complete = true;
              }
              i = 0;
              l = 0;
              j = 0;
              total = 0;
              answers = [];
              pages = [];
              complete = [];
              categoryTotal = [];
              while (i < $scope.assessment.answers.length) {
                answers.push($scope.assessment.answers[i].page);
                total = Number(total) + Number($scope.assessment.answers[i].answer);
                i++;
              }
              while (l < $scope.assessment.pages.length) {
                pages.push($scope.assessment.pages[l].name);
                if (_.contains(answers, $scope.assessment.pages[l].name)) {
                  $scope.assessment.pages[l].status = 'complete';
                  complete.push($scope.assessment.pages[l].name);
                  categoryTotal.push($scope.assessment.pages[l].category);
                }
                l++;
              }
              return $scope.assessment.score = Math.round((total / complete.length) * 20);
            });
            return $stateProvider.state("assessment.child", {
              url: "/:slug",
              templateUrl: "partials/page",
              params: {
                'id': 'id',
                'name': 'name',
                'pageName': 'pageName',
                'pageId': 'pageId',
                'slug': 'slug'
              },
              controller: function(Restangular, $stateParams, $scope, $state) {
                Restangular.one("api/v1").customGET("answer/" + $scope.assessment._id + "/" + $stateParams.pageName).then(function(answer) {
                  $scope.answer = answer.data[0];
                  return $scope.answer.score = Math.round((answer.data[0].answer / 5) * 100);
                });
                return Restangular.one("api/v1").customGET("page/" + $stateParams.pageName).then(function(page) {
                  var answerText;
                  $scope.page = page.data[0];
                  answerText = 'answer' + $scope.answer.answer;
                  return $scope.answerText = $scope.page[answerText];
                });
              }
            });
          });
        });
        return $scope.changeState = function(state) {
          return $state.go(state);
        };
      }
    });
  });

}).call(this);

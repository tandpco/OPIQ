(function() {
  var app;

  app = angular.module("Client Center", ["restangular", "ui.router", "ui.bootstrap", "angularUtils.directives.dirPagination", "ngSanitize", "ngAnimate"]);

  angular.module("Client Center").directive('ngReallyClick', [
    function() {
      return {
        restrict: 'A',
        link: function(scope, element, attrs) {
          element.bind('click', function() {
            var message;
            message = attrs.ngReallyMessage;
            if (message && confirm(message)) {
              scope.$apply(attrs.ngReallyClick);
            }
          });
        }
      };
    }
  ]);

  app.filter("slug", function() {
    return function(input) {
      if (input) {
        return input.toLowerCase().replace(/[^a-z_]/g, "-");
      }
    };
  });

  app.config(function($stateProvider, $urlRouterProvider, RestangularProvider) {
    $urlRouterProvider.otherwise("/");
    $stateProvider.state("home", {
      url: "/",
      views: {
        'main': {
          templateUrl: "/client/partials/search",
          controller: function(Restangular, $stateParams, $scope, $state, $filter) {
            Restangular.all("api/v1").customGET("client/" + $currentUser + "/users").then(function(users) {
              $scope.$root.users = users.data;
              return $scope.$root.users.length = users.data.length;
            });
            Restangular.all("api/v1").customGET("client/keys/" + $currentUser + "/list").then(function(keys) {
              $scope.$root.keys = keys.data;
              $scope.$root.keys.active = $filter('filter')(keys.data, {
                status: 'Active'
              }, true);
              $scope.$root.keys.distributed = $filter('filter')(keys.data, {
                status: 'Distributed'
              }, true);
              $scope.$root.keys.pending = $filter('filter')(keys.data, {
                status: 'Pending'
              }, true);
              return $scope.$root.keys.inactive = $filter('filter')(keys.data, {
                status: 'Inactive'
              }, true);
            });
            $scope.toggleFilter = function() {
              return $scope.search.name.first = true;
            };
            $scope.changeState = function(state) {
              return $state.go(state);
            };
            return $scope.edit = false;
          }
        },
        'sidebarOne': {
          templateUrl: "/client/partials/keys"
        }
      }
    });
    $stateProvider.state("user", {
      url: "/user/:id",
      views: {
        "main": {
          templateUrl: "/client/partials/client",
          controller: function(Restangular, $stateParams, $scope, $state, $timeout, $http, $window, $filter) {
            $scope.saving = false;
            $scope.saved = false;
            $scope.$root.userKeys = $filter('filter')($scope.$root.keys, {
              user: $stateParams.id
            });
            $scope.$root.userID = $stateParams.id;
            $scope.onSubmit = function() {
              $scope.saving = true;
              return $http.post('/api/v1/user/' + $scope.user._id + '/update', $scope.user).success(function(data, status, headers, config) {
                $scope.saving = false;
                $scope.saved = true;
                return $timeout(function() {
                  return $scope.saved = false;
                }, 1000);
              }).error(function(data, status, headers, config) {
                return console.log(status);
              });
            };
            $scope.deleteClient = function() {
              return $http["delete"]('/api/v1/user/' + $scope.user._id + '/remove').success(function(data, status, headers, config) {
                return $window.location = '/client-center';
              }).error(function(data, status, headers, config) {
                return console.log(status);
              });
            };
            Restangular.one("api/v1").customGET("user/" + $stateParams.id).then(function(user) {
              var utc;
              $scope.user = user.data;
              $scope.memberSince = new Date(user.data.createdAt);
              utc = Date.parse($scope.memberSince);
              if (isNaN(utc) !== false) {
                $scope.memberSince = "N/A";
              }
              return Restangular.all("api/v1").customGET("user/" + $stateParams.id + "/keys").then(function(keys) {
                return $scope.user.noOfKeys = keys.data.length;
              });
            });
            $scope.Math = window.Math;
            Restangular.all("api/v1").customGET("pages/list").then(function(pages) {
              $scope.pages = pages.data;
              console.log("Found pages!");
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
        },
        "sidebarOne": {
          templateUrl: "/client/partials/client/keys/manage",
          controller: function(Restangular, $scope, $stateParams, $http, $window) {
            Restangular.one("api/v1").customGET("user/" + $stateParams.id).then(function(user) {
              var utc;
              $scope.user = user.data;
              $scope.memberSince = new Date(user.data.createdAt);
              utc = Date.parse($scope.memberSince);
              if (isNaN(utc) !== false) {
                return $scope.memberSince = "N/A";
              }
            });
            return $scope.updateKeys = function() {
              if (!$scope.keyDistributionForm.$valid) {
                $scope.fixErrors = true;
              } else {
                return $http.post('client/partials/client/keys/manage', {
                  client: $currentUser,
                  user: $stateParams.id,
                  amount: $scope.form.newKeys
                }).success(function(data, status, headers, config) {
                  console.log(status);
                  return $window.location = '/client-center';
                }).error(function(data, status, headers, config) {
                  return console.log(status);
                });
              }
            };
          }
        },
        "sidebarTwo": {
          templateUrl: "/client/partials/keys",
          controller: function(Restangular, $stateParams, $scope, $http, $window) {
            $scope.requestKeys = false;
            return $scope.generateKeys = function() {
              return $http.post('/client/partials/keys', {
                amount: $scope.newKeys
              }).success(function(data, status, headers, config) {
                return $window.location = '/client-center';
              }).error(function(data, status, headers, config) {
                return console.log(status);
              });
            };
          }
        }
      }
    });
    $stateProvider.state("createUser", {
      url: "/user/create",
      views: {
        "main": {
          templateUrl: "/client/partials/client/create",
          controller: function(Restangular, $stateParams, $scope, $state, $timeout, $http, $window) {
            $scope.currentUser = $currentUser;
            $scope.createUser = function() {
              $scope.user.client = $currentUser;
              return $http.post('/api/v1/users', $scope.user).success(function(data, status, headers, config) {
                return $window.location = '/client-center';
              }).error(function(data, status, headers, config) {
                return console.log(status);
              });
            };
            return $scope.changeState = function(state) {
              return $state.go(state);
            };
          }
        },
        "sidebarOne": {
          templateUrl: "/client/partials/keys"
        }
      }
    });
    return $stateProvider.state("createStaff", {
      url: "/staff/create",
      views: {
        "main": {
          templateUrl: "/client/partials/staff/create",
          controller: function(Restangular, $stateParams, $scope, $state, $timeout, $http, $window) {
            $scope.currentUser = $currentUser;
            $scope.createStaff = function() {
              $scope.staff.licenseclient = $currentUser;
              return $http.post('/api/v1/client/staff', $scope.staff).success(function(data, status, headers, config) {
                return $window.location = '/client';
              }).error(function(data, status, headers, config) {
                return console.log(status);
              });
            };
            return $scope.changeState = function(state) {
              return $state.go(state);
            };
          }
        },
        "sidebarOne": {
          templateUrl: "/client/partials/staff",
          controller: function(Restangular, $stateParams, $scope) {
            Restangular.all("api/v1").customGET("client/staff/" + $currentUser).then(function(staff) {
              return $scope.staff = staff.data;
            });
            return $scope.toggleFilter = function() {
              return $scope.search.name.first = true;
            };
          }
        }
      }
    });
  });

}).call(this);

(function() {
  var app, count;

  $(window).on("scroll", function() {
    var pos;
    pos = $(window).scrollTop();
    if (pos > 61) {
      $('#float th.inner-table').addClass("fixed");
      return $('#float .ui-view-container').css({
        "padding-top": "40px"
      });
    } else {
      $('#float th.inner-table').removeClass("fixed");
      return $('#float .ui-view-container').css({
        "padding-top": "0"
      });
    }
  });

  app = angular.module("Users", ["restangular", "ui.router", "angularUtils.directives.dirPagination", "ngSanitize", "ngAnimate"]);

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

(function() {
  var app;

  app = angular.module("Partner Panel", ["restangular", "ui.router", "ui.bootstrap", "angularUtils.directives.dirPagination", "ngSanitize", "ngAnimate"]);

  angular.module("Partner Panel").directive('ngReallyClick', [
    function() {
      return {
        restrict: 'A',
        link: function(scope, element, attrs) {
          element.bind('click', function() {
            var message;
            message = attrs.ngReallyMessage;
            if (message && confirm(message)) {
              scope.$apply(attrs.ngReallyClick);
            }
          });
        }
      };
    }
  ]);

  app.config(function($stateProvider, $urlRouterProvider, RestangularProvider) {
    $urlRouterProvider.otherwise("/");
    $stateProvider.state("home", {
      url: "/",
      views: {
        'main': {
          templateUrl: "/partner/partials/search",
          controller: function(Restangular, $stateParams, $scope, $state, $filter) {
            Restangular.all("api/v1").customGET("user/" + $currentUser).then(function(user) {
              var utc;
              $scope.$root.currentUser = user.data;
              $scope.memberSince = new Date(user.data.createdAt);
              utc = Date.parse($scope.memberSince);
              if (isNaN(utc) !== false) {
                return $scope.memberSince = "N/A";
              }
            });
            Restangular.all("api/v1").customGET("partner/clients/" + $currentUser).then(function(clients) {
              $scope.users = clients.data;
              return $scope.$root.clientsList = clients.data;
            });
            Restangular.all("api/v1").customGET("partner/keys/" + $currentUser + "/list").then(function(keys) {
              $scope.$root.keys = keys.data;
              $scope.$root.keys.active = $filter('filter')(keys.data, {
                status: 'Active'
              }, true);
              $scope.$root.keys.pending = $filter('filter')(keys.data, {
                status: 'Pending'
              }, true);
              return $scope.$root.keys.inactive = $filter('filter')(keys.data, {
                status: 'Inactive'
              }, true);
            });
            $scope.toggleFilter = function() {
              return $scope.search.name.first = true;
            };
            $scope.changeState = function(state) {
              return $state.go(state);
            };
            return $scope.edit = false;
          }
        },
        'sidebarOne': {
          templateUrl: "/partner/partials/invoices",
          controller: function(Restangular, $stateParams, $scope) {
            return Restangular.all("api/v1").customGET("partner/invoices/" + $currentUser + "/list").then(function(invoices) {
              return $scope.$root.invoices = invoices.data;
            });
          }
        },
        'sidebarTwo': {
          templateUrl: "/partner/partials/keys",
          controller: function(Restangular, $stateParams, $scope, $http, $window) {
            $scope.newKeys = 0;
            return $scope.generateKeys = function() {
              return $http.post('/partner/partials/keys', {
                amount: $scope.newKeys
              }).success(function(data, status, headers, config) {
                return $window.location = '/partner';
              }).error(function(data, status, headers, config) {
                return console.log(status);
              });
            };
          }
        },
        'sidebarThree': {
          templateUrl: "/partner/partials/staff",
          controller: function(Restangular, $stateParams, $scope, $state) {
            $scope.edit = false;
            Restangular.all("api/v1").customGET("partner/staff/" + $currentUser).then(function(staff) {
              return $scope.staff = staff.data;
            });
            $scope.toggleFilter = function() {
              return $scope.search.name.first = true;
            };
            return $scope.changeState = function(state) {
              return $state.go(state);
            };
          }
        }
      }
    });
    $stateProvider.state("client", {
      url: "/client/:id",
      views: {
        "main": {
          templateUrl: "/partner/partials/client",
          controller: function(Restangular, $stateParams, $scope, $state, $timeout, $http, $window, $filter) {
            $scope.saving = false;
            $scope.saved = false;
            $scope.$root.clientKeys = $filter('filter')($scope.$root.keys, {
              client: $stateParams.id
            });
            $scope.$root.clientID = $stateParams.id;
            $scope.onSubmit = function() {
              $scope.saving = true;
              return $http.post('/api/v1/partner/clients/' + $scope.user._id + '/update', $scope.user).success(function(data, status, headers, config) {
                $scope.saving = false;
                $scope.saved = true;
                return $timeout(function() {
                  return $scope.saved = false;
                }, 1000);
              }).error(function(data, status, headers, config) {
                return console.log(status);
              });
            };
            $scope.deleteClient = function() {
              return $http["delete"]('/api/v1/partner/clients/' + $scope.user._id + '/delete').success(function(data, status, headers, config) {
                return $window.location = '/partner';
              }).error(function(data, status, headers, config) {
                return console.log(status);
              });
            };
            Restangular.one("api/v1").customGET("user/" + $stateParams.id).then(function(user) {
              var utc;
              $scope.user = user.data;
              $scope.memberSince = new Date(user.data.createdAt);
              utc = Date.parse($scope.memberSince);
              if (isNaN(utc) !== false) {
                $scope.memberSince = "N/A";
              }
              return Restangular.all("api/v1").customGET("client/keys/" + user.data._id + "/list").then(function(keys) {
                return $scope.user.noOfKeys = keys.data.length;
              });
            });
            return $scope.changeState = function(state) {
              return $state.go(state);
            };
          }
        },
        "sidebarOne": {
          templateUrl: "/partner/partials/client/keys/manage",
          controller: function(Restangular, $scope, $stateParams, $http, $window) {
            Restangular.one("api/v1").customGET("user/" + $stateParams.id).then(function(user) {
              var utc;
              $scope.user = user.data;
              $scope.memberSince = new Date(user.data.createdAt);
              utc = Date.parse($scope.memberSince);
              if (isNaN(utc) !== false) {
                return $scope.memberSince = "N/A";
              }
            });
            return $scope.updateKeys = function() {
              if (!$scope.keyDistributionForm.$valid) {
                $scope.fixErrors = true;
              } else {
                return $http.post('partner/partials/client/keys/manage', {
                  licensePartner: $currentUser,
                  client: $scope.$root.clientID,
                  amount: $scope.form.newKeys
                }).success(function(data, status, headers, config) {
                  console.log(status);
                  return $window.location = '/partner';
                }).error(function(data, status, headers, config) {
                  return console.log(status);
                });
              }
            };
          }
        },
        "sidebarTwo": {
          templateUrl: "/partner/partials/keys",
          controller: function(Restangular, $stateParams, $scope, $http, $window) {
            $scope.requestKeys = false;
            return $scope.generateKeys = function() {
              return $http.post('/partner/partials/keys', {
                amount: $scope.newKeys
              }).success(function(data, status, headers, config) {
                return $window.location = '/partner';
              }).error(function(data, status, headers, config) {
                return console.log(status);
              });
            };
          }
        }
      }
    });
    $stateProvider.state("staff", {
      url: "/staff/:id",
      views: {
        "main": {
          templateUrl: "/partner/partials/staff/edit",
          controller: function(Restangular, $stateParams, $scope, $state, $timeout, $http, $window) {
            $scope.saving = false;
            $scope.saved = false;
            $scope.onSubmit = function() {
              $scope.saving = true;
              return $http.post('/api/v1/partner/staff/' + $scope.user._id + '/update', $scope.user).success(function(data, status, headers, config) {
                $scope.saving = false;
                $scope.saved = true;
                return $timeout(function() {
                  return $scope.saved = false;
                }, 1000);
              }).error(function(data, status, headers, config) {
                return console.log(status);
              });
            };
            $scope.deleteClient = function() {
              return $http["delete"]('/api/v1/partner/staff/' + $scope.user._id + '/delete').success(function(data, status, headers, config) {
                return $window.location = '/partner';
              }).error(function(data, status, headers, config) {
                return console.log(status);
              });
            };
            Restangular.one("api/v1").customGET("user/" + $stateParams.id).then(function(user) {
              var utc;
              $scope.user = user.data;
              $scope.memberSince = new Date(user.data.createdAt);
              utc = Date.parse($scope.memberSince);
              if (isNaN(utc) !== false) {
                return $scope.memberSince = "N/A";
              }
            });
            return $scope.changeState = function(state) {
              return $state.go(state);
            };
          }
        },
        "sidebarOne": {
          templateUrl: "/partner/partials/staff",
          controller: function(Restangular, $stateParams, $scope) {
            Restangular.all("api/v1").customGET("partner/staff/" + $currentUser).then(function(staff) {
              return $scope.staff = staff.data;
            });
            return $scope.toggleFilter = function() {
              return $scope.search.name.first = true;
            };
          }
        }
      }
    });
    $stateProvider.state("createClient", {
      url: "/client/create",
      views: {
        "main": {
          templateUrl: "/partner/partials/client/create",
          controller: function(Restangular, $stateParams, $scope, $state, $timeout, $http, $window) {
            $scope.currentUser = $currentUser;
            $scope.createClient = function() {
              $scope.client.licensePartner = $currentUser;
              return $http.post('/api/v1/partner/clients', $scope.client).success(function(data, status, headers, config) {
                return $window.location = '/partner';
              }).error(function(data, status, headers, config) {
                return console.log(status);
              });
            };
            return $scope.changeState = function(state) {
              return $state.go(state);
            };
          }
        },
        "sidebarOne": {
          templateUrl: "/partner/partials/keys",
          controller: function(Restangular, $stateParams, $scope) {
            return $scope.$root.requestKeys = false;
          }
        }
      }
    });
    return $stateProvider.state("createStaff", {
      url: "/staff/create",
      views: {
        "main": {
          templateUrl: "/partner/partials/staff/create",
          controller: function(Restangular, $stateParams, $scope, $state, $timeout, $http, $window) {
            $scope.currentUser = $currentUser;
            $scope.createStaff = function() {
              $scope.staff.licensePartner = $currentUser;
              return $http.post('/api/v1/partner/staff', $scope.staff).success(function(data, status, headers, config) {
                return $window.location = '/partner';
              }).error(function(data, status, headers, config) {
                return console.log(status);
              });
            };
            return $scope.changeState = function(state) {
              return $state.go(state);
            };
          }
        },
        "sidebarOne": {
          templateUrl: "/partner/partials/staff",
          controller: function(Restangular, $stateParams, $scope) {
            Restangular.all("api/v1").customGET("partner/staff/" + $currentUser).then(function(staff) {
              return $scope.staff = staff.data;
            });
            return $scope.toggleFilter = function() {
              return $scope.search.name.first = true;
            };
          }
        }
      }
    });
  });

}).call(this);

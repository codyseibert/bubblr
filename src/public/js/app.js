(function() {
  angular.module('MINIAPP', ['ngRoute', 'ngAnimate']).config([
    '$routeProvider', function($routeProvider) {
      return $routeProvider.when('/test', {
        controller: 'TestsController',
        templateUrl: 'templates/Tests.tpl.html'
      }).when('/questions/:questionNumber', {
        controller: 'QuestionsController',
        templateUrl: 'templates/Questions.tpl.html'
      }).when('/submit', {
        controller: 'SubmitController',
        templateUrl: 'templates/Submit.tpl.html'
      }).when('/results', {
        controller: 'ResultsController',
        templateUrl: 'templates/Results.tpl.html'
      }).otherwise({
        redirectTo: '/test'
      });
    }
  ]).run([
    '$rootScope', '$window', function($rootScope, $window) {
      return $rootScope.back = function() {
        return $window.history.back();
      };
    }
  ]);

}).call(this);

(function() {
  angular.module('MINIAPP').controller('QuestionsController', [
    '$scope', '$routeParams', 'QuestionsService', 'AnswersService', 'Navigation', function($scope, $routeParams, QuestionsService, AnswersService, Navigation) {
      var questionIndex, questionNumber;
      if (!QuestionsService.isQuestionsLoaded()) {
        Navigation.navigateToTests();
        return;
      }
      questionNumber = parseInt($routeParams.questionNumber, 10);
      questionIndex = questionNumber - 1;
      $scope.questionNumber = questionNumber;
      $scope.question = QuestionsService.getQuestion(questionIndex);
      $scope.selected = AnswersService.getAnswer($scope.question.id);
      console.log($scope.selected);
      $scope.select = function(pValue) {
        return $scope.selected = pValue;
      };
      $scope.saveAnswer = function() {
        var answer;
        answer = {
          id: $scope.question.id,
          selected: $scope.selected
        };
        AnswersService.saveAnswer(answer);
        if (QuestionsService.isLastQuestion(questionIndex)) {
          return Navigation.navigateToSubmit();
        } else {
          return Navigation.navigateToQuestion(questionNumber + 1);
        }
      };
      return $scope.isFirstQuestion = function() {
        return questionNumber === 1;
      };
    }
  ]);

}).call(this);

(function() {
  angular.module('MINIAPP').controller('ResultsController', [
    function() {
      return void 0;
    }
  ]);

}).call(this);

(function() {
  angular.module('MINIAPP').controller('SubmitController', [
    '$scope', 'AnswersService', 'Navigation', function($scope, AnswersService, Navigation) {
      return $scope.submitQuiz = function() {
        return AnswersService.submitAnswers().success(function() {
          return Navigation.navigateToResults();
        });
      };
    }
  ]);

}).call(this);

(function() {
  angular.module('MINIAPP').controller('TestsController', [
    'Navigation', 'QuestionsService', function(Navigation, QuestionsService) {
      var firstQuestionIndex;
      firstQuestionIndex = 1;
      return QuestionsService.loadQuestions().success(function() {
        return Navigation.navigateToQuestion(firstQuestionIndex);
      });
    }
  ]);

}).call(this);

(function() {
  angular.module('MINIAPP').factory('AnswersService', [
    'HttpStub', function(HttpStub) {
      var ret, theUsersAnswers;
      theUsersAnswers = {};
      ret = {
        saveAnswer: function(pAnswer) {
          return theUsersAnswers[pAnswer.id] = pAnswer.selected;
        },
        getAnswer: function(pQuestionId) {
          return theUsersAnswers[pQuestionId];
        },
        submitAnswers: function() {
          var answer, answers, key, _i, _len;
          answers = [];
          for (_i = 0, _len = theUsersAnswers.length; _i < _len; _i++) {
            key = theUsersAnswers[_i];
            if (theUsersAnswers.hasOwnProperty(key)) {
              answer = theUsersAnswers[key];
              answers.push({
                id: parseInt(key, 10),
                selected: answer
              });
            }
          }
          return HttpStub.createHttpStub(answers);
        }
      };
      return ret;
    }
  ]);

}).call(this);

(function() {
  angular.module('MINIAPP').factory('QuestionsService', [
    'HttpStub', function(HttpStub) {
      var ret, theQuestions;
      theQuestions = null;
      ret = {
        isQuestionsLoaded: function() {
          return theQuestions !== null;
        },
        loadQuestions: function() {
          theQuestions = [
            {
              "id": 1,
              "text": "Tim Berners-Lee invented the Internet."
            }, {
              "id": 2,
              "text": "Dogs are better than cats."
            }, {
              "id": 3,
              "text": "Winter is coming."
            }, {
              "id": 4,
              "text": "Internet Explorer is the most advanced browser on Earth."
            }
          ];
          return HttpStub.createHttpStub(theQuestions);
        },
        getQuestion: function(pQuestionIndex) {
          return theQuestions[pQuestionIndex];
        },
        isLastQuestion: function(pQuestionIndex) {
          return pQuestionIndex >= theQuestions.length - 1;
        }
      };
      return ret;
    }
  ]);

}).call(this);

(function() {
  angular.module('MINIAPP').factory('ResultsService', [
    'AnswersService', function(AnswersService) {
      'use strict';
      var ret, theAnswerKey;
      theAnswerKey = {
        "1": true,
        "2": false,
        "3": true,
        "4": false
      };
      ret = {
        getTestResults: function() {
          var answer, questionId, results, usersAnswers, value, _i, _len;
          usersAnswers = AnswersService.getUsersAnswers();
          for (_i = 0, _len = usersAnswers.length; _i < _len; _i++) {
            answer = usersAnswers[_i];
            questionId = answer.question_id;
            value = answer.value;
            if (value === theAnswerKey[questionId]) {
              correct += 1;
            }
          }
          results = {
            answers_correct: correct,
            number_of_questions: theAnswerKey.length()
          };
          return results;
        }
      };
      return ret;
    }
  ]);

}).call(this);

(function() {
  angular.module('MINIAPP').factory('HttpStub', [
    '$q', function($q) {
      var ret;
      ret = {
        createHttpStub: function(pDataToReturn) {
          var deferred, promise;
          deferred = $q.defer();
          promise = deferred.promise;
          deferred.resolve(pDataToReturn);
          promise.success = function(fn) {
            promise.then(fn);
            return promise;
          };
          promise.error = function(fn) {
            promise.then(null, fn);
            return promise;
          };
          return promise;
        }
      };
      return ret;
    }
  ]);

}).call(this);

(function() {
  angular.module('MINIAPP').factory('Navigation', [
    '$location', function($location) {
      var ret;
      ret = {
        navigateToQuestion: function(pQuestionNumber) {
          return $location.path('/questions/' + pQuestionNumber);
        },
        navigateToSubmit: function() {
          return $location.path('/submit');
        },
        navigateToResults: function() {
          return $location.path('/results');
        },
        navigateToTests: function() {
          return $location.path('/tests');
        }
      };
      return ret;
    }
  ]);

}).call(this);

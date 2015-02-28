# Used for centralizing the navigation path calls
angular.module('MINIAPP')
    .factory('Navigation', [
        '$location',
        ($location) ->

            ret =
                navigateToQuestion: (pQuestionNumber) ->
                    $location.path('/questions/' + pQuestionNumber)

                navigateToSubmit: () ->
                    $location.path('/submit')

                navigateToResults: () ->
                    $location.path('/results')

                navigateToTests: () ->
                    $location.path('/tests')

            return ret
        ]);

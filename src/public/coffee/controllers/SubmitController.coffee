# Used to confirm the user is ready to submit his test
angular.module('MINIAPP')
    .controller('SubmitController', [
        '$scope',
        'AnswersService',
        'Navigation',
        (
            $scope,
            AnswersService,
            Navigation
        ) ->
            # Send the user's answers to server and
            # redirect to their results
            $scope.submitQuiz = () ->
                AnswersService.submitAnswers()
                    .success( () ->
                        Navigation.navigateToResults()
                    )
        ]);

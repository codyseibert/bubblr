# Gets the user's test results (% correct) from the backend
angular.module('MINIAPP')
    .factory('ResultsService', [
        'AnswersService',
        (AnswersService) ->
            'use strict';

            # Would potentially use some data structure like this
            # to compare the users answers (assuming they are allowed
            # to view the answers after finishing the test
            theAnswerKey =
                "1": true
                "2": false
                "3": true
                "4": false

            ret =
                # Invokes backend for the user's results
                getTestResults: () ->

                    usersAnswers = AnswersService.getUsersAnswers()

                    for answer in usersAnswers
                        questionId = answer.question_id
                        value = answer.value
                        correct += 1 if value == theAnswerKey[questionId]

                    results =
                        answers_correct: correct
                        number_of_questions: theAnswerKey.length()

                    return results

            return ret
        ]);

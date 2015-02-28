# Saves the users answers and ultimately submits them to the server
angular.module('MINIAPP')
    .factory('AnswersService', [
        'HttpStub',
        (HttpStub) ->

            # Keeps track of the user's answer for each question
            theUsersAnswers = {}

            ret =
                # Posts user's answers to the backend (or should in the future)
                saveAnswer: (pAnswer) ->
                    theUsersAnswers[pAnswer.id] = pAnswer.selected

                # Gets a user's previous answered question
                getAnswer: (pQuestionId) ->
                    return theUsersAnswers[pQuestionId]

                # Submits all of the user's answers to the backend
                # (or should in the future)
                submitAnswers: () ->
                    answers = []

                    # Convert the way we are checking user's answers
                    # into the proper Data-Transfer-Object required
                    # by the backend
                    for key in theUsersAnswers
                        if theUsersAnswers.hasOwnProperty(key)
                            answer = theUsersAnswers[key]
                            answers.push({
                                id: parseInt(key, 10),
                                selected: answer
                            })

                    return HttpStub.createHttpStub(answers)

            return ret
        ]);

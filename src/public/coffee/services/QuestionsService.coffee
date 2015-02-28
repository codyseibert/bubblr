# Used for retrieving the questions
angular.module('MINIAPP')
    .factory('QuestionsService', [
        'HttpStub',
        (HttpStub) ->
            theQuestions = null

            ret =
                # Questions are loaded from the backend
                isQuestionsLoaded: () ->
                    return theQuestions != null

                # Loads the questions from the backend (or should in the future)
                loadQuestions: () ->
                    theQuestions = [
                        { "id": 1, "text": "Tim Berners-Lee invented the Internet."},
                        { "id": 2, "text": "Dogs are better than cats."},
                        { "id": 3, "text": "Winter is coming."},
                        { "id": 4, "text": "Internet Explorer is the most advanced browser on Earth."}
                    ]
                    return HttpStub.createHttpStub(theQuestions)

                # Grabs a question from the loaded questions
                getQuestion: (pQuestionIndex) ->
                    return theQuestions[pQuestionIndex]

                # Check if are on the last question
                isLastQuestion: (pQuestionIndex) ->
                    return (pQuestionIndex >= theQuestions.length - 1)

            return ret
        ]);

angular.module('MINIAPP')
    .controller('TestsController', [
        'Navigation',
        'QuestionsService',
        (
            Navigation,
            QuestionsService
        ) ->

            # The front end representation of the first question index
            # We use positive intergers because that is what a user would
            # be used to seeing if they look in the nav bar
            firstQuestionIndex = 1

            # Loads the questions from the backend
            QuestionsService.loadQuestions()
                .success( () ->
                    Navigation.navigateToQuestion(firstQuestionIndex)
                )
        ])

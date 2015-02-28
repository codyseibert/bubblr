
# QuestionController houses the logic for navigating through
# the questions we will ask the user

angular.module('MINIAPP')
    .controller('QuestionsController', [
        '$scope',
        '$routeParams',
        'QuestionsService',
        'AnswersService',
        'Navigation',
        (
            $scope,
            $routeParams,
            QuestionsService,
            AnswersService,
            Navigation
        ) ->

            # Redirect if we haven't loaded any questions (user refreshed page?)
            if !QuestionsService.isQuestionsLoaded()
                Navigation.navigateToTests()
                return

            # The current question user is on
            questionNumber = parseInt($routeParams.questionNumber, 10)

            # The internal index representation
            questionIndex = questionNumber - 1

            # Used for displaying question number in template
            $scope.questionNumber = questionNumber;

            # Used for displaying question text in template
            $scope.question = QuestionsService.getQuestion(questionIndex)

            # Used for class .enabled when button clicked
            $scope.selected = AnswersService.getAnswer($scope.question.id)

            # changes the state of the button class
            $scope.select = (pValue) ->
                $scope.selected = pValue

            # saves the answer and continues to the next question
            $scope.saveAnswer = () ->
                answer =
                    id: $scope.question.id
                    selected: $scope.selected

                AnswersService.saveAnswer(answer)

                if QuestionsService.isLastQuestion(questionIndex)
                    Navigation.navigateToSubmit()
                else
                    Navigation.navigateToQuestion(questionNumber + 1)

            # used for hiding the back button
            $scope.isFirstQuestion = () ->
                return questionNumber == 1
        ]);

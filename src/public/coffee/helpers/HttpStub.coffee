# Mock out of the $http object
angular.module('MINIAPP')
    .factory('HttpStub', [
        '$q',
        ($q) ->
            ret =
                # Returns a promise with the same functions as the $http
                # object has and invokes the success promise
                createHttpStub: (pDataToReturn) ->
                    deferred = $q.defer()
                    promise = deferred.promise

                    deferred.resolve(pDataToReturn)

                    promise.success = (fn) ->
                        promise.then(fn)
                        return promise

                    promise.error = (fn) ->
                        promise.then(null, fn)
                        return promise

                    return promise

            return ret
        ]);

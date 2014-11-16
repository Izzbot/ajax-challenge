"use strict";
/*
    app.js, main Angular application script
    define your module and controllers here
*/

// Set up the URL for easy coding
var commentsUrl = 'https://api.parse.com/1/classes/comments';


// Build our module
angular.module('Commenter', ['ui.bootstrap'])
    .config(function($httpProvider) {
        $httpProvider.defaults.headers.common['X-Parse-Application-Id'] = 'cXXmzY2CipGaqiydD6qmgZRraLIZyfRWoPABR7yI';
        $httpProvider.defaults.headers.common['X-Parse-REST-API-Key'] = 'MoxE3HBQRWIPP1sRcKsR7CjM2Qs9EjaWUbHaoxL7';
    })

    // Build a new controller
    .controller('commenterController', function($scope, $http) {

        // Initialize a new Comment object
        $scope.newComment = {score: 0};


        $scope.refreshComments = function() {
            $scope.loading = true;
            $http.get(commentsUrl + '?where={"done": false}')
                .success(function(data) {
                    $scope.comments = data.results;
                })
                .error(function(err) {
                    $cope.errorMessage = err;
                })
                .finally(function() {
                   $scope.loading = false;
                });
        };

        // Refresh upon load
        $scope.refreshComments();

        // Adds a comment to the list
        $scope.addComment = function() {
            $scope.loading = true;
            $http.post(commentsUrl, $scope.newComment)
                .success(function(responseData) {
                    $scope.newComment.objectId = responseData.objectId;
                    $scope.comments.push($scope.newComment);
                    $scope.newComment = {score: 0};
                })
                .error(function(err) {
                    $scope.errorMessage = err;
                })
                .finally(function() {
                   $scope.loading = false;
                });
        };

        // Updates a comment
        $scope.updateComment = function(comment) {
            $scope.loading = true;
          $http.put(commentsUrl + '/' + comment.objectId, comment)
              .success(function() {
                // Don't need to to much upon a success
              })
              .error(function() {
                  $scope.errorMessage = err;
              })
              .finally(function() {
                  $scope.loading = false;
              });
        };


        // Changes the score of a comment
        $scope.changeScore = function(comment, amount) {
            $scope.loading = true;
            $http.put(commentsUrl + '/' + comment.objectId, {
                votes: {
                    __op: 'Increment',
                    amount: amount
                }
            })
                .success(function(responseData) {
                    comment.score = responseData.score;
                })
                .error(function(err) {
                    $scope.errorMessage = err;
                })
                .finally(function() {
                   $scope.loading = false;
                });

        };
    });
"use strict";

// Set up the URL for easy coding
var commentsUrl = 'https://api.parse.com/1/classes/comments';


// Build our module
angular.module('CommenterApp', ['ui.bootstrap'])
    .config(function($httpProvider) {
        $httpProvider.defaults.headers.common['X-Parse-Application-Id'] = 'cXXmzY2CipGaqiydD6qmgZRraLIZyfRWoPABR7yI';
        $httpProvider.defaults.headers.common['X-Parse-REST-API-Key'] = 'MoxE3HBQRWIPP1sRcKsR7CjM2Qs9EjaWUbHaoxL7';
    })

    // Build a new controller
    .controller('CommentsController', function($scope, $http) {

        // Initialize a new Comment object
        $scope.newComment = {score: 0};

		/*
		 * Allows us to grab the latest comments from Parse
		 */
        $scope.refreshComments = function() {
            $scope.loading = true;

            $http.get(commentsUrl)
                .success(function(data) {
                	// Sort the results by score
                	data.results.sort(function(a, b){
                		return b.score-a.score
                	})
                    
                    // Assign the results
                    $scope.comments = data.results;
                })
                .error(function(err) {
                    $cope.errorMessage = err;
                })
                .finally(function() {
                   $scope.loading = false;
                });
        };

        /*
         * Adds a comment to the list
         */ 
        $scope.addComment = function() {
	        // No data sanitization is coded for this challenge
    
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

        /*
         * Updates a comment
         */
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


        /*
         *  Changes the score of a comment
         */
        $scope.changeScore = function(comment, amount) {
            
            // Don't let them make the score less than 0
            if (comment.score + amount >=0) {
	            $scope.loading = true;
				
				// increase score using atomic increment
	            $http.put(commentsUrl + '/' + comment.objectId, {
	                score: {
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
            }

        };

		/*
		 * Deletes the comment
		 */
		$scope.deleteComment = function(comment) {
          $scope.loading = true;
          $http.delete(commentsUrl + '/' + comment.objectId)
              .success(function() {
                // Don't need to to much upon a success
              })
              .error(function() {
                  $scope.errorMessage = err;
              })
              .finally(function() {
              	// Refresh the list
              	$scope.refreshComments();
              	$scope.loading = false;
              });

		};

        // Refresh upon load
        $scope.refreshComments();
    });
'use strict';

angular.module('kamehameApp')
  .controller('kamehameCtrl', function($scope, $http) {
    $scope.init = function(){
      $scope.playing = {enabled: true};
      $scope.random = {enabled: true};
      $scope.mute = {enabled:false}
    };

  	$scope.showHideMenu = function() {

  	};

  	$scope.playPause = function(){
      $scope.playing.enabled = !$scope.playing.enabled;
  	};

  	$scope.skipForward = function(){

  	};

  	$scope.skipBackward = function(){

  	};

  	$scope.toggleRandom = function() {
      $scope.random.enabled = !$scope.random.enabled;
  	};

    $scope.toggleMute = function() {
      $scope.mute.enabled = !$scope.mute.enabled;
    };

  	$scope.getVideo = function(){

  	};

  	$scope.getVideoList = function(){

  	};

    $scope.init()

  });
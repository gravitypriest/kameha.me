'use strict';

angular.module('kamehameApp')
  .controller('kamehameCtrl', function($scope) {

    $scope.init = function(){
      $scope.playing = {enabled: true};
      $scope.random = {enabled: true};
      $scope.mute = {enabled:false}
      $scope.repeat = {enabled:false}
      $scope.showmenu = {enabled: false}

      $scope.currentClip = 'placeholder'

      $scope.menuControls = [
        {
          name: 'play',
          hover:false,
          click: function() {$scope.toggle($scope.playing);},
          label: function(){
            return $scope.playing.enabled ? 'Pause' : 'Play';
          }
        },
        {
          name: 'forward',
          hover:false,
          click: function() {},
          label: function(){ return 'Next clip'; }
        },
        {
          name:'backward',
          hover:false,
          click: function() {},
          label: function(){ return 'Previous clip' }
        },
        {
          name: 'repeat',
          hover:false,
          click: function() {$scope.toggle($scope.repeat);},
          label: function(){ return 'Repeat: ' }
        },
        {
          name: 'random',
          hover:false,
          click: function() {$scope.toggle($scope.random);},
          label: function(){ return 'Random: ' }
        },
        {
          name: 'select',
          hover:false,
          click: function() {},
          label: function(){ return 'Select clip...' }
        }
      ]
    };

  	$scope.toggle = function(state){
      state.enabled = !state.enabled;
  	};

  	$scope.skipForward = function(){

  	};

  	$scope.skipBackward = function(){

  	};

  	$scope.getVideo = function(){

  	};

  	$scope.getVideoList = function(){

  	};

    $scope.generateRandomOrder = function() {

    }

    $scope.init()

  });
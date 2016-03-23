'use strict';

angular.module('kamehameApp', [])
  .controller('kamehameCtrl', function($scope, $http) {

    $scope.init = function(){
      // get list of clips & filenames
      $scope.resetClipList().
      then(function(res) {

        $scope.clipList = res.data;

        // player modes
        $scope.playing = {enabled: true};
        $scope.random = {enabled: true};
        $scope.mute = {enabled:false};
        $scope.repeat = {enabled:false};
        $scope.showmenu = {enabled: false};

        // call again once list is downloaded
        $scope.resetClipList();

        // video
        $scope.currentClip = $scope.clipList[0];
        $scope.clipViewer = document.getElementById('clipViewer');
        $scope.clipViewer.addEventListener('ended', $scope.onClipEnd);
        $scope.setClip($scope.currentClip);

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
            click: function() {$scope.skipForward()},
            label: function(){ return 'Next clip'; }
          },
          {
            name:'backward',
            hover:false,
            click: function() {$scope.skipBackward()},
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
            name:'mute',
            hover:false,
            click: function() {$scope.toggle($scope.mute)},
            label: function(){ return 'Mute: '}
          }
        ]
      });
    };

  	$scope.toggle = function(state){
      state.enabled = !state.enabled;
      switch(state) {
        case $scope.playing:
          if ($scope.playing.enabled) {
            clipViewer.play();
          } else {
            clipViewer.pause();
          }
          break;
        case $scope.mute:
          if ($scope.mute.enabled) {
            clipViewer.muted = true;
          } else {
            clipViewer.muted = false;
          }
          break;
        case $scope.random:
          $scope.resetClipList();
        default:
          break;
      }
  	};

  	$scope.skipForward = function() {
      var nextClip = $scope.getNextClip();
      $scope.setClip(nextClip, true);
  	};

  	$scope.skipBackward = function() {
      var prevClip = $scope.getPrevClip();
      $scope.setClip(prevClip, true);
  	};

  	$scope.setClip = function(clip, skip) {
      if ($scope.repeat.enabled && !skip) {
        $scope.clipViewer.play();
        return;
      } else {
        $scope.clipViewer.setAttribute('src', clip.fname);
        $scope.currentClip = clip;
      }
  	};

  	$scope.resetClipList = function(){
      // recreate the list when random is toggled
      // if it hasn't been created (on load)
      if ($scope.clipList === undefined) {
        return $http.get('/cliplist');
      }
      if ($scope.random.enabled) {
        $scope.shuffleArray($scope.clipList);
      } else {
        $scope.sortArray($scope.clipList);
      }
  	};

    $scope.onClipEnd = function() {
      var nextClip = $scope.getNextClip();
      $scope.setClip(nextClip, false);
    };

    $scope.getNextClip = function() {
      var curClipIndex = $scope.clipList.indexOf($scope.currentClip)
      var nextClipIndex = curClipIndex + 1;
      if ($scope.clipList[nextClipIndex] === undefined) {
        // end of the list, loop to beginning
        return $scope.clipList[0];
      }
      return $scope.clipList[nextClipIndex];
    };

    $scope.getPrevClip = function() {
      var curClipIndex = $scope.clipList.indexOf($scope.currentClip)
      var prevClipIndex = curClipIndex - 1;
      if (prevClipIndex < 0) {
        // beginning of list, loop to end
        return $scope.clipList[$scope.clipList.length-1];
      }
      return $scope.clipList[prevClipIndex];
    };

    $scope.escapeClipName = function(clipName) {
      var escapedName = clipName.replace('video/', '').replace('.webm', '');
      return escapedName;
    };

    $scope.sortArray = function(array) {
      array.sort(function(obj1, obj2) {
        if (obj1.name < obj2.name) {
          return -1;
        }
        if (obj1.name > obj2.name) {
          return 1;
        }
        return 0;
      });
    };

    // http://stackoverflow.com/a/12646864
    $scope.shuffleArray = function(array) {
      for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    };

    $scope.init();

  });
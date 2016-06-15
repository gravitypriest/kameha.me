'use strict';

angular.module('kamehame', [])
.controller('kamehameCtrl', function($scope, $http, $timeout) {

    var init = function(){
        // get list of clips & filenames
        resetClipList().
        then(function(res) {

            $scope.clipList = res.data;

            // player modes
            $scope.playing = {enabled: true};
            $scope.random = {enabled: true};
            $scope.mute = {enabled:false};
            $scope.repeat = {enabled:false};
            $scope.showmenu = {enabled: false};

            // call again once list is downloaded
            resetClipList();

            // video
            var clipViewer = document.getElementById('clipViewer');
            clipViewer.addEventListener('ended', onClipEnd);
            setClip($scope.clipList[0]);

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

    var setClip = function(clip, skip) {
        if ($scope.repeat.enabled && !skip) {
            clipViewer.play();
            return;
        } else {
            $timeout(function() {
                $scope.currentClip = clip;
                clipViewer.setAttribute('src', clip.fname);
            });
        }
    };

    var resetClipList = function(){
        // recreate the list when random is toggled
        // if it hasn't been created (on load)
        if ($scope.clipList === undefined) {
            return $http.get('/cliplist');
        }
        if ($scope.random.enabled) {
            shuffleArray($scope.clipList);
        } else {
            sortArray($scope.clipList);
        }
    };

    var onClipEnd = function() {
        var nextClip = getNextClip();
        setClip(nextClip, false);
    };

    var getNextClip = function() {
        var curClipIndex = $scope.clipList.indexOf($scope.currentClip)
        var nextClipIndex = curClipIndex + 1;
        if ($scope.clipList[nextClipIndex] === undefined) {
            // end of the list, loop to beginning
            return $scope.clipList[0];
        }
        return $scope.clipList[nextClipIndex];
    };

    var getPrevClip = function() {
        var curClipIndex = $scope.clipList.indexOf($scope.currentClip)
        var prevClipIndex = curClipIndex - 1;
        if (prevClipIndex < 0) {
            // beginning of list, loop to end
            return $scope.clipList[$scope.clipList.length-1];
        }
        return $scope.clipList[prevClipIndex];
    };

    var sortArray = function(array) {
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
    var shuffleArray = function(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    };

    $scope.changeVolume = function(amount) {
        // html5 video has vol between 0 and 1
        // 105 = 100px volume bar + 5px selector
        if (amount > 105) amount = 105;
        if (amount < 0) amount = 0;
        var newVolume = amount / 105;
        clipViewer.volume = newVolume;
        $scope.volume = Math.ceil(newVolume * 100);
        if ($scope.volume > 0) {
            $scope.toggle($scope.mute, false);
        }
    };

    $scope.clickDownVolume = function($event) {
        $scope.dragging = true;
    }

    $scope.clickUpVolume = function($event) {
        var amount = $event.offsetX;
        $scope.changeVolume(amount);
        $scope.dragging = false;
    }

    $scope.dragVolume = function($event) {
        $scope.changeVolume($event.offsetX);
    }

    $scope.currentVolume = function() {
        if ($scope.mute.enabled) {
            return {volume: '0px', opposite: '100px'};
        } else {
            return {volume: $scope.volume + 'px', opposite: (100 - $scope.volume) + 'px'}
        }
    };

    $scope.toggle = function(state, force) {
        if (typeof(force) !== 'undefined') {
            state.enabled = force;
        } else {
            state.enabled = !state.enabled;
        }
        switch(state) {
            case $scope.playing:
                $scope.playing.enabled ? clipViewer.play() : clipViewer.pause();
                break;
            case $scope.mute:
                clipViewer.muted = $scope.mute.enabled;
                break;
            case $scope.random:
                resetClipList();
                break;
            default:
                break;
        }
    };

    $scope.fuckyou = function() {
        console.log(this);
    }

    $scope.skipForward = function() {
        var nextClip = getNextClip();
        setClip(nextClip, true);
    };

    $scope.skipBackward = function() {
        var prevClip = getPrevClip();
        setClip(prevClip, true);
    };

    init();

});
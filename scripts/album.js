/*
  bloc-jams
    scripts
      album.js
*/

// createSongRow(songNumber, songName, songLength)
//  => generates song row content
var createSongRow = function(songNumber, songName, songLength) {
  var template =
    '<tr class="album-view-song-item">'
  + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
  + '  <td class="song-item-title">' + songName + '</td>'
  + '  <td class="song-item-duration">' + filterTimeCode(songLength) + '</td>'
  + '</tr>'
  ;

  var $row = $(template);

  var clickHandler = function() {
    var songNumber = parseInt($(this).attr('data-song-number'));

  	if (currentlyPlayingSongNumber !== null) {
  		// Revert to song number for currently playing song because user started playing new song.
  		var currentlyPlayingCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
  		currentlyPlayingCell.html(currentlyPlayingSongNumber);
  	}

  	if (currentlyPlayingSongNumber !== songNumber) {
  		// Switch from Play -> Pause button to indicate new song is playing.
  		$(this).html(pauseButtonTemplate);
      setSong(songNumber);
      currentSoundFile.play();

      var $volumeFill = $('.volume .fill');
      var $volumeThumb = $('.volume .thumb');
      $volumeFill.width(currentVolume + '%');
      $volumeThumb.css({left: currentVolume + '%'});

      updateSeekBarWhileSongPlays();
      updatePlayerBarSong();
  	} else if (currentlyPlayingSongNumber === songNumber) {
      if (currentSoundFile.isPaused()) {
        $(this).html(pauseButtonTemplate);
        $('main-controls .play-pause').html(playerBarPauseButton);
        currentSoundFile.play();
        updateSeekBarWhileSongPlays();
      } else {
        $(this).html(playButtonTemplate);
        $('main-controls .play-pause').html(playerBarPlayButton);
        currentSoundFile.pause();
      }
  	}
  };

  var onHover = function(event) {
    var songNumberCell = $(this).find('.song-item-number');
    var songNumber = parseInt(songNumberCell.attr('data-song-number'));

    if (songNumber !== currentlyPlayingSongNumber) {
      songNumberCell.html(playButtonTemplate);
    }
  };

  var offHover = function(event) {
    var songNumberCell = $(this).find('.song-item-number');
    var songNumber = parseInt(songNumberCell.attr('data-song-number'));

    if (songNumber !== currentlyPlayingSongNumber) {
      songNumberCell.html(songNumber);
    }

    // test
    console.log("songNumber type is " + typeOf(songNumber) + "\nand currentlyPlayingSongNumber type is " + typeOf(currentlyPlayingSongNumber));
  };

  $row.find('.song-item-number').click(clickHandler);
  $row.hover(onHover, offHover);
  return $row;
}

// setCurrentAlbum(album)
//  => takes an 'album' object and injects its information into the template
var setCurrentAlbum = function(album) {
  currentAlbum = album;
  var $albumTitle = $('.album-view-title');
  var $albumArtist = $('.album-view-artist');
  var $albumReleaseInfo = $('.album-view-release-info');
  var $albumImage = $('.album-cover-art');
  var $albumSongList = $('.album-view-song-list');

  $albumTitle.text(album.title);
  $albumArtist.text(album.artist);
  $albumReleaseInfo.text(album.year + ' ' + album.label);
  $albumImage.attr('src', album.albumArtUrl);

  $albumSongList.empty();

  for (var i = 0; i < album.songs.length; i++) {
    var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
    $albumSongList.append($newRow);
  }
};

// filterTimeCode(timeInSeconds)
//  => takes a time in seconds and returns it in 'X:XX' format
var filterTimeCode = function(timeInSeconds) {
  var time = parseFloat(timeInSeconds);
  var minutes = Math.floor(time / 60);
  var seconds = Math.floor(time % 60);
  if (seconds < 10) { seconds = '0' + seconds; }
  return minutes + ':' + seconds;
};

// setTotalTimeInPlayerBar(totalTime)
//  => adds text to the player bar reflecting the total duration of the song
var setTotalTimeInPlayerBar = function(totalTime) {
  $('.total-time').text(totalTime);
};

// setCurrentTimeInPlayerBar(currentTime)
//  => adds text to the player bar reflecting the current playback position
// of the song
var setCurrentTimeInPlayerBar = function(currentTime) {
  $('.current-time').text(currentTime);
};

// updateSeekBarWhileSongPlays()
//  => adds an event listener to the Buzz sound object to adjust the seek bar
// as the song progresses
var updateSeekBarWhileSongPlays = function() {
  if (currentSoundFile) {
    currentSoundFile.bind('timeupdate', function(event) {
      var seekBarFillRatio = this.getTime() / this.getDuration();
      var $seekBar = $('.seek-control .seek-bar');

      updateSeekPercentage($seekBar, seekBarFillRatio);
      setCurrentTimeInPlayerBar(filterTimeCode(currentSoundFile.getTime()));
    });
  }
};

// updateSeekPercentage($seekBar, seekBarFillRatio)
//  => takes in the '$seekbar' and 'seekBarFillRatio' and adjusts the display
// of the seek bar accordingly
var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
  var offsetXPercent = seekBarFillRatio * 100;
  offsetXPercent = Math.max(0, offsetXPercent);
  offsetXPercent = Math.min(100, offsetXPercent);

  var percentageString = offsetXPercent + '%';
  $seekBar.find('.fill').width(percentageString);
  $seekBar.find('.thumb').css({left: percentageString});
};

// setupSeekBars()
//  => initializes album.html's seek bars with click events to capture seek
// bar manipulation
var setupSeekBars = function() {
  var $seekBars = $('.player-bar .seek-bar');

  $seekBars.click(function(event) {
    var offsetX = event.pageX - $(this).offset().left;
    var barWidth = $(this).width();
    var seekBarFillRatio = offsetX / barWidth;

    if ($(this).parent().attr('class') == 'seek-control') {
      seek(seekBarFillRatio * currentSoundFile.getDuration());
    } else {
      setVolume(seekBarFillRatio * 100);
    }

    updateSeekPercentage($(this), seekBarFillRatio);
  });

  $seekBars.find('.thumb').mousedown(function(event) {
    var $seekBar = $(this).parent();
    $(document).bind('mousemove.thumb', function(event) {
      var offsetX = event.pageX - $seekBar.offset().left;
      var barWidth = $seekBar.width();
      var seekBarFillRatio = offsetX / barWidth;

      if ($(this).parent().attr('class') == 'seek-control') {
        seek(seekBarFillRatio * currentSoundFile.getDuration());
      } else {
        setVolume(seekBarFillRatio * 100);
      }

      updateSeekPercentage($seekBar, seekBarFillRatio);
    });
    $(document).bind('mouseup.thumb', function() {
      console.log("unbinding");
      $(document).unbind('mousemove.thumb');
      $(document).unbind('mouseup.thumb');
    });
  });
};

// getSongNumberCell(number)
//  => returns the '.song-item-number' element that corresponds to 'number'
var getSongNumberCell = function(number) {
  return $('.song-item-number[data-song-number=' + number + ']');
};

// setSong(songNumber)
//  => sets global vars 'currentlyPlayingSongNumber' and 'currentSongFromAlbum'
// according to 'songNumber'
//  => creates a Buzz 'sound' object
var setSong = function(songNumber) {
  if (currentSoundFile) {
    currentSoundFile.stop();
  }

  currentlyPlayingSongNumber = parseInt(songNumber);
  currentSongFromAlbum = currentAlbum.songs[songNumber - 1];

  currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
    formats: [ 'mp3' ],
    preload: true
  });

  setVolume(currentVolume);
};

// seek(time)
//  => advances currentSoundFile to the time mark
var seek = function(time) {
  if (currentSoundFile) {
    currentSoundFile.setTime(time);
  }
};

var setVolume = function(volume) {
  if (currentSoundFile) {
    currentSoundFile.setVolume(volume);
  }
};

// trackIndex(album, song)
//  => returns the index of 'song' in 'album'
var trackIndex = function(album, song) {
  return album.songs.indexOf(song);
};

// nextSong()
//  => plays the next song, updating album.html with the changes
var nextSong = function() {
  var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
  // Note that we're _incrementing_ the song here
  currentSongIndex++;

  if (currentSongIndex >= currentAlbum.songs.length) {
    currentSongIndex = 0;
  }

  // Save the last song number before changing it
  var lastSongNumber = currentlyPlayingSongNumber;

  // Set a new current song
  setSong(currentSongIndex + 1);
  currentSoundFile.play();
  updateSeekBarWhileSongPlays();

  // Update the Player Bar information
  updatePlayerBarSong();

  var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
  var $lastSongNumberCell = getSongNumberCell(lastSongNumber);

  $nextSongNumberCell.html(pauseButtonTemplate);
  $lastSongNumberCell.html(lastSongNumber);
};

// previousSong()
//  => plays the previous song, updating album.html with the changes
var previousSong = function() {
  var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
  // Note that we're _decrementing_ the index here
  currentSongIndex--;

  if (currentSongIndex < 0) {
      currentSongIndex = currentAlbum.songs.length - 1;
  }

  // Save the last song number before changing it
  var lastSongNumber = currentlyPlayingSongNumber;

  // Set a new current song
  setSong(currentSongIndex + 1);
  currentSoundFile.play();
  updateSeekBarWhileSongPlays();

  // Update the Player Bar information
  updatePlayerBarSong();

  $('.main-controls .play-pause').html(playerBarPauseButton);

  var $previousSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
  var $lastSongNumberCell = getSongNumberCell(lastSongNumber);

  $previousSongNumberCell.html(pauseButtonTemplate);
  $lastSongNumberCell.html(lastSongNumber);
};

// updatePlayerBarSong()
//  => updates the text in the player bar to represent information from the
// song playing
var updatePlayerBarSong = function() {
  $('.currently-playing .song-name').text(currentSongFromAlbum.title);
  $('.currently-playing .artist-name').text(currentAlbum.artist);
  $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
  $('.main-controls .play-pause').html(playerBarPauseButton);
  setTotalTimeInPlayerBar(filterTimeCode(currentSongFromAlbum.duration));
};

// album button templates
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

// store state of playing songs
var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');

$(document).ready(function() {
  setCurrentAlbum(albumPicasso);
  setupSeekBars();

  $previousButton.click(previousSong);
  $nextButton.click(nextSong);
});

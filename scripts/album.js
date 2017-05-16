/*
  bloc-jams
    scripts
      album.js
*/

// example album
var albumPicasso = {
  title: "The Colors",
  artist: "Pablo Picasso",
  label: "Cubism",
  year: "1881",
  albumArtUrl: "assets/images/album_covers/01.png",
  songs: [
    { title: "Blue", duration: "4:26" },
    { title: "Green", duration: "3:14" },
    { title: "Red", duration: "5:01" },
    { title: "Pink", duration: "3:21" },
    { title: "Magenta", duration: "2:15" }
  ]
};

// another example album
var albumMarconi = {
  title: "The Telephone",
  artist: "Guglielmo Marconi",
  label: "EM",
  year: "1909",
  albumArtUrl: "assets/images/album_covers/20.png",
  songs: [
    { title: "Hello, Operator?", duration: "1:01" },
    { title: "Ring, ring, ring", duration: "5:01" },
    { title: "Fits in your pocket", duration: "3:21" },
    { title: "Can you hear me now?", duration: "3:14" },
    { title: "Wrong phone number", duration: "2:15" }
  ]
};

// Assignment 9 - my own album
var albumLamar = {
  title: "Damn",
  artist: "Kendrick Lamar",
  label: "Top Dawg",
  year: "2017",
  albumArtUrl: "assets/images/album_covers/Damn-Kendrick-Lamar.jpeg",
  songs: [
    { title: "Blood", duration: "1:58" },
    { title: "DNA", duration: "3:05" },
    { title: "Yah", duration: "2:40"},
    { title: "Element", duration: "3:28"},
    { title: "Feel", duration: "3:34"},
    { title: "Loyalty", duration: "3:47"},
    { title: "Pride", duration: "4:35"},
    { title: "Humble", duration: "2:57"},
    { title: "Lust", duration: "5:07"},
    { title: "Love", duration: "3:33"},
    { title: "XXX", duration: "4:14"},
    { title: "Fear", duration: "7:40"},
    { title: "God", duration: "4:08"},
    { title: "Duckworth", duration: "4:08"}
  ]
};


// generates song row content
var createSongRow = function(songNumber, songName, songLength) {
  var template =
    '<tr class="album-view-song-item">'
  + '  <td class="song-item-number">' + songNumber + '</td>'
  + '  <td class="song-item-title">' + songName + '</td>'
  + '  <td class="song-item-duration">' + songLength + '</td>'
  + '</tr>'
  ;

  return template;
}

// takes an album object and injects its information into the template
var setCurrentAlbum = function(album) {
  var albumTitle = document.getElementsByClassName('album-view-title')[0];
  var albumArtist = document.getElementsByClassName('album-view-artist')[0];
  var albumReleaseInfo = document.getElementsByClassName('album-view-release-info')[0];
  var albumImage = document.getElementsByClassName('album-cover-art')[0];
  var albumSongList = document.getElementsByClassName('album-view-song-list')[0];

  albumTitle.firstChild.nodeValue = album.title;
  albumArtist.firstChild.nodeValue = album.artist;
  albumReleaseInfo.firstChild.nodeValue = album.year + ' ' + album.label;
  albumImage.setAttribute('src', album.albumArtUrl);

  albumSongList.innerHTML = '';

  for (var i = 0; i < album.songs.length; i++) {
    albumSongList.innerHTML += createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
  }
};

window.onload = function() {
  setCurrentAlbum(albumPicasso);

  // Add an event listener to the album cover. When a user clicks it, the album
  // page content should toggle between the three album objects: albumPicasso,
  // albumMarconi, and your album object.

  // grabbing 'album-cover-art' element
  var albumCover = document.getElementsByClassName('album-cover-art')[0];
  // adding event listener ('click')
  albumCover.addEventListener('click', function(event) {
    var albumTitle = document.getElementsByClassName('album-view-title')[0].textContent;
    // conditional statement to check current album displayed
    if (albumTitle === "The Colors") { setCurrentAlbum(albumMarconi); }
    else if (albumTitle === "The Telephone") { setCurrentAlbum(albumLamar); }
    else if (albumTitle === "Damn") { setCurrentAlbum(albumPicasso); }
  });

  // adding 'pointer' cursor to the 'album-cover-art' element to signal
  // interactivity
  albumCover.style.cursor = "pointer";
};

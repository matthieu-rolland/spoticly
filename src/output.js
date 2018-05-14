var term = require( 'terminal-kit' ).terminal ;

var displayList = list => {
  return new Promise(resolve => {
    term.singleColumnMenu(list , function(error , response) {
      resolve(response.selectedIndex);
    });
  });
}

exports.notFound = artistName => {
  term('\n').eraseLineAfter.red(
    "- Oops, I couldn't find anything like \"%s\" :(" ,
    artistName
  );
  term( '\n' ).eraseLineAfter.blue(
    " ** Don't cry ok? **\n" ,
  );
  process.exit();
}

exports.noPlaylist = playlistName => {
  term('\n').eraseLineAfter.red(
    "- Oops, I couldn't find any playlist like \"%s\" :(" ,
    playlistName
  );
  term( '\n' ).eraseLineAfter.blue(
    " ** Don't cry ok? **\n" ,
  );
  process.exit();
}

exports.noAlbums = artistName => {
  term('\n').eraseLineAfter.red(
    "- Oops, I didn't find any album from %s...",
    artistName
  );
  term('\n').eraseLineAfter.blue(
    " ** That's weird, right? **\n"
  );
  process.exit();
}

exports.foundAlbums = nb => {
  process.stdout.write('\033c');
  term( '\n' ).eraseLineAfter.green(
    "- I found %s albums !\n" ,
    nb
  );
}

exports.foundAlbumsAndSingles = albums => {
  var nbAlbums = nbSingles = nbCompilations = 0;
  for (var key in albums) {
    if (albums[key].album_type == 'album') nbAlbums++;
    if (albums[key].album_type == 'single') nbSingles++;
    if (albums[key].album_type == 'compilation') nbCompilations++;
  }
  process.stdout.write('\033c');
  term( '\n' ).eraseLineAfter.green(
    "- I found %s albums, %s singles and %s compilations !\n" ,
    nbAlbums,
    nbSingles,
    nbCompilations
  );
}

exports.displayArtistsList = artistsData => {
  artistsList = [];
  for (var key in artistsData) {
    artistsList.push(artistsData[key].name);
  }
  return displayList(artistsList);
}

exports.displayPlaylists = playlists => {
  process.stdout.write('\033c');
  list = [];
  for (var key in playlists) {
    list.push(playlists[key].name);
  }
  return displayList(list);
}

exports.displayAlbums = (albums) => {
  displayAlbumsList = [];
  for (var key in albums) {
    displayAlbumsList.push('  ' + albums[key].name + ' (' + albums[key].album_type + ' - ' + albums[key].release_date.substr(0, 4) + ')');
  }
  return displayList(displayAlbumsList);
}

exports.displayTracks = async tracks => {
  process.stdout.write('\033c');
  displayTracksList = [];
  for (var key in tracks) {
    displayTracksList.push(' ' + tracks[key].name + ' (' + tracks[key].artists[0].name + ')');
  }
  return displayList(displayTracksList);
}

exports.displayContextTracks = async (tracks, type, contextName) => {
  process.stdout.write('\033c');
  term( '\n' )
  .eraseLineAfter
  .green("- There are %s tracks in ", tracks.length)
  .yellow('%s' + '\n', contextName);

  displayTracksList = [];
  for (var key in tracks) {
    if (type != 'album') {
      displayTracksList.push(' ' + tracks[key].track.name + ' (' + tracks[key].track.artists[0].name + ')');
    } else {
      displayTracksList.push(' ' + tracks[key].name + ' ');
    }
  }
  return displayList(displayTracksList);
}

exports.youChose = (choice, artistName) => {
  process.stdout.write('\033c');
  term( '\n' )
  .eraseLineAfter
  .green("- Now playing: ")
  .blue("%s ", choice);
  if (artistName != null) {
    term
    .green('from ')
    .yellow('%s\n\n', artistName);
  } else {
    term('\n\n');
  }
  process.exit();
}

exports.topTracks = artistName => {
  term( '\n' ).eraseLineAfter.green(
    "- Now playing top tracks from "
  ).yellow(
    "%s\n\n",
    artistName
  );
  process.exit();
}

exports.currentlyPlaying = (position, trackInfos) => {
  term( '\n' )
  .eraseLineAfter
  .green("- Current track: ")
  .blue("%s ", trackInfos.name)
  .green("by ")
  .yellow('%s\n\n', trackInfos.artist);
  process.exit();
}

exports.askAccessInfos = (idType) => {
  return new Promise(resolve => {
    term('\nPlease enter your ' + idType + ': ');
    term.inputField(
      {},
      function(error, input) {
        resolve(input);
      }
    );
  });
}

exports.noTrackList = () => {
  term( '\n' ).eraseLineAfter.red(
    ' - hmmm, nope ! This only works if: \n\n 1/ You are listening to an album or a playlist\n 2/ And you entered this album or playlist through spoticly.'
  ).blue(
    '\n\n ** Don\'t cry ok? **\n'
  );
  process.exit();
}

exports.crendentialSet = () => {
  term( '\n\n' ).eraseLineAfter.green('Your credentials have been set :) \n\n');
  process.exit();
}

exports.generalError = (technicalError) => {
  term('\n').eraseLineAfter.red(
    " - Oops, there was a problem :(" ,
  );
  term( '\n' ).eraseLineAfter.blue(
    " ** Is spotify properly started ? **\n" ,
  );
  term( '\n' ).eraseLineAfter.blue(
    " ** Or maybe this song is not available in your country ? **\n" ,
  );
  term('\n')
  .blue('Technical error message: ')
  .white(technicalError + '\n');
}

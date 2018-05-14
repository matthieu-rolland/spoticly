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
  list = [];
  for (var key in playlists) {
    list.push(playlists[key].name);
  }
  return displayList(list);
}

exports.displayAlbums = albums => {
  displayAlbumsList = [];
  for (var key in albums) {
    displayAlbumsList.push('  ' + albums[key].name + ' (' + albums[key].album_type + ' - ' + albums[key].release_date.substr(0, 4) + ')');
  }
  return displayList(displayAlbumsList);
}

exports.displayTracks = async tracks => {
  displayTracksList = [];
  for (var key in tracks) {
    displayTracksList.push(' ' + tracks[key].name + ' (' + tracks[key].artists[0].name + ')');
  }
  return displayList(displayTracksList);
}

exports.youChose = (choice, artistName) => {
  process.stdout.write('\033c');
  term( '\n' )
  .eraseLineAfter
  .green("- Now playing: ")
  .blue(
    "%s ",
    choice
  );
  if (artistName != null) {
    term.green('from ')
    .yellow(
      '%s\n\n',
      artistName
    );
  }
  process.exit();
}

exports.topTracks = artistName => {
  // process.stdout.write('\033c');
  term( '\n' ).eraseLineAfter.green(
    "- Now playing top tracks from "
  ).yellow(
    "%s\n\n",
    artistName
  );
  process.exit();
}

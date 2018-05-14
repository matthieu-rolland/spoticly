const spotiFetcher = require('./spotiFetcher');
const output = require('./output');
const spotiScript = require('spotify-node-applescript');
const termImg = require('term-img');

var controller = {};

exports.dispatcher = (callMethod, spotApi = false, params = false, options = false) => {
  spotApi.clientCredentialsGrant().then(data => {
    spotApi.setAccessToken(data.body['access_token']);
    controller[callMethod](spotApi, params, options);
  });
}

controller.artistAlbums = async (spotApi, artistName, options) => {
  // get artists list
  var artistsData = await spotiFetcher.getArtistList(spotApi, artistName);
  if (artistsData.length < 1) output.notFound(artistName);
  // get albums list for chosen artist
  var indexArtist = options.choose ? await output.displayArtistsList(artistsData) : 0;
  var albums = await spotiFetcher.getArtistAlbums(spotApi, artistsData[indexArtist].id, options.all);
  if (albums.length < 1) output.noAlbums(artistsData[indexArtist].name);
  options.all ? output.foundAlbumsAndSingles(albums) : output.foundAlbums(albums.length);
  // play selected album
  selectedAlbum = albums[await output.displayAlbums(albums)];
  spotiScript.playTrackInContext(selectedAlbum.uri);
  termImg('/Users/matthieurolland/Desktop/testage.jpeg', {width : '10', height : '10'});
  // termImg(selectedAlbum.images[2].url, {width : '10', height : '10'});
  output.youChose(selectedAlbum.name, selectedAlbum.artists[0].name);
}

controller.artistTopTracks = async (spotApi, artistName, options) => {
  var artistsData = await spotiFetcher.getArtistList(spotApi, artistName);
  if (artistsData.length < 1) output.notFound(artistName);
  var indexArtist = options.choose ? await output.displayArtistsList(artistsData) : 0;
  spotiScript.playTrackInContext(artistsData[indexArtist].uri);
  output.topTracks(artistsData[indexArtist].name);
}

controller.playLists = async (spotApi, playlistName, options) => {
  var playlists = await spotiFetcher.getPlaylists(spotApi, playlistName);
  if (playlists.length < 1) output.noPlaylist(playlistName);
  selectedIndex = await output.displayPlaylists(playlists);
  spotiScript.playTrackInContext(playlists[selectedIndex].uri);
  output.youChose(playlists[selectedIndex].name, playlists[selectedIndex].owner.display_name);
}

controller.thisIs = async (spotApi, artistName) => {
  var playlists = await spotiFetcher.getPlaylists(spotApi, artistName, 'this is');
  if (playlists.length < 1) output.noPlaylist(artistName);
  spotiScript.playTrackInContext(playlists[0].uri);
  output.youChose(playlists[0].name, playlists[0].owner.display_name);
  process.exit();
}

controller.track = async (spotApi, name) => {
  var tracks = await spotiFetcher.getTracks(spotApi, name);
  if (tracks.length < 1) output.notFound(name);
  selectedTrack = tracks[await output.displayTracks(tracks)];
  spotiScript.playTrack(selectedTrack.uri);
  output.youChose(selectedTrack.name, selectedTrack.artists[0].name);
}
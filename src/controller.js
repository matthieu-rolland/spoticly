const spotiFetcher = require('./spotiFetcher');
const output = require('./output');
const spotiScript = require('spotify-node-applescript');
const termImg = require('term-img');
const conf = require('conf');
var controller = {};

/**
 * Get spotify credentials granted, set access token, call specified method
 *
 * @param  {[string]}   callMethod
 * @param  {object}     spotApi
 * @param  {object}     params
 * @param  {object}     options
 */
exports.dispatcher = (callMethod, spotApi = false, params = false, options = false) => {
  spotApi.clientCredentialsGrant().then(data => {
    spotApi.setAccessToken(data.body['access_token']);
    controller[callMethod](spotApi, params, options);
  });
}

/**
 * Get a list of playlist for a given keyword,
 * then paly the selected playlist
 * @param  {object} spotApi
 * @param  {string} playlistName
 * @param  {object} options
 */
controller.playLists = async (spotApi, playlistName, options) => {
  var playlists = await spotiFetcher.getPlaylists(spotApi, playlistName);
  if (playlists.length < 1) output.noPlaylist(playlistName);
  selectedIndex = await output.displayPlaylists(playlists);
  setContext(playlists[selectedIndex]);
  spotiScript.playTrackInContext(playlists[selectedIndex].uri);
  output.youChose(playlists[selectedIndex].name, playlists[selectedIndex].owner.display_name);
}

/**
 * Get a "this is" playlist (the ones made by spotify)
 * and play it if there is any (most bands don't have a "this is" playlist made by spotify)
 * @param  {object} spotApi
 * @param  {string} artistName
 */
controller.thisIs = async (spotApi, artistName) => {
  var playlists = await spotiFetcher.getPlaylists(spotApi, artistName, 'this is');
  if (playlists.length < 1) output.noPlaylist(artistName);
  setContext(playlists[0]);
  spotiScript.playTrackInContext(playlists[0].uri);
  output.youChose(playlists[0].name, playlists[0].owner.display_name);
  process.exit();
}

/**
 * Display list of tracks in current context (albums or playlists)
 * Then play the selected track
 * @param  {object} spotApi
 * @param  {object} lastContext
 */
controller.getTrackList = async (spotApi, lastContext) => {
  if (!lastContext) {
    output.noTrackList();
  }
  var currentTrackList = await spotiFetcher.getCurrentTrackList(spotApi, lastContext);
  var trackIndex = await output.displayContextTracks(currentTrackList, lastContext.type, lastContext.name);
  var trackUri = lastContext.type == 'album' ? currentTrackList[trackIndex].uri : currentTrackList[trackIndex].track.uri;
  spotiScript.playTrackInContext(trackUri, lastContext.uri);
  await new Promise(done => setTimeout(done, 600));
  controller.getStatus();
}

/**
 * Get a list of albums from a given artist,
 * and play the selected album (album, compilation single)
 * @param  {object} spotApi
 * @param  {string} artistName that's the needle
 * @param  {object} options    [description]
 */
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
  setContext(selectedAlbum);
  spotiScript.playTrackInContext(selectedAlbum.uri);
  output.youChose(selectedAlbum.name, selectedAlbum.artists[0].name);
}

/**
 * Play an artist's top tracks
 * @param  {object} spotApi
 * @param  {string} artistName
 * @param  {object} options
 */
controller.artistTopTracks = async (spotApi, artistName, options) => {
  var artistsData = await spotiFetcher.getArtistList(spotApi, artistName);
  if (artistsData.length < 1) output.notFound(artistName);
  var indexArtist = options.choose ? await output.displayArtistsList(artistsData) : 0;
  spotiScript.playTrackInContext(artistsData[indexArtist].uri);
  output.topTracks(artistsData[indexArtist].name);
}

/**
 * Get a list of tracks for a given keyword,
 * and play selected track
 * @param  {object} spotApi
 * @param  {string} name
 */
controller.track = async (spotApi, name) => {
  var tracks = await spotiFetcher.getTracks(spotApi, name);
  if (tracks.length < 1) output.notFound(name);
  selectedTrack = tracks[await output.displayTracks(tracks)];
  spotiScript.playTrack(selectedTrack.uri);
  output.youChose(selectedTrack.name, selectedTrack.artists[0].name);
}

/**
 * Display infos on currently played track
 */
controller.getStatus = async () => {
  var position = await getInfo('getState', 'position');
  var trackInfos = await getInfo('getTrack');
  output.currentlyPlaying(position, trackInfos);
}

/**
 * Get user's access infos in order to be able to use the spotify api
 * @param  {string} idType  (as it will be displayed to the user in the command line)
 */
exports.getAccessInfos = async (idType) => {
  return await output.askAccessInfos(idType);
}

exports.askCredentials = async () => {
  var config = new conf();
  config.set('client.id', await exports.getAccessInfos('client ID'));
  config.set('client.secret', await exports.getAccessInfos('client secret'));
  output.crendentialSet();
}

/**
 * Get informations on currently played track
 * @param  {string}  method
 * @param  {string} element
 * @return {promise]}
 */
function getInfo(method, element = false) {
  return new Promise(resolve => {
    spotiScript[method](function(err, state) {
      try {
        if (element && typeof state[element] != undefined) {
          resolve(state[element]);
        } else {
          resolve(state);
        }
      } catch(e) {
        output.generalError(e.message);
      }
    });
  });
}

/**
 * Set current context, so that user can later fetch a track list of current context
 * @param {[object]} contextObject
 */
function setContext(contextObject) {
  var config = new conf();
  config.set('lastContext.type', contextObject.type);
  config.set('lastContext.id', contextObject.id);
  config.set('lastContext.name', contextObject.name);
  config.set('lastContext.uri', contextObject.uri);
  if (typeof contextObject.owner != 'undefined') {
    config.set('lastContext.userId', contextObject.owner.id);
  }
}

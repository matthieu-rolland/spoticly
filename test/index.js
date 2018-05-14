var assert = require('chai').assert;
var expect = require('chai').expect;
const spotify = require('spotify-web-api-node');
const spotiFetcher = require('../src/spotiFetcher');
const loadJsonFile = require('load-json-file');
const conf = require('conf');

var getSpotApi = () => {
  spotApi = new spotify({
        clientId : 'f2d8eccf21d84f459c447c732bbde0f2',
        clientSecret : 'dd6980480dab4ef1b81caa093df91fe7'
      });
  return new Promise(resolve => {
    spotApi.clientCredentialsGrant().then(data => {
      spotApi.setAccessToken(data.body['access_token']);
      resolve(spotApi);
    });
  });
}

var testGetCurrentTrackList = async () => {
  spotApi = await getSpotApi();
  var lastContext = await loadJsonFile('test/lastContext.json');
  var trackList = await spotiFetcher.getCurrentTrackList(spotApi, lastContext);
  assert.isString(typeof trackList[0].name, 'first track name');
}

var testGetArtistAlbums = async () => {
  var spotApi = await getSpotApi();
  var albumList = await spotiFetcher.getArtistAlbums(spotApi, '4pejUc4iciQfgdX6OKulQn', false);
  var albumAndSinglesList = await spotiFetcher.getArtistAlbums(spotApi, '4pejUc4iciQfgdX6OKulQn', true);
  assert.isString(albumList[0].name, 'first album name');
  assert.isString(albumAndSinglesList[0].name, 'first album or single name');
  assert.isAbove(albumAndSinglesList.length, albumList.length, 'albums and single list is strictly greater than only albums list');
}

var testGetArtistList = async () => {
  var spotApi = await getSpotApi();
  var artist = 'radiohead';
  var artistList = await spotiFetcher.getArtistList(spotApi, artist);
  assert.strictEqual(artist, artistList[0].name.toLowerCase(), 'these artist names are strictly equal');
}

var testGetPlaylists = async () => {
  var spotApi = await getSpotApi();
  var playlists = await spotiFetcher.getPlaylists(spotApi, 'bossa nova');
  assert.isString(playlists[1].name, 'name of a playlist');
}

var testGetTracks = async () => {
  var spotApi = await getSpotApi();
  var listOfTracks = await spotiFetcher.getTracks(spotApi, 'a rush and a push');
  assert.isString(listOfTracks[0].name, 'first album name');
}

describe('Fetch data using the spotify web api', function(){
  it('get a list of track from spotify api, given an album\'s informations', testGetCurrentTrackList);
  it('get a list of albums', testGetArtistAlbums);
  it('get a list of artists', testGetArtistList);
  it('get a list of playlists', testGetPlaylists);
  it('get a list of tracks', testGetTracks);
});

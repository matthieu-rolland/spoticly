const filters = require('./filters');

spotiFetcher = {};

spotiFetcher.getData = (spotApi, methodName, param, optional = false) => {
  return new Promise(resolve => {
    spotApi[methodName](param, optional).then(function(data) {
      resolve(data);
    });
  });
}

exports.getCurrentTrackList = async (spotApi, contextObject) => {
  var tracks;
  if (contextObject.type === 'playlist') {
    tracks = await spotApi['getPlaylistTracks'](contextObject.userId, contextObject.id);
  } else if (contextObject.type === 'album') {
    tracks = await spotiFetcher.getData(spotApi, 'getAlbumTracks', contextObject.id);
  }
  tracks = tracks.body.items || [];
  return new Promise(resolve => {
    resolve(tracks);
  });
}

exports.getArtistAlbums = async (spotApi, artistId, all) => {
  var albums = await spotiFetcher.getData(spotApi, 'getArtistAlbums', artistId, {limit: 50, offset: 0})
  albums = albums.body.items || [];
  if (albums.length === 50) {
    nextAlbums = await spotiFetcher.getData(spotApi, 'getArtistAlbums', artistId, {limit: 50, offset: 50});
    albums = [...albums, ...nextAlbums.body.items];
  }
  albums = filters.filterAlbums(albums, all);
  return albums;
}

exports.getArtistList = async (spotApi, artistName) => {
  var artists = await spotiFetcher.getData(spotApi, 'searchArtists', artistName);
  return artists.body.artists.items || [];
}

exports.getPlaylists = async (spotApi, search, filterName = false) => {
  var playlists = await spotiFetcher.getData(spotApi, 'searchPlaylists', search, {limit: 25, offset: 0});
  playlists = playlists.body.playlists.items;
  if (filterName) {
    playlists = filters.filterPlaylistName(playlists, filterName);
  }
  return playlists;
}

exports.getTracks = async (spotApi, search) => {
  var tracks = await spotiFetcher.getData(spotApi, 'searchTracks', search);
  return tracks.body.tracks.items || [];
}

exports.filterAlbums = (albumList, all) => {
  var duplicates = [];
  return albumList.filter((item) => {
    if ((item.album_type == 'album' 
      || (item.album_type == 'single' && all)
      || (item.album_type == 'compilation' && all))
      && item.album_group != 'appears_on' 
      && duplicates.indexOf(item.name.toLowerCase()) == -1) {
      duplicates.push(item.name.toLowerCase());
      return true;
    }
    return false;
  });
}

exports.filterPlaylistName = (playlists, filterString) => {
  return playlists.filter(item => {
    if (item.name.toLowerCase().indexOf(filterString) == -1) {
      return false;
    }
    return true;
  });
}
#!/usr/bin/env node
var spotify = require('spotify-web-api-node');
var program = require('commander');
var controller = require('./src/controller');
const spotiScript = require('spotify-node-applescript');


program
  .version('1.0')
  .command('artist <name>')
  .alias('ar')
  .description('get music from an artist\'s name')
  .action(function(name, cmd) {
    program.topTracks ? init('artistTopTracks', name, program) : init('artistAlbums', name, program);
  });

program
  .command('track <name>')
  .alias('tr')
  .description('find a specific track by its name')
  .action(function(name, cmd) {
    init('track', name, program);
  });

program
  .command('playlist <name>')
  .alias('pl')
  .description('Search a playlist by name')
  .action(function(name, cmd) {
    init('playLists', name, program);
  });

program
  .command('thisis <name>')
  .alias('ti')
  .description('Listen to spotify\'s "This is xxx" playlist of an artist, if it exists')
  .action(function(name, cmd) {
    init('thisIs', name, program);
  });

program
  .command('status')
  .alias('st')
  .description('Get info on current track')
  .action(function(cmd) {
    spotiScript.getTrack(function(err, track) {
      console.log(track);
      process.exit();
    });
  });

program
  .command('next')
  .alias('n')
  .description('Play next track')
  .action(function(){
    spotiScript.next();
  });

program
  .command('previous')
  .alias('p')
  .description('Play previous track')
  .action(function(){
    spotiScript.previous();
  });

program
  .command('play-pause')
  .alias('pp')
  .description('Toggles play/pause')
  .action(function(){
    spotiScript.playPause();
  });

program.option('ch --choose', 'Used with \'ar\', it lets you choose among a list of corresponding artists');
program.option('all --all', 'When used with \'ar\', will not only fetch albums but also singles and compilations.');
program.option('tt --top-tracks', 'When used with \'ar\', will play artist\'s top tracks');
program.parse(process.argv);

async function init(getMethod, params = false, options = false) {
  spotApi = new spotify({
    clientId : 'f2d8eccf21d84f459c447c732bbde0f2',
    clientSecret : 'dd6980480dab4ef1b81caa093df91fe7'
  });
  controller.dispatcher(getMethod, spotApi, params, options);
}

  // program
  // .version('1.0.0')
  // .option('al, --album [name]', 'Search album')
  // .option('ar, --artist [name]', 'Searcb artist')
  // .option('pl, --playlist [name]', 'Search playlist')
  // .option('upl, --userplaylists [username]', 'Search a user\'s playlists')
  // .option('st, --status', 'See what\'s currently being played')
  // .option('play --play', 'Play music')
  // .option('pause --pause', 'Pause music')
  // .option('next --next', 'Next song')
  // .option('prev --previous', 'Previous song')
  // .option('status --status', 'Current song')
  // .option('mute --mutevolume', 'Mute sound')
  // .option('unmute --unmutevolume', 'Unmute sound')
  // .parse(process.argv);





// console.log(program);

// return;

// function testage() {
//   return new Promise(resolvec => {
//     setTimeout(() => {
//       console.log('2 secondes passées');
//       resolvec('le résultat !');
//     }, 2000);
//   });
// }

// async function  getResult() {
//   var result = await testage();
//   console.log(result);
// }

// getResult();

// spoti.clientCredentialsGrant().then(function(data) {
//     spoti.setAccessToken(data.body['access_token']);
//     if (program.userplaylists) {
//         spoti.getUserPlaylists(program.userplaylists).then(function(data) {
//             console.log(data.body.items[0]);
//         });
//     }
//     if (program.playlist) {
//         spoti.searchPlaylists(program.playlist).then(function(data) {
//             console.log(data.body.playlists.items);
//         });
//     }
//     if (program.artist) {
//         spoti.searchArtists(program.artist).then(function(data) {
//             if (data.body.artists.items.length < 1) {
//               term( '\n' ).eraseLineAfter.red(
//                 "- Oops, I couldn't find anything like \"%s\" :(" ,
//                 program.artist
//               );
//               term( '\n' ).eraseLineAfter.blue(
//                   "** Don't cry ok? **\n" ,
//                 );
//               process.exit();
//             }
//             spoti.getArtistAlbums(data.body.artists.items[0].id, {limit: 50, offset: 0})
//               .then(function(data) {
//                 var albumList = [];
//                 var duplicates = [];
//                 var albums = data.body.items.filter((item) => {
//                   if ((item.album_type == 'album'/* || item.album_type == 'single' || item.album_type == 'compilation'*/)&& item.album_group != 'appears_on' && duplicates.indexOf(item.name.toLowerCase()) == -1) {
//                     duplicates.push(item.name.toLowerCase());
//                     return true;
//                   }
//                   return false;
//                 });
//                 for (var key in albums) {
//                     albumList.push('  ' + albums[key].name + ' (' + albums[key].album_type + ' - ' + albums[key].release_date.substr(0, 4) + ')');
//                 }
//                 process.stdout.write('\033c');
//                 term( '\n' ).eraseLineAfter.green(
//                   "- I found %s albums :)\n" ,
//                   albumList.length
//                 );
//                 term.singleColumnMenu( albumList , function( error , response ) {
//                   spotiScript.playTrackInContext(albums[response.selectedIndex].uri, function(){

//                   });
//                   process.stdout.write('\033c');
//                   term( '\n' ).eraseLineAfter.green(
//                     "- You chose: %s from --%s--\n" ,
//                     response.selectedText,
//                     albums[response.selectedIndex].artists[0].name
//                   );

//                   process.exit();
//                 } ) ;

//               }, function(err) {
//                 console.error(err);
//               });
//         });
//     }
//     if (program.play) {
//         spotiScript.play(function(err, track){
//         });
//     }
//     if (program.pause) {
//         spotiScript.pause(function(err, track){
//         });
//     }
//     if (program.next) {
//         spotiScript.next(function(err, track){
//         });
//     }
//     if (program.previous) {
//         spotiScript.previous(function(err, track){
//         });
//     }
//     if (program.mutevolume) {
//         spotiScript.muteVolume();
//     }
//     if (program.unmutevolume) {
//         spotiScript.unmuteVolume(function(err, track){
//         });
//     }
//     if (program.status) {
//         spotiScript.getTrack(function(err, track){
//           console.log(track);
//         });
//     }
// });

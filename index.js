#!/usr/bin/env node
const spotify = require('spotify-web-api-node');
const program = require('commander');
const controller = require('./src/controller');
const spotiScript = require('spotify-node-applescript');
const conf = require('conf');
const updateNotifier = require('update-notifier');
const pkg = require('./package.json');

updateNotifier({pkg}).notify();

var init = async (methodName, params = false, options = false) => {
  var config = new conf();
  if (!config.get('client.id', false)) {
    config.set('client.id', await controller.getAccessInfos('client ID'));
    config.set('client.secret', await controller.getAccessInfos('client secret'));
  }
  spotApi = new spotify({
    clientId : config.get('client.id'),
    clientSecret : config.get('client.secret')
  });
  controller.dispatcher(methodName, spotApi, params, options);
}

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
  .action(async function(cmd) {
    init('getStatus', false, program);
  });

program
  .command('next')
  .alias('n')
  .description('Play next track')
  .action(function(){
    spotiScript.next();
    init('getStatus', false, program);
  });

program
  .command('previous')
  .alias('p')
  .description('Play previous track')
  .action(function(){
    spotiScript.previous();
    init('getStatus', false, program);
  });

program
  .command('play-pause')
  .alias('pp')
  .description('Toggles play/pause')
  .action(function(){
    spotiScript.playPause();
  });

program
  .command('about')
  .alias('abt')
  .description('About spoticly')
  .action(function(){
    // about();
  });

program
  .command('track-list')
  .alias('tl')
  .description('navigate in current track list (for albums and playlists only)')
  .action(function(){
    var config = new conf();
    init('getTrackList', config.get('lastContext', false));
  });

program
  .command('credentials')
  .alias('cr')
  .description('Set credentials (spotify client ID and secret token)')
  .action(function(name, cmd) {
    controller.askCredentials();
  });

program.option('ch --choose', 'Used with \'ar\', it lets you choose among a list of corresponding artists');
program.option('all --all', 'When used with \'ar\', will not only fetch albums but also singles and compilations.');
program.option('tt --top-tracks', 'When used with \'ar\', will play artist\'s top tracks');
program.parse(process.argv);

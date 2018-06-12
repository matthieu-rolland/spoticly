
# SPOTICLY

[![NPM](https://nodei.co/npm/spoticly.png)](https://nodei.co/npm/spoticly/) [![Build Status](https://travis-ci.org/breizoreol/spoticly.svg?branch=master)](https://travis-ci.org/breizoreol/spoticly) ![npm](https://img.shields.io/npm/dt/spoticly.svg)


Browse, control and listen to spotify from the command line (mac os only for now, windows support might come later)

## Why would I need this?
I am on dual screen at work and I was fed up with switching from command line/ editor to spotify all the time, also I was not happy with already existing CLI solutions, I made this CLI utility to spare me some time. Context switching aside, it's actually even faster than using the GUI. 

![alt text](https://github.com//breizoreol/spoticly/blob/master/demo.gif?raw=true) 

## INSTALL AND SETUP

### INSTALL

```
npm install -g spoticly

````

### FIRST USE
Get your credentials (spotify client ID and secret token) by creating an app at this address: https://developer.spotify.com/my-applications
It's fast and easy, put whatever in the form.

Spoticly will ask for it the first time you use it.

## Usage

### Listen to an artist
By default, you will get to choose among an artist's **albums** using this command:
```
    spoticly artist radiohead
````

Use the '**--choose**' option or just 'ch' if you need to **choose** among several artists, it's useful if several artists have similar names, ex:
```
    spoticly artist ch radiohead
    spoticly artist --choose radiohead

    (will give you a list of artists to choose from)
````

Use the '**all**' option if you want to select not only albums but also singles and compilations (without this option, you will get to choose among albums only)

```
    spoticly artist all nirvana
````

Use the '**--top-tracks**' option, or just 'tt' if you just want to listen to the artist's **top tracks**, ex:

````
    spoticly artist tt qotsa

    (will play Queen of the Stone Age's top tracks)
````

### Listen to a playlist

Use this command to choose a **playlist** or its shortcut '**pl**':

```
    spoticly playlist "chanson française"    
    spoticly pl "chanson française"
````

### Listen to a specific track

You can search for a specific track using the "**track**" command, or '**tr**'

```
    spoticly track "song for the dead"
    spoticly tr "song for the dead"
````

### Navigate inside an album or a playlist
Use '**track-list**' or '**tr**' to display and navigate inside an album or playlist

```
    spoticly --track-list
    spoticly tr
````


### CONTROLS AND OTHER COMMANDS

Use the --help command to get a detailed list of all features (play/pause/next/previous etc...)
````
    spoticly --help
````

## TODO

 Improve tests, get a user's playlists, paginate long playlists, add an about command, notify updates...






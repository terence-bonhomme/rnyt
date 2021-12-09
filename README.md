# rnyt
take notes in RemNote with a Youtube video

plugin for RemNote (https://www.remnote.io/) with only read and create permissions

## Project

- get a tool to learn with Youtube videos into RemNote
- make something that can be useful for others
- learn Javascript, jQuery, CSS, Bootstrap
- use YouTube Player API for iframe Embeds (https://developers.google.com/youtube/iframe_api_reference)
- use Glitch (https://glitch.com/) 
  - my page : (https://glitch.com/@terence-bonhomme)
- the plugin has weakness, read the cautious part

## Description

- create timestamps like chapters, add child notes with or without timestamps
- review you video notes later
- jump to the timestamps with your mouse or your keyboard
- control the player with shortcuts
- set the default settings when you use the plugin, so you don't have to do your settings again
- modify your rems in Remnote

## Quick start

https://streamable.com/iwc01j

### How to add the plugin ?

- Plugin Name : rnyt (by example)
- Plugin URL : https://local-maroon-badger.glitch.me 
- CSS Height : find your height or empty
- Permissions : Read and Create
- Location : inline

### How to use the plugin ?

- copy paste your video link on RemNote (youtube.com or you.tube)
- go into the rem
- insert the plugin
- click on the video to start
- input a delay to rewind the video when you take a note

### How to change the default settings ?

- go into RemNote YT
- dark_mode : 0 (or 1)
- width: 65 (% value)
- playback_speed: 1 (0.25, 0.5, ..., 2)
- delay: 0 (seconds)
- caption: 0 (or 1)

## Commands

### Button

 - take note : take a note
 - delay : the timestamp begins earlier
 - keyboard : check if the plugin player has the focus to use shortcuts
 - refresh : correct your notes, fold and refresh

### Keyboard shortcuts

#### Video is playing

#### note
- enter : input a note
#### playing
- left : rewind 5s
- right : forward 5s
- space : play/pause
- j : rewind 10s
- l : forward 10s
- k : play/pause
- 0-9 : n * 10% jump
- shift + , : slower
- shift + . : faster
#### sound
- m : mute
- shift + up : volume up
- shift + down : volume down
#### jump
- shift + chapter up : previous
- shift + chapter down : next chapter
- shift + home : first chapter
- shift + end : last chapter
- backspace : repeat the current chapter

#### You're taking a note

- enter : enter a parent note with a timestamp
- ctrl + enter : enter a child note with a timestamp
- alt + enter : enter a child note without a timestamp
- shift + enter : enter a question to create a flashcard
- ctrl + shift + enter : enter a child question to create a flashcard
- left / right : you can use left and right before to type
- cancel : erase and leave the text input

you can use qwerty and azerty

## cautious

- don't delete the RemNote YT
  - deleted rems are not really deleted in RemNote
- plugin name
  - if you don't want the settings, use -np in the plugin name : example rnyt -np    
  - use an useless name like "rnyt" to avoid noise when you search in RemNote
- the plugin can't modify the rems, so it won't correct the misplaced rems
- be careful when you edit you rems into RemNote
  - the timestamps are mandatory on the top level
  - follow the chronological order
  - the child notes with a timestamp are inserted before child notes without a timestamp
- the child notes are linked to the current chapter, you can change it into RemNote
- show one plugin at a time to avoid duplicates
- in the settings
  - only change the numbers
  - don't write units
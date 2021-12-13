# rnyt

take notes in RemNote with a Youtube video

plugin for RemNote (https://www.remnote.io/) with only read and create permissions

## Project

### me

- I get a tool to learn with Youtube videos into RemNote
- I make something that can be useful for others
- I learn Javascript, jQuery, CSS, Bootstrap

### information

- it uses YouTube Player API for iframe Embeds (https://developers.google.com/youtube/iframe_api_reference)
- it uses Glitch (https://glitch.com/) 
- the plugin has weaknesses, read the "Warning" part

## Description

- create timestamps like chapters, add child notes with or without timestamps
- review you video notes later
- jump to the timestamps with your mouse or your keyboard
- control the player with shortcuts
- set the default settings, so you don't have to do your settings again
- put questions and get the answer with a video link
- modify your rems in Remnote

## Quick start

### Short presentation video

[![Watch the video](https://img.youtube.com/vi/eUwJnBIlHsI/0.jpg)](https://youtu.be/eUwJnBIlHsI)

### How to add the plugin ?

- Plugin Name : rnyt (by example)
- Plugin URL : https://local-maroon-badger.glitch.me 
- CSS Height : find your height or empty
- Permissions : Read and Create
- Location : inline

### How to use the plugin ?

- copy paste your video link in RemNote (youtube.com or you.tube)
- go into the rem
- insert the plugin
- click on the video to start
- input a delay to rewind the video when you take a note

### How to change the default settings ?

- you can skip and use these settings later
- go into RemNote YT
  - dark_mode : 0 (or 1)
  - width: 65 (% value)
  - playback_speed: 1 (0.25, 0.5, ..., 2)
  - delay: 0 (seconds)
  - caption: 0 (or 1)
  
## Tips

- remember at least the shortcuts to input your notes and the left/right keys to move
- you can rewind/forward while you have an empty text input to target the best time (it doesn't cancel the delay)
- enable/disable the delay with "d" if you want to make many notes in a row

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

#### multimedia

- media play pause : play/pause
- media track previous : previous
- media track next : next

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

#### other

- r : refresh
- d : enable/disable the delay

#### You're taking a note

##### note

- enter : enter a parent note with a timestamp
- shift + enter : enter a question to create a flashcard

##### child note

- ctrl + enter : enter a child note with a timestamp
- alt + enter : enter a child note without a timestamp
- ctrl + shift + enter : enter a child question to create a flashcard

##### other

- left / right : you can use left and right before to type
- cancel : erase and leave the text input

#### Note

- you can use qwerty and azerty

## Warning

### Project

- the plugin is still in development, you could find some bugs
- the Glitch project that you added is not used for developping, but the project can sometimes be updated
- a plugin could be broken after an update from RemNote, it could be fixed by me or someone else
- the plugin's design follows the "read and create" permissions, at best it can create rems among siblings

### Usage

- don't delete the "RemNote YT" rem, it can break the plugin
- plugin name
  - always use the same name, but you can change the link and the height
  - if you change the name, you will need to add another plugin in RemNote to be able to use all the plugins you've used
  - if you don't want the settings, use -np in the plugin name : example rnyt -np (warning : it is like a new name)  
  - use an useless name like "rnyt" to avoid noise when you search in RemNote
- the plugin can't modify the rems, so it won't correct the misplaced rems
- be careful when you edit you rems into RemNote
  - the timestamps are mandatory on the top level
  - follow the chronological order
  - the child notes with a timestamp are inserted before child notes without a timestamp
- the child notes are linked to the current chapter, you can change it into RemNote
- show one plugin at a time to avoid duplicates
- in the settings, change only the numbers and don't write units
- refresh could fix some displaying bugs
- the plugin has been tested with dozens of notes only

## Acknowledgement

- project started from https://youtubetoremnote.glitch.me/ by AllThingsRemNote
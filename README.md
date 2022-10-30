# Presentation

Take notes from YouTube videos. The plugin suspends the video while you type your note. Each note has a clickable timestamp on the side. So you can replay the most important parts of the video with your notes.

# Notice

The plugin is still in the development phase, but you can try it in dev mode.

Many features from the previous version still need to be implemented.

The goal is to merge rnyt and rnhp. It will not be limited to YouTube.

# How to

## Setup

Use your terminal for the following lines.

- `git clone https://github.com/terence-bonhomme/rnyt.git`
- `npm install`
- `npm audit` (optional)

## Launch

- from the plugin directory, type in your terminal `npm run dev`
- on RemNote: Plugin Explorer > Build > Develop from localhost > Develop

## Quick tour

After a video URL or an embed video, type the command `/rnyt`. A widget should appear on the top. To close the widget, you need to reload the page.

Push `enter` to take a note and `enter` again to confirm. Timestamps appear on the side. They are sorted by time, and they are clickable. They persist after using the plugin.

The notes are children of the video's rem.

On the settings, the height and the delay can be modified.

## Hotkeys

- `space`: play/pause
- `enter`: take/confirm a note
- `left`/`right`: backward/forward
- `esc`: cancel a note

# Known issues

- It might create an issue with the height. You need to check the plugin settings and reload the page.
- The old notes still need to be supported. The first child note is not a URL.
- The plugin does not create proper links. They are not clickable on RemNote.
- It uses the "modify" permission to set a text on a new rem.
- One level only to write notes.
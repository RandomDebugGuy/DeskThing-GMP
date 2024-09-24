# Global Media Player (GMP, not very creative but all I could come up with)

Global media player webapp for <a href="https://github.com/ItsRiprod/DeskThing">DeskThing</a>. 

## How to install:
- 1: Download the latest GMP-app-v0.x.x.zip from the <a href="https://github.com/RandomDebugGuy/DeskThing-GMP.git">releases</a> page. Leave it zipped.
- 2: Navigate to Apps > App Downloads, then either drag the zip file into the window or click "Drop App ZIP file here" and select the zip file.
- 3: Click "Run local!"

## Features: 
- Control media playback from Spotify (Prioriity 4 TODO): expand on this to support multiple platforms like apple music etc.
- Get currently playing song data from media player app (Priority 2 TODO): figure out how to make this work for (maybe) Linux MPRIS browsers

## Known bugs: (you shouldn't need to read these, only for devs!)
- Currently, fetching the song data from the app is not working.
- - Temporary fix: request to Spotify app for song data, if the spotify app is not installed or no song is playing, return null.

## TODO list once app is bug free:
- 1: Make a media platform selector to select different platforms such as SoundCloud, Apple Music, etc. and make an autodetect feature for it.
- 2: Add a bread emoji somewhere in the code just because ;) 

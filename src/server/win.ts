//@ts-ignore
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

type Song = {
  album: string | null
  artist: string | null
  playlist: string | null
  playlist_id: string | null
  track_name: string
  shuffle_state: boolean | null
  repeat_state: string | null //off, all, track
  is_playing: boolean
  can_fast_forward: boolean // Whether or not there's an option to 'fastforward 30 sec'
  can_skip: boolean
  can_like: boolean
  can_change_volume: boolean
  can_set_output: boolean 
  track_duration: number | null
  track_progress: number | null
  volume: number // percentage 0-100
  thumbnail: string | null //base64 encoding that includes data:image/png;base64, at the beginning
  device: string // Name of device that is playing the audio
  id: string | null // A way to identify the current song (is used for certain actions)
  device_id: string | null // a way to identify the current device if needed
}

class winPlayer {
  public DeskThing: any;
  private currentId: string;
  private isUpdating: boolean;
  private updateTimeout: number;
  public sessionIsSet: boolean;
  public allPlayersArray: string[] = [];

  constructor(DeskThing) {
    this.DeskThing = DeskThing;
    this.currentId = '';
    this.updateTimeout = 1500;
    this.sessionIsSet = false;
  }

  parseName(name: string) {
    const allPlatforms = {
      'spotify.exe': 'Spotify',
      'operagxwebbrowser': 'Opera GX',
      'chrome': 'Chrome',
      'firefox': 'Firefox',
      'brave': 'Brave',
      'operawebbrowser': 'Opera',
      'vivaldi': 'Vivaldi',
      'edge': 'Edge'
    };

    for (const key of Object.keys(allPlatforms)) {
      if (name.includes(key)) {
        return allPlatforms[key];
      }
    }
    return 'Unknown app';
  }

  async getSettingsOptionsArray() {
    const result: JSON[] = await this.getAllSessions()
    console.log(result);
    let options: any = [];
    console.log(result);

    result.forEach((song:any) => {
      options.push({
        label: this.parseName(song.device.toLowerCase()), 
        value: song.device.toLowerCase() 
      });
    });
    return options;
  }

  setUpdate() {
    if (!this.isUpdating) {
      this.isUpdating = true;
      setTimeout(() => {
        this.isUpdating = false;
      }, this.updateTimeout);
    } else return false;
  }

  async returnSongData() {
    const result:Song = await this.executeCommand() as Song;
    console.log("currentIbhjbD: ", result);

    if (this.currentId !== result.id as string) {
      this.currentId = result.id as string;
      const musicData:any = result;
      musicData.thumbnail = "data:image/png;base64," + musicData.thumbnail;
      musicData.can_change_volume = true;
      this.DeskThing.sendLog('Returning song data hopefully please work i would be so happy');
      const response = {
        type: 'song',
        app: 'client',
        payload: musicData
      }
      this.DeskThing.send(JSON.parse(JSON.stringify(response)))
    } else {
      if (!this.isUpdating) {
        this.DeskThing.sendLog('ATTEMPTING TO REFRESH PLAYBACK STATUS....................');
        const response = {
          type: 'song',
          app: 'client',
          payload: {
            id: result.id,
            thumbnail: "data:image/png;base64," + result.thumbnail,
            is_playing: result.is_playing,
            shuffle_state: result.shuffle_state,
            repeat_state: result.repeat_state,
            track_progress: result.track_progress,
            track_duration: result.track_duration,
            volume: result.volume,
          }
        }
        this.DeskThing.send(JSON.parse(JSON.stringify(response)));
      }
    }
  }

  async checkForRefresh() {
    return await this.returnSongData();
  }

  async getAllSessions() {
    const result:any = await new Promise((resolve, reject) => {
      //@ts-ignore i will yeet you
      const process = spawn('./DeskThingMediaCLI/DeskThingMediaCLI.exe', ['getall'], { cwd: __dirname });
      let stdout = '';
      process.stdout.on('data', (data: any) => stdout += data.toString());
      process.on('close', (code: any) => {
        if (code === 0) {
          resolve(JSON.parse(stdout));
        } else reject(false);
      })
    });
    console.log("result:", result);
    if (result.success) return result.content;
  }

  // TODO: make this less janky (done)
  async executeCommand(...args: string[]) {
    this.setUpdate();
    if (this.sessionIsSet) {
      let result: any;
      for (const player of this.allPlayersArray) {
        const response: any = await new Promise((resolve, reject) => {
          //@ts-ignore i will yeet you
          const process = spawn('./DeskThingMediaCLI/DeskThingMediaCLI.exe', ['executesession', player, ...args], { cwd: __dirname});
          let stdout = '';
          process.stdout.on('data', (data: any) => stdout += data.toString());
          process.on('close', (code: any) => {
            if (code === 0) {
              resolve(stdout);
            } else resolve(false)
          })
        })
        if (response) {
          result = JSON.parse(response);
          break;
        }
      }
    } else {
      return new Promise((resolve, reject) => {
        //@ts-ignore i will yeet you
        const process = spawn('./DeskThingMediaCLI/DeskThingMediaCLI.exe', [...args], { cwd: __dirname });
        let stdout = '';
        process.stdout.on('data', (data: any) => stdout += data.toString());
        process.on('close', (code: any) => {
          if (code === 0) {
            console.log("dope ass fucking stdout with garlic bread:", stdout);
            resolve(JSON.parse(stdout));
          } else reject(false);
        })
      })

    }
  }

  async next() {
    this.setUpdate();
    const result:any = await (this.executeCommand('next'));
    return await this.returnSongData();
  }

  async previous() {
    this.setUpdate();
    this.executeCommand('previous')
  }

  async play() {
    this.setUpdate();
    this.executeCommand('play')
  }

  async pause() {
    this.setUpdate();
    this.executeCommand('pause')
  }

  async stop() {
    this.setUpdate();
    return this.executeCommand('stop')
  }

  async seek(positionMs) {
    this.setUpdate();
    this.executeCommand('seek', positionMs) 
  }

  async volume(volumePercentage: number) {
    this.setUpdate();
    this.executeCommand('volume', (volumePercentage / 100).toString()) 
    return true
  }

  async repeat(state) {
    this.setUpdate();
    this.executeCommand('setrepeat', state) 
  }

  async shuffle(state) {
    this.setUpdate();
    this.executeCommand('setshuffle', state) 
  }}

export { winPlayer };
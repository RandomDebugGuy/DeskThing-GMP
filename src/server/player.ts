import * as dbus from 'dbus-next';
import * as dbusnative from 'dbus-native';
// @ts-ignore

interface MediaPlayer {
  play(callback: (err: any) => void): void;
  pause(callback: (err: any) => void): void;
  stop(callback: (err: any) => void): void;
  next(callback: (err: any, songid: string | void | null) => void): void;
  previous(callback: (err: any, songid: string | void | null) => void): void;
  seek(seconds: number, callback: (err: any) => void): void;
  setVolume(volume: number, callback: (err: any) => void): void;
  setRepeat(state: string, callback: (err: any) => void): void;
  setShuffle(state: string, callback: (err: any) => void): void;
  getVolume(callback: (err: any, volume: number) => void): void;
  getPosition(callback: (err: any, position: number) => void): void;
  getSong(callback: (err: any, song: string | void | null) => void): void;
  getSongId(returnRawObject:boolean): void;
}

class MediaPlayer {
  private serviceName: string | null;
  private player: any;
  private playerObject: any;
  private playerObjectProperties: any;
  private sessionBus: any;
  private serviceNameBus: any;
  private connecting: boolean;
  private connected: boolean;
  private playerInitTimeout: number;
  private getSeekTimeCounterer: number;

  constructor() {
    this.serviceName = null;
    this.player = null;
    this.playerObject = null;
    this.playerObjectProperties = null;
    this.sessionBus = dbus.sessionBus();
    this.serviceNameBus = dbusnative.sessionBus();
    this.connecting = false;
    this.connected = false;
    this.playerInitTimeout = 1000;
    this.getSeekTimeCounterer = 6; // Couldn't think of a word, look in seek(), value is in microseconds
  }

  private async detectMediaPlayer(callback: any) { // TODO: Add support for multiple browsers and add instance recognition to detect which instance is playing the configured service (may be done)
    const mediaPlayerPrefixes = [
      'org.mpris.MediaPlayer2.spotify',
      'org.mpris.MediaPlayer2.firefox.instance_',
      'org.mpris.MediaPlayer2.chromium.instance_',
      'org.mpris.MediaPlayer2.google-chrome.instance_',
    ]

    this.serviceNameBus.listNames(async (err: any, names: any) => {
      if (err) return callback(err);
      
      for (const prefix of mediaPlayerPrefixes) {
        const playerName = await names.find((name: string) => name.startsWith(prefix))
        if (playerName) {
          console.log('Found media player:', playerName);
          this.serviceName = playerName;
          return callback(null);
        }
      }
    });
  }

  // Connect to the media player service and get the player interface
  private async connect(callback: any) {
    if (this.connecting) {
      return callback(new Error('Already connecting to media player.'));
    }

    if (this.connected) {
      console.log('Already connected, refreshing player...');
      this.player = null;
    }

    this.connecting = true;
    console.log("Connecting to media player...");

    if (!this.serviceName) {
      await this.detectMediaPlayer((err: any) => {
        if (err) {
          this.connecting = false;
          throw err;
        }
        this.connectToService(callback);
      });
    } else this.connectToService(callback);
  }
  

  private async connectToService(callback: any) {
    try {
      const object = await this.sessionBus.getProxyObject(this.serviceName, '/org/mpris/MediaPlayer2');

      this.player = await object.getInterface('org.mpris.MediaPlayer2.Player');
      this.playerObject = object;
      this.playerObjectProperties = await object.getInterface('org.freedesktop.DBus.Properties')

      this.connecting = false;
      return setTimeout(() => {
        callback(null);
      }, this.playerInitTimeout);
    } catch (err) {
      return callback(err);
    }
  }

  // Ensure player is connected
  private async ensureConnection(callback: any) {
    await this.connect(callback);
  }

  /**
   * @param {*} callback - Callback function returning a true or false error bool and a JSON array containing the following: 
   * @param {String} album
   * @param {Array} artist
   * @param {String} track_name
   * @param {String} thumbnail 
   * @param {Boolean} is_playing
   * @param {Number} volume
   * @param {Boolean} shuffle_state
   * @param {String} repeat_state
   * @param {Number} track_progress
   * @param {Number} track_duration
   * @param {Boolean} can_skip
   * @param {Boolean} can_play
   * @param {Boolean} can_pause
   * @param {Boolean} can_go_previous
   * @param {Boolean} can_fast_forward
   * @param {Boolean} can_change_volume
   * @param {Boolean} can_like - Unsupported at the moment, returns false
   * @param {Boolean} can_set_output - Unsupported at the moment, returns false
   * @param {null} playlist - Unsupported at the moment, returns null
   * @param {null} playlist_id - Unsupported at the moment, returns null
  */ // don't ask me why I made this jsdoc but I did 

  
  public async getMetadata(callback: any) {
    const result: any = {};

    this.ensureConnection(async (err: any) => {
      if (err) {
        return callback(err);
      }

      //console.log(this.player)
      const player = this.playerObjectProperties

      // Helper function to get data and append it to result
      const getData = async (interfaceName: string, property: string, key: string) => {
        result[key] = (await player.Get(interfaceName, property)).value;
        return result[key];
      };

      // Beginning of assigning constant variables to the
      function appendPermanentVariables() {
        result['playlist'] = null;
        result['playlist_id'] = null;
    
        result['can_fast_forward'] = false;
        result['can_like'] = false;
        result['can_change_volume'] = true;
        result['can_set_output'] = false;
      };
      appendPermanentVariables();
      // End of assigning constant variables to the

      // Beginning of custom functions getting data a specific way
      async function customGetterFunctions() {
        const playBackStatus = await player.Get('org.mpris.MediaPlayer2.Player', 'PlaybackStatus');
        try {
          if (playBackStatus.value == 'Playing') {
            result['is_playing'] = true;
          } else {
            result['is_playing'] = false;
          }
        } catch (err) {
          console.log(err)
          // may or may not add error handling here
        }

        const metaData = (await player.Get('org.mpris.MediaPlayer2.Player', 'Metadata')).value;
        try {
          result['album'] = metaData['xesam:album'].value;
          result['artist'] = metaData['xesam:artist'].value[0];
          result['track_name'] = metaData['xesam:title'].value;
          result['thumbnail'] = metaData['mpris:artUrl'].value;
          result['track_length'] = metaData['mpris:length'].value / BigInt(1000);
        } catch (err) {
          console.log(err)
          // may or may not add error handling here
        }
        
        const trackProgress = (await player.Get('org.mpris.MediaPlayer2.Player', 'Position')).value;
        try {
          result['track_progress'] = trackProgress / BigInt(1000);
        } catch (err) {
          console.log(err)
          // may or may not add error handling here
        }
      }
      await customGetterFunctions()
      // End of custom functions getting data a specific way

      // Beginning of using predefined function to get data, looks cleaner I guess  
      await getData('org.mpris.MediaPlayer2.Player', 'CanGoNext', 'can_skip');
      await getData('org.mpris.MediaPlayer2.Player', 'CanPlay', 'can_play');
      await getData('org.mpris.MediaPlayer2.Player', 'CanPause', 'can_pause');
      await getData('org.mpris.MediaPlayer2.Player', 'CanGoPrevious', 'can_go_previous');
      await getData('org.mpris.MediaPlayer2.Player', 'LoopStatus', 'repeat_state');
      await getData('org.mpris.MediaPlayer2.Player', 'Shuffle', 'shuffle_state');
      await getData('org.mpris.MediaPlayer2.Player', 'CanSeek', 'can_seek');
      await getData('org.mpris.MediaPlayer2.Player', 'CanControl', 'can_control');
      await getData('org.mpris.MediaPlayer2.Player', 'Volume', 'volume');
      await getData('org.mpris.MediaPlayer2.Player', 'Rate', 'playback_rate');
      // End of using predefined function to get data

      callback(null, result);
    });

  }

  public async getSongId(returnRawObject: boolean = false) {
    this.ensureConnection(async (err: any) => {
      if (err) {
        console.log(err);
        return err;
      }
      const result = await this.playerObjectProperties.Get('org.mpris.MediaPlayer2.Player', 'Metadata')
      if (returnRawObject) return result.value['mpris:trackid']
      return result.value['mpris:trackid'].value.split('/').pop();
    })
  }

  private async getCurrentPlaybackPos() {
    const result = await this.playerObjectProperties.Get('org.mpris.MediaPlayer2.Player', 'Position');
    return result.value;
  }
 
  // Control playback
  play(callback: (err: any) => void) {
    this.ensureConnection((err: any) => {
      if (err) {
        if (callback) {
          return callback(err);
        }
        return err;
      }

      try {
        this.player.Play();
        callback(null);
      } catch (e) {
        callback(e);
      }
    });
  }

  pause(callback: (err: any) => void) {
    this.ensureConnection((err: any) => {
      if (err) {
        if (callback) {
          return callback(err);
        }
        return err;
      }
      try {
        this.player.Pause();
      } catch (e) {
        callback(e);
      }

    });
  }

  stop(callback: (err: any) => void) {
    this.ensureConnection((err: any) => {
      if (err) {
        if (callback) {
          return callback(err);
        }
        return err;
      }
      try {
      this.player.Stop();
      } catch(e) {
        console.log(e);
        callback(e);
      }
    
    });
  }

  next(callback: (err: any, songid: string | void | null) => void) {
    this.ensureConnection(async (err: any) => {
      if (err) {
        if (callback) {
          return callback(err, null);
        }
        return err;
      }

      try {
        await this.player.Next();
        callback(null, await this.getSongId());
      } catch (e) {
        console.log(e);
        callback(e, null);
      }
    });
  }

  previous(callback: (err: any) => void) {
    this.ensureConnection((err: any) => {
      if (err) {
        if (callback) {
          return callback(err);
        }
        return err;
      }

      try {
      this.player.Previous();
      } catch (e) {
        console.log(e);
        callback(e);
      }
    });
  }

  /**
   * @param offset - Integer to seek forward or backwards in ms
   * @param callback - Callback function
   */
  seek(seekTime: number, callback: (err: any) => void) {
    this.ensureConnection(async (err: any) => {
      if (err) {
        if (callback) {
          return callback(err);
        }
        return err;
      }
      console.log(seekTime);
      const newSeekTime = BigInt(seekTime);

      try {
        const currentSeekTime = BigInt(await this.getCurrentPlaybackPos()) / BigInt(1000);
        if (newSeekTime < currentSeekTime) { // if currentseektime is 10000 and newseektime is 3000 (reference for my phd level advanced scientist fast thinking brain :P)
          const difference = (currentSeekTime - newSeekTime) - BigInt(this.getSeekTimeCounterer);
          this.player.Seek(-difference * BigInt(1000));
        } else {
          this.player.Seek(newSeekTime * BigInt(1000));
        }
      } catch (e) {
        console.log(e);
        callback(e);
      }
    });
  }
  
  getVol(callback: (err: any, volume: number | null) => void) {
    let response; 

    this.ensureConnection(async (err: any) => {
      if (err) {
        if (callback) {
          return callback(err, null);
        }
        return err;
      }
      
      response = await this.playerObjectProperties.Get('org.mpris.MediaPlayer2.Player', 'Volume');
      console.log(response.value);
      if (callback) return callback(null, response.value * 100);
    });
  }

  setVol(volume: number, callback: (err: any) => void) {
    this.ensureConnection(async (err: any) => {
      if (err) {
        if (callback) {
          return callback(err);
        }
        return err;
      }

      try {
        const vol = new dbus.Variant('d', volume / 100)
        await this.playerObjectProperties.Set('org.mpris.MediaPlayer2.Player', 'Volume', vol);
        if (callback) return callback(null);
        return;
      } catch (e) {
        console.log(e);
        callback(e);
      }
    });
  }

  setRepeat(state: string, callback: (err: any) => void) {
    this.ensureConnection(async (err: any) => {
      if (err) {
        if (callback) {
          return callback(err);
        }
        return err;
      }
      let currentState;
      try {
        switch (state) {
          case 'off':
            currentState = 'None';
            break;
          case 'track':
            currentState = 'Track';
            break;
          case 'all':
            currentState = 'Playlist';
            break;
          default:
            break;
        }
        this.playerObjectProperties.Set('org.mpris.MediaPlayer2.Player', 'LoopStatus', new dbus.Variant('s', currentState));
        return true;
      } catch (e) {
        console.log(e)
      }
    })
  }
  setShuffle(state: string, callback: (err: any) => void) {
    this.ensureConnection(async (err: any) => {
      if (err) {
        if (callback) {
          return callback(err);
        }
        return err;
      }
      try {
        this.playerObjectProperties.Set('org.mpris.MediaPlayer2.Player', 'Shuffle', new dbus.Variant('b', state));
        return true;
      } catch (e) {
        console.log(e)
      }
    })
  }
}

export default MediaPlayer;

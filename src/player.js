const dbus = require('dbus-next');
const dbusnative = require('dbus-native');

class MediaPlayer {
  constructor() {
    this.serviceName = null;
    this.player = null;
    this.playerObject = null;
    this.playerObjectProperties = null;
    this.sessionBus = dbus.sessionBus();
    this.serviceNameBus = dbusnative.sessionBus();
    this.connecting = false;
    this.connected = false;
    this.playerInitTimeout = 500;
  }

  detectMediaPlayer(callback) { // TODO: Add support for multiple browsers and add instance recognition to detect which instance is playing the configured service (may be done)
    const mediaPlayerPrefixes = [
      'org.mpris.MediaPlayer2.spotify',
      'org.mpris.MediaPlayer2.firefox.instance_',
      'org.mpris.MediaPlayer2.chromium.instance_',
      'org.mpris.MediaPlayer2.google-chrome.instance_',
    ]

    this.serviceNameBus.listNames(async (err, names) => {
      if (err) return callback(err);``
      
      for (const prefix of mediaPlayerPrefixes) {
        const playerName = await names.find(name => name.startsWith(prefix))
        if (playerName) {
          console.log('Found media player:', playerName);
          this.serviceName = playerName;
          return callback(null, playerName);
        }
      }
    });
  }

  // Connect to the media player service and get the player interface
  connect(callback) {
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
      this.detectMediaPlayer((err) => {
        if (err) {
          this.connecting = false;
          return callback(err);
        }
        this.connectToService(callback);
      });
    } else {
      this.connectToService(callback);
    }
  }

  async connectToService(callback) {
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
  async ensureConnection(callback) {
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
     @param {Boolean} can_set_output - Unsupported at the moment, returns false
   * @param {null} playlist - Unsupported at the moment, returns null
   * @param {null} playlist_id - Unsupported at the moment, returns null
  */ // don't ask me why I made this jsdoc but I did 

  
  getMetadata(callback) {
    const result = {}

    this.ensureConnection(async (err) => {
      if (err) {
        return callback(err);
      }

      console.log(await this.playerObjectProperties.Get('org.mpris.MediaPlayer2.Player', 'Metadata'))
      const player = this.playerObjectProperties

      // Helper function to get data and append it to result
      const getData = (interfaceName, property, key) => {
        result[key] = player.Get(interfaceName, property).value;
        return result[key];
      };

      // Beginning of creating a predefined variable function to append to result
      function appendPermanentVariables() {
        result['playlist'] = null;
        result['playlist_id'] = null;
    
        result['can_fast_forward'] = false;
        result['can_like'] = false;
        result['can_change_volume'] = true;
        result['can_set_output'] = false;
      };
      appendPermanentVariables();
      // End of creating a predefined variable function to append to result


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
        const metaData = await player.Get('org.mpris.MediaPlayer2.Player', 'Metadata');
        try {
          result['album'] = metaData.value['xesam:album'].value;
          result['artist'] = metaData.value['xesam:artist'].value;
          result['track_name'] = metaData.value['xesam:title'].value;
          result['thumbnail'] = metaData.value['mpris:artUrl'].value;
          result['track_progress'] = metaData.value['mpris:length'].value;
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
      await getData('org.mpris.MediaPlayer2.Player', 'Position', 'track_progress');
      await getData('org.mpris.MediaPlayer2.Player', 'LoopStatus', 'repeat_state');
      await getData('org.mpris.MediaPlayer2.Player', 'Shuffle', 'shuffle_state');
      await getData('org.mpris.MediaPlayer2.Player', 'CanSeek', 'can_seek');
      await getData('org.mpris.MediaPlayer2.Player', 'CanControl', 'can_control');
      await getData('org.mpris.MediaPlayer2.Player', 'Volume', 'volume');
      await getData('org.mpris.MediaPlayer2.Player', 'Rate', 'playback_rate');
      // End of using predefined function to get data

      setTimeout(() => {
        callback(null, result);
      }, 1000);
    });

  }

  async getSongId() {
    this.ensureConnection(async (err) => {
      if (err) {
        return callback(err);
      }
      const result = await this.playerObjectProperties.Get('org.mpris.MediaPlayer2.Player', 'Metadata')
      return result.value['mpris:trackid'].value.split('/').pop();
    })
  }
 
  // Control playback
  play(callback) {
    this.ensureConnection((err) => {
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

  pause(callback) {
    this.ensureConnection((err) => {
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

  stop(callback) {
    this.ensureConnection((err) => {
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

  next(callback) {
    this.ensureConnection(async (err) => {
      if (err) {
        if (callback) {
          return callback(err);
        }
        return err;
      }

      try {
        await this.player.Next();
      callback(null, await this.getSongId());
      } catch (e) {
        console.log(e);
        callback(e);
      }
    });
  }

  previous(callback) {
    this.ensureConnection((err) => {
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
   * @param offset - Integer to seek forward or backwards in µs
   * @param callback - Callback function
   */
  seek(offset, callback) {
    this.ensureConnection(async (err) => {
      if (err) {
        if (callback) {
          return callback(err);
        }
        return err;
      }

      try {
      await this.player.Seek(offset);
      } catch (e) {
        console.log(e);
        callback(e);
      }
    });
  }
  
  getVol(callback) {
    let response; 

    this.ensureConnection(async (err) => {
      if (err) {
        if (callback) {
          return callback(err);
        }
        return err;
      }
      
      response = await this.playerObjectProperties.Get('org.mpris.MediaPlayer2.Player', 'Volume');
      console.log(response.value);
      if (callback) return callback(null, response.value * 100);
    });
  }

  setVol(volume, callback) {
    this.ensureConnection(async (err) => {
      if (err) {
        if (callback) {
          return callback(err);
        }
        return err;
      }

      const response = await this.playerObjectProperties.Set('org.mpris.MediaPlayer2.Player', 'Volume', new dbus.Variant('d', volume / 100));
      if (callback) callback(null, response);
    });
  }

  setRepeat(state) {
    this.ensureConnection(async (err) => {
      if (err) {
        if (callback) {
          return callback(err);
        }
        return err;
      }
      try {
        this.playerObjectProperties.Set('org.mpris.MediaPlayer2.Player', 'LoopStatus', new dbus.Variant('s', state));
        return true;
      } catch (e) {
        console.log(e)
      }
    })
  }
  setShuffle(state) {
    this.ensureConnection(async (err) => {
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

module.exports = MediaPlayer;
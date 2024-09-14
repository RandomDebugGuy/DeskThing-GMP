const dbus = require('dbus-next');
const dbusnative = require('dbus-native');

class MediaPlayer {
  constructor() {
    this.serviceName = null;
    this.player = null;
    this.playerObject = null;
    this.sessionBus = dbus.sessionBus();
    this.serviceNameBus = dbusnative.sessionBus();
    this.connecting = false;
    this.connected = false;
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

      this.playerObject = object;
      this.player = await object.getInterface('org.mpris.MediaPlayer2.Player');

      this.connecting = false;
      return callback(null);
    } catch (err) {
      return callback(err);
    }
  }

  // Ensure player is connected
  async ensureConnection(callback) {
    await this.connect(callback);
    callback(null);
  }

  /**
   * @param {*} callback - Returns a callback function with variables containing the following:
   * @property {String} album
   * @property {Array} artist
   * @property {string} track_name
   * @property {something} thumbnail 
   * @property {boolean} is_playing
   * @property {boolean} can_skip
   * @property {boolean} can_play
   * @property {boolean} can_pause
   * @property {boolean} can_go_previous
   * @property {null} playlist - Unsupported at the moment, returns null
   * @property {null} playlist_id - Unsupported at the moment, returns null
   * @property {null} volume - Unsupported at the moment, returns null
   * @property {boolean} can_fast_forward - Unsupported at the moment, returns false
   * @property {boolean} can_like - Unsupported at the moment, returns false
   * @property {boolean} can_change_volume - Unsupported at the moment, returns false
     @property {boolean} can_set_output - Unsupported at the moment, returns false
   * @property {boolean} shuffle_state - Unsupported at the moment, returns false
   * @property {string} repeat_state - Unsupported at the moment, returns off
   * @param {number} track_progress - Unsupported at the moment, returns 32768000
   * @param {number} track_duration - Unsupported at the moment, returns 32768000
  */ // don't ask me why I made this jsdoc but I did 

  
  getMetadata(callback) {
    const result = {}

    this.ensureConnection(async (err) => {
      if (err) {
        return callback(err);
      }

      const player = await this.playerObject.Get((err) => {
        if (err) {
          return callback(err);
        }
      });

      // Helper function to get data and append it to result
      const getData = (interfaceName, property, key) => {
        result[key] = player.Get(interfaceName, property);
      };

      // Beginning of creating a predefined variable function to append to result
      function appendPermanentVariables() {
        result['playlist'] = null;
        result['playlist_id'] = null;
        result['volume'] = null;
    
        result['can_fast_forward'] = false;
        result['can_like'] = false;
        result['can_change_volume'] = false;
        result['can_set_output'] = false;
        result['shuffle_state'] = false;

        result['repeat_state'] = "off";

        result['playback_rate'] = 1;
        result['track_duration'] = 32768000;
        result['track_progress'] = 32768000;
      };
      appendPermanentVariables();
      // End of creating a predefined variable function to append to result


      // Beginning of custom functions getting data a specific way
      function customGetterFunctions() {
        const playBackStatus = this.playerObject.Get('org.freedesktop.DBus.Properties', 'PlaybackStatus');
        try {
          if (playBackStatus.value === 'Playing') {
            result['is_playing'] = true;
          } else {
            result['is_playing'] = false;
          }
        } catch (err) {
          // may or may not add error handling here
        }
        const metaData = this.playerObject.Get('org.mpris.MediaPlayer2.Player', 'Metadata');
        try {
          result['album'] = metaData['xesam:album'];
          result['artist'] = metaData['xesam:artist'];
          result['track_name'] = metaData['xesam:title'];
          result['thumbnail'] = metaData['mpris:artUrl'];
        } catch (err) {
          // may or may not add error handling here
        }
      }
      customGetterFunctions()
      // End of custom functions getting data a specific way


      // Beginning of using predefined function to get data, looks cleaner I guess  
      getData('org.freedesktop.DBus.Properties', 'CanGoNext', 'can_skip');
      getData('org.freedesktop.DBus.Properties', 'CanPlay', 'can_play');
      getData('org.freedesktop.DBus.Properties', 'CanPause', 'can_pause');
      getData('org.freedesktop.DBus.Properties', 'CanGoPrevious', 'can_go_previous');
      getData('org.freedesktop.DBus.Properties', 'Position', 'track_progress');
      // End of using predefined function to get data

    });

    callback(null, result);
    //return result;
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
        callback(e);
      }
    
    });
  }

  next(callback) {
    this.ensureConnection((err) => {
      if (err) {
        if (callback) {
          return callback(err);
        }
        return err;
      }

      try {
      this.player.Next();
      } catch (e) {
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
        callback(e);
      }
    });
  }

  seek(offset, callback) {
    this.ensureConnection((err) => {
      if (err) {
        if (callback) {
          return callback(err);
        }
        return err;
      }

      try {
      this.player.Seek(offset);
      } catch (e) {
        callback(e);
      }
    });
  }
  
  getVol(callback) {
    let response; 

    this.ensureConnection((err) => {
      if (err) {
        if (callback) {
          return callback(err);
        }
        return err;
      }

      response = this.player.Get('org.freedesktop.DBus.Properties', 'Volume');
      
    });

    return response * 100;
  }

  setVol(volume, callback) {

    this.ensureConnection((err) => {
      if (err) {
        if (callback) {
          return callback(err);
        }
        return err;
      }

      response = this.player.Set('org.freedesktop.DBus.Properties', 'Volume', volume / 100);
    });
  }
}

module.exports = MediaPlayer;
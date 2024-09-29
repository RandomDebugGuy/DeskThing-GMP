import MediaPlayer from './player.js'

class linuxPlayer {
  private player: MediaPlayer;
  constructor() {
    this.player = new MediaPlayer();
  }
  
  private safeStringify(obj) {
    return JSON.stringify(obj, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    );
    
  }
  
  async returnSongData(DeskThing, isRefresh) {
    try {
      
      const data = await new Promise((resolve, reject) => {
        this.player.getMetadata(async (err, result) => {
          if (err) {
            reject(err);
            return;
          }
      
          const processedThumbnail = await this.processThumbnail(result['thumbnail'], DeskThing);
          
          // Construct the data object using object literal
          const data = {
            album: result['album'],
            artist: result['artist'],
            track_name: result['track_name'],
            thumbnail: processedThumbnail,
            is_playing: result['is_playing'],
            can_skip: result['can_skip'],
            can_play: result['can_play'],
            can_pause: result['can_pause'],
            can_go_previous: result['can_go_previous'],
            playlist: result['playlist'],
            playlist_id: result['playlist_id'],
            volume: result['volume'],
            can_fast_forward: result['can_fast_forward'],
            can_like: result['can_like'],
            can_change_volume: result['can_change_volume'],
            can_set_output: result['can_set_output'],
            shuffle_state: result['shuffle_state'],
            repeat_state: result['repeat_state'],
            track_progress: Number(result['track_progress']),
            track_duration: Number(result['track_length'])
          };
          console.log(result['track_length'], 'is the duration')
      
          console.log('executing to here ---------------------------------------------------------------------');
          resolve(data);
        });
      });

      if (isRefresh) {
        DeskThing.sendDataToClient({ app: 'client', type: 'song', payload: data });
        console.log('sent refresh');
      } else {
        DeskThing.sendDataToClient({ app: 'client', type: 'song', payload: data });
        console.log('sent song');
      }
      
    } catch (error) {
      return false;
    }
  }

  async processThumbnail(thumbnail, DeskThing) {
    const result = await DeskThing.encodeImageFromUrl(thumbnail, 'jpeg')
    return result;
  }

  async checkForRefresh(DeskThing) {
    await this.returnSongData(DeskThing, true)
  }

  async getSetVolume(args?) {
    return new Promise((resolve, reject) => {
      if (!args) {
        const response = this.player.getVol((err, response) => {
          if (err) reject(err);
          return response;
        });
        resolve(response);
      } else {
        this.player.setVol(args, (err) => {
          if (err) reject(err);
        });
        resolve(true);
      }
    });
  }

  async getVolumeInfo () {
    return await this.getSetVolume()
  } 

  async next(id) {
    this.player.next((err) => {
      if (err) {
        console.log(err);
        throw new Error("An error occured while skipping the track: " + err);
      }
    })
  }

  async previous(args) {
    return this.player.previous((err) => {
      if (err) {
        console.log(err);
        throw new Error("An error occured while going to previous track: " + err);
      }
    });
  }

  async fastForward(seconds) {
    return this.player.seek(seconds * 1000000, (err)=> { if (err) console.log(err); });
  }

  async rewind(seconds) {
    return this.player.seek(-seconds * 1000000, (err) => { if (err) console.log(err); });
  }

  async play(args) {
    return this.player.play((err) => {
      if (err) {
        console.log(err);
        throw new Error("An error occured while playing the track: " + err);
      }
    });
  }

  async pause(args) {
    return this.player.pause((err) => {
      if (err) {
        console.log(err);
        throw new Error("An error occured while pausing: " + err);
      }
    });
  }

  async stop(args) {
    return this.player.stop((err) => {
      if (err) {
        console.log(err);
        throw new Error("An error occured while stopping: " + err);
      }
    });
  }

  async seek(trackid, positionMs) {
    return this.player.seek(trackid, positionMs);
  }

  async volume(volumePercentage) {
    this.getSetVolume(volumePercentage);
    return true
  }

  async repeat(state) {
    this.player.setRepeat(state, (err) => { if (err) console.log(err); });
    return true
  }

  async shuffle(state) {
    this.player.setShuffle(state, (err) => { if (err) console.log(err); });
  }
}

export { linuxPlayer };
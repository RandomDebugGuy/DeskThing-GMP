import mediaPlayer from './player.js'

class linuxPlayer {
  constructor(DeskThing) {
    this.DeskThing = DeskThing;
    this.currentId = null;
    this.player = new mediaPlayer();
  }


  async returnSongData(id = null, retryCount = 0) {
    try {
      let data = [];
      
      await this.player.getMetadata(async (err, result) => {
        console.log(result + '--------------------------------')
        if (id) {
          data['id'] = result['track_name'];
          return;
        }
        data['album'] = result['album'];
        data['artist'] = result['artist'];
        data['track_name'] = result['track_name'];
        data['thumbnail'] = "data:image/png;base64," + await this.processThumbnail(result['thumbnail']);
        data['is_playing'] = result['is_playing'];
        data['can_skip'] = result['can_skip'];
        data['can_play'] = result['can_play'];
        data['can_pause'] = result['can_pause'];
        data['can_go_previous'] = result['can_go_previous'];
        data['playlist'] = result['playlist'];
        data['playlist_id'] = result['playlist_id'];
        data['volume'] = result['volume'];
        data['can_fast_forward'] = result['can_fast_forward'];
        data['can_like'] = result['can_like'];
        data['can_change_volume'] = result['can_change_volume'];
        data['can_set_output'] = result['can_set_output'];
        data['shuffle_state'] = result['shuffle_state'];
        data['repeat_state'] = result['repeat_state'];
        data['track_progress'] = result['track_progress'];
        data['track_duration'] = result['track_duration'];
      });
      
    } catch (error) {
      this.sendError(`Error executing next command: ${error}`);
      return false;
    }
  }

  async processThumbnail(thumbnail) {
    const result = await DeskThing.encodeImageFromUrl(thumbnail, 'jpeg')
    return result;
  }

  async checkForRefresh(id) {
    return await this.returnSongData(id)
    return await this.returnSongData(id);
  }

  async getSetVolume(args) {
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
    return this.player.seek(seconds * 1000000);
  }

  async rewind(seconds) {
    return this.player.seek(-seconds * 1000000);
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

  async seek(positionMs) {
    return this.player.seek(positionMs);
  }

  async volume(volumePercentage) {
    this.getSetVolume(volumePercentage);
    return true
  }

  async repeat(state) {
    this.player.setRepeat(state);
    return true
  }

  async shuffle(state) {
    this.player.setShuffle(state);
  }
}

export { linuxPlayer };
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
      

      /* // Old code
      const result = await this.executeCommand('')
      if (result === false) {
        this.sendError('Music Data returned false! There was an error');
        return false;
      } else {

        // Check if result.id is different from the passed id
        if (result.id !== id) {
          this.currentId = result.id;
          const musicData = result;
          musicData.thumbnail = "data:image/png;base64," + musicData.thumbnail;
          musicData.volume = await this.getVolumeInfo();
          musicData.can_change_volume = true;
          this.sendLog('Returning song data');
      
          return musicData
        } else {
          // Retry logic up to 5 attempts
          if (retryCount < 5) {
            this.sendLog(`Retry attempt ${retryCount + 1} for next command.`);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second before retrying
          return this.returnSongData(id, retryCount + 1); // Recursive call with incremented retryCount
        } else {
          this.sendError(`Reached maximum retry attempts for next command.`);
          return false;
        }
      }
      }*/
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

  async exeVol(args) {
    return new Promise((resolve, reject) => {
      if (!args) {
        const response = this.player.getVol((err) => {
          if (err) reject(err);
        });
        resolve(response);
      } else {
        this.player.setVol(args / 100, (err) => {
          if (err) reject(err);
        });
        resolve(true);
      }
    });
  }

  async getVolumeInfo () {
    const data = await this.exeVol()
    const args = data.split(' ')
  
    return parseInt(args[0], 10)
  } 

  async next(id) {
    const result = await this.player.next()
    if (result.success) {
      return await this.returnSongData(id)
    }
    console.error('Error occured skipping track:', result)
    return false
  }

  async previous(args) {
    return this.player.previous();
  }

  async fastForward(seconds) {
    return this.player.seek(seconds);
  }

  async rewind(seconds) {
    return this.player.seek(-seconds);
  }

  async play(args) {
    return this.player.play();
  }

  async pause(args) {
    return this.player.pause();
  }

  async stop(args) {
    return this.player.stop();
  }

  async seek(positionMs) {
    return this.player.seek(positionMs);
  }

  async volume(volumePercentage) {
    this.exeVol(String(volumePercentage));
    return true
  }

  async repeat(state) {
    return 'Unsupported at the moment'
  }

  async shuffle(state) {
    return 'Unsupported at the moment'
  }
}

export { linuxPlayer };
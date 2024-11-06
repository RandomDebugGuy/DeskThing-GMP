import { exec } from 'child_process';

class winPlayer {
  public DeskThing: any;
  private currentId: string | null;
  private isUpdating: boolean;
  private updateTimeout: number;

  constructor(DeskThing) {
    this.DeskThing = DeskThing;
    this.currentId = null;
    this.updateTimeout = 1500;
  }

  setUpdate() {
    if (!this.isUpdating) {
      this.isUpdating = true;
      setTimeout(() => {
        this.isUpdating = false;
      }, this.updateTimeout);
    } else return false;
  }

  async sendLog(message) {
    this.DeskThing.sendLog(message)
  }
  async sendError(message) {
    this.DeskThing.sendError(message)
  }

  async returnSongData(uselessVarForCompatibility) {
    try {
      const result:any = await this.executeCommand('')
      if (result === false) {
        this.sendError('Music Data returned false! There was an error');
        return false;
      } else {
        if (this.currentId !== result.id) {
          this.currentId = result.id;
          const musicData:any = result;
          musicData.thumbnail = "data:image/png;base64," + musicData.thumbnail;
          musicData.volume = await this.getVolumeInfo();
          musicData.can_change_volume = true;
          this.sendLog('Returning song data');
          const response = {
            app: 'client',
            type: 'song',
            payload: musicData
          }
          this.DeskThing.sendDataToClient(response);
        } else {
          if (!this.isUpdating) {
            this.sendLog('Refreshing playback status...');

            const response = {
              app: 'client',
              type: 'song',
              payload: {
                is_playing: result.is_playing,
                track_progress: result.track_progress,
                volume: await this.getVolumeInfo(),
              }
            };
            this.DeskThing.sendDataToClient(response);
          }
        }
      }
    } catch (error) {
      this.sendError(`Error executing next command: ${error}`);
      return false;
    }
  }

  async checkForRefresh(uselessVarForCompatibility) {
    return this.returnSongData(uselessVarForCompatibility);
  }

  async executeCommand(command, args = '') {
    return new Promise((resolve, reject) => {
      exec(`cd ${__dirname} && DeskThingMediaCLI.exe ${command} ${args}`, (error, stdout, stderr) => {
        if (error) {
          this.sendError(`exec error: ${error}`);
          reject(false);
          return;
        }

        try {
          const result = JSON.parse(stdout);
          resolve(result);
        } catch (parseError) {
          this.sendError('Error parsing JSON:' + parseError);
          reject(false);
        }
      });
    });
  }

  async exeVol(...args) {
    return new Promise((resolve, reject) => {
      exec(`cd ${__dirname} && adjust_get_current_system_volume_vista_plus.exe ${args}`, (error, stdout, stderr) => {
        if (error) {
          this.sendError(`exec error: ${error}`);
          reject(false);
          return;
        }

        try {
          resolve(stdout);
        } catch (parseError) {
          this.sendError('Error parsing JSON:' + parseError);
          reject(false);
        }
      });
    });
  }

  async getVolumeInfo () {
    const data:any = await this.exeVol()
    const args = data.split(' ');
    return parseInt(args[0], 10)
  }


  checkIfIsMuted() {
    const data:any = this.exeVol()
    const args = data.split(' ')
    if (parseInt(args[1], 10) === 1) {
      return true
    } else return false
  }

  async next(id) {
    this.setUpdate();
    const result:any = await this.executeCommand('next');
    if (result.success) {
      return await this.returnSongData(id)
    }
    return false
  }

  async previous() {
    this.setUpdate();
    this.executeCommand('previous');
  }

  async fastForward(seconds) {
    this.setUpdate();
    this.executeCommand('fastforward', seconds);
  }

  async rewind(seconds) {
    this.setUpdate(); 
    this.executeCommand('rewind', seconds);
  }

  async play() {
    this.setUpdate();
    this.executeCommand('play');
  }

  async pause() {
    this.setUpdate();
    this.executeCommand('pause');
  }

  async stop() {
    this.setUpdate();
    return this.executeCommand('stop');
  }

  async seek(positionMs) {
    this.setUpdate();
    this.executeCommand('seek', positionMs);
  }

  async volume(volumePercentage) {
    this.setUpdate();
    if (volumePercentage <= 4) {
      if (!this.checkIfIsMuted()) {
        this.exeVol('mute');
      }
    } else {
      if (this.checkIfIsMuted()) {
        this.exeVol('unmute');
      }
      this.exeVol(volumePercentage);
    }
    return true
  }

  async repeat(state) {
    this.setUpdate();
    this.executeCommand('setrepeat', state);
  }

  async shuffle(state) {
    this.setUpdate();
    this.executeCommand('setshuffle', state);
  }
}

export { winPlayer }

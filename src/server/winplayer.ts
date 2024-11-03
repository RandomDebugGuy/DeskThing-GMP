import { exec } from 'child_process';

class winPlayer {
  public DeskThing: any;
  private currentId: string | null;
  constructor(DeskThing) {
    this.DeskThing = DeskThing;
    this.currentId = null;
  }

  async sendLog(message) {
    this.DeskThing.sendLog(message)
  }
  async sendError(message) {
    this.DeskThing.sendError(message)
  }

  async returnSongData(DeskThing) {
    try {
      const result:any = await this.executeCommand('')
      if (result === false) {
        this.sendError('Music Data returned false! There was an error');
        return false;
      } else {
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

      }
    } catch (error) {
      this.sendError(`Error executing next command: ${error}`);
      return false;
    }
  }

  async checkForRefresh(DeskThing) {
    const result:any = await this.executeCommand('')
    if (result === false) {
      this.sendError('Music Data returned false! There was an error');
      return false;
    } else if (result.id !== this.currentId) {
      return this.returnSongData(DeskThing)
    }
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
    const args = data.split(' ')
  
    return parseInt(args[0], 10)
  }

  async next(id) {
    const result:any = await this.executeCommand('next');
    if (result.success) {
      return await this.returnSongData(id)
    }
    return false
  }

  async previous() {
    return this.executeCommand('previous');
  }

  async fastForward(seconds) {
    return this.executeCommand('fastforward', seconds);
  }

  async rewind(seconds) {
    return this.executeCommand('rewind', seconds);
  }

  async play() {
    return this.executeCommand('play');
  }

  async pause() {
    return this.executeCommand('pause');
  }

  async stop() {
    return this.executeCommand('stop');
  }

  async seek(positionMs) {
    return this.executeCommand('seek', positionMs);
  }

  async volume(volumePercentage) {
    this.exeVol(String(volumePercentage));
    return true
  }

  async repeat(state) {
    return this.executeCommand('setrepeat', state);
  }

  async shuffle(state) {
    return this.executeCommand('setshuffle', state);
  }
}

export { winPlayer }

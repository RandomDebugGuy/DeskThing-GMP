import { DeskThing as DK } from 'deskthing-server';
import os from 'os';
const DeskThing = DK.getInstance();
export { DeskThing };

class main {
    private DeskThing: any;
    private mediaPlayer: any;
    constructor() {
        this.DeskThing = DeskThing;
        this.start = this.start.bind(this);
        this.handleGet = this.handleGet.bind(this);
        this.handleSet = this.handleSet.bind(this);
    }

    private async switchPlatform() {
        switch(await os.platform()) {
            case 'win32':
                return new (await import('./winplayer')).winPlayer(this.DeskThing);
            case 'linux':
                return new (await import('./linuxplayer')).linuxPlayer();
            default:
                console.warn('GMP APP: Unsupported platform, assuming linux.');
                return new (await import('./linuxplayer')).linuxPlayer();
        }
    }

    async start() {
        this.mediaPlayer = await this.switchPlatform();
        DeskThing.sendLog('Detected Platform:' + await os.platform());
        let Data = await DeskThing.getData();
        DeskThing.on('data', (newData) => Data = newData)

        DeskThing.on('get', this.handleGet);
        DeskThing.on('set', this.handleSet);
    }

    private async handleGet(data) {
        if (data == null) {
            DeskThing.sendError('No args provided');
            return;
        }
        DeskThing.sendLog('Receiving Get Data' + data)
        switch (data.request) {
            case 'song':
                console.log('Sending song...')
                await this.mediaPlayer.returnSongData(DeskThing);
                break
            case 'refresh':
                await this.mediaPlayer.checkForRefresh(DeskThing);
                break
            default:
                DeskThing.sendError(`Unknown request: ${data.request}`)
                break
          }
    }

    private async handleSet(data) {
        if (data == null) {
            DeskThing.sendError('No args provided')
            return
        }

        DeskThing.sendLog('Receiving Set Data' + data)
        console.log('Receiving Set Data', data)

        let response;
        switch (data.request) {
            case 'next':
              response = await this.mediaPlayer.next(data.payload)
              if (!response == false) {
                response = { app: 'client', type: 'song', payload: response }
                DeskThing.sendDataToClient(response)
              }
              break
            case 'previous':
              await this.mediaPlayer.previous()
              break
            case 'fast_forward':
              await this.mediaPlayer.fastForward(data.payload)
              break
            case 'rewind':
              await this.mediaPlayer.rewind(data.payload)
              break
            case 'play':
              await this.mediaPlayer.play(data.payload)
              break
            case 'pause':
            case 'stop':
              await this.mediaPlayer.pause()
              break
            case 'seek':
              await this.mediaPlayer.seek(data.payload)
              break
            case 'like':
              break
            case 'volume':
              await this.mediaPlayer.volume(data.payload)
              break
            case 'repeat':
              await this.mediaPlayer.repeat(data.payload)
              break
            case 'shuffle':
              await this.mediaPlayer.shuffle(data.payload)
              break
          }
    }
}
const Main = new main();

DeskThing.on('start', Main.start)
DeskThing.on('stop', () => void 0)
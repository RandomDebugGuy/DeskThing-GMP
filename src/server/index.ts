import { DeskThing as DK } from 'deskthing-server';
const DeskThing = DK.getInstance();
export { DeskThing }
import os from 'os';

const switchPlatform = async () => {
  switch(await os.platform()) {
      case 'win32':
          return new (await import('./winPlayer')).winPlayer(DeskThing);
      case 'linux':
          return new (await import('./linuxInterface')).linuxPlayer(DeskThing);
      default:
          console.warn('GMP APP: Unsupported platform, assuming linux.');
          return new (await import('./linuxInterface')).linuxPlayer(DeskThing);
  }
}
let mediaPlayer;

const init = async () => mediaPlayer = await switchPlatform();

const start = async () => {
  await init();
  DeskThing.sendLog('Detected Platform:' + await os.platform());

  DeskThing.on('get', handleGet);
  DeskThing.on('set', handleSet);
} 

async function handleGet(data) {
  if (data == null) {
      DeskThing.sendError('No args provided');
      return;
  }
  DeskThing.sendLog('Receiving Get Data' + data)
  switch (data.request) {
      case 'song':
          console.log('Sending song...')
          await mediaPlayer.returnSongData(DeskThing);
          break
      case 'refresh':
          console.log('Checking for refresh...')
          await mediaPlayer.checkForRefresh(DeskThing);
          break
      default:
          DeskThing.sendError(`Unknown request: ${data.request}`)
          break
    }
}

async function handleSet(data) {
  if (data == null) {
      DeskThing.sendError('No args provided')
      return
  }

  DeskThing.sendLog('Receiving Set Data' + data)
  console.log('Receiving Set Data', data)

  let response;
  switch (data.request) {
      case 'next':
        response = await mediaPlayer.next(data.payload)
        if (!response == false) {
          response = { app: 'client', type: 'song', payload: response }
          DeskThing.sendDataToClient(response)
        }
        break
      case 'previous':
        await mediaPlayer.previous()
        break
      case 'fast_forward':
        await mediaPlayer.fastForward(data.payload)
        break
      case 'rewind':
        await mediaPlayer.rewind(data.payload)
        break
      case 'play':
        await mediaPlayer.play(data.payload)
        break
      case 'pause':
      case 'stop':
        await mediaPlayer.pause()
        break
      case 'seek':
        await mediaPlayer.seek(data.payload)
        break
      case 'like':
        break
      case 'volume':
        await mediaPlayer.volume(data.payload)
        break
      case 'repeat':
        await mediaPlayer.repeat(data.payload)
        break
      case 'shuffle':
        await mediaPlayer.shuffle(data.payload)
        break
    }
}


DeskThing.on('start', start)
import { DeskThing } from 'deskthing-server';
export { DeskThing }
//import settingsImport from './settings'; // settings manager for deskthing bc riprod's kinda sucks (sorry riprod if you're reading this lmao)
import os from 'os';

const switchPlatform = async () => {
  switch(await os.platform()) {
      case 'win32':
          return new (await import('./win')).winPlayer(DeskThing);
      case 'linux':
          return new (await import('./linuxInterface')).linuxPlayer(DeskThing);
      default:
          console.warn('GMP APP: Unsupported platform, assuming linux.');
          return new (await import('./linuxInterface')).linuxPlayer(DeskThing);
  }
}
let mediaPlayer;

//const settingsManager = new settingsImport(DeskThing)

const init = async () => mediaPlayer = await switchPlatform();

async function start() {
  await init();
  
  DeskThing.sendLog('Detected Platform:' + await os.platform());

  //await handleData(await DeskThing.getData());

  DeskThing.on('get', handleGet);
  DeskThing.on('set', handleSet);

  //DeskThing.on('data', handleData);
}

// settings handler I give up on this till Riprod makes settings stable
async function handleData(data:any) {

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
          response = { type: 'song', app: 'client', payload: response }
          DeskThing.send(response)
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
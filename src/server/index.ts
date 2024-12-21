import { DeskThing } from 'deskthing-server';
export { DeskThing }
import settingsImport from './settings'; // settings manager for deskthing bc riprod's kinda sucks (sorry riprod if you're reading this lmao)
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

const settingsManager = new settingsImport(DeskThing)

const init = async () => mediaPlayer = await switchPlatform();

async function start() {
  await init();
  
  DeskThing.sendLog('Detected Platform:' + await os.platform());

  //handleData(await DeskThing.getData());

  //DeskThing.on('data', handleData);

  DeskThing.on('get', handleGet);
  DeskThing.on('set', handleSet);
}

async function handleData(data:any) {
  const settings = data.settings;
  settingsManager.settings = settings; // always update the settings before using the manager
  settingsManager.add({
    playerselectEnabled: {
      label: "Media player selection capability",
      description: "Enables or disables the media player selection capability",
      type: "select",
      value: "disabled",
      options: [
        {
          label: "Yes",
          value: "enabled"
        },
        {
          label: "No",
          value: "disabled"
        }
      ]
    }
  });

  if (mediaPlayer?.sessionIsSet && !settings?.playerOptions) {
    const options = await mediaPlayer.getSettingsOptionsArray();
    let values = [...options.map((option) => option.value)];
    DeskThing.addSettings({
      playerOptions: {
        type: 'ranked',
        label: 'Selected Playback Program',
        value: values,
        options: options,
      }
    });
    mediaPlayer.allPlayersArray = options || [];
    return;
  }

  mediaPlayer.allPlayersArray = settings?.playerOptions?.value || ['spotify.exe'];
  mediaPlayer.sessionIsSet = settings?.playerselectEnabled?.value === 'enabled';
  console.log(mediaPlayer.sessionIsSet);
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
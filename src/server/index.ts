import { DataInterface, DeskThing as DK } from 'deskthing-server'
import os from 'os'
const DeskThing = DK.getInstance()
export { DeskThing }
const platform = os.platform();

let mediaPlayer;

const getSpotify = async (type) => {
  await DeskThing.sendDataToOtherApp('spotify', { type: 'get', request: type, payload: { id: '' } });
}

const switchPlatform = async () => {
  let result;

  if (platform == 'win32') {
    const { winPlayer }  = await import('./winplayer.js')

    result = new winPlayer(DeskThing)
  } else if (platform == 'linux') {
    const { linuxPlayer } = await import('./linuxplayer.js')

    result = new linuxPlayer()
  } else {
    console.warn('GMP APP: Unsupported platform, assuming linux.');
    const { linuxPlayer } = await import('./linuxplayer.js')

    result = new linuxPlayer()
  }
  return result;
}

const start = async () => {
  mediaPlayer = await switchPlatform()

  let Data:any = await DeskThing.getData()
  DeskThing.on('data', (newData) => {
    Data = newData
    if (Data) {
      console.log(Data)
    }
  })

  if (!Data.settings?.change_source) {
    const settings = {
      "change_source": {
        "value": 'true',
        "label": "Switch output on select (unsupported at the moment)",
        "options": [
          {
            "value": "true",
            "label": "Switch"
          },
          {
            "value": "false",
            "label": "Dont Switch"
          }
        ]
      },
    }
    DeskThing.addSettings(settings)
  }


  DeskThing.on('get', handleGet)
  DeskThing.on('set', handleSet)
}

DeskThing.on('start', start)

let lastRequestTimestamp = 0;
const cooldownPeriod = 4000;
let now = 0;
let lastRequestTime = 0;

const handleGet = async (data) => {
  now = Date.now();
  lastRequestTime = now - lastRequestTimestamp;
  if (lastRequestTime < cooldownPeriod) { // request cooldown logic
    console.log(`Request sent too quickly. Delaying for ${(cooldownPeriod - lastRequestTime) / 1000} seconds.`);
    await new Promise(resolve => setTimeout(resolve, cooldownPeriod - lastRequestTime));
  }
  lastRequestTimestamp = Date.now();

  console.log('Receiving Get Data', data);
  if (data == null) {
    DeskThing.sendError('No args provided');
    return;
  }
  
  console.log(data);
  switch (data.request) {
    case 'song':
      await mediaPlayer.returnSongData(DeskThing)
      break
    case 'refresh':
      await mediaPlayer.checkForRefresh(DeskThing);
      break
    default:
      DeskThing.sendError(`Unknown request: ${data.request}`)
      break
  }
}

const handleSet = async (data) => {
  if (data == null) {
    DeskThing.sendError('No args provided')
    return
  }
  DeskThing.sendLog('Receiving Set Data' + data)
  console.log('Receiving Set Data', data)
  let response
  switch (data.request) {
    case 'next':
      response = await mediaPlayer.next(data.payload)
      if (!response == false) {
        response = { app: 'client', type: 'song', payload: response }
        DeskThing.sendDataToClient(response)
      }
      break
    case 'previous':
      response = await mediaPlayer.previous()
      break
    case 'fast_forward':
      response = await mediaPlayer.fastForward(data.payload)
      break
    case 'rewind':
      response = await mediaPlayer.rewind(data.payload)
      break
    case 'play':
      response = await mediaPlayer.play(data.payload)
      break
    case 'pause':
    case 'stop':
      response = await mediaPlayer.pause()
      break
    case 'seek':
      response = await mediaPlayer.seek(data.payload)
      break
    case 'like':
      response = 'Unable to like songs!'
      break
    case 'volume':
      response = await mediaPlayer.volume(data.payload)
      break
    case 'repeat':
      response = await mediaPlayer.repeat(data.payload)
      break
    case 'shuffle':
      response = await mediaPlayer.shuffle(data.payload)
      break
  }
}
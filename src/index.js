import { DeskThing as DK } from 'deskthing-server'
import os from 'os'
const DeskThing = DK.getInstance()
export { DeskThing }

let mediaPlayer;

const getSpotify = async (type) => {
  await DeskThing.sendDataToOtherApp('spotify', { type: 'get', request: type, payload: { id: '' } });
}
const switchPlatform = async () => {
  let result;

  let platform = await os.platform();
  if (platform == 'win32') {
    const { winPlayer }  = await import('./winplayer.js')

    result = new winPlayer(DeskThing)
  } else if (platform == 'linux') {
    const { linuxPlayer } = await import('./linuxplayer.js')

    result = new linuxPlayer(DeskThing)
  } else {
    console.warn('GWP APP: Unsupported platform, assuming linux.');
    const { linuxPlayer } = await import('./linuxplayer.js')

    result = new linuxPlayer(DeskThing)
  }
  return result;
}

const start = async () => {
  mediaPlayer = await switchPlatform()

  let Data = await DeskThing.getData()
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


const handleGet = async (data) => {
  console.log('Receiving Get Data', data)
  if (data == null) {
    DeskThing.sendError('No args provided')
    return
  }
  let response;
  let artUrl;
  console.log(data)
  switch (data.request) {
    case 'song':
      await getSpotify('song');
      break
    case 'refresh':
      await getSpotify('refresh');
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
import * as dbus from 'dbus-next';
import * as dbusnative from 'dbus-native';

type SongData = {
  id: string;
  album: string;
  artist: string;
  track_name: string;
  thumbnail: string;
  is_playing: boolean;
  volume: number;
  shuffle_state: string;
  repeat_state: string;
  track_progress: number;
  track_length: number;
  can_play: boolean;
  can_change_volume: boolean;
  playlist: string;
}

class linuxPlayer {
    private DeskThing: any;
    private player: any;
    private playerObject: any;
    private playerObjectProperties: any;
    private sessionBus: any;
    private serviceName: any;
    private serviceNameBus: any;

    private currentId: string;

    constructor(DeskThing: any) {
        this.DeskThing = DeskThing;
        this.player = null;
        this.serviceName = null;
        this.serviceNameBus = null;
        this.playerObject = null;
        this.playerObjectProperties = null;
        this.sessionBus = dbus.sessionBus();
        this.serviceNameBus = dbusnative.sessionBus();

        this.currentId = '';
    }

    async detectMediaPlayer() {
        const mediaPlayerPrefixes = [
            'org.mpris.MediaPlayer2.spotify',
            'org.mpris.MediaPlayer2.firefox.instance_',
            'org.mpris.MediaPlayer2.chromium.instance_',
            'org.mpris.MediaPlayer2.google-chrome.instance_',
        ]

        const names: string[] = await new Promise((resolve, reject) => {
          this.serviceNameBus.listNames((err: any, results: any) => {
            if (err) {
              reject(err);
            } else {
              resolve(results);
            }
          });
        });
          
        for (const prefix of mediaPlayerPrefixes) {
          const playerName = names.find((name: string) => name.startsWith(prefix))
          if (playerName) {
            console.log('Found media player:', playerName);
            this.serviceName = playerName;
          }
        }
    }

    public async init() {
      console.log("Connecting to media player...");
  
      if (!this.serviceName) {
          await this.detectMediaPlayer();
      }

      const object = await this.sessionBus.getProxyObject(this.serviceName, '/org/mpris/MediaPlayer2');
      this.player = await object.getInterface('org.mpris.MediaPlayer2.Player');
      this.playerObjectProperties = await object.getInterface('org.freedesktop.DBus.Properties');
    }

    public async returnSongData() {
      const properties = await this.playerObjectProperties.GetAll('org.mpris.MediaPlayer2.Player');

      const metaData = properties.Metadata.value;
      console.log(metaData);
      const thumbnail = await this.DeskThing.encodeImageFromUrl(metaData['mpris:artUrl'].value, 'jpeg');
      const response: SongData = {
        id: metaData['xesam:title'].value,
        album: metaData['xesam:album'].value,
        artist: metaData['xesam:artist'].value[0],
        track_name: metaData['xesam:title'].value,
        thumbnail: thumbnail,
        track_length: Number(metaData['mpris:length'].value / BigInt(1000)),
        track_progress: Number(properties.Position.value / BigInt(1000)),
        is_playing: properties.PlaybackStatus.value == "Playing",
        volume: properties.Volume.value * 100,
        shuffle_state: properties.Shuffle.value,
        repeat_state: properties.LoopStatus.value,
        can_play: properties.CanPlay.value,
        can_change_volume: true,
        playlist: 'Not implemented',
      };
      this.currentId = response.id;
      this.DeskThing.sendDataToClient({ app: 'client', type: 'song', payload: response });
    }

    public async checkForRefresh() {
      const result = await this.playerObjectProperties.GetAll('org.mpris.MediaPlayer2.Player');
      const metaData = result.Metadata.value;

      if (result.Metadata.value['xesam:title'].value !== this.currentId) {
        this.returnSongData();
      } else {
        const data = {
          id: metaData['mpris:title'].value,
          track_name: metaData['xesam:title'].value,
          is_playing: result.PlaybackStatus.value == "Playing",
          volume: result.Volume.value * 100,
          shuffle_state: result.Shuffle.value,
          repeat_state: result.LoopStatus.value.toLowerCase(),
          track_progress: Number(result.Position.value / BigInt(1000)),
          track_duration: Number(metaData['mpris:length'].value / BigInt(1000)),
        };
        this.DeskThing.sendDataToClient({ app: 'client', type: 'song', payload: data });
      }
    }

    public async play() {
      return await this.player.Play();
    }

    public async pause() {
      return await this.player.Pause();
    }

    public async next() {
      return await this.player.Next();
    }

    public async previous() {
      return await this.player.Previous();
    }

    public async seek(position: number) {
      const trackId = (await this.playerObjectProperties.Get('org.mpris.MediaPlayer2.Player', 'Metadata')).value['mpris:trackid'].value;
      const seek = BigInt(position * 1000);
      return await this.player.SetPosition(trackId, seek);
    }

    public async Volume(volume: number) {
      const vol = new dbus.Variant('d', Math.round(volume / 100));
      return await this.playerObjectProperties.Set('org.mpris.MediaPlayer2.Player', 'Volume', vol);
    }

    public async setRepeat(state: string) {
      const repeat = new dbus.Variant('s', state.charAt(0).toUpperCase() + state.slice(1));
      return await this.playerObjectProperties.Set('org.mpris.MediaPlayer2.Player', 'LoopStatus', repeat);
    }

    public async setShuffle(state: boolean) {
      const shuffle = new dbus.Variant('b', state);
      return await this.playerObjectProperties.Set('org.mpris.MediaPlayer2.Player', 'Shuffle', shuffle);
    }    
}

export { linuxPlayer };
export interface SocketData {
    app?: string;
    type?: string;
    request?: string;
    payload?: Array<string> | string | object | number | {
        [key: string]: string | Array<string>;
    } | App[] | boolean;
}
export type AppTypes = 'client' | 'server' | string;
export type EventTypes = 'get' | 'set' | 'message' | 'log' | 'error' | 'data' | 'apps' | 'message' | 'music' | 'settings' | string;
export type SongData = {
    album: string | null;
    artist: string | null;
    playlist: string | null;
    playlist_id: string | null;
    track_name: string;
    shuffle_state: boolean | null;
    repeat_state: 'off' | 'all' | 'track';
    is_playing: boolean;
    can_fast_forward: boolean;
    can_skip: boolean;
    can_like: boolean;
    can_change_volume: boolean;
    can_set_output: boolean;
    track_duration: number | null;
    track_progress: number | null;
    volume: number;
    thumbnail: string | null;
    device: string | null;
    id: string | null;
    device_id: string | null;
};
export declare enum AUDIO_REQUESTS {
    NEXT = "next",
    PREVIOUS = "previous",
    REWIND = "rewind",
    FAST_FORWARD = "fast_forward",
    PLAY = "play",
    PAUSE = "pause",
    SEEK = "seek",
    LIKE = "like",
    SONG = "song",
    VOLUME = "volume",
    REPEAT = "repeat",
    SHUFFLE = "shuffle"
}
export interface Manifest {
    isAudioSource: boolean;
    requires: Array<string>;
    label: string;
    version: string;
    description?: string;
    author?: string;
    id: string;
    isWebApp: boolean;
    isLocalApp: boolean;
    platforms: Array<string>;
    homepage?: string;
    repository?: string;
}
export interface App {
    name: string;
    enabled: boolean;
    running: boolean;
    prefIndex: number;
    manifest?: Manifest;
}
export interface Settings {
    [key: string]: {
        [setting: string]: {
            value: string | number;
            label: string;
            options: [
                {
                    value: string | number;
                    label: string;
                }
            ];
        };
    };
}

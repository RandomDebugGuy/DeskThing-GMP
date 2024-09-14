"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeskThing = void 0;
const spotify_1 = __importDefault(require("./spotify"));
const deskthing_server_1 = require("deskthing-server");
const DeskThing = deskthing_server_1.DeskThing.getInstance();
exports.DeskThing = DeskThing;
class mwHandler {
    mediawin;
    send;
    constructor() {
        this.mediawin = null;
        this.send = async (type, request, payload) => {
            let response;
            await DeskThing.sendDataToOtherApp('local', { 'type': type, 'request': request, 'payload': payload });
            DeskThing.on('data', (newData) => {
                console.log(newData);
                response = newData;
            });
            return response;
        };
    }
    next() {
        return this.send('set', 'next', null);
    }
    previous() {
        return this.send('set', 'previous', null);
    }
    fastForward(args) {
        return this.send('set', 'fastForward', args);
    }
    rewind(args) {
        return this.send('set', 'rewind', args);
    }
    play(args) {
        return this.send('set', 'play', null);
    }
    pause() {
        return this.send('set', 'pause', null);
    }
    seek(args) {
        return this.send('set', 'seek', args);
    }
    volume(args) {
        return this.send('set', 'volume', args);
    }
}
let spotify;
let mediawin;
const start = async () => {
    spotify = new spotify_1.default();
    mediawin = new mwHandler();
    DeskThing.on('get', handleGet);
    DeskThing.on('set', handleSet);
    DeskThing.on('callback-data', handleCallbackData);
};
const handleCallbackData = async (data) => {
    if (data.payload == null) {
        DeskThing.sendError('Unable to get access token');
    }
    else {
        await spotify.getAccessToken(data.payload);
    }
};
const handleGet = async (data) => {
    if (data.type == null) {
        DeskThing.sendError('No args provided!');
        return;
    }
    switch (data.request) {
        case 'song':
            await spotify.returnSongData();
            break;
        case 'refresh':
            await spotify.checkForRefresh();
            break;
        default:
            DeskThing.sendError(`Unknown request: ${data.request}`);
            break;
        // Handle other types ?
    }
};
const handleSet = async (data) => {
    if (data == null) {
        DeskThing.sendError('No args provided');
        return;
    }
    let response;
    switch (data.request) {
        case 'next':
            response = await mediawin.next();
            break;
        case 'previous':
            response = await mediawin.previous();
            break;
        case 'fast_forward':
            response = await mediawin.fastForward(data.payload);
            break;
        case 'rewind':
            response = await mediawin.rewind(data.payload);
            break;
        case 'play':
            response = await mediawin.play(data.payload);
            break;
        case 'pause':
        case 'stop':
            response = await mediawin.pause();
            break;
        case 'seek':
            response = await mediawin.seek(data.payload);
            break;
        case 'like':
            response = 'Unsupported'; //await spotify.like(data.payload)
            break;
        case 'volume':
            response = await mediawin.volume(data.payload);
            break;
        case 'repeat':
            response = 'Unsupported'; //await spotify.repeat(data.payload)
            break;
        case 'shuffle':
            response = 'Unsuported'; //await spotify.shuffle(data.payload)
            break;
        case 'transfer':
            response = 'Unsupported'; //await spotify.transfer()
            break;
    }
    DeskThing.sendLog(response);
};
DeskThing.on('start', start);

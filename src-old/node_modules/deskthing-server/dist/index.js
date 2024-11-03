"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeskThing = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const axios_1 = __importDefault(require("axios"));
class DeskThing {
    constructor() {
        this.Listeners = {};
        this.manifest = null;
        this.toServer = null;
        this.SysEvents = null;
        this.sysListeners = [];
        this.data = null;
        this.backgroundTasks = [];
        this.isDataBeingFetched = false;
        this.dataFetchQueue = [];
        this.stopRequested = false;
        this.loadManifest();
    }
    /**
     * Singleton pattern: Ensures only one instance of DeskThing exists.
     *
     * @example
     * const deskThing = DeskThing.getInstance();
     * deskthing.on('start', () => {
     *   // Your code here
     * });
     */
    static getInstance() {
        if (!this.instance) {
            this.instance = new DeskThing();
        }
        return this.instance;
    }
    /**
     * Initializes data if it is not already set on the server.
     * This method is run internally when there is no data retrieved from the server.
     *
     * @example
     * const deskThing = DeskThing.getInstance();
     * deskThing.start({ toServer, SysEvents });
     */
    initializeData() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.data) {
                if (!this.data.settings) {
                    this.data.settings = {};
                }
                this.sendData('set', this.data);
            }
            else {
                this.data = {
                    settings: {}
                };
                this.sendData('set', this.data);
            }
        });
    }
    /**
     * Notifies all listeners of a particular event.
     *
     * @example
     * deskThing.on('message', (msg) => console.log(msg));
     * deskThing.notifyListeners('message', 'Hello, World!');
     */
    notifyListeners(event, ...args) {
        return __awaiter(this, void 0, void 0, function* () {
            const callbacks = this.Listeners[event];
            if (callbacks) {
                callbacks.forEach(callback => callback(...args));
            }
        });
    }
    /**
     * Registers an event listener for a specific incoming event. Events are either the "type" value of the incoming SocketData object or a special event like "start", "stop", or "data".
     *
     * @param event - The event type to listen for.
     * @param callback - The function to call when the event occurs.
     * @returns A function to remove the listener.
     *
     * @example
     * const removeListener = deskThing.on('data', (data) => console.log(data));
     * removeListener(); // To remove the listener
     * @example
     * const removeListener = deskThing.on('start', () => console.log('App is starting));
     * removeListener(); // To remove the listener
     * @example
     * // When {type: 'get'} is received from the server
     * const removeListener = deskThing.on('get', (socketData) => console.log(socketData.payload));
     * removeListener(); // To remove the listener
     * @example
     * // When a setting is updated. Passes the updated settings object
     * const removeListener = deskThing.on('settings', (settings) => console.log(settings.some_setting.value));
     * removeListener(); // To remove the listener
     */
    on(event, callback) {
        if (!this.Listeners[event]) {
            this.Listeners[event] = [];
        }
        this.Listeners[event].push(callback);
        return () => this.off(event, callback);
    }
    /**
     * Removes a specific event listener for a particular incoming event.
     *
     * @param event - The event for which to remove the listener.
     * @param callback - The listener function to remove.
     *
     * @example
     * const dataListener = () => console.log('Data received');
     * deskthing.on('data', dataListener);
     * deskthing.off('data', dataListener);
     */
    off(event, callback) {
        if (!this.Listeners[event]) {
            return;
        }
        this.Listeners[event] = this.Listeners[event].filter(cb => cb !== callback);
    }
    /**
     * Registers a system event listener. This feature is somewhat limited but allows for detecting when there are new audiosources or button mappings registered to the server.
     * Eg 'config' is emitted when the server has new button mappings or audio sources registered.
     * @param event - The system event to listen for.
     * @param listener - The function to call when the event occurs.
     * @returns A function to remove the listener.
     *
     * @example
     * const removeSysListener = deskThing.onSystem('config', (config) => console.log('Config changed', config));
     * removeSysListener(); // To remove the system event listener
     */
    onSystem(event, listener) {
        if (this.SysEvents) {
            const removeListener = this.SysEvents(event, listener);
            this.sysListeners.push(removeListener);
            return () => {
                const index = this.sysListeners.indexOf(removeListener);
                if (index !== -1) {
                    this.sysListeners[index](); // Call the removal function
                    this.sysListeners.splice(index, 1); // Remove it from the array
                }
            };
        }
        return () => { }; // Return a no-op function if SysEvents is not defined
    }
    /**
     * Registers a one-time listener for an incoming event. The listener will be automatically removed after the first occurrence of the event.
     *
     * @param event - The event to listen for.
     * @param callback - Optional callback function. If omitted, returns a promise.
     * @returns A promise that resolves with the event data if no callback is provided.
     *
     * @example
     * deskThing.once('data').then(data => console.log('Received data:', data));
     * @example
     * await deskThing.once('flagType');
     * @example
     * await deskThing.once('flagType', someFunction);
     */
    once(event, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            if (callback) {
                const onceWrapper = (...args) => {
                    this.off(event, onceWrapper);
                    callback(...args);
                };
                this.on(event, onceWrapper);
            }
            else {
                return new Promise((resolve) => {
                    const onceWrapper = (...args) => {
                        this.off(event, onceWrapper);
                        resolve(args.length === 1 ? args[0] : args);
                    };
                    this.on(event, onceWrapper);
                });
            }
        });
    }
    /**
     * Sends data to the server with a specified event type.
     *
     * @param event - The event type to send.
     * @param payload - The data to send.
     * @param request - Optional request string.
     *
     * @example
     * deskThing.sendData('log', { message: 'Logging an event' });
     */
    sendData(event, payload, request) {
        if (this.toServer == null) {
            console.error('toServer is not defined');
            return;
        }
        const outgoingData = {
            type: event,
            request: request || '',
            payload: payload
        };
        this.toServer(outgoingData);
    }
    /**
     * Requests data from the server with optional scopes.
     *
     * @param request - The type of data to request ('data', 'config', or 'input').
     * @param scopes - Optional scopes to request specific data.
     *
     * @example
     * deskThing.requestData('data');
     */
    requestData(request, scopes) {
        const authScopes = scopes || {};
        this.sendData('get', authScopes, request);
    }
    /**
     * Public method to send data to the server.
     *
     * @param event - The event type to send.
     * @param payload - The data to send.
     * @param request - Optional request string.
     *
     * @example
     * deskThing.send('message', 'Hello, Server!');
     * @example
     * deskThing.send('log', 'Hello, Server!');
     * @example
     * deskThing.send('data', {type: 'songData', payload: musicData });
     */
    send(event, payload, request) {
        this.sendData(event, payload, request);
    }
    /**
     * Sends a plain text message to the server. This will display as a gray notification on the DeskThingServer GUI
     *
     * @param message - The message to send to the server.
     *
     * @example
     * deskThing.sendMessage('Hello, Server!');
     */
    sendMessage(message) {
        this.send('message', message);
    }
    /**
     * Sends a log message to the server. This will be saved to the .logs file and be saved in the Logs on the DeskThingServer GUI
     *
     * @param message - The log message to send.
     *
     * @example
     * deskThing.sendLog('This is a log message.');
     */
    sendLog(message) {
        this.send('log', message);
    }
    /**
     * Sends an error message to the server. This will show up as a red notification
     *
     * @param message - The error message to send.
     *
     * @example
     * deskThing.sendError('An error occurred!');
     */
    sendError(message) {
        this.send('error', message);
    }
    /**
     * Routes request to another app running on the server.
     * Ensure that the app you are requesting data from is in your dependency array!
     *
     * @param appId - The ID of the target app.
     * @param data - The data to send to the target app.
     *
     * @example
     * deskThing.sendDataToOtherApp('utility', { type: 'set', request: 'next', payload: { id: '' } });
     * @example
     * deskThing.sendDataToOtherApp('spotify', { type: 'get', request: 'music' });
     */
    sendDataToOtherApp(appId, payload) {
        this.send('toApp', payload, appId);
    }
    /**
     * Sends structured data to the client through the server. This will be received by the webapp client. The "app" field defaults to the current app.
     *
     * @param data - The structured data to send to the client, including app, type, request, and data.
     *
     * @example
     * deskThing.sendDataToClient({
     *   app: 'client',
     *   type: 'set',
     *   request: 'next',
     *   data: { key: 'value' }
     * });
     * @example
     * deskThing.sendDataToClient({
     *   type: 'songData',
     *   data: songData
     * });
     * @example
     * deskThing.sendDataToClient({
     *   type: 'callStatus',
     *   data: callData
     * });
     */
    sendDataToClient(data) {
        this.send('data', data);
    }
    /**
     * Requests the server to open a specified URL.
     *
     * @param url - The URL to open.
     *
     * @example
     * deskThing.openUrl('https://example.com');
     */
    openUrl(url) {
        this.send('open', url);
    }
    /**
     * Fetches data from the server if not already retrieved, otherwise returns the cached data.
     * This method also handles queuing requests while data is being fetched.
     *
     * @returns A promise that resolves with the data fetched or the cached data, or null if data is not available.
     *
     * @example
     * const data = await deskThing.getData();
     * console.log('Fetched data:', data);
     */
    getData() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.data) {
                if (this.isDataBeingFetched) {
                    console.warn('Data is already being fetched!!');
                    return new Promise((resolve) => {
                        this.dataFetchQueue.push(resolve);
                    });
                }
                this.isDataBeingFetched = true;
                this.requestData('data');
                try {
                    const data = yield Promise.race([
                        this.once('data'),
                        new Promise((resolve) => setTimeout(() => resolve(null), 5000)) // Adjust timeout as needed
                    ]);
                    this.isDataBeingFetched = false;
                    if (data) {
                        this.dataFetchQueue.forEach(resolve => resolve(data));
                        this.dataFetchQueue = [];
                        return data;
                    }
                    else {
                        if (this.data) {
                            this.sendLog('Failed to fetch data, but data was found');
                            this.dataFetchQueue.forEach(resolve => resolve(this.data));
                            this.dataFetchQueue = [];
                            return this.data;
                        }
                        else {
                            this.dataFetchQueue.forEach(resolve => resolve(null));
                            this.dataFetchQueue = [];
                            this.sendError('Data is not defined! Try restarting the app');
                            return null;
                        }
                    }
                }
                catch (error) {
                    this.sendLog(`Error fetching data: ${error}`);
                    this.isDataBeingFetched = false;
                    this.dataFetchQueue.forEach(resolve => resolve(this.data));
                    this.dataFetchQueue = [];
                    return this.data;
                }
            }
            else {
                //console.log('Returning ', this.data)
                return this.data;
            }
        });
    }
    /**
     * Requests a specific configuration from the server by name.
     *
     * @param name - The name of the configuration to request.
     * @returns A promise that resolves with the requested configuration or null if not found.
     *
     * @example
     * deskThing.getConfig('myConfig');
     * @example
     * const someValue = await deskThing.getConfig('superSpecificConfig');
     * console.log('Some value:', someValue);
     */
    getConfig(name) {
        return __awaiter(this, void 0, void 0, function* () {
            // Request config data from the server
            this.requestData('config', name);
            // Race between the data being received and a timeout
            return yield Promise.race([
                this.once('config'),
                new Promise((resolve) => setTimeout(() => {
                    resolve(null);
                    this.sendLog(`Failed to fetch config: ${name}`);
                }, 5000))
            ]);
        });
    }
    /**
     * Asynchronously retrieves the current settings. If settings are not defined, it fetches them from the server.
     *
     * @returns The current settings or undefined if not set.
     *
     * @example
     * const settings = deskThing.getSettings();
     * console.log('Current settings:', settings);
     */
    getSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!((_a = this.data) === null || _a === void 0 ? void 0 : _a.settings)) {
                console.error('Settings are not defined!');
                const data = yield this.getData();
                if (data && data.settings) {
                    return data.settings;
                }
                else {
                    this.sendLog('Settings are not defined!');
                    return null;
                }
            }
            else {
                return this.data.settings;
            }
        });
    }
    /**
     * Requests user input for the specified scopes and triggers the provided callback with the input response.
     * Commonly used for settings keys, secrets, and other user-specific data. Callback data will be a json object with keys matching the scope ids and values of the answers.
     *
     * @param scopes - The scopes to request input for, defining the type and details of the input needed.
     * @param callback - The function to call with the input response once received.
     *
     * @example
     * deskThing.getUserInput(
     *   {
     *     username: { instructions: 'Enter your username', label: 'Username' },
     *     password: { instructions: 'Enter your password', label: 'Password' },
     *     status: { instructions: 'Enter status', label: 'Status', value: 'active' }
     *   },
     *   (response) => console.log('User input received:', response.username, response.password, response.status)
     * );
     */
    getUserInput(scopes, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!scopes) {
                this.sendError('Scopes not defined in getUserInput!');
                return;
            }
            // Send the request to the server
            this.requestData('input', scopes);
            try {
                // Wait for the 'input' event and pass the response to the callback
                const response = yield this.once('input');
                if (callback && typeof callback === 'function') {
                    callback(response);
                }
            }
            catch (error) {
                this.sendError(`Error occurred while waiting for input: ${error}`);
            }
        });
    }
    /**
     * Adds a new setting or overwrites an existing one. Automatically saves the new setting to the server to be persisted.
     *
     * @param id - The unique identifier for the setting.
     * @param label - The display label for the setting.
     * @param defaultValue - The default value for the setting.
     * @param options - An array of options for the setting.
     *
     * @example
     * // Adding a boolean setting
     * deskThing.addSetting('darkMode', 'Dark Mode', false, [
     *   { label: 'On', value: true },
     *   { label: 'Off', value: false }
     * ])
     * @example
     * // Adding a string setting with multiple options
     * deskThing.addSetting('theme', 'Theme', 'light', [
     *   { label: 'Light', value: 'light' },
     *   { label: 'Dark', value: 'dark' },
     *   { label: 'System', value: 'system' }
     * ])
     */
    addSettings(settings) {
        var _a;
        if (!this.data) {
            this.data = { settings: {} };
        }
        else if (!this.data.settings) {
            this.data.settings = {};
        }
        if ((_a = this.data) === null || _a === void 0 ? void 0 : _a.settings) {
            Object.keys(settings).forEach((id) => {
                var _a;
                const setting = settings[id];
                if (!((_a = this.data) === null || _a === void 0 ? void 0 : _a.settings))
                    return;
                if (this.data.settings[id]) {
                    console.warn(`Setting with label "${setting.label}" already exists. It will be overwritten.`);
                    this.sendLog(`Setting with label "${setting.label}" already exists. It will be overwritten.`);
                }
                this.data.settings[id] = {
                    value: setting.value,
                    label: setting.label,
                    options: setting.options,
                };
            });
            console.log('sending settings', this.data.settings);
            this.sendData('add', { settings: this.data.settings });
        }
    }
    /**
   * Registers a new action to the server. This can be mapped to any key on the deskthingserver UI.
   *
   * @param name - The name of the action.
   * @param id - The unique identifier for the action. This is what will be used when it is triggered
   * @param description - A description of the action.
   * @param flair - Optional flair for the action (default is an empty string).
   *
   * @example
   * deskthing.addAction('Print Hello', 'printHello', 'Prints Hello to the console', '')
   * deskthing.on('button', (data) => {
   *      if (data.payload.id === 'printHello') {
   *          console.log('Hello')
   *      }
   * })
   */
    registerAction(name, id, description, flair = '') {
        this.sendData('action', { name, id, description, flair }, 'add');
    }
    /**
   * Registers a new action to the server. This can be mapped to any key on the deskthingserver UI.
   *
   * @param action - The action object to register.
   * @throws {Error} If the action object is invalid.
   * @example
   * const action = {
   *      name: 'Print Hello',
   *      id: 'printHello',
   *      description: 'Prints Hello to the console',
   *      flair: ''
   * }
   * deskthing.addActionObject(action)
   * deskthing.on('button', (data) => {
   *      if (data.payload.id === 'printHello') {
   *          console.log('Hello')
   *      }
   * })
   */
    registerActionObject(action) {
        if (!action || typeof action !== 'object') {
            throw new Error('Invalid action object');
        }
        if (!action.name || typeof action.name !== 'string') {
            throw new Error('Action must have a valid name');
        }
        if (!action.id || typeof action.id !== 'string') {
            throw new Error('Action must have a valid id');
        }
        if (!action.description || typeof action.description !== 'string') {
            throw new Error('Action must have a valid description');
        }
        if (action.flair !== undefined && typeof action.flair !== 'string') {
            throw new Error('Action flair must be a string if provided');
        }
        this.sendData('action', action, 'add');
    }
    /**
     * Updates the flair of a specified action id. This can be used to update the image of the button. Flair is appended to the end of the action name and thus the end of the SVG path as well
     * @param id action id
     * @param flair the updated flair
     * @example
     * // Previously using like.svg
     * deskthing.updateFlair('like', 'active')
     * // Now using likeactive.svg
     */
    updateFlair(id, flair) {
        this.sendData('action', { id, flair }, 'update');
    }
    /**
   * Registers a new key with the specified identifier. This can be mapped to any action. Use a keycode to map a specific keybind.
   * Possible keycodes can be found at https://www.toptal.com/developers/keycode and is listening for event.code
   *
   * Keys can also be considered "digital" like buttons on the screen.
   * The first number in the key will be passed to the action (e.g. customAction13 with action SwitchView will switch to the 13th view )
   *
   * @param id - The unique identifier for the key.
   * @param description - Description for the key.
   */
    registerKey(id, description) {
        this.sendData('button', { id, description }, 'add');
    }
    /**
   * Removes an action with the specified identifier.
   *
   * @param id - The unique identifier of the action to be removed.
   */
    removeAction(id) {
        this.sendData('action', { id }, 'remove');
    }
    /**
   * Removes a key with the specified identifier.
   *
   * @param id - The unique identifier of the key to be removed.
   */
    removeKey(id) {
        this.sendData('button', { id }, 'remove');
    }
    /**
   * Saves the provided data by merging it with the existing data and updating settings.
   * Sends the updated data to the server and notifies listeners.
   *
   * @param data - The data to be saved and merged with existing data.
   */
    saveData(data) {
        var _a;
        this.data = Object.assign(Object.assign(Object.assign({}, this.data), data), { settings: Object.assign(Object.assign({}, (_a = this.data) === null || _a === void 0 ? void 0 : _a.settings), data.settings) });
        this.sendData('add', this.data);
        this.notifyListeners('data', this.data);
    }
    /**
     * Adds a background task that will loop until either the task is cancelled or the task function returns false.
     * This is useful for tasks that need to run periodically or continuously in the background.
     *
     * @param task - The background task function to add. This function should return a Promise that resolves to a boolean or void.
     * @returns A function to cancel the background task.
     *
     * @example
     * // Add a background task that logs a message every 5 seconds
     * const cancelTask = deskThing.addBackgroundTaskLoop(async () => {
     *   console.log('Performing periodic task...');
     *   await new Promise(resolve => setTimeout(resolve, 5000));
     *   return false; // Return false to continue the loop
     * });
     *
     * // Later, to stop the task:
     * cancelTask();
     *
     * @example
     * // Add a background task that runs until a condition is met
     * let count = 0;
     * deskThing.addBackgroundTaskLoop(async () => {
     *   console.log(`Task iteration ${++count}`);
     *   if (count >= 10) {
     *     console.log('Task completed');
     *     return true; // Return true to end the loop
     *   }
     *   return false; // Continue the loop
     * });
     */
    addBackgroundTaskLoop(task) {
        const cancelToken = { cancelled: false };
        const wrappedTask = () => __awaiter(this, void 0, void 0, function* () {
            let endToken = false;
            while (!cancelToken.cancelled && !endToken) {
                endToken = (yield task()) || false;
            }
        });
        this.backgroundTasks.push(() => {
            cancelToken.cancelled = true;
        });
        wrappedTask(); // Start the task immediately
        return () => {
            cancelToken.cancelled = true;
        };
    }
    /**
 * Encodes an image from a URL and returns a Promise that resolves to a base64 encoded string.
 *
 *
 * @param url - The url that points directly to the image
 * @param type - The type of image to return (jpeg for static and gif for animated)
 * @param retries - The number of times to retry the request in case of failure. Defaults to 3.
 * @returns Promise string that has the base64 encoded image
 *
 * @example
 * // Getting encoded spotify image data
 * const encodedImage = await deskThing.encodeImageFromUrl(https://i.scdn.co/image/ab67616d0000b273bd7401ecb7477f3f6cdda060, 'jpeg')
 *
 * deskThing.sendMessageToAllClients({app: 'client', type: 'song', payload: { thumbnail: encodedImage } })
 */
    encodeImageFromUrl(url_1) {
        return __awaiter(this, arguments, void 0, function* (url, type = 'jpeg', retries = 3) {
            try {
                console.log(`Fetching ${type} data...`);
                const response = yield (0, axios_1.default)({
                    method: 'get',
                    url,
                    responseType: 'stream'
                });
                let data = [];
                response.data.on('data', (chunk) => {
                    data.push(chunk);
                });
                return new Promise((resolve, reject) => {
                    response.data.on('end', () => {
                        const bufferData = Buffer.concat(data); // Combine all the buffer chunks
                        const imgData = `data:image/${type};base64,${bufferData.toString('base64')}`;
                        console.log(`Sending ${type} data`);
                        resolve(imgData);
                    });
                    response.data.on('error', (error) => {
                        console.error(`Error fetching ${type}:`, error);
                        if (retries > 0) {
                            console.warn(`Retrying... (${retries} attempts left)`);
                            resolve(this.encodeImageFromUrl(url, type, retries - 1));
                        }
                        else {
                            reject(error);
                        }
                    });
                });
            }
            catch (error) {
                console.error(`Error fetching ${type}:`, error);
                throw error;
            }
        });
    }
    /**
     * Deskthing Server Functions
     */
    /**
     * Load the manifest file and saves it locally
     * This method is typically used internally to load configuration data.
     *
     * @example
     * const manifest = deskThing.loadManifest();
     */
    loadManifest() {
        const manifestPath = path.resolve(__dirname, './manifest.json');
        try {
            const manifestData = fs.readFileSync(manifestPath, 'utf-8');
            this.manifest = JSON.parse(manifestData);
        }
        catch (error) {
            console.error('Failed to load manifest:', error);
        }
    }
    /**
    * Returns the manifest in a Response structure
    * If the manifest is not found or fails to load, it returns a 500 status code.
    * It will attempt to read the manifest from file if the manifest does not exist in cache
    *
    * !! This method is not intended for use in client code.
    *
    * @example
    * const manifest = deskThing.getManifest();
    * console.log(manifest);
    */
    getManifest() {
        if (!this.manifest) {
            console.warn('Manifest Not Found - trying to load manually...');
            this.loadManifest();
            if (!this.manifest) {
                return {
                    data: { message: 'Manifest not found or failed to load after 2nd attempt' },
                    status: 500,
                    statusText: 'Internal Server Error',
                    request: []
                };
            }
            else {
                //console.log('Manifest loaded!') 
            }
        }
        return {
            data: this.manifest,
            status: 200,
            statusText: 'OK',
            request: []
        };
    }
    /**
     * Starts the deskthing.
     * !! This method is not intended for use in client code.
     * @param param0
     * @returns
     */
    start(_a) {
        return __awaiter(this, arguments, void 0, function* ({ toServer, SysEvents }) {
            this.toServer = toServer;
            this.SysEvents = SysEvents;
            this.stopRequested = false;
            try {
                yield this.notifyListeners('start');
            }
            catch (error) {
                console.error('Error in start:', error);
                return {
                    data: { message: `Error starting the app: ${error}` },
                    status: 500,
                    statusText: 'Internal Server Error',
                    request: []
                };
            }
            return {
                data: { message: 'Started successfully!' },
                status: 200,
                statusText: 'OK',
                request: []
            };
        });
    }
    /**
     * Stops background tasks, clears data, notifies listeners, and returns a response. This is used by the server to kill the program. Emits 'stop' event.
     *
     * !! This method is not intended for use in client code.
     *
     * @returns A promise that resolves with a response object.
     *
     * @example
     * const response = await deskThing.stop();
     * console.log(response.statusText);
     */
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (this.data) {
                    this.sendData('set', this.data);
                }
                // Notify listeners of the stop event
                yield this.notifyListeners('stop');
                // Set flag to indicate stop request
                this.stopRequested = true;
                // Stop all background tasks
                this.backgroundTasks.forEach(cancel => cancel());
                this.backgroundTasks = [];
                this.sendLog('Background tasks stopped and removed');
            }
            catch (error) {
                console.error('Error in stop:', error);
                return {
                    data: { message: `Error in stop: ${error}` },
                    status: 500,
                    statusText: 'Internal Server Error',
                    request: []
                };
            }
            return {
                data: { message: 'App stopped successfully!' },
                status: 200,
                statusText: 'OK',
                request: []
            };
        });
    }
    purge() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Notify listeners of the stop event
                yield this.notifyListeners('purge');
                // Set flag to indicate stop request
                this.stopRequested = true;
                // Stop all background tasks
                this.backgroundTasks.forEach(cancel => cancel());
                this.sendLog('Background tasks stopped');
                // Clear cached data
                this.clearCache();
                this.sendLog('Cache cleared');
            }
            catch (error) {
                console.error('Error in Purge:', error);
                return {
                    data: { message: `Error in Purge: ${error}` },
                    status: 500,
                    statusText: 'Internal Server Error',
                    request: []
                };
            }
            return {
                data: { message: 'App purged successfully!' },
                status: 200,
                statusText: 'OK',
                request: []
            };
        });
    }
    // Method to clear cached data
    clearCache() {
        this.data = null;
        this.Listeners = {};
        this.manifest = null;
        this.SysEvents = null;
        this.stopRequested = false;
        this.backgroundTasks = [];
        this.sysListeners.forEach(removeListener => removeListener());
        this.sysListeners = [];
        this.sendLog('Cache cleared');
        this.toServer = null;
    }
    toClient(data) {
        if (data.type === 'data' && data) {
            const payload = data.payload; // Extract the first argument as data
            if (typeof payload === 'object' && data !== null) {
                this.saveData(payload);
            }
            else {
                console.warn('Received invalid data from server:', payload);
                this.sendLog('Received invalid data from server:' + payload);
                this.initializeData();
            }
        }
        else if (data.type === 'message') {
            this.sendLog('Received message from server:' + data.payload);
        }
        else if (data.type === 'set' && data.request === 'settings' && data.payload) {
            const { id, value } = data.payload;
            if (this.data && this.data.settings && this.data.settings[id]) {
                this.sendLog(`Setting with label "${id}" changing from ${this.data.settings[id].value} to ${value}`);
                this.data.settings[id].value = value;
                this.sendData('add', { settings: this.data.settings });
                this.notifyListeners('settings', this.data.settings);
                this.notifyListeners('data', this.data);
            }
            else {
                this.sendLog(`Setting with label "${id}" not found`);
            }
        }
        else {
            this.notifyListeners(data.type, data);
        }
    }
}
exports.DeskThing = DeskThing;
exports.default = DeskThing.getInstance();

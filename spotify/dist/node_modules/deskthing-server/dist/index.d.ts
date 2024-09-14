type DeskthingListener = (...args: any) => void;
export type IncomingEvent = 'message' | 'data' | 'get' | 'set' | 'callback-data' | 'start' | 'stop' | 'purge' | 'input' | 'action' | 'config' | 'settings';
export type OutgoingEvent = 'message' | 'data' | 'get' | 'set' | 'add' | 'open' | 'toApp' | 'error' | 'log' | 'action' | 'button';
export type GetTypes = 'data' | 'config' | 'input';
export interface Manifest {
    type: string[];
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
export interface AuthScopes {
    [key: string]: {
        instructions: string;
        label: string;
        value?: string;
    };
}
export interface Settings {
    [key: string]: {
        value: string | boolean;
        label: string;
        options: {
            label: string;
            value: string | boolean;
        }[];
    };
}
export interface InputResponse {
    [key: string]: string | boolean;
}
export interface SocketData {
    app?: string;
    type: string;
    request?: string;
    payload?: Array<string> | string | object | number | {
        [key: string]: string | Array<string>;
    };
}
export interface DataInterface {
    [key: string]: string | Settings | undefined;
    settings?: Settings;
}
export type OutgoingData = {
    type: OutgoingEvent;
    request: string;
    payload: any | AuthScopes;
};
export type IncomingData = {
    type: IncomingEvent;
    request: string;
    payload: any;
};
type toServer = (data: OutgoingData) => void;
type SysEvents = (event: string, listener: (...args: any) => void) => () => void;
type startData = {
    toServer: toServer;
    SysEvents: SysEvents;
};
type Response = {
    data: any;
    status: number;
    statusText: string;
    request: string[];
};
export declare class DeskThing {
    private static instance;
    private Listeners;
    private manifest;
    private toServer;
    private SysEvents;
    private sysListeners;
    private data;
    private backgroundTasks;
    private isDataBeingFetched;
    private dataFetchQueue;
    stopRequested: boolean;
    constructor();
    /**
     * Singleton pattern: Ensures only one instance of DeskThing exists.
     *
     * @example
     * const deskThing = DeskThing.getInstance();
     */
    static getInstance(): DeskThing;
    /**
     * Initializes data if it is not already set on the server.
     * This method is run internally when there is no data retrieved from the server.
     *
     * @example
     * const deskThing = DeskThing.getInstance();
     * deskThing.start({ toServer, SysEvents });
     */
    private initializeData;
    /**
     * Notifies all listeners of a particular event.
     *
     * @example
     * deskThing.on('message', (msg) => console.log(msg));
     * deskThing.notifyListeners('message', 'Hello, World!');
     */
    private notifyListeners;
    /**
     * Registers an event listener for a specific incoming event.
     *
     * @param event - The event to listen for.
     * @param callback - The function to call when the event occurs.
     * @returns A function to remove the listener.
     *
     * @example
     * const removeListener = deskThing.on('data', (data) => console.log(data));
     * removeListener(); // To remove the listener
     */
    on(event: IncomingEvent, callback: DeskthingListener): () => void;
    /**
     * Removes a specific event listener for a particular incoming event.
     *
     * @param event - The event for which to remove the listener.
     * @param callback - The listener function to remove.
     *
     * @example
     * deskThing.off('data', dataListener);
     */
    off(event: IncomingEvent, callback: DeskthingListener): void;
    /**
     * Registers a system event listener. This feature is somewhat limited but allows for detecting when there are new audiosources or button mappings registered to the server.
     *
     * @param event - The system event to listen for.
     * @param listener - The function to call when the event occurs.
     * @returns A function to remove the listener.
     *
     * @example
     * const removeSysListener = deskThing.onSystem('config', (config) => console.log('Config changed', config));
     * removeSysListener(); // To remove the system event listener
     */
    onSystem(event: string, listener: DeskthingListener): () => void;
    /**
     * Registers a one-time listener for an incoming event. The listener will be automatically removed after the first occurrence of the event.
     *
     * @param event - The event to listen for.
     * @param callback - Optional callback function. If omitted, returns a promise.
     * @returns A promise that resolves with the event data if no callback is provided.
     *
     * @example
     * deskThing.once('data').then(data => console.log('Received data:', data));
     */
    once(event: IncomingEvent, callback?: DeskthingListener): Promise<any>;
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
    private sendData;
    /**
     * Requests data from the server with optional scopes.
     *
     * @param request - The type of data to request ('data', 'config', or 'input').
     * @param scopes - Optional scopes to request specific data.
     *
     * @example
     * deskThing.requestData('data');
     */
    private requestData;
    /**
     * Public method to send data to the server.
     *
     * @param event - The event type to send.
     * @param payload - The data to send.
     * @param request - Optional request string.
     *
     * @example
     * deskThing.send('message', 'Hello, Server!');
     */
    send(event: OutgoingEvent, payload: any, request?: string): void;
    /**
     * Sends a plain text message to the server. This will display as a gray notification on the DeskThingServer GUI
     *
     * @param message - The message to send to the server.
     *
     * @example
     * deskThing.sendMessage('Hello, Server!');
     */
    sendMessage(message: string): void;
    /**
     * Sends a log message to the server. This will be saved to the .logs file and be saved in the Logs on the DeskThingServer GUI
     *
     * @param message - The log message to send.
     *
     * @example
     * deskThing.sendLog('This is a log message.');
     */
    sendLog(message: string): void;
    /**
     * Sends an error message to the server. This will show up as a red notification
     *
     * @param message - The error message to send.
     *
     * @example
     * deskThing.sendError('An error occurred!');
     */
    sendError(message: string): void;
    /**
     * Routes request to another app running on the server.
     *
     * @param appId - The ID of the target app.
     * @param data - The data to send to the target app.
     *
     * @example
     * deskThing.sendDataToOtherApp('utility', { type: 'set', request: 'next', payload: { id: '' } });
     */
    sendDataToOtherApp(appId: string, payload: OutgoingData): void;
    /**
     * Sends structured data to the client through the server. This will be received by the webapp client. "app" defaults to the current app.
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
     */
    sendDataToClient(data: SocketData): void;
    /**
     * Requests the server to open a specified URL.
     *
     * @param url - The URL to open.
     *
     * @example
     * deskThing.openUrl('https://example.com');
     */
    openUrl(url: string): void;
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
    getData(): Promise<DataInterface | null>;
    /**
     * Requests a specific configuration from the server by name.
     *
     * @param name - The name of the configuration to request.
     * @returns A promise that resolves with the requested configuration or null if not found.
     *
     * @example
     * deskThing.getConfig('myConfig');
     */
    getConfig(name: string): Promise<any>;
    /**
     * Asynchronously retrieves the current settings. If settings are not defined, it fetches them from the server.
     *
     * @returns The current settings or undefined if not set.
     *
     * @example
     * const settings = deskThing.getSettings();
     * console.log('Current settings:', settings);
     */
    getSettings(): Promise<Settings | null>;
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
     *     password: { instructions: 'Enter your password', label: 'Password' }
     *   },
     *   (response) => console.log('User input received:', response.username, response.password)
     * );
     */
    getUserInput(scopes: AuthScopes, callback: DeskthingListener): Promise<void>;
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
     *
     * @example
     * // Adding a string setting with multiple options
     * deskThing.addSetting('theme', 'Theme', 'light', [
     *   { label: 'Light', value: 'light' },
     *   { label: 'Dark', value: 'dark' },
     *   { label: 'System', value: 'system' }
     * ])
     */
    addSettings(settings: Settings): void;
    /**
   * Registers a new action to the server. This can be mapped to any key on the deskthingserver UI.
   *
   * @param name - The name of the action.
   * @param id - The unique identifier for the action. This is what will be used when it is triggered
   * @param description - A description of the action.
   * @param flair - Optional flair for the action (default is an empty string).
   */
    registerAction(name: string, id: string, description: string, flair?: string): void;
    /**
   * Registers a new key with the specified identifier. This can be mapped to any action. Use a keycode to map a specific keybind.
   * Possible keycodes can be found at https://www.toptal.com/developers/keycode and is listening for event.code
   * The first number in the key will be passed to the action (e.g. customAction13 with action SwitchView will switch to the 13th view )
   *
   * @param id - The unique identifier for the key.
   */
    registerKey(id: string): void;
    /**
   * Removes an action with the specified identifier.
   *
   * @param id - The unique identifier of the action to be removed.
   */
    removeAction(id: string): void;
    /**
   * Removes a key with the specified identifier.
   *
   * @param id - The unique identifier of the key to be removed.
   */
    removeKey(id: string): void;
    /**
   * Saves the provided data by merging it with the existing data and updating settings.
   * Sends the updated data to the server and notifies listeners.
   *
   * @param data - The data to be saved and merged with existing data.
   */
    saveData(data: DataInterface): void;
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
    addBackgroundTaskLoop(task: () => Promise<boolean | void>): () => void;
    /**
 * Adds a background task that will loop until either the task is cancelled or the task function returns false.
 * This is useful for tasks that need to run periodically or continuously in the background.
 *
 * @param url - The url that points directly to the image
 * @param type - The type of image to return (jpeg for static and gif for animated)
 * @returns Promise string that has the base64 encoded image
 *
 * @example
 * // Getting encoded spotify image data
 * const encodedImage = deskThing.encodeImageFromUrl(https://i.scdn.co/image/ab67616d0000b273bd7401ecb7477f3f6cdda060, 'jpeg')
 *
 * deskThing.sendMessageToAllClients({app: 'client', type: 'song', payload: { thumbnail: encodedImage } })
 */
    encodeImageFromUrl(url: string, type?: 'jpeg' | 'gif'): Promise<string>;
    /**
     * Deskthing Server Functions
     */
    /**
     * Load the manifest file and saves it locally
     * This method is typically used internally to load configuration data.
     *
     * @example
     * deskThing.loadManifest();
     */
    private loadManifest;
    /**
    * Returns the manifest in a Response structure
    * If the manifest is not found or fails to load, it returns a 500 status code.
    * It will attempt to read the manifest from file if the manifest does not exist in cache
    *
    * @example
    * const manifest = deskThing.getManifest();
    * console.log(manifest);
    */
    getManifest(): Response;
    start({ toServer, SysEvents }: startData): Promise<Response>;
    /**
     * Stops background tasks, clears data, notifies listeners, and returns a response. This is used by the server to kill the program. Emits 'stop' event.
     *
     * @returns A promise that resolves with a response object.
     *
     * @example
     * const response = await deskThing.stop();
     * console.log(response.statusText);
     */
    stop(): Promise<Response>;
    purge(): Promise<Response>;
    private clearCache;
    toClient(data: IncomingData): void;
}
declare const _default: DeskThing;
export default _default;

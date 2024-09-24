var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __glob = (map) => (path) => {
  var fn = map[path];
  if (fn)
    return fn();
  throw new Error("Module not found in bundle: " + path);
};
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/deskthing-server/dist/index.js
var require_dist = __commonJS({
  "node_modules/deskthing-server/dist/index.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports2 && exports2.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports2 && exports2.__importStar || function(mod) {
      if (mod && mod.__esModule)
        return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod)
          if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
            __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.DeskThing = void 0;
    var fs = __importStar(require("fs"));
    var path = __importStar(require("path"));
    var DeskThing2 = class _DeskThing {
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
       */
      static getInstance() {
        if (!this.instance) {
          this.instance = new _DeskThing();
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
            this.sendData("set", this.data);
          } else {
            this.data = {
              settings: {}
            };
            this.sendData("set", this.data);
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
            callbacks.forEach((callback2) => callback2(...args));
          }
        });
      }
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
      on(event, callback2) {
        if (!this.Listeners[event]) {
          this.Listeners[event] = [];
        }
        this.Listeners[event].push(callback2);
        return () => this.off(event, callback2);
      }
      /**
       * Removes a specific event listener for a particular incoming event.
       *
       * @param event - The event for which to remove the listener.
       * @param callback - The listener function to remove.
       *
       * @example
       * deskThing.off('data', dataListener);
       */
      off(event, callback2) {
        if (!this.Listeners[event]) {
          return;
        }
        this.Listeners[event] = this.Listeners[event].filter((cb) => cb !== callback2);
      }
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
      onSystem(event, listener) {
        if (this.SysEvents) {
          const removeListener = this.SysEvents(event, listener);
          this.sysListeners.push(removeListener);
          return () => {
            const index = this.sysListeners.indexOf(removeListener);
            if (index !== -1) {
              this.sysListeners[index]();
              this.sysListeners.splice(index, 1);
            }
          };
        }
        return () => {
        };
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
       */
      once(event, callback2) {
        return __awaiter(this, void 0, void 0, function* () {
          if (callback2) {
            const onceWrapper = (...args) => {
              this.off(event, onceWrapper);
              callback2(...args);
            };
            this.on(event, onceWrapper);
          } else {
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
          console.error("toServer is not defined");
          return;
        }
        const outgoingData = {
          type: event,
          request: request || "",
          payload
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
        this.sendData("get", authScopes, request);
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
        this.send("message", message);
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
        this.send("log", message);
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
        this.send("error", message);
      }
      /**
       * Routes request to another app running on the server.
       *
       * @param appId - The ID of the target app.
       * @param data - The data to send to the target app.
       *
       * @example
       * deskThing.sendDataToOtherApp('utility', { type: 'set', request: 'next', payload: { id: '' } });
       */
      sendDataToOtherApp(appId, payload) {
        this.send("toApp", payload, appId);
      }
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
      sendDataToClient(data) {
        this.send("data", data);
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
        this.send("open", url);
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
              console.warn("Data is already being fetched!!");
              return new Promise((resolve) => {
                this.dataFetchQueue.push(resolve);
              });
            }
            this.isDataBeingFetched = true;
            this.requestData("data");
            try {
              const data = yield Promise.race([
                this.once("data"),
                new Promise((resolve) => setTimeout(() => resolve(null), 5e3))
                // Adjust timeout as needed
              ]);
              this.isDataBeingFetched = false;
              if (data) {
                this.dataFetchQueue.forEach((resolve) => resolve(data));
                this.dataFetchQueue = [];
                return data;
              } else {
                if (this.data) {
                  this.sendLog("Failed to fetch data, but data was found");
                  this.dataFetchQueue.forEach((resolve) => resolve(this.data));
                  this.dataFetchQueue = [];
                  return this.data;
                } else {
                  this.dataFetchQueue.forEach((resolve) => resolve(null));
                  this.dataFetchQueue = [];
                  this.sendError("Data is not defined! Try restarting the app");
                  return null;
                }
              }
            } catch (error) {
              this.sendLog(`Error fetching data: ${error}`);
              this.isDataBeingFetched = false;
              this.dataFetchQueue.forEach((resolve) => resolve(this.data));
              this.dataFetchQueue = [];
              return this.data;
            }
          } else {
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
       */
      getConfig(name) {
        return __awaiter(this, void 0, void 0, function* () {
          this.requestData("config", name);
          return yield Promise.race([
            this.once("config"),
            new Promise((resolve) => setTimeout(() => {
              resolve(null);
              this.sendLog(`Failed to fetch config: ${name}`);
            }, 5e3))
            // Adjust timeout as needed
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
            console.error("Settings are not defined!");
            const data = yield this.getData();
            if (data && data.settings) {
              return data.settings;
            } else {
              this.sendLog("Settings are not defined!");
              return null;
            }
          } else {
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
       *     password: { instructions: 'Enter your password', label: 'Password' }
       *   },
       *   (response) => console.log('User input received:', response.username, response.password)
       * );
       */
      getUserInput(scopes, callback2) {
        return __awaiter(this, void 0, void 0, function* () {
          if (!scopes) {
            this.sendError("Scopes not defined in getUserInput!");
            return;
          }
          this.requestData("input", scopes);
          try {
            const response = yield this.once("input");
            if (callback2 && typeof callback2 === "function") {
              callback2(response);
            }
          } catch (error) {
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
       *
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
        } else if (!this.data.settings) {
          this.data.settings = {};
        }
        if ((_a = this.data) === null || _a === void 0 ? void 0 : _a.settings) {
          Object.keys(settings).forEach((id) => {
            var _a2;
            const setting = settings[id];
            if (!((_a2 = this.data) === null || _a2 === void 0 ? void 0 : _a2.settings))
              return;
            if (this.data.settings[id]) {
              console.warn(`Setting with label "${setting.label}" already exists. It will be overwritten.`);
              this.sendLog(`Setting with label "${setting.label}" already exists. It will be overwritten.`);
            }
            this.data.settings[id] = {
              value: setting.value,
              label: setting.label,
              options: setting.options
            };
          });
          console.log("sending settings", this.data.settings);
          this.sendData("add", { settings: this.data.settings });
        }
      }
      /**
      * Registers a new action to the server. This can be mapped to any key on the deskthingserver UI.
      *
      * @param name - The name of the action.
      * @param id - The unique identifier for the action. This is what will be used when it is triggered
      * @param description - A description of the action.
      * @param flair - Optional flair for the action (default is an empty string).
      */
      registerAction(name, id, description, flair = "") {
        this.sendData("action", { name, id, description, flair }, "add");
      }
      /**
      * Registers a new key with the specified identifier. This can be mapped to any action. Use a keycode to map a specific keybind.
      * Possible keycodes can be found at https://www.toptal.com/developers/keycode and is listening for event.code
      * The first number in the key will be passed to the action (e.g. customAction13 with action SwitchView will switch to the 13th view )
      *
      * @param id - The unique identifier for the key.
      */
      registerKey(id) {
        this.sendData("button", { id }, "add");
      }
      /**
      * Removes an action with the specified identifier.
      *
      * @param id - The unique identifier of the action to be removed.
      */
      removeAction(id) {
        this.sendData("action", { id }, "remove");
      }
      /**
      * Removes a key with the specified identifier.
      *
      * @param id - The unique identifier of the key to be removed.
      */
      removeKey(id) {
        this.sendData("button", { id }, "remove");
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
        this.sendData("add", this.data);
        this.notifyListeners("data", this.data);
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
        wrappedTask();
        return () => {
          cancelToken.cancelled = true;
        };
      }
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
      encodeImageFromUrl(url_1) {
        return __awaiter(this, arguments, void 0, function* (url, type = "jpeg") {
          try {
            console.log(`Fetching ${type} data...`);
            const response = yield fetch(url);
            const arrayBuffer = yield response.arrayBuffer();
            const base64String = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
            const imgData = `data:image/${type};base64,${base64String}`;
            console.log(`Sending ${type} data`);
            return imgData;
          } catch (error) {
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
       * deskThing.loadManifest();
       */
      loadManifest() {
        const manifestPath = path.resolve(__dirname, "./manifest.json");
        try {
          const manifestData = fs.readFileSync(manifestPath, "utf-8");
          this.manifest = JSON.parse(manifestData);
        } catch (error) {
          console.error("Failed to load manifest:", error);
        }
      }
      /**
      * Returns the manifest in a Response structure
      * If the manifest is not found or fails to load, it returns a 500 status code.
      * It will attempt to read the manifest from file if the manifest does not exist in cache
      *
      * @example
      * const manifest = deskThing.getManifest();
      * console.log(manifest);
      */
      getManifest() {
        if (!this.manifest) {
          console.warn("Manifest Not Found - trying to load manually...");
          this.loadManifest();
          if (!this.manifest) {
            return {
              data: { message: "Manifest not found or failed to load after 2nd attempt" },
              status: 500,
              statusText: "Internal Server Error",
              request: []
            };
          } else {
          }
        }
        return {
          data: this.manifest,
          status: 200,
          statusText: "OK",
          request: []
        };
      }
      start(_a) {
        return __awaiter(this, arguments, void 0, function* ({ toServer, SysEvents }) {
          this.toServer = toServer;
          this.SysEvents = SysEvents;
          this.stopRequested = false;
          try {
            yield this.notifyListeners("start");
          } catch (error) {
            console.error("Error in start:", error);
            return {
              data: { message: `Error starting the app: ${error}` },
              status: 500,
              statusText: "Internal Server Error",
              request: []
            };
          }
          return {
            data: { message: "Started successfully!" },
            status: 200,
            statusText: "OK",
            request: []
          };
        });
      }
      /**
       * Stops background tasks, clears data, notifies listeners, and returns a response. This is used by the server to kill the program. Emits 'stop' event.
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
              this.sendData("set", this.data);
            }
            yield this.notifyListeners("stop");
            this.stopRequested = true;
            this.backgroundTasks.forEach((cancel) => cancel());
            this.backgroundTasks = [];
            this.sendLog("Background tasks stopped and removed");
          } catch (error) {
            console.error("Error in stop:", error);
            return {
              data: { message: `Error in stop: ${error}` },
              status: 500,
              statusText: "Internal Server Error",
              request: []
            };
          }
          return {
            data: { message: "App stopped successfully!" },
            status: 200,
            statusText: "OK",
            request: []
          };
        });
      }
      purge() {
        return __awaiter(this, void 0, void 0, function* () {
          try {
            yield this.notifyListeners("purge");
            this.stopRequested = true;
            this.backgroundTasks.forEach((cancel) => cancel());
            this.sendLog("Background tasks stopped");
            this.clearCache();
            this.sendLog("Cache cleared");
          } catch (error) {
            console.error("Error in Purge:", error);
            return {
              data: { message: `Error in Purge: ${error}` },
              status: 500,
              statusText: "Internal Server Error",
              request: []
            };
          }
          return {
            data: { message: "App purged successfully!" },
            status: 200,
            statusText: "OK",
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
        this.sysListeners.forEach((removeListener) => removeListener());
        this.sysListeners = [];
        this.sendLog("Cache cleared");
        this.toServer = null;
      }
      toClient(data) {
        if (data.type === "data" && data) {
          const payload = data.payload;
          if (typeof payload === "object" && data !== null) {
            this.saveData(payload);
          } else {
            console.warn("Received invalid data from server:", payload);
            this.sendLog("Received invalid data from server:" + payload);
            this.initializeData();
          }
        } else if (data.type === "message") {
          this.sendLog("Received message from server:" + data.payload);
        } else if (data.type === "set" && data.request === "settings" && data.payload) {
          const { id, value } = data.payload;
          if (this.data && this.data.settings && this.data.settings[id]) {
            this.sendLog(`Setting with label "${id}" changing from ${this.data.settings[id].value} to ${value}`);
            this.data.settings[id].value = value;
            this.sendData("add", { settings: this.data.settings });
            this.notifyListeners("settings", this.data.settings);
            this.notifyListeners("data", this.data);
          } else {
            this.sendLog(`Setting with label "${id}" not found`);
          }
        } else {
          this.notifyListeners(data.type, data);
        }
      }
    };
    exports2.DeskThing = DeskThing2;
    exports2.default = DeskThing2.getInstance();
  }
});

// server/winplayer.js
var winplayer_exports = {};
__export(winplayer_exports, {
  winPlayer: () => winPlayer
});
var exec, winPlayer;
var init_winplayer = __esm({
  "server/winplayer.js"() {
    ({ exec } = require("child_process"));
    winPlayer = class {
      constructor(DeskThing2) {
        this.DeskThing = DeskThing2;
        this.currentId = null;
      }
      async sendLog(message) {
        this.DeskThing.sendLog(message);
      }
      async sendError(message) {
        this.DeskThing.sendError(message);
      }
      async returnSongData(id = null, retryCount = 0) {
        try {
          const result = await this.executeCommand("");
          if (result === false) {
            this.sendError("Music Data returned false! There was an error");
            return false;
          } else {
            if (result.id !== id) {
              this.currentId = result.id;
              const musicData = result;
              musicData.thumbnail = "data:image/png;base64," + musicData.thumbnail;
              musicData.volume = await this.getVolumeInfo();
              musicData.can_change_volume = true;
              this.sendLog("Returning song data");
              return musicData;
            } else {
              if (retryCount < 5) {
                this.sendLog(`Retry attempt ${retryCount + 1} for next command.`);
                await new Promise((resolve) => setTimeout(resolve, 1e3));
                return this.returnSongData(id, retryCount + 1);
              } else {
                this.sendError(`Reached maximum retry attempts for next command.`);
                return false;
              }
            }
          }
        } catch (error) {
          this.sendError(`Error executing next command: ${error}`);
          return false;
        }
      }
      async checkForRefresh() {
        const result = await this.executeCommand("");
        if (result === false) {
          this.sendError("Music Data returned false! There was an error");
          return false;
        } else if (result.id !== this.currentId) {
          return this.returnSongData();
        }
      }
      async executeCommand(command, args = "") {
        return new Promise((resolve, reject) => {
          exec(`cd ${__dirname} && DeskThingMediaCLI.exe ${command} ${args}`, (error, stdout, stderr) => {
            if (error) {
              this.sendError(`exec error: ${error}`);
              reject(false);
              return;
            }
            try {
              const result = JSON.parse(stdout);
              resolve(result);
            } catch (parseError) {
              this.sendError("Error parsing JSON:" + parseError);
              reject(false);
            }
          });
        });
      }
      async exeVol(...args) {
        return new Promise((resolve, reject) => {
          exec(`cd ${__dirname} && adjust_get_current_system_volume_vista_plus.exe ${args}`, (error, stdout, stderr) => {
            if (error) {
              this.sendError(`exec error: ${error}`);
              reject(false);
              return;
            }
            try {
              resolve(stdout);
            } catch (parseError) {
              this.sendError("Error parsing JSON:" + parseError);
              reject(false);
            }
          });
        });
      }
      async getVolumeInfo() {
        const data = await this.exeVol();
        const args = data.split(" ");
        return parseInt(args[0], 10);
      }
      async next(id) {
        const result = await this.executeCommand("next");
        if (result.success) {
          return await this.returnSongData(id);
        }
        return false;
      }
      async previous() {
        return this.executeCommand("previous");
      }
      async fastForward(seconds) {
        return this.executeCommand("fastforward", seconds);
      }
      async rewind(seconds) {
        return this.executeCommand("rewind", seconds);
      }
      async play() {
        return this.executeCommand("play");
      }
      async pause() {
        return this.executeCommand("pause");
      }
      async stop() {
        return this.executeCommand("stop");
      }
      async seek(positionMs) {
        return this.executeCommand("seek", positionMs);
      }
      async volume(volumePercentage) {
        this.exeVol(String(volumePercentage));
        return true;
      }
      async repeat(state) {
        return this.executeCommand("setrepeat", state);
      }
      async shuffle(state) {
        return this.executeCommand("setshuffle", state);
      }
    };
  }
});

// node_modules/jsbi/dist/jsbi-cjs.js
var require_jsbi_cjs = __commonJS({
  "node_modules/jsbi/dist/jsbi-cjs.js"(exports2, module2) {
    "use strict";
    var JSBI = class _JSBI extends Array {
      constructor(a, b) {
        if (a > _JSBI.__kMaxLength)
          throw new RangeError("Maximum BigInt size exceeded");
        super(a), this.sign = b;
      }
      static BigInt(a) {
        var b = Math.floor, c = Number.isFinite;
        if ("number" == typeof a) {
          if (0 === a)
            return _JSBI.__zero();
          if ((0 | a) === a)
            return 0 > a ? _JSBI.__oneDigit(-a, true) : _JSBI.__oneDigit(a, false);
          if (!c(a) || b(a) !== a)
            throw new RangeError("The number " + a + " cannot be converted to BigInt because it is not an integer");
          return _JSBI.__fromDouble(a);
        }
        if ("string" == typeof a) {
          const b2 = _JSBI.__fromString(a);
          if (null === b2)
            throw new SyntaxError("Cannot convert " + a + " to a BigInt");
          return b2;
        }
        if ("boolean" == typeof a)
          return true === a ? _JSBI.__oneDigit(1, false) : _JSBI.__zero();
        if ("object" == typeof a) {
          if (a.constructor === _JSBI)
            return a;
          const b2 = _JSBI.__toPrimitive(a);
          return _JSBI.BigInt(b2);
        }
        throw new TypeError("Cannot convert " + a + " to a BigInt");
      }
      toDebugString() {
        const a = ["BigInt["];
        for (const b of this)
          a.push((b ? (b >>> 0).toString(16) : b) + ", ");
        return a.push("]"), a.join("");
      }
      toString(a = 10) {
        if (2 > a || 36 < a)
          throw new RangeError("toString() radix argument must be between 2 and 36");
        return 0 === this.length ? "0" : 0 == (a & a - 1) ? _JSBI.__toStringBasePowerOfTwo(this, a) : _JSBI.__toStringGeneric(this, a, false);
      }
      static toNumber(a) {
        var b = Math.clz32;
        const c = a.length;
        if (0 === c)
          return 0;
        if (1 === c) {
          const b2 = a.__unsignedDigit(0);
          return a.sign ? -b2 : b2;
        }
        const d = a.__digit(c - 1), e = b(d), f = 32 * c - e;
        if (1024 < f)
          return a.sign ? -Infinity : 1 / 0;
        let g = f - 1, h = d, i = c - 1;
        const j = e + 1;
        let k = 32 === j ? 0 : h << j;
        k >>>= 12;
        const l = j - 12;
        let m = 12 <= j ? 0 : h << 20 + j, n = 20 + j;
        0 < l && 0 < i && (i--, h = a.__digit(i), k |= h >>> 32 - l, m = h << l, n = l), 0 < n && 0 < i && (i--, h = a.__digit(i), m |= h >>> 32 - n, n -= 32);
        const o = _JSBI.__decideRounding(a, n, i, h);
        if ((1 === o || 0 === o && 1 == (1 & m)) && (m = m + 1 >>> 0, 0 == m && (k++, 0 != k >>> 20 && (k = 0, g++, 1023 < g))))
          return a.sign ? -Infinity : 1 / 0;
        const p = a.sign ? -2147483648 : 0;
        return g = g + 1023 << 20, _JSBI.__kBitConversionInts[1] = p | g | k, _JSBI.__kBitConversionInts[0] = m, _JSBI.__kBitConversionDouble[0];
      }
      static unaryMinus(a) {
        if (0 === a.length)
          return a;
        const b = a.__copy();
        return b.sign = !a.sign, b;
      }
      static bitwiseNot(a) {
        return a.sign ? _JSBI.__absoluteSubOne(a).__trim() : _JSBI.__absoluteAddOne(a, true);
      }
      static exponentiate(a, b) {
        if (b.sign)
          throw new RangeError("Exponent must be positive");
        if (0 === b.length)
          return _JSBI.__oneDigit(1, false);
        if (0 === a.length)
          return a;
        if (1 === a.length && 1 === a.__digit(0))
          return a.sign && 0 == (1 & b.__digit(0)) ? _JSBI.unaryMinus(a) : a;
        if (1 < b.length)
          throw new RangeError("BigInt too big");
        let c = b.__unsignedDigit(0);
        if (1 === c)
          return a;
        if (c >= _JSBI.__kMaxLengthBits)
          throw new RangeError("BigInt too big");
        if (1 === a.length && 2 === a.__digit(0)) {
          const b2 = 1 + (c >>> 5), d2 = a.sign && 0 != (1 & c), e2 = new _JSBI(b2, d2);
          e2.__initializeDigits();
          const f = 1 << (31 & c);
          return e2.__setDigit(b2 - 1, f), e2;
        }
        let d = null, e = a;
        for (0 != (1 & c) && (d = a), c >>= 1; 0 !== c; c >>= 1)
          e = _JSBI.multiply(e, e), 0 != (1 & c) && (null === d ? d = e : d = _JSBI.multiply(d, e));
        return d;
      }
      static multiply(a, b) {
        if (0 === a.length)
          return a;
        if (0 === b.length)
          return b;
        let c = a.length + b.length;
        32 <= a.__clzmsd() + b.__clzmsd() && c--;
        const d = new _JSBI(c, a.sign !== b.sign);
        d.__initializeDigits();
        for (let c2 = 0; c2 < a.length; c2++)
          _JSBI.__multiplyAccumulate(b, a.__digit(c2), d, c2);
        return d.__trim();
      }
      static divide(a, b) {
        if (0 === b.length)
          throw new RangeError("Division by zero");
        if (0 > _JSBI.__absoluteCompare(a, b))
          return _JSBI.__zero();
        const c = a.sign !== b.sign, d = b.__unsignedDigit(0);
        let e;
        if (1 === b.length && 65535 >= d) {
          if (1 === d)
            return c === a.sign ? a : _JSBI.unaryMinus(a);
          e = _JSBI.__absoluteDivSmall(a, d, null);
        } else
          e = _JSBI.__absoluteDivLarge(a, b, true, false);
        return e.sign = c, e.__trim();
      }
      static remainder(a, b) {
        if (0 === b.length)
          throw new RangeError("Division by zero");
        if (0 > _JSBI.__absoluteCompare(a, b))
          return a;
        const c = b.__unsignedDigit(0);
        if (1 === b.length && 65535 >= c) {
          if (1 === c)
            return _JSBI.__zero();
          const b2 = _JSBI.__absoluteModSmall(a, c);
          return 0 === b2 ? _JSBI.__zero() : _JSBI.__oneDigit(b2, a.sign);
        }
        const d = _JSBI.__absoluteDivLarge(a, b, false, true);
        return d.sign = a.sign, d.__trim();
      }
      static add(a, b) {
        const c = a.sign;
        return c === b.sign ? _JSBI.__absoluteAdd(a, b, c) : 0 <= _JSBI.__absoluteCompare(a, b) ? _JSBI.__absoluteSub(a, b, c) : _JSBI.__absoluteSub(b, a, !c);
      }
      static subtract(a, b) {
        const c = a.sign;
        return c === b.sign ? 0 <= _JSBI.__absoluteCompare(a, b) ? _JSBI.__absoluteSub(a, b, c) : _JSBI.__absoluteSub(b, a, !c) : _JSBI.__absoluteAdd(a, b, c);
      }
      static leftShift(a, b) {
        return 0 === b.length || 0 === a.length ? a : b.sign ? _JSBI.__rightShiftByAbsolute(a, b) : _JSBI.__leftShiftByAbsolute(a, b);
      }
      static signedRightShift(a, b) {
        return 0 === b.length || 0 === a.length ? a : b.sign ? _JSBI.__leftShiftByAbsolute(a, b) : _JSBI.__rightShiftByAbsolute(a, b);
      }
      static unsignedRightShift() {
        throw new TypeError("BigInts have no unsigned right shift; use >> instead");
      }
      static lessThan(a, b) {
        return 0 > _JSBI.__compareToBigInt(a, b);
      }
      static lessThanOrEqual(a, b) {
        return 0 >= _JSBI.__compareToBigInt(a, b);
      }
      static greaterThan(a, b) {
        return 0 < _JSBI.__compareToBigInt(a, b);
      }
      static greaterThanOrEqual(a, b) {
        return 0 <= _JSBI.__compareToBigInt(a, b);
      }
      static equal(a, b) {
        if (a.sign !== b.sign)
          return false;
        if (a.length !== b.length)
          return false;
        for (let c = 0; c < a.length; c++)
          if (a.__digit(c) !== b.__digit(c))
            return false;
        return true;
      }
      static bitwiseAnd(a, b) {
        var c = Math.max;
        if (!a.sign && !b.sign)
          return _JSBI.__absoluteAnd(a, b).__trim();
        if (a.sign && b.sign) {
          const d = c(a.length, b.length) + 1;
          let e = _JSBI.__absoluteSubOne(a, d);
          const f = _JSBI.__absoluteSubOne(b);
          return e = _JSBI.__absoluteOr(e, f, e), _JSBI.__absoluteAddOne(e, true, e).__trim();
        }
        return a.sign && ([a, b] = [b, a]), _JSBI.__absoluteAndNot(a, _JSBI.__absoluteSubOne(b)).__trim();
      }
      static bitwiseXor(a, b) {
        var c = Math.max;
        if (!a.sign && !b.sign)
          return _JSBI.__absoluteXor(a, b).__trim();
        if (a.sign && b.sign) {
          const d2 = c(a.length, b.length), e2 = _JSBI.__absoluteSubOne(a, d2), f = _JSBI.__absoluteSubOne(b);
          return _JSBI.__absoluteXor(e2, f, e2).__trim();
        }
        const d = c(a.length, b.length) + 1;
        a.sign && ([a, b] = [b, a]);
        let e = _JSBI.__absoluteSubOne(b, d);
        return e = _JSBI.__absoluteXor(e, a, e), _JSBI.__absoluteAddOne(e, true, e).__trim();
      }
      static bitwiseOr(a, b) {
        var c = Math.max;
        const d = c(a.length, b.length);
        if (!a.sign && !b.sign)
          return _JSBI.__absoluteOr(a, b).__trim();
        if (a.sign && b.sign) {
          let c2 = _JSBI.__absoluteSubOne(a, d);
          const e2 = _JSBI.__absoluteSubOne(b);
          return c2 = _JSBI.__absoluteAnd(c2, e2, c2), _JSBI.__absoluteAddOne(c2, true, c2).__trim();
        }
        a.sign && ([a, b] = [b, a]);
        let e = _JSBI.__absoluteSubOne(b, d);
        return e = _JSBI.__absoluteAndNot(e, a, e), _JSBI.__absoluteAddOne(e, true, e).__trim();
      }
      static ADD(a, b) {
        if (a = _JSBI.__toPrimitive(a), b = _JSBI.__toPrimitive(b), "string" == typeof a)
          return "string" != typeof b && (b = b.toString()), a + b;
        if ("string" == typeof b)
          return a.toString() + b;
        if (a = _JSBI.__toNumeric(a), b = _JSBI.__toNumeric(b), _JSBI.__isBigInt(a) && _JSBI.__isBigInt(b))
          return _JSBI.add(a, b);
        if ("number" == typeof a && "number" == typeof b)
          return a + b;
        throw new TypeError("Cannot mix BigInt and other types, use explicit conversions");
      }
      static LT(a, b) {
        return _JSBI.__compare(a, b, 0);
      }
      static LE(a, b) {
        return _JSBI.__compare(a, b, 1);
      }
      static GT(a, b) {
        return _JSBI.__compare(a, b, 2);
      }
      static GE(a, b) {
        return _JSBI.__compare(a, b, 3);
      }
      static EQ(a, b) {
        for (; ; ) {
          if (_JSBI.__isBigInt(a))
            return _JSBI.__isBigInt(b) ? _JSBI.equal(a, b) : _JSBI.EQ(b, a);
          if ("number" == typeof a) {
            if (_JSBI.__isBigInt(b))
              return _JSBI.__equalToNumber(b, a);
            if ("object" != typeof b)
              return a == b;
            b = _JSBI.__toPrimitive(b);
          } else if ("string" == typeof a) {
            if (_JSBI.__isBigInt(b))
              return a = _JSBI.__fromString(a), null !== a && _JSBI.equal(a, b);
            if ("object" != typeof b)
              return a == b;
            b = _JSBI.__toPrimitive(b);
          } else if ("boolean" == typeof a) {
            if (_JSBI.__isBigInt(b))
              return _JSBI.__equalToNumber(b, +a);
            if ("object" != typeof b)
              return a == b;
            b = _JSBI.__toPrimitive(b);
          } else if ("symbol" == typeof a) {
            if (_JSBI.__isBigInt(b))
              return false;
            if ("object" != typeof b)
              return a == b;
            b = _JSBI.__toPrimitive(b);
          } else if ("object" == typeof a) {
            if ("object" == typeof b && b.constructor !== _JSBI)
              return a == b;
            a = _JSBI.__toPrimitive(a);
          } else
            return a == b;
        }
      }
      static __zero() {
        return new _JSBI(0, false);
      }
      static __oneDigit(a, b) {
        const c = new _JSBI(1, b);
        return c.__setDigit(0, a), c;
      }
      __copy() {
        const a = new _JSBI(this.length, this.sign);
        for (let b = 0; b < this.length; b++)
          a[b] = this[b];
        return a;
      }
      __trim() {
        let a = this.length, b = this[a - 1];
        for (; 0 === b; )
          a--, b = this[a - 1], this.pop();
        return 0 === a && (this.sign = false), this;
      }
      __initializeDigits() {
        for (let a = 0; a < this.length; a++)
          this[a] = 0;
      }
      static __decideRounding(a, b, c, d) {
        if (0 < b)
          return -1;
        let e;
        if (0 > b)
          e = -b - 1;
        else {
          if (0 === c)
            return -1;
          c--, d = a.__digit(c), e = 31;
        }
        let f = 1 << e;
        if (0 == (d & f))
          return -1;
        if (f -= 1, 0 != (d & f))
          return 1;
        for (; 0 < c; )
          if (c--, 0 !== a.__digit(c))
            return 1;
        return 0;
      }
      static __fromDouble(a) {
        _JSBI.__kBitConversionDouble[0] = a;
        const b = 2047 & _JSBI.__kBitConversionInts[1] >>> 20, c = b - 1023, d = (c >>> 5) + 1, e = new _JSBI(d, 0 > a);
        let f = 1048575 & _JSBI.__kBitConversionInts[1] | 1048576, g = _JSBI.__kBitConversionInts[0];
        const h = 20, i = 31 & c;
        let j, k = 0;
        if (i < 20) {
          const a2 = h - i;
          k = a2 + 32, j = f >>> a2, f = f << 32 - a2 | g >>> a2, g <<= 32 - a2;
        } else if (i === 20)
          k = 32, j = f, f = g;
        else {
          const a2 = i - h;
          k = 32 - a2, j = f << a2 | g >>> 32 - a2, f = g << a2;
        }
        e.__setDigit(d - 1, j);
        for (let b2 = d - 2; 0 <= b2; b2--)
          0 < k ? (k -= 32, j = f, f = g) : j = 0, e.__setDigit(b2, j);
        return e.__trim();
      }
      static __isWhitespace(a) {
        return !!(13 >= a && 9 <= a) || (159 >= a ? 32 == a : 131071 >= a ? 160 == a || 5760 == a : 196607 >= a ? (a &= 131071, 10 >= a || 40 == a || 41 == a || 47 == a || 95 == a || 4096 == a) : 65279 == a);
      }
      static __fromString(a, b = 0) {
        let c = 0;
        const e = a.length;
        let f = 0;
        if (f === e)
          return _JSBI.__zero();
        let g = a.charCodeAt(f);
        for (; _JSBI.__isWhitespace(g); ) {
          if (++f === e)
            return _JSBI.__zero();
          g = a.charCodeAt(f);
        }
        if (43 === g) {
          if (++f === e)
            return null;
          g = a.charCodeAt(f), c = 1;
        } else if (45 === g) {
          if (++f === e)
            return null;
          g = a.charCodeAt(f), c = -1;
        }
        if (0 === b) {
          if (b = 10, 48 === g) {
            if (++f === e)
              return _JSBI.__zero();
            if (g = a.charCodeAt(f), 88 === g || 120 === g) {
              if (b = 16, ++f === e)
                return null;
              g = a.charCodeAt(f);
            } else if (79 === g || 111 === g) {
              if (b = 8, ++f === e)
                return null;
              g = a.charCodeAt(f);
            } else if (66 === g || 98 === g) {
              if (b = 2, ++f === e)
                return null;
              g = a.charCodeAt(f);
            }
          }
        } else if (16 === b && 48 === g) {
          if (++f === e)
            return _JSBI.__zero();
          if (g = a.charCodeAt(f), 88 === g || 120 === g) {
            if (++f === e)
              return null;
            g = a.charCodeAt(f);
          }
        }
        for (; 48 === g; ) {
          if (++f === e)
            return _JSBI.__zero();
          g = a.charCodeAt(f);
        }
        const h = e - f;
        let i = _JSBI.__kMaxBitsPerChar[b], j = _JSBI.__kBitsPerCharTableMultiplier - 1;
        if (h > 1073741824 / i)
          return null;
        const k = i * h + j >>> _JSBI.__kBitsPerCharTableShift, l = new _JSBI(k + 31 >>> 5, false), n = 10 > b ? b : 10, o = 10 < b ? b - 10 : 0;
        if (0 == (b & b - 1)) {
          i >>= _JSBI.__kBitsPerCharTableShift;
          const b2 = [], c2 = [];
          let d = false;
          do {
            let h2 = 0, j2 = 0;
            for (; ; ) {
              let b3;
              if (g - 48 >>> 0 < n)
                b3 = g - 48;
              else if ((32 | g) - 97 >>> 0 < o)
                b3 = (32 | g) - 87;
              else {
                d = true;
                break;
              }
              if (j2 += i, h2 = h2 << i | b3, ++f === e) {
                d = true;
                break;
              }
              if (g = a.charCodeAt(f), 32 < j2 + i)
                break;
            }
            b2.push(h2), c2.push(j2);
          } while (!d);
          _JSBI.__fillFromParts(l, b2, c2);
        } else {
          l.__initializeDigits();
          let c2 = false, h2 = 0;
          do {
            let k2 = 0, p = 1;
            for (; ; ) {
              let i2;
              if (g - 48 >>> 0 < n)
                i2 = g - 48;
              else if ((32 | g) - 97 >>> 0 < o)
                i2 = (32 | g) - 87;
              else {
                c2 = true;
                break;
              }
              const d = p * b;
              if (4294967295 < d)
                break;
              if (p = d, k2 = k2 * b + i2, h2++, ++f === e) {
                c2 = true;
                break;
              }
              g = a.charCodeAt(f);
            }
            j = 32 * _JSBI.__kBitsPerCharTableMultiplier - 1;
            const q = i * h2 + j >>> _JSBI.__kBitsPerCharTableShift + 5;
            l.__inplaceMultiplyAdd(p, k2, q);
          } while (!c2);
        }
        for (; f !== e; ) {
          if (!_JSBI.__isWhitespace(g))
            return null;
          g = a.charCodeAt(f++);
        }
        return 0 != c && 10 !== b ? null : (l.sign = -1 == c, l.__trim());
      }
      static __fillFromParts(a, b, c) {
        let d = 0, e = 0, f = 0;
        for (let g = b.length - 1; 0 <= g; g--) {
          const h = b[g], i = c[g];
          e |= h << f, f += i, 32 === f ? (a.__setDigit(d++, e), f = 0, e = 0) : 32 < f && (a.__setDigit(d++, e), f -= 32, e = h >>> i - f);
        }
        if (0 !== e) {
          if (d >= a.length)
            throw new Error("implementation bug");
          a.__setDigit(d++, e);
        }
        for (; d < a.length; d++)
          a.__setDigit(d, 0);
      }
      static __toStringBasePowerOfTwo(a, b) {
        var c = Math.clz32;
        const d = a.length;
        let e = b - 1;
        e = (85 & e >>> 1) + (85 & e), e = (51 & e >>> 2) + (51 & e), e = (15 & e >>> 4) + (15 & e);
        const f = e, g = b - 1, h = a.__digit(d - 1), i = c(h);
        let j = 0 | (32 * d - i + f - 1) / f;
        if (a.sign && j++, 268435456 < j)
          throw new Error("string too long");
        const k = Array(j);
        let l = j - 1, m = 0, n = 0;
        for (let c2 = 0; c2 < d - 1; c2++) {
          const b2 = a.__digit(c2), d2 = (m | b2 << n) & g;
          k[l--] = _JSBI.__kConversionChars[d2];
          const e2 = f - n;
          for (m = b2 >>> e2, n = 32 - e2; n >= f; )
            k[l--] = _JSBI.__kConversionChars[m & g], m >>>= f, n -= f;
        }
        const o = (m | h << n) & g;
        for (k[l--] = _JSBI.__kConversionChars[o], m = h >>> f - n; 0 !== m; )
          k[l--] = _JSBI.__kConversionChars[m & g], m >>>= f;
        if (a.sign && (k[l--] = "-"), -1 != l)
          throw new Error("implementation bug");
        return k.join("");
      }
      static __toStringGeneric(a, b, c) {
        var d = Math.clz32;
        const e = a.length;
        if (0 === e)
          return "";
        if (1 === e) {
          let d2 = a.__unsignedDigit(0).toString(b);
          return false === c && a.sign && (d2 = "-" + d2), d2;
        }
        const f = 32 * e - d(a.__digit(e - 1)), g = _JSBI.__kMaxBitsPerChar[b], h = g - 1;
        let i = f * _JSBI.__kBitsPerCharTableMultiplier;
        i += h - 1, i = 0 | i / h;
        const j = i + 1 >> 1, k = _JSBI.exponentiate(_JSBI.__oneDigit(b, false), _JSBI.__oneDigit(j, false));
        let l, m;
        const n = k.__unsignedDigit(0);
        if (1 === k.length && 65535 >= n) {
          l = new _JSBI(a.length, false), l.__initializeDigits();
          let c2 = 0;
          for (let b2 = 2 * a.length - 1; 0 <= b2; b2--) {
            const d2 = c2 << 16 | a.__halfDigit(b2);
            l.__setHalfDigit(b2, 0 | d2 / n), c2 = 0 | d2 % n;
          }
          m = c2.toString(b);
        } else {
          const c2 = _JSBI.__absoluteDivLarge(a, k, true, true);
          l = c2.quotient;
          const d2 = c2.remainder.__trim();
          m = _JSBI.__toStringGeneric(d2, b, true);
        }
        l.__trim();
        let o = _JSBI.__toStringGeneric(l, b, true);
        for (; m.length < j; )
          m = "0" + m;
        return false === c && a.sign && (o = "-" + o), o + m;
      }
      static __unequalSign(a) {
        return a ? -1 : 1;
      }
      static __absoluteGreater(a) {
        return a ? -1 : 1;
      }
      static __absoluteLess(a) {
        return a ? 1 : -1;
      }
      static __compareToBigInt(a, b) {
        const c = a.sign;
        if (c !== b.sign)
          return _JSBI.__unequalSign(c);
        const d = _JSBI.__absoluteCompare(a, b);
        return 0 < d ? _JSBI.__absoluteGreater(c) : 0 > d ? _JSBI.__absoluteLess(c) : 0;
      }
      static __compareToNumber(a, b) {
        if (b | true) {
          const c = a.sign, d = 0 > b;
          if (c !== d)
            return _JSBI.__unequalSign(c);
          if (0 === a.length) {
            if (d)
              throw new Error("implementation bug");
            return 0 === b ? 0 : -1;
          }
          if (1 < a.length)
            return _JSBI.__absoluteGreater(c);
          const e = Math.abs(b), f = a.__unsignedDigit(0);
          return f > e ? _JSBI.__absoluteGreater(c) : f < e ? _JSBI.__absoluteLess(c) : 0;
        }
        return _JSBI.__compareToDouble(a, b);
      }
      static __compareToDouble(a, b) {
        var c = Math.clz32;
        if (b !== b)
          return b;
        if (b === 1 / 0)
          return -1;
        if (b === -Infinity)
          return 1;
        const d = a.sign;
        if (d !== 0 > b)
          return _JSBI.__unequalSign(d);
        if (0 === b)
          throw new Error("implementation bug: should be handled elsewhere");
        if (0 === a.length)
          return -1;
        _JSBI.__kBitConversionDouble[0] = b;
        const e = 2047 & _JSBI.__kBitConversionInts[1] >>> 20;
        if (2047 == e)
          throw new Error("implementation bug: handled elsewhere");
        const f = e - 1023;
        if (0 > f)
          return _JSBI.__absoluteGreater(d);
        const g = a.length;
        let h = a.__digit(g - 1);
        const i = c(h), j = 32 * g - i, k = f + 1;
        if (j < k)
          return _JSBI.__absoluteLess(d);
        if (j > k)
          return _JSBI.__absoluteGreater(d);
        let l = 1048576 | 1048575 & _JSBI.__kBitConversionInts[1], m = _JSBI.__kBitConversionInts[0];
        const n = 20, o = 31 - i;
        if (o !== (j - 1) % 31)
          throw new Error("implementation bug");
        let p, q = 0;
        if (20 > o) {
          const a2 = n - o;
          q = a2 + 32, p = l >>> a2, l = l << 32 - a2 | m >>> a2, m <<= 32 - a2;
        } else if (20 === o)
          q = 32, p = l, l = m;
        else {
          const a2 = o - n;
          q = 32 - a2, p = l << a2 | m >>> 32 - a2, l = m << a2;
        }
        if (h >>>= 0, p >>>= 0, h > p)
          return _JSBI.__absoluteGreater(d);
        if (h < p)
          return _JSBI.__absoluteLess(d);
        for (let c2 = g - 2; 0 <= c2; c2--) {
          0 < q ? (q -= 32, p = l >>> 0, l = m, m = 0) : p = 0;
          const b2 = a.__unsignedDigit(c2);
          if (b2 > p)
            return _JSBI.__absoluteGreater(d);
          if (b2 < p)
            return _JSBI.__absoluteLess(d);
        }
        if (0 !== l || 0 !== m) {
          if (0 === q)
            throw new Error("implementation bug");
          return _JSBI.__absoluteLess(d);
        }
        return 0;
      }
      static __equalToNumber(a, b) {
        var c = Math.abs;
        return b | 0 === b ? 0 === b ? 0 === a.length : 1 === a.length && a.sign === 0 > b && a.__unsignedDigit(0) === c(b) : 0 === _JSBI.__compareToDouble(a, b);
      }
      static __comparisonResultToBool(a, b) {
        switch (b) {
          case 0:
            return 0 > a;
          case 1:
            return 0 >= a;
          case 2:
            return 0 < a;
          case 3:
            return 0 <= a;
        }
        throw new Error("unreachable");
      }
      static __compare(a, b, c) {
        if (a = _JSBI.__toPrimitive(a), b = _JSBI.__toPrimitive(b), "string" == typeof a && "string" == typeof b)
          switch (c) {
            case 0:
              return a < b;
            case 1:
              return a <= b;
            case 2:
              return a > b;
            case 3:
              return a >= b;
          }
        if (_JSBI.__isBigInt(a) && "string" == typeof b)
          return b = _JSBI.__fromString(b), null !== b && _JSBI.__comparisonResultToBool(_JSBI.__compareToBigInt(a, b), c);
        if ("string" == typeof a && _JSBI.__isBigInt(b))
          return a = _JSBI.__fromString(a), null !== a && _JSBI.__comparisonResultToBool(_JSBI.__compareToBigInt(a, b), c);
        if (a = _JSBI.__toNumeric(a), b = _JSBI.__toNumeric(b), _JSBI.__isBigInt(a)) {
          if (_JSBI.__isBigInt(b))
            return _JSBI.__comparisonResultToBool(_JSBI.__compareToBigInt(a, b), c);
          if ("number" != typeof b)
            throw new Error("implementation bug");
          return _JSBI.__comparisonResultToBool(_JSBI.__compareToNumber(a, b), c);
        }
        if ("number" != typeof a)
          throw new Error("implementation bug");
        if (_JSBI.__isBigInt(b))
          return _JSBI.__comparisonResultToBool(_JSBI.__compareToNumber(b, a), 2 ^ c);
        if ("number" != typeof b)
          throw new Error("implementation bug");
        return 0 === c ? a < b : 1 === c ? a <= b : 2 === c ? a > b : 3 === c ? a >= b : void 0;
      }
      __clzmsd() {
        return Math.clz32(this[this.length - 1]);
      }
      static __absoluteAdd(a, b, c) {
        if (a.length < b.length)
          return _JSBI.__absoluteAdd(b, a, c);
        if (0 === a.length)
          return a;
        if (0 === b.length)
          return a.sign === c ? a : _JSBI.unaryMinus(a);
        let d = a.length;
        (0 === a.__clzmsd() || b.length === a.length && 0 === b.__clzmsd()) && d++;
        const e = new _JSBI(d, c);
        let f = 0, g = 0;
        for (; g < b.length; g++) {
          const c2 = b.__digit(g), d2 = a.__digit(g), h = (65535 & d2) + (65535 & c2) + f, i = (d2 >>> 16) + (c2 >>> 16) + (h >>> 16);
          f = i >>> 16, e.__setDigit(g, 65535 & h | i << 16);
        }
        for (; g < a.length; g++) {
          const b2 = a.__digit(g), c2 = (65535 & b2) + f, d2 = (b2 >>> 16) + (c2 >>> 16);
          f = d2 >>> 16, e.__setDigit(g, 65535 & c2 | d2 << 16);
        }
        return g < e.length && e.__setDigit(g, f), e.__trim();
      }
      static __absoluteSub(a, b, c) {
        if (0 === a.length)
          return a;
        if (0 === b.length)
          return a.sign === c ? a : _JSBI.unaryMinus(a);
        const d = new _JSBI(a.length, c);
        let e = 0, f = 0;
        for (; f < b.length; f++) {
          const c2 = a.__digit(f), g = b.__digit(f), h = (65535 & c2) - (65535 & g) - e;
          e = 1 & h >>> 16;
          const i = (c2 >>> 16) - (g >>> 16) - e;
          e = 1 & i >>> 16, d.__setDigit(f, 65535 & h | i << 16);
        }
        for (; f < a.length; f++) {
          const b2 = a.__digit(f), c2 = (65535 & b2) - e;
          e = 1 & c2 >>> 16;
          const g = (b2 >>> 16) - e;
          e = 1 & g >>> 16, d.__setDigit(f, 65535 & c2 | g << 16);
        }
        return d.__trim();
      }
      static __absoluteAddOne(a, b, c = null) {
        const d = a.length;
        null === c ? c = new _JSBI(d, b) : c.sign = b;
        let e = true;
        for (let f, g = 0; g < d; g++) {
          f = a.__digit(g);
          const b2 = -1 === f;
          e && (f = 0 | f + 1), e = b2, c.__setDigit(g, f);
        }
        return e && c.__setDigitGrow(d, 1), c;
      }
      static __absoluteSubOne(a, b) {
        const c = a.length;
        b = b || c;
        const d = new _JSBI(b, false);
        let e = true;
        for (let f, g = 0; g < c; g++) {
          f = a.__digit(g);
          const b2 = 0 === f;
          e && (f = 0 | f - 1), e = b2, d.__setDigit(g, f);
        }
        for (let e2 = c; e2 < b; e2++)
          d.__setDigit(e2, 0);
        return d;
      }
      static __absoluteAnd(a, b, c = null) {
        let d = a.length, e = b.length, f = e;
        if (d < e) {
          f = d;
          const c2 = a, g2 = d;
          a = b, d = e, b = c2, e = g2;
        }
        let g = f;
        null === c ? c = new _JSBI(g, false) : g = c.length;
        let h = 0;
        for (; h < f; h++)
          c.__setDigit(h, a.__digit(h) & b.__digit(h));
        for (; h < g; h++)
          c.__setDigit(h, 0);
        return c;
      }
      static __absoluteAndNot(a, b, c = null) {
        const d = a.length, e = b.length;
        let f = e;
        d < e && (f = d);
        let g = d;
        null === c ? c = new _JSBI(g, false) : g = c.length;
        let h = 0;
        for (; h < f; h++)
          c.__setDigit(h, a.__digit(h) & ~b.__digit(h));
        for (; h < d; h++)
          c.__setDigit(h, a.__digit(h));
        for (; h < g; h++)
          c.__setDigit(h, 0);
        return c;
      }
      static __absoluteOr(a, b, c = null) {
        let d = a.length, e = b.length, f = e;
        if (d < e) {
          f = d;
          const c2 = a, g2 = d;
          a = b, d = e, b = c2, e = g2;
        }
        let g = d;
        null === c ? c = new _JSBI(g, false) : g = c.length;
        let h = 0;
        for (; h < f; h++)
          c.__setDigit(h, a.__digit(h) | b.__digit(h));
        for (; h < d; h++)
          c.__setDigit(h, a.__digit(h));
        for (; h < g; h++)
          c.__setDigit(h, 0);
        return c;
      }
      static __absoluteXor(a, b, c = null) {
        let d = a.length, e = b.length, f = e;
        if (d < e) {
          f = d;
          const c2 = a, g2 = d;
          a = b, d = e, b = c2, e = g2;
        }
        let g = d;
        null === c ? c = new _JSBI(g, false) : g = c.length;
        let h = 0;
        for (; h < f; h++)
          c.__setDigit(h, a.__digit(h) ^ b.__digit(h));
        for (; h < d; h++)
          c.__setDigit(h, a.__digit(h));
        for (; h < g; h++)
          c.__setDigit(h, 0);
        return c;
      }
      static __absoluteCompare(a, b) {
        const c = a.length - b.length;
        if (0 != c)
          return c;
        let d = a.length - 1;
        for (; 0 <= d && a.__digit(d) === b.__digit(d); )
          d--;
        return 0 > d ? 0 : a.__unsignedDigit(d) > b.__unsignedDigit(d) ? 1 : -1;
      }
      static __multiplyAccumulate(a, b, c, d) {
        var e = Math.imul;
        if (0 === b)
          return;
        const f = 65535 & b, g = b >>> 16;
        let h = 0, j = 0, k = 0;
        for (let l = 0; l < a.length; l++, d++) {
          let b2 = c.__digit(d), i = 65535 & b2, m = b2 >>> 16;
          const n = a.__digit(l), o = 65535 & n, p = n >>> 16, q = e(o, f), r = e(o, g), s = e(p, f), t = e(p, g);
          i += j + (65535 & q), m += k + h + (i >>> 16) + (q >>> 16) + (65535 & r) + (65535 & s), h = m >>> 16, j = (r >>> 16) + (s >>> 16) + (65535 & t) + h, h = j >>> 16, j &= 65535, k = t >>> 16, b2 = 65535 & i | m << 16, c.__setDigit(d, b2);
        }
        for (; 0 != h || 0 !== j || 0 !== k; d++) {
          let a2 = c.__digit(d);
          const b2 = (65535 & a2) + j, e2 = (a2 >>> 16) + (b2 >>> 16) + k + h;
          j = 0, k = 0, h = e2 >>> 16, a2 = 65535 & b2 | e2 << 16, c.__setDigit(d, a2);
        }
      }
      static __internalMultiplyAdd(a, b, c, d, e) {
        var f = Math.imul;
        let g = c, h = 0;
        for (let j = 0; j < d; j++) {
          const c2 = a.__digit(j), d2 = f(65535 & c2, b), i = (65535 & d2) + h + g;
          g = i >>> 16;
          const k = f(c2 >>> 16, b), l = (65535 & k) + (d2 >>> 16) + g;
          g = l >>> 16, h = k >>> 16, e.__setDigit(j, l << 16 | 65535 & i);
        }
        if (e.length > d)
          for (e.__setDigit(d++, g + h); d < e.length; )
            e.__setDigit(d++, 0);
        else if (0 !== g + h)
          throw new Error("implementation bug");
      }
      __inplaceMultiplyAdd(a, b, c) {
        var e = Math.imul;
        c > this.length && (c = this.length);
        const f = 65535 & a, g = a >>> 16;
        let h = 0, j = 65535 & b, k = b >>> 16;
        for (let l = 0; l < c; l++) {
          const a2 = this.__digit(l), b2 = 65535 & a2, c2 = a2 >>> 16, d = e(b2, f), i = e(b2, g), m = e(c2, f), n = e(c2, g), o = j + (65535 & d), p = k + h + (o >>> 16) + (d >>> 16) + (65535 & i) + (65535 & m);
          j = (i >>> 16) + (m >>> 16) + (65535 & n) + (p >>> 16), h = j >>> 16, j &= 65535, k = n >>> 16;
          this.__setDigit(l, 65535 & o | p << 16);
        }
        if (0 != h || 0 !== j || 0 !== k)
          throw new Error("implementation bug");
      }
      static __absoluteDivSmall(a, b, c) {
        null === c && (c = new _JSBI(a.length, false));
        let d = 0;
        for (let e, f = 2 * a.length - 1; 0 <= f; f -= 2) {
          e = (d << 16 | a.__halfDigit(f)) >>> 0;
          const g = 0 | e / b;
          d = 0 | e % b, e = (d << 16 | a.__halfDigit(f - 1)) >>> 0;
          const h = 0 | e / b;
          d = 0 | e % b, c.__setDigit(f >>> 1, g << 16 | h);
        }
        return c;
      }
      static __absoluteModSmall(a, b) {
        let c = 0;
        for (let d = 2 * a.length - 1; 0 <= d; d--) {
          const e = (c << 16 | a.__halfDigit(d)) >>> 0;
          c = 0 | e % b;
        }
        return c;
      }
      static __absoluteDivLarge(a, b, d, e) {
        var f = Math.imul;
        const g = b.__halfDigitLength(), h = b.length, c = a.__halfDigitLength() - g;
        let i = null;
        d && (i = new _JSBI(c + 2 >>> 1, false), i.__initializeDigits());
        const k = new _JSBI(g + 2 >>> 1, false);
        k.__initializeDigits();
        const l = _JSBI.__clz16(b.__halfDigit(g - 1));
        0 < l && (b = _JSBI.__specialLeftShift(b, l, 0));
        const m = _JSBI.__specialLeftShift(a, l, 1), n = b.__halfDigit(g - 1);
        let o = 0;
        for (let l2, p = c; 0 <= p; p--) {
          l2 = 65535;
          const a2 = m.__halfDigit(p + g);
          if (a2 !== n) {
            const c2 = (a2 << 16 | m.__halfDigit(p + g - 1)) >>> 0;
            l2 = 0 | c2 / n;
            let d2 = 0 | c2 % n;
            const e3 = b.__halfDigit(g - 2), h2 = m.__halfDigit(p + g - 2);
            for (; f(l2, e3) >>> 0 > (d2 << 16 | h2) >>> 0 && (l2--, d2 += n, !(65535 < d2)); )
              ;
          }
          _JSBI.__internalMultiplyAdd(b, l2, 0, h, k);
          let e2 = m.__inplaceSub(k, p, g + 1);
          0 !== e2 && (e2 = m.__inplaceAdd(b, p, g), m.__setHalfDigit(p + g, m.__halfDigit(p + g) + e2), l2--), d && (1 & p ? o = l2 << 16 : i.__setDigit(p >>> 1, o | l2));
        }
        return e ? (m.__inplaceRightShift(l), d ? { quotient: i, remainder: m } : m) : d ? i : void 0;
      }
      static __clz16(a) {
        return Math.clz32(a) - 16;
      }
      __inplaceAdd(a, b, c) {
        let d = 0;
        for (let e = 0; e < c; e++) {
          const c2 = this.__halfDigit(b + e) + a.__halfDigit(e) + d;
          d = c2 >>> 16, this.__setHalfDigit(b + e, c2);
        }
        return d;
      }
      __inplaceSub(a, b, c) {
        let d = 0;
        if (1 & b) {
          b >>= 1;
          let e = this.__digit(b), f = 65535 & e, g = 0;
          for (; g < c - 1 >>> 1; g++) {
            const c2 = a.__digit(g), h2 = (e >>> 16) - (65535 & c2) - d;
            d = 1 & h2 >>> 16, this.__setDigit(b + g, h2 << 16 | 65535 & f), e = this.__digit(b + g + 1), f = (65535 & e) - (c2 >>> 16) - d, d = 1 & f >>> 16;
          }
          const h = a.__digit(g), i = (e >>> 16) - (65535 & h) - d;
          d = 1 & i >>> 16, this.__setDigit(b + g, i << 16 | 65535 & f);
          if (b + g + 1 >= this.length)
            throw new RangeError("out of bounds");
          0 == (1 & c) && (e = this.__digit(b + g + 1), f = (65535 & e) - (h >>> 16) - d, d = 1 & f >>> 16, this.__setDigit(b + a.length, 4294901760 & e | 65535 & f));
        } else {
          b >>= 1;
          let e = 0;
          for (; e < a.length - 1; e++) {
            const c2 = this.__digit(b + e), f2 = a.__digit(e), g2 = (65535 & c2) - (65535 & f2) - d;
            d = 1 & g2 >>> 16;
            const h2 = (c2 >>> 16) - (f2 >>> 16) - d;
            d = 1 & h2 >>> 16, this.__setDigit(b + e, h2 << 16 | 65535 & g2);
          }
          const f = this.__digit(b + e), g = a.__digit(e), h = (65535 & f) - (65535 & g) - d;
          d = 1 & h >>> 16;
          let i = 0;
          0 == (1 & c) && (i = (f >>> 16) - (g >>> 16) - d, d = 1 & i >>> 16), this.__setDigit(b + e, i << 16 | 65535 & h);
        }
        return d;
      }
      __inplaceRightShift(a) {
        if (0 === a)
          return;
        let b = this.__digit(0) >>> a;
        const c = this.length - 1;
        for (let e = 0; e < c; e++) {
          const c2 = this.__digit(e + 1);
          this.__setDigit(e, c2 << 32 - a | b), b = c2 >>> a;
        }
        this.__setDigit(c, b);
      }
      static __specialLeftShift(a, b, c) {
        const d = a.length, e = new _JSBI(d + c, false);
        if (0 === b) {
          for (let b2 = 0; b2 < d; b2++)
            e.__setDigit(b2, a.__digit(b2));
          return 0 < c && e.__setDigit(d, 0), e;
        }
        let f = 0;
        for (let g = 0; g < d; g++) {
          const c2 = a.__digit(g);
          e.__setDigit(g, c2 << b | f), f = c2 >>> 32 - b;
        }
        return 0 < c && e.__setDigit(d, f), e;
      }
      static __leftShiftByAbsolute(a, b) {
        const c = _JSBI.__toShiftAmount(b);
        if (0 > c)
          throw new RangeError("BigInt too big");
        const e = c >>> 5, f = 31 & c, g = a.length, h = 0 !== f && 0 != a.__digit(g - 1) >>> 32 - f, j = g + e + (h ? 1 : 0), k = new _JSBI(j, a.sign);
        if (0 === f) {
          let b2 = 0;
          for (; b2 < e; b2++)
            k.__setDigit(b2, 0);
          for (; b2 < j; b2++)
            k.__setDigit(b2, a.__digit(b2 - e));
        } else {
          let b2 = 0;
          for (let a2 = 0; a2 < e; a2++)
            k.__setDigit(a2, 0);
          for (let c2 = 0; c2 < g; c2++) {
            const g2 = a.__digit(c2);
            k.__setDigit(c2 + e, g2 << f | b2), b2 = g2 >>> 32 - f;
          }
          if (h)
            k.__setDigit(g + e, b2);
          else if (0 != b2)
            throw new Error("implementation bug");
        }
        return k.__trim();
      }
      static __rightShiftByAbsolute(a, b) {
        const c = a.length, d = a.sign, e = _JSBI.__toShiftAmount(b);
        if (0 > e)
          return _JSBI.__rightShiftByMaximum(d);
        const f = e >>> 5, g = 31 & e;
        let h = c - f;
        if (0 >= h)
          return _JSBI.__rightShiftByMaximum(d);
        let i = false;
        if (d) {
          if (0 != (a.__digit(f) & (1 << g) - 1))
            i = true;
          else
            for (let b2 = 0; b2 < f; b2++)
              if (0 !== a.__digit(b2)) {
                i = true;
                break;
              }
        }
        if (i && 0 === g) {
          const b2 = a.__digit(c - 1);
          0 == ~b2 && h++;
        }
        let j = new _JSBI(h, d);
        if (0 === g)
          for (let b2 = f; b2 < c; b2++)
            j.__setDigit(b2 - f, a.__digit(b2));
        else {
          let b2 = a.__digit(f) >>> g;
          const d2 = c - f - 1;
          for (let c2 = 0; c2 < d2; c2++) {
            const e2 = a.__digit(c2 + f + 1);
            j.__setDigit(c2, e2 << 32 - g | b2), b2 = e2 >>> g;
          }
          j.__setDigit(d2, b2);
        }
        return i && (j = _JSBI.__absoluteAddOne(j, true, j)), j.__trim();
      }
      static __rightShiftByMaximum(a) {
        return a ? _JSBI.__oneDigit(1, true) : _JSBI.__zero();
      }
      static __toShiftAmount(a) {
        if (1 < a.length)
          return -1;
        const b = a.__unsignedDigit(0);
        return b > _JSBI.__kMaxLengthBits ? -1 : b;
      }
      static __toPrimitive(a, b = "default") {
        if ("object" != typeof a)
          return a;
        if (a.constructor === _JSBI)
          return a;
        const c = a[Symbol.toPrimitive];
        if (c) {
          const a2 = c(b);
          if ("object" != typeof a2)
            return a2;
          throw new TypeError("Cannot convert object to primitive value");
        }
        const d = a.valueOf;
        if (d) {
          const b2 = d.call(a);
          if ("object" != typeof b2)
            return b2;
        }
        const e = a.toString;
        if (e) {
          const b2 = e.call(a);
          if ("object" != typeof b2)
            return b2;
        }
        throw new TypeError("Cannot convert object to primitive value");
      }
      static __toNumeric(a) {
        return _JSBI.__isBigInt(a) ? a : +a;
      }
      static __isBigInt(a) {
        return "object" == typeof a && a.constructor === _JSBI;
      }
      __digit(a) {
        return this[a];
      }
      __unsignedDigit(a) {
        return this[a] >>> 0;
      }
      __setDigit(a, b) {
        this[a] = 0 | b;
      }
      __setDigitGrow(a, b) {
        this[a] = 0 | b;
      }
      __halfDigitLength() {
        const a = this.length;
        return 65535 >= this.__unsignedDigit(a - 1) ? 2 * a - 1 : 2 * a;
      }
      __halfDigit(a) {
        return 65535 & this[a >>> 1] >>> ((1 & a) << 4);
      }
      __setHalfDigit(a, b) {
        const c = a >>> 1, d = this.__digit(c), e = 1 & a ? 65535 & d | b << 16 : 4294901760 & d | 65535 & b;
        this.__setDigit(c, e);
      }
      static __digitPow(a, b) {
        let c = 1;
        for (; 0 < b; )
          1 & b && (c *= a), b >>>= 1, a *= a;
        return c;
      }
    };
    JSBI.__kMaxLength = 33554432, JSBI.__kMaxLengthBits = JSBI.__kMaxLength << 5, JSBI.__kMaxBitsPerChar = [0, 0, 32, 51, 64, 75, 83, 90, 96, 102, 107, 111, 115, 119, 122, 126, 128, 131, 134, 136, 139, 141, 143, 145, 147, 149, 151, 153, 154, 156, 158, 159, 160, 162, 163, 165, 166], JSBI.__kBitsPerCharTableShift = 5, JSBI.__kBitsPerCharTableMultiplier = 1 << JSBI.__kBitsPerCharTableShift, JSBI.__kConversionChars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"], JSBI.__kBitConversionBuffer = new ArrayBuffer(8), JSBI.__kBitConversionDouble = new Float64Array(JSBI.__kBitConversionBuffer), JSBI.__kBitConversionInts = new Int32Array(JSBI.__kBitConversionBuffer), module2.exports = JSBI;
  }
});

// node_modules/dbus-next/lib/constants.js
var require_constants = __commonJS({
  "node_modules/dbus-next/lib/constants.js"(exports2, module2) {
    var NameFlag = class {
    };
    NameFlag.ALLOW_REPLACEMENT = 1;
    NameFlag.REPLACE_EXISTING = 2;
    NameFlag.DO_NOT_QUEUE = 4;
    var RequestNameReply = class {
    };
    RequestNameReply.PRIMARY_OWNER = 1;
    RequestNameReply.IN_QUEUE = 2;
    RequestNameReply.EXISTS = 3;
    RequestNameReply.ALREADY_OWNER = 4;
    var ReleaseNameReply = class {
    };
    ReleaseNameReply.RELEASED = 1;
    ReleaseNameReply.NON_EXISTENT = 2;
    ReleaseNameReply.NOT_OWNER = 3;
    var MessageType = class {
    };
    MessageType.METHOD_CALL = 1;
    MessageType.METHOD_RETURN = 2;
    MessageType.ERROR = 3;
    MessageType.SIGNAL = 4;
    var MessageFlag = class {
    };
    MessageFlag.NO_REPLY_EXPECTED = 1;
    MessageFlag.NO_AUTO_START = 2;
    var MAX_INT64_STR = "9223372036854775807";
    var MIN_INT64_STR = "-9223372036854775807";
    var MAX_UINT64_STR = "18446744073709551615";
    var MIN_UINT64_STR = "0";
    var _JSBIConstants = {};
    function _getJSBIConstants() {
      if (Object.keys(_JSBIConstants).length !== 0) {
        return _JSBIConstants;
      }
      const JSBI = require_jsbi_cjs();
      _JSBIConstants.MAX_INT64 = JSBI.BigInt(MAX_INT64_STR);
      _JSBIConstants.MIN_INT64 = JSBI.BigInt(MIN_INT64_STR);
      _JSBIConstants.MAX_UINT64 = JSBI.BigInt(MAX_UINT64_STR);
      _JSBIConstants.MIN_UINT64 = JSBI.BigInt(MIN_UINT64_STR);
      return _JSBIConstants;
    }
    var _BigIntConstants = {};
    function _getBigIntConstants() {
      if (Object.keys(_BigIntConstants).length !== 0) {
        return _BigIntConstants;
      }
      _BigIntConstants.MAX_INT64 = BigInt(MAX_INT64_STR);
      _BigIntConstants.MIN_INT64 = BigInt(MIN_INT64_STR);
      _BigIntConstants.MAX_UINT64 = BigInt(MAX_UINT64_STR);
      _BigIntConstants.MIN_UINT64 = BigInt(MIN_UINT64_STR);
      return _BigIntConstants;
    }
    module2.exports = {
      MAX_INT64_STR,
      MIN_INT64_STR,
      MAX_UINT64_STR,
      MIN_UINT64_STR,
      NameFlag,
      RequestNameReply,
      ReleaseNameReply,
      MessageType,
      MessageFlag,
      headerTypeName: [
        null,
        "path",
        "interface",
        "member",
        "errorName",
        "replySerial",
        "destination",
        "sender",
        "signature",
        "unixFd"
      ],
      // TODO: merge to single hash? e.g path -> [1, 'o']
      fieldSignature: {
        path: "o",
        interface: "s",
        member: "s",
        errorName: "s",
        replySerial: "u",
        destination: "s",
        sender: "s",
        signature: "g",
        unixFd: "u"
      },
      headerTypeId: {
        path: 1,
        interface: 2,
        member: 3,
        errorName: 4,
        replySerial: 5,
        destination: 6,
        sender: 7,
        signature: 8,
        unixFd: 9
      },
      protocolVersion: 1,
      endianness: {
        le: 108,
        be: 66
      },
      messageSignature: "yyyyuua(yv)",
      defaultAuthMethods: ["EXTERNAL", "DBUS_COOKIE_SHA1", "ANONYMOUS"],
      _getJSBIConstants,
      _getBigIntConstants
    };
  }
});

// node_modules/dbus-next/lib/variant.js
var require_variant = __commonJS({
  "node_modules/dbus-next/lib/variant.js"(exports2, module2) {
    var Variant = class {
      /**
      * Construct a new `Variant` with the given signature and value.
      * @param {string} signature - a DBus type signature for the `Variant`.
      * @param {any} value - the value of the `Variant` with type specified by the type signature.
      */
      constructor(signature, value) {
        this.signature = signature;
        this.value = value;
      }
    };
    module2.exports = {
      Variant
    };
  }
});

// node_modules/dbus-next/lib/validators.js
var require_validators = __commonJS({
  "node_modules/dbus-next/lib/validators.js"(exports2, module2) {
    var busNameRe = /^[A-Za-z_-][A-Za-z0-9_-]*$/;
    function isBusNameValid(name) {
      if (typeof name !== "string") {
        return false;
      }
      if (name.startsWith(":")) {
        return true;
      }
      return !!(name.length > 0 && name.length <= 255 && name[0] !== "." && name.indexOf(".") !== -1 && name.split(".").every((n) => n && busNameRe.test(n)));
    }
    function assertBusNameValid(name) {
      if (!isBusNameValid(name)) {
        throw new Error(`Invalid bus name: ${name}`);
      }
    }
    var pathRe = /^[A-Za-z0-9_]+$/;
    function isObjectPathValid(path) {
      return !!(typeof path === "string" && path && path[0] === "/" && (path.length === 1 || path[path.length - 1] !== "/" && path.split("/").slice(1).every((p) => p && pathRe.test(p))));
    }
    function assertObjectPathValid(path) {
      if (!isObjectPathValid(path)) {
        throw new Error(`Invalid object path: ${path}`);
      }
    }
    var elementRe = /^[A-Za-z_][A-Za-z0-9_]*$/;
    function isInterfaceNameValid(name) {
      return !!(typeof name === "string" && name && name.length > 0 && name.length <= 255 && name[0] !== "." && name.indexOf(".") !== -1 && name.split(".").every((n) => n && elementRe.test(n)));
    }
    function assertInterfaceNameValid(name) {
      if (!isInterfaceNameValid(name)) {
        throw new Error(`Invalid interface name: ${name}`);
      }
    }
    function isMemberNameValid(name) {
      return !!(typeof name === "string" && name && name.length > 0 && name.length <= 255 && elementRe.test(name));
    }
    function assertMemberNameValid(name) {
      if (!assertMemberNameValid) {
        throw new Error(`Invalid member name: ${name}`);
      }
    }
    module2.exports = {
      isBusNameValid,
      assertBusNameValid,
      isObjectPathValid,
      assertObjectPathValid,
      isInterfaceNameValid,
      assertInterfaceNameValid,
      isMemberNameValid,
      assertMemberNameValid
    };
  }
});

// node_modules/dbus-next/lib/message-type.js
var require_message_type = __commonJS({
  "node_modules/dbus-next/lib/message-type.js"(exports2, module2) {
    var {
      assertBusNameValid,
      assertInterfaceNameValid,
      assertObjectPathValid,
      assertMemberNameValid
    } = require_validators();
    var {
      METHOD_CALL,
      METHOD_RETURN,
      ERROR,
      SIGNAL
    } = require_constants().MessageType;
    var Message = class _Message {
      /**
       * Construct a new `Message` to send on the bus.
       */
      constructor(msg) {
        this.type = msg.type ? msg.type : METHOD_CALL;
        this._sent = false;
        this._serial = isNaN(msg.serial) ? null : msg.serial;
        this.path = msg.path;
        this.interface = msg.interface;
        this.member = msg.member;
        this.errorName = msg.errorName;
        this.replySerial = msg.replySerial;
        this.destination = msg.destination;
        this.sender = msg.sender;
        this.signature = msg.signature || "";
        this.body = msg.body || [];
        this.flags = msg.flags || 0;
        if (this.destination) {
          assertBusNameValid(this.destination);
        }
        if (this.interface) {
          assertInterfaceNameValid(this.interface);
        }
        if (this.path) {
          assertObjectPathValid(this.path);
        }
        if (this.member) {
          assertMemberNameValid(this.member);
        }
        if (this.errorName) {
          assertInterfaceNameValid(this.errorName);
        }
        const requireFields = (...fields) => {
          for (const field of fields) {
            if (this[field] === void 0) {
              throw new Error(`Message is missing a required field: ${field}`);
            }
          }
        };
        switch (this.type) {
          case METHOD_CALL:
            requireFields("path", "member");
            break;
          case SIGNAL:
            requireFields("path", "member", "interface");
            break;
          case ERROR:
            requireFields("errorName", "replySerial");
            break;
          case METHOD_RETURN:
            requireFields("replySerial");
            break;
          default:
            throw new Error(`Got unknown message type: ${this.type}`);
        }
      }
      /**
        * @member {int} - The serial of the message to track through the bus.  You
        * must use {@link MessageBus#newSerial} to get this serial. If not set, it
        * will be set automatically when the message is sent.
        */
      get serial() {
        return this._serial;
      }
      set serial(value) {
        this._sent = false;
        this._serial = value;
      }
      /**
       * Construct a new `Message` of type `ERROR` in reply to the given `Message`.
       *
       * @param {Message} msg - The `Message` this error is in reply to.
       * @param {string} errorName - The name of the error. Must be a valid
       * interface name.
       * @param {string} [errorText='An error occurred.'] - An error message for
       * the error.
       */
      static newError(msg, errorName, errorText = "An error occurred.") {
        assertInterfaceNameValid(errorName);
        return new _Message({
          type: ERROR,
          replySerial: msg.serial,
          destination: msg.sender,
          errorName,
          signature: "s",
          body: [errorText]
        });
      }
      /**
       * Construct a new `Message` of type `METHOD_RETURN` in reply to the given
       * message.
       *
       * @param {Message} msg - The `Message` this `Message` is in reply to.
       * @param {string} signature - The signature for the message body.
       * @param {Array} body - The body of the message as an array of arguments.
       * Must match the signature.
       */
      static newMethodReturn(msg, signature = "", body = []) {
        return new _Message({
          type: METHOD_RETURN,
          replySerial: msg.serial,
          destination: msg.sender,
          signature,
          body
        });
      }
      /**
       * Construct a new `Message` of type `SIGNAL` to broadcast on the bus.
       *
       * @param {string} path - The object path of this signal.
       * @param {string} iface - The interface of this signal.
       * @param {string} signature - The signature of the message body.
       * @param {Array] body - The body of the message as an array of arguments.
       * Must match the signature.
       */
      static newSignal(path, iface, name, signature = "", body = []) {
        return new _Message({
          type: SIGNAL,
          interface: iface,
          path,
          member: name,
          signature,
          body
        });
      }
    };
    module2.exports = {
      Message
    };
  }
});

// node_modules/dbus-next/lib/signature.js
var require_signature = __commonJS({
  "node_modules/dbus-next/lib/signature.js"(exports2, module2) {
    var match = {
      "{": "}",
      "(": ")"
    };
    var knownTypes = {};
    "(){}ybnqiuxtdsogarvehm*?@&^".split("").forEach(function(c) {
      knownTypes[c] = true;
    });
    function parseSignature(signature) {
      let index = 0;
      function next() {
        if (index < signature.length) {
          const c2 = signature[index];
          ++index;
          return c2;
        }
        return null;
      }
      function parseOne(c2) {
        function checkNotEnd(c3) {
          if (!c3) {
            throw new Error("Bad signature: unexpected end");
          }
          return c3;
        }
        if (!knownTypes[c2]) {
          throw new Error(`Unknown type: "${c2}" in signature "${signature}"`);
        }
        let ele;
        const res = { type: c2, child: [] };
        switch (c2) {
          case "a":
            ele = next();
            checkNotEnd(ele);
            res.child.push(parseOne(ele));
            return res;
          case "{":
          case "(":
            while ((ele = next()) !== null && ele !== match[c2]) {
              res.child.push(parseOne(ele));
            }
            checkNotEnd(ele);
            return res;
        }
        return res;
      }
      const ret = [];
      let c;
      while ((c = next()) !== null) {
        ret.push(parseOne(c));
      }
      return ret;
    }
    function collapseSignature(value) {
      if (value.child.length === 0) {
        return value.type;
      }
      let type = value.type;
      for (let i = 0; i < value.child.length; ++i) {
        type += collapseSignature(value.child[i]);
      }
      if (type[0] === "{") {
        type += "}";
      } else if (type[0] === "(") {
        type += ")";
      }
      return type;
    }
    module2.exports = {
      parseSignature,
      collapseSignature
    };
  }
});

// node_modules/dbus-next/lib/service/interface.js
var require_interface = __commonJS({
  "node_modules/dbus-next/lib/service/interface.js"(exports2, module2) {
    var { parseSignature, collapseSignature } = require_signature();
    var variant = require_variant();
    var Variant = variant.Variant;
    var ACCESS_READ = "read";
    var ACCESS_WRITE = "write";
    var ACCESS_READWRITE = "readwrite";
    var EventEmitter = require("events");
    var {
      assertInterfaceNameValid,
      assertMemberNameValid
    } = require_validators();
    function property(options) {
      options.access = options.access || ACCESS_READWRITE;
      if (!options.signature) {
        throw new Error("missing signature for property");
      }
      options.signatureTree = parseSignature(options.signature);
      return function(descriptor) {
        options.name = options.name || descriptor.key;
        assertMemberNameValid(options.name);
        descriptor.finisher = function(klass) {
          klass.prototype.$properties = klass.prototype.$properties || [];
          klass.prototype.$properties[descriptor.key] = options;
        };
        return descriptor;
      };
    }
    function method(options) {
      options.disabled = !!options.disabled;
      options.inSignature = options.inSignature || "";
      options.outSignature = options.outSignature || "";
      options.inSignatureTree = parseSignature(options.inSignature);
      options.outSignatureTree = parseSignature(options.outSignature);
      return function(descriptor) {
        options.name = options.name || descriptor.key;
        assertMemberNameValid(options.name);
        options.fn = descriptor.descriptor.value;
        descriptor.finisher = function(klass) {
          klass.prototype.$methods = klass.prototype.$methods || [];
          klass.prototype.$methods[descriptor.key] = options;
        };
        return descriptor;
      };
    }
    function signal(options) {
      options.signature = options.signature || "";
      options.signatureTree = parseSignature(options.signature);
      return function(descriptor) {
        options.name = options.name || descriptor.key;
        assertMemberNameValid(options.name);
        options.fn = descriptor.descriptor.value;
        descriptor.descriptor.value = function() {
          if (options.disabled) {
            throw new Error("tried to call a disabled signal");
          }
          const result = options.fn.apply(this, arguments);
          this.$emitter.emit("signal", options, result);
        };
        descriptor.finisher = function(klass) {
          klass.prototype.$signals = klass.prototype.$signals || [];
          klass.prototype.$signals[descriptor.key] = options;
        };
        return descriptor;
      };
    }
    var Interface = class {
      /**
       * Create an interface. This should be called with the name of the interface
       * in the class that extends it.
       */
      constructor(name) {
        assertInterfaceNameValid(name);
        this.$name = name;
        this.$emitter = new EventEmitter();
      }
      /**
       * An alternative to the decorator functions to configure
       * [`Interface`]{@link module:interface~Interface} DBus members when
       * decorators cannot be supported.
       *
       * *Calling this method twice on the same `Interface` or mixing this method
       * with the decorator interface will result in undefined behavior that may be
       * specified at a future time.*
       *
       * @static
       * @example
       * ConfiguredInterface.configureMembers({
       *   properties: {
       *     SomeProperty: {
       *       signature: 's'
       *     }
       *   },
       *   methods: {
       *     Echo: {
       *       inSignature: 'v',
       *       outSignature: 'v'
       *     }
       *   },
       *   signals: {
       *     HelloWorld: {
       *       signature: 'ss'
       *     }
       *   }
       * });
       *
       * @param members {Object} - Member configuration object.
       * @param members.properties {Object} - The class methods to define as
       * properties. The key should be a method defined on the class and the value
       * should be the options for a [property]{@link module:interface.property}
       * decorator.
       * @param members.methods {Object} - The class methods to define as DBus
       * methods. The key should be a method defined on the class and the value
       * should be the options for a [method]{@link module:interface.method}
       * decorator.
       * @param members.signals {Object} - The class methods to define as signals.
       * The key should be a method defined on the class and hte value should be
       * options for a [signal]{@link module:interface.signal} decorator.
       */
      static configureMembers(members) {
        const properties = members.properties || {};
        const methods = members.methods || {};
        const signals = members.signals || {};
        this.prototype.$properties = {};
        this.prototype.$methods = {};
        this.prototype.$signals = {};
        for (const k of Object.keys(properties)) {
          const options = properties[k];
          options.name = options.name || k;
          options.access = options.access || ACCESS_READWRITE;
          if (!options.signature) {
            throw new Error("missing signature for property");
          }
          options.signatureTree = parseSignature(options.signature);
          assertMemberNameValid(options.name);
          this.prototype.$properties[options.name] = options;
        }
        for (const k of Object.keys(methods)) {
          const options = methods[k];
          options.name = options.name || k;
          assertMemberNameValid(options.name);
          options.disabled = !!options.disabled;
          options.inSignature = options.inSignature || "";
          options.outSignature = options.outSignature || "";
          options.inSignatureTree = parseSignature(options.inSignature);
          options.outSignatureTree = parseSignature(options.outSignature);
          options.fn = this.prototype[k];
          this.prototype.$methods[options.name] = options;
        }
        for (const k of Object.keys(signals)) {
          const options = signals[k];
          options.name = options.name || k;
          assertMemberNameValid(options.name);
          options.fn = this.prototype[k];
          options.signature = options.signature || "";
          options.signatureTree = parseSignature(options.signature);
          this.prototype[k] = function() {
            if (options.disabled) {
              throw new Error("tried to call a disabled signal");
            }
            const result = options.fn.apply(this, arguments);
            this.$emitter.emit("signal", options, result);
          };
          this.prototype.$signals[options.name] = options;
        }
      }
      /**
       * Emit the `PropertiesChanged` signal on an [`Interface`s]{@link
       * module:interface~Interface} associated standard
       * `org.freedesktop.DBus.Properties` interface with a map of new values and
       * invalidated properties. Pass the properties as JavaScript values.
       *
       * @static
       * @example
       * Interface.emitPropertiesChanged({ SomeProperty: 'bar' }, ['InvalidedProperty']);
       *
       * @param {module:interface~Interface} - the `Interface` to emit the `PropertiesChanged` signal on
       * @param {Object} - A map of property names and new property values that are changed.
       * @param {string[]} - A list of invalidated properties.
       */
      static emitPropertiesChanged(iface, changedProperties, invalidatedProperties = []) {
        if (!Array.isArray(invalidatedProperties) || !invalidatedProperties.every((p) => typeof p === "string")) {
          throw new Error("invalidated properties must be an array of strings");
        }
        const properties = iface.$properties || {};
        const changedPropertiesVariants = {};
        for (const p of Object.keys(changedProperties)) {
          if (properties[p] === void 0) {
            throw new Error(`got properties changed with unknown property: ${p}`);
          }
          changedPropertiesVariants[p] = new Variant(properties[p].signature, changedProperties[p]);
        }
        iface.$emitter.emit("properties-changed", changedPropertiesVariants, invalidatedProperties);
      }
      $introspect() {
        const xml = {
          $: {
            name: this.$name
          }
        };
        const properties = this.$properties || {};
        for (const p of Object.keys(properties) || []) {
          const property2 = properties[p];
          if (property2.disabled) {
            continue;
          }
          xml.property = xml.property || [];
          xml.property.push({
            $: {
              name: property2.name,
              type: property2.signature,
              access: property2.access
            }
          });
        }
        const methods = this.$methods || {};
        for (const m of Object.keys(methods) || []) {
          const method2 = methods[m];
          if (method2.disabled) {
            continue;
          }
          xml.method = xml.method || [];
          const methodXml = {
            $: {
              name: method2.name
            },
            arg: [],
            annotation: []
          };
          for (const signature of method2.inSignatureTree) {
            methodXml.arg.push({
              $: {
                direction: "in",
                type: collapseSignature(signature)
              }
            });
          }
          for (const signature of method2.outSignatureTree) {
            methodXml.arg.push({
              $: {
                direction: "out",
                type: collapseSignature(signature)
              }
            });
          }
          if (method2.noReply) {
            methodXml.annotation.push({
              $: {
                name: "org.freedesktop.DBus.Method.NoReply",
                value: "true"
              }
            });
          }
          xml.method.push(methodXml);
        }
        const signals = this.$signals || {};
        for (const s of Object.keys(signals) || []) {
          const signal2 = signals[s];
          if (signal2.disabled) {
            continue;
          }
          xml.signal = xml.signal || [];
          const signalXml = {
            $: {
              name: signal2.name
            },
            arg: []
          };
          for (const signature of signal2.signatureTree) {
            signalXml.arg.push({
              $: {
                type: collapseSignature(signature)
              }
            });
          }
          xml.signal.push(signalXml);
        }
        return xml;
      }
    };
    module2.exports = {
      ACCESS_READ,
      ACCESS_WRITE,
      ACCESS_READWRITE,
      property,
      method,
      signal,
      Interface
    };
  }
});

// node_modules/dbus-next/lib/errors.js
var require_errors = __commonJS({
  "node_modules/dbus-next/lib/errors.js"(exports2, module2) {
    var { assertInterfaceNameValid } = require_validators();
    var DBusError = class extends Error {
      /**
       * Construct a new `DBusError` with the given type and text.
       */
      constructor(type, text, reply = null) {
        assertInterfaceNameValid(type);
        text = text || "";
        super(text);
        this.name = "DBusError";
        this.type = type;
        this.text = text;
        this.reply = reply;
      }
    };
    module2.exports = {
      DBusError
    };
  }
});

// node_modules/dbus-next/lib/service/handlers.js
var require_handlers = __commonJS({
  "node_modules/dbus-next/lib/service/handlers.js"(exports2, module2) {
    var fs = require("fs");
    var variant = require_variant();
    var Variant = variant.Variant;
    var { Message } = require_message_type();
    var {
      isObjectPathValid,
      isInterfaceNameValid,
      isMemberNameValid
    } = require_validators();
    var {
      ACCESS_READ,
      ACCESS_WRITE,
      ACCESS_READWRITE
    } = require_interface();
    var constants = require_constants();
    var {
      METHOD_RETURN
    } = constants.MessageType;
    var { DBusError } = require_errors();
    var INVALID_ARGS = "org.freedesktop.DBus.Error.InvalidArgs";
    function sendServiceError(bus, msg, errorMessage) {
      bus.send(Message.newError(msg, "com.github.dbus_next.ServiceError", `Service error: ${errorMessage}`));
      return true;
    }
    function handleIntrospect(bus, msg, path) {
      bus.send(Message.newMethodReturn(msg, "s", [bus._introspect(path)]));
    }
    function handleGetProperty(bus, msg, path) {
      const [ifaceName, prop] = msg.body;
      if (!bus._serviceObjects[path]) {
        bus.send(Message.newError(msg, INVALID_ARGS, `Path not exported on bus: '${path}'`));
        return;
      }
      const obj = bus._getServiceObject(path);
      const iface = obj.interfaces[ifaceName];
      if (!iface) {
        bus.send(Message.newError(msg, INVALID_ARGS, `No such interface: '${ifaceName}'`));
        return;
      }
      const properties = iface.$properties || {};
      let options = null;
      let propertyKey = null;
      for (const k of Object.keys(properties)) {
        if (properties[k].name === prop && !properties[k].disabled) {
          options = properties[k];
          propertyKey = k;
          break;
        }
      }
      if (options === null) {
        bus.send(Message.newError(msg, INVALID_ARGS, `No such property: '${prop}'`));
        return;
      }
      let propertyValue = null;
      try {
        propertyValue = iface[propertyKey];
      } catch (e) {
        if (e.name === "DBusError") {
          bus.send(Message.newError(msg, e.type, e.text));
        } else {
          sendServiceError(bus, msg, `The service threw an error.
${e.stack}`);
        }
        return true;
      }
      if (propertyValue instanceof DBusError) {
        bus.send(Message.newError(msg, propertyValue.type, propertyValue.text));
        return true;
      } else if (propertyValue === void 0) {
        return sendServiceError(bus, msg, "tried to get a property that is not set: " + prop);
      }
      if (!(options.access === ACCESS_READWRITE || options.access === ACCESS_READ)) {
        bus.send(Message.newError(msg, INVALID_ARGS, `Property does not have read access: '${prop}'`));
      }
      const body = new Variant(options.signature, propertyValue);
      bus.send(Message.newMethodReturn(msg, "v", [body]));
    }
    function handleGetAllProperties(bus, msg, path) {
      const ifaceName = msg.body[0];
      if (!bus._serviceObjects[path]) {
        bus.send(Message.newError(msg, INVALID_ARGS, `Path not exported on bus: '${path}'`));
        return;
      }
      const obj = bus._getServiceObject(path);
      const iface = obj.interfaces[ifaceName];
      const result = {};
      if (iface) {
        const properties = iface.$properties || {};
        for (const k of Object.keys(properties)) {
          const p = properties[k];
          if (!(p.access === ACCESS_READ || p.access === ACCESS_READWRITE) || p.disabled) {
            continue;
          }
          let value;
          try {
            value = iface[k];
          } catch (e) {
            if (e.name === "DBusError") {
              bus.send(Message.newError(msg, e.type, e.text));
            } else {
              sendServiceError(bus, msg, `The service threw an error.
${e.stack}`);
            }
            return true;
          }
          if (value instanceof DBusError) {
            bus.send(Message.newError(msg, value.type, value.text));
            return true;
          } else if (value === void 0) {
            return sendServiceError(bus, msg, "tried to get a property that is not set: " + p);
          }
          result[p.name] = new Variant(p.signature, value);
        }
      }
      bus.send(Message.newMethodReturn(msg, "a{sv}", [result]));
    }
    function handleSetProperty(bus, msg, path) {
      const [ifaceName, prop, value] = msg.body;
      if (!bus._serviceObjects[path]) {
        bus.send(Message.newError(msg, INVALID_ARGS, `Path not exported on bus: '${path}'`));
        return;
      }
      const obj = bus._getServiceObject(path);
      const iface = obj.interfaces[ifaceName];
      if (!iface) {
        bus.send(Message.newError(msg, INVALID_ARGS, `Interface not found: '${ifaceName}'`));
        return;
      }
      const properties = iface.$properties || {};
      let options = null;
      let propertyKey = null;
      for (const k of Object.keys(properties)) {
        if (properties[k].name === prop && !properties[k].disabled) {
          options = properties[k];
          propertyKey = k;
          break;
        }
      }
      if (options === null) {
        bus.send(Message.newError(msg, INVALID_ARGS, `No such property: '${prop}'`));
        return;
      }
      if (!(options.access === ACCESS_WRITE || options.access === ACCESS_READWRITE)) {
        bus.send(Message.newError(msg, INVALID_ARGS, `Property does not have write access: '${prop}'`));
      }
      if (value.signature !== options.signature) {
        bus.send(Message.newError(msg, INVALID_ARGS, `Cannot set property '${prop}' with signature '${value.signature}' (expected '${options.signature}')`));
        return;
      }
      try {
        iface[propertyKey] = value.value;
      } catch (e) {
        if (e.name === "DBusError") {
          bus.send(Message.newError(msg, e.type, e.text));
        } else {
          sendServiceError(bus, msg, `The service threw an error.
${e.stack}`);
        }
        return true;
      }
      bus.send(Message.newMethodReturn(msg, "", []));
    }
    function handleStdIfaces(bus, msg) {
      const {
        member,
        path,
        signature
      } = msg;
      const ifaceName = msg.interface;
      if (!isInterfaceNameValid(ifaceName)) {
        bus.send(Message.newError(msg, INVALID_ARGS, `Invalid interface name: '${ifaceName}'`));
        return true;
      }
      if (!isMemberNameValid(member)) {
        bus.send(Message.newError(msg, INVALID_ARGS, `Invalid member name: '${member}'`));
        return true;
      }
      if (!isObjectPathValid(path)) {
        bus.send(Message.newError(msg, INVALID_ARGS, `Invalid path name: '${path}'`));
        return true;
      }
      if (ifaceName === "org.freedesktop.DBus.Introspectable" && member === "Introspect" && !signature) {
        handleIntrospect(bus, msg, path);
        return true;
      } else if (ifaceName === "org.freedesktop.DBus.Properties") {
        if (member === "Get" && signature === "ss") {
          handleGetProperty(bus, msg, path);
          return true;
        } else if (member === "Set" && signature === "ssv") {
          handleSetProperty(bus, msg, path);
          return true;
        } else if (member === "GetAll") {
          handleGetAllProperties(bus, msg, path);
          return true;
        }
      } else if (ifaceName === "org.freedesktop.DBus.Peer") {
        if (member === "Ping" && !signature) {
          bus._connection.message({
            type: METHOD_RETURN,
            serial: bus._serial++,
            replySerial: msg.serial,
            destination: msg.sender
          });
          return true;
        } else if (member === "GetMachineId" && !signature) {
          const machineId = fs.readFileSync("/var/lib/dbus/machine-id").toString().trim();
          bus._connection.message({
            type: METHOD_RETURN,
            serial: bus._serial++,
            replySerial: msg.serial,
            destination: msg.sender,
            signature: "s",
            body: [machineId]
          });
          return true;
        }
      }
      return false;
    }
    function handleMessage(msg, bus) {
      let {
        path,
        member,
        signature
      } = msg;
      const ifaceName = msg.interface;
      signature = signature || "";
      if (handleStdIfaces(bus, msg)) {
        return true;
      }
      if (!bus._serviceObjects[path]) {
        return false;
      }
      const obj = bus._getServiceObject(path);
      const iface = obj.interfaces[ifaceName];
      if (!iface) {
        return false;
      }
      const methods = iface.$methods || {};
      for (const m of Object.keys(methods)) {
        const method = methods[m];
        let result = null;
        const handleError = (e) => {
          if (e.name === "DBusError") {
            bus.send(Message.newError(msg, e.type, e.text));
          } else {
            sendServiceError(bus, msg, `The service threw an error.
${e.stack}`);
          }
        };
        if (method.name === member && method.inSignature === signature) {
          try {
            result = method.fn.apply(iface, msg.body);
          } catch (e) {
            handleError(e);
            return true;
          }
          const sendReply = (body) => {
            if (method.noReply)
              return;
            if (body === void 0) {
              body = [];
            } else if (method.outSignatureTree.length === 1) {
              body = [body];
            } else if (method.outSignatureTree.length === 0) {
              return sendServiceError(bus, msg, `method ${iface.$name}.${method.name} was not expected to return a body.`);
            } else if (!Array.isArray(body)) {
              return sendServiceError(bus, msg, `method ${iface.$name}.${method.name} expected to return multiple arguments in an array (signature: '${method.outSignature}')`);
            }
            if (method.outSignatureTree.length !== body.length) {
              return sendServiceError(bus, msg, `method ${iface.$name}.${m} returned the wrong number of arguments (got ${body.length} expected ${method.outSignatureTree.length}) for signature '${method.outSignature}'`);
            }
            bus.send(Message.newMethodReturn(msg, method.outSignature, body));
          };
          if (result && result.constructor === Promise) {
            result.then(sendReply).catch(handleError);
          } else {
            sendReply(result);
          }
          return true;
        }
      }
      return false;
    }
    module2.exports = handleMessage;
  }
});

// node_modules/dbus-next/lib/service/object.js
var require_object = __commonJS({
  "node_modules/dbus-next/lib/service/object.js"(exports2, module2) {
    var { Message } = require_message_type();
    var Interface = require_interface().Interface;
    var assertObjectPathValid = require_validators().assertObjectPathValid;
    var ServiceObject = class _ServiceObject {
      constructor(path, bus) {
        assertObjectPathValid(path);
        this.path = path;
        this.bus = bus;
        this.interfaces = {};
        this._handlers = {};
      }
      addInterface(iface) {
        if (!(iface instanceof Interface)) {
          throw new Error(`object.addInterface takes an Interface as the first argument (got ${iface})`);
        }
        if (this.interfaces[iface.$name]) {
          throw new Error(`an interface with name '${iface.$name}' is already exported on this object`);
        }
        this.interfaces[iface.$name] = iface;
        const that = this;
        const propertiesChangedHandler = function(changedProperties, invalidatedProperties) {
          const body = [
            iface.$name,
            changedProperties,
            invalidatedProperties
          ];
          that.bus.send(Message.newSignal(that.path, "org.freedesktop.DBus.Properties", "PropertiesChanged", "sa{sv}as", body));
        };
        const signalHandler = function(options, result) {
          const {
            signature,
            signatureTree,
            name
          } = options;
          if (result === void 0) {
            result = [];
          } else if (signatureTree.length === 1) {
            result = [result];
          } else if (!Array.isArray(result)) {
            throw new Error(`signal ${iface.$name}.${name} expected to return multiple arguments in an array (signature: '${signature}')`);
          }
          if (signatureTree.length !== result.length) {
            throw new Error(`signal ${iface.$name}.${name} returned the wrong number of arguments (got ${result.length} expected ${signatureTree.length}) for signature '${signature}'`);
          }
          that.bus.send(Message.newSignal(that.path, iface.$name, name, signature, result));
        };
        this._handlers[iface.$name] = {
          propertiesChanged: propertiesChangedHandler,
          signal: signalHandler
        };
        iface.$emitter.on("signal", signalHandler);
        iface.$emitter.on("properties-changed", propertiesChangedHandler);
      }
      removeInterface(iface) {
        if (!(iface instanceof Interface)) {
          throw new Error(`object.removeInterface takes an Interface as the first argument (got ${iface})`);
        }
        if (!this.interfaces[iface.$name]) {
          throw new Error(`Interface ${iface.$name} not exported on this object`);
        }
        const handlers = this._handlers[iface.$name];
        iface.$emitter.removeListener("signal", handlers.signal);
        iface.$emitter.removeListener("properties-changed", handlers.propertiesChanged);
        delete this._handlers[iface.$name];
        delete this.interfaces[iface.$name];
      }
      introspect() {
        const interfaces = _ServiceObject.defaultInterfaces();
        for (const i of Object.keys(this.interfaces)) {
          const iface = this.interfaces[i];
          interfaces.push(iface.$introspect());
        }
        return interfaces;
      }
      static defaultInterfaces() {
        return [
          {
            $: { name: "org.freedesktop.DBus.Introspectable" },
            method: [
              {
                $: { name: "Introspect" },
                arg: [
                  {
                    $: { name: "data", direction: "out", type: "s" }
                  }
                ]
              }
            ]
          },
          {
            $: { name: "org.freedesktop.DBus.Peer" },
            method: [
              {
                $: { name: "GetMachineId" },
                arg: [
                  { $: { direction: "out", name: "machine_uuid", type: "s" } }
                ]
              },
              {
                $: { name: "Ping" }
              }
            ]
          },
          {
            $: { name: "org.freedesktop.DBus.Properties" },
            method: [
              {
                $: { name: "Get" },
                arg: [
                  { $: { direction: "in", type: "s" } },
                  { $: { direction: "in", type: "s" } },
                  { $: { direction: "out", type: "v" } }
                ]
              },
              {
                $: { name: "Set" },
                arg: [
                  { $: { direction: "in", type: "s" } },
                  { $: { direction: "in", type: "s" } },
                  { $: { direction: "in", type: "v" } }
                ]
              },
              {
                $: { name: "GetAll" },
                arg: [
                  { $: { direction: "in", type: "s" } },
                  { $: { direction: "out", type: "a{sv}" } }
                ]
              }
            ],
            signal: [
              {
                $: { name: "PropertiesChanged" },
                arg: [
                  { $: { type: "s" } },
                  { $: { type: "a{sv}" } },
                  { $: { type: "as" } }
                ]
              }
            ]
          }
        ];
      }
    };
    module2.exports = ServiceObject;
  }
});

// node_modules/xml2js/lib/defaults.js
var require_defaults = __commonJS({
  "node_modules/xml2js/lib/defaults.js"(exports2) {
    (function() {
      exports2.defaults = {
        "0.1": {
          explicitCharkey: false,
          trim: true,
          normalize: true,
          normalizeTags: false,
          attrkey: "@",
          charkey: "#",
          explicitArray: false,
          ignoreAttrs: false,
          mergeAttrs: false,
          explicitRoot: false,
          validator: null,
          xmlns: false,
          explicitChildren: false,
          childkey: "@@",
          charsAsChildren: false,
          includeWhiteChars: false,
          async: false,
          strict: true,
          attrNameProcessors: null,
          attrValueProcessors: null,
          tagNameProcessors: null,
          valueProcessors: null,
          emptyTag: ""
        },
        "0.2": {
          explicitCharkey: false,
          trim: false,
          normalize: false,
          normalizeTags: false,
          attrkey: "$",
          charkey: "_",
          explicitArray: true,
          ignoreAttrs: false,
          mergeAttrs: false,
          explicitRoot: true,
          validator: null,
          xmlns: false,
          explicitChildren: false,
          preserveChildrenOrder: false,
          childkey: "$$",
          charsAsChildren: false,
          includeWhiteChars: false,
          async: false,
          strict: true,
          attrNameProcessors: null,
          attrValueProcessors: null,
          tagNameProcessors: null,
          valueProcessors: null,
          rootName: "root",
          xmldec: {
            "version": "1.0",
            "encoding": "UTF-8",
            "standalone": true
          },
          doctype: null,
          renderOpts: {
            "pretty": true,
            "indent": "  ",
            "newline": "\n"
          },
          headless: false,
          chunkSize: 1e4,
          emptyTag: "",
          cdata: false
        }
      };
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/Utility.js
var require_Utility = __commonJS({
  "node_modules/xmlbuilder/lib/Utility.js"(exports2, module2) {
    (function() {
      var assign, getValue, isArray, isEmpty, isFunction, isObject, isPlainObject, slice = [].slice, hasProp = {}.hasOwnProperty;
      assign = function() {
        var i, key, len, source, sources, target;
        target = arguments[0], sources = 2 <= arguments.length ? slice.call(arguments, 1) : [];
        if (isFunction(Object.assign)) {
          Object.assign.apply(null, arguments);
        } else {
          for (i = 0, len = sources.length; i < len; i++) {
            source = sources[i];
            if (source != null) {
              for (key in source) {
                if (!hasProp.call(source, key))
                  continue;
                target[key] = source[key];
              }
            }
          }
        }
        return target;
      };
      isFunction = function(val) {
        return !!val && Object.prototype.toString.call(val) === "[object Function]";
      };
      isObject = function(val) {
        var ref;
        return !!val && ((ref = typeof val) === "function" || ref === "object");
      };
      isArray = function(val) {
        if (isFunction(Array.isArray)) {
          return Array.isArray(val);
        } else {
          return Object.prototype.toString.call(val) === "[object Array]";
        }
      };
      isEmpty = function(val) {
        var key;
        if (isArray(val)) {
          return !val.length;
        } else {
          for (key in val) {
            if (!hasProp.call(val, key))
              continue;
            return false;
          }
          return true;
        }
      };
      isPlainObject = function(val) {
        var ctor, proto;
        return isObject(val) && (proto = Object.getPrototypeOf(val)) && (ctor = proto.constructor) && typeof ctor === "function" && ctor instanceof ctor && Function.prototype.toString.call(ctor) === Function.prototype.toString.call(Object);
      };
      getValue = function(obj) {
        if (isFunction(obj.valueOf)) {
          return obj.valueOf();
        } else {
          return obj;
        }
      };
      module2.exports.assign = assign;
      module2.exports.isFunction = isFunction;
      module2.exports.isObject = isObject;
      module2.exports.isArray = isArray;
      module2.exports.isEmpty = isEmpty;
      module2.exports.isPlainObject = isPlainObject;
      module2.exports.getValue = getValue;
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLDOMImplementation.js
var require_XMLDOMImplementation = __commonJS({
  "node_modules/xmlbuilder/lib/XMLDOMImplementation.js"(exports2, module2) {
    (function() {
      var XMLDOMImplementation;
      module2.exports = XMLDOMImplementation = function() {
        function XMLDOMImplementation2() {
        }
        XMLDOMImplementation2.prototype.hasFeature = function(feature, version) {
          return true;
        };
        XMLDOMImplementation2.prototype.createDocumentType = function(qualifiedName, publicId, systemId) {
          throw new Error("This DOM method is not implemented.");
        };
        XMLDOMImplementation2.prototype.createDocument = function(namespaceURI, qualifiedName, doctype) {
          throw new Error("This DOM method is not implemented.");
        };
        XMLDOMImplementation2.prototype.createHTMLDocument = function(title) {
          throw new Error("This DOM method is not implemented.");
        };
        XMLDOMImplementation2.prototype.getFeature = function(feature, version) {
          throw new Error("This DOM method is not implemented.");
        };
        return XMLDOMImplementation2;
      }();
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLDOMErrorHandler.js
var require_XMLDOMErrorHandler = __commonJS({
  "node_modules/xmlbuilder/lib/XMLDOMErrorHandler.js"(exports2, module2) {
    (function() {
      var XMLDOMErrorHandler;
      module2.exports = XMLDOMErrorHandler = function() {
        function XMLDOMErrorHandler2() {
        }
        XMLDOMErrorHandler2.prototype.handleError = function(error) {
          throw new Error(error);
        };
        return XMLDOMErrorHandler2;
      }();
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLDOMStringList.js
var require_XMLDOMStringList = __commonJS({
  "node_modules/xmlbuilder/lib/XMLDOMStringList.js"(exports2, module2) {
    (function() {
      var XMLDOMStringList;
      module2.exports = XMLDOMStringList = function() {
        function XMLDOMStringList2(arr) {
          this.arr = arr || [];
        }
        Object.defineProperty(XMLDOMStringList2.prototype, "length", {
          get: function() {
            return this.arr.length;
          }
        });
        XMLDOMStringList2.prototype.item = function(index) {
          return this.arr[index] || null;
        };
        XMLDOMStringList2.prototype.contains = function(str) {
          return this.arr.indexOf(str) !== -1;
        };
        return XMLDOMStringList2;
      }();
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLDOMConfiguration.js
var require_XMLDOMConfiguration = __commonJS({
  "node_modules/xmlbuilder/lib/XMLDOMConfiguration.js"(exports2, module2) {
    (function() {
      var XMLDOMConfiguration, XMLDOMErrorHandler, XMLDOMStringList;
      XMLDOMErrorHandler = require_XMLDOMErrorHandler();
      XMLDOMStringList = require_XMLDOMStringList();
      module2.exports = XMLDOMConfiguration = function() {
        function XMLDOMConfiguration2() {
          var clonedSelf;
          this.defaultParams = {
            "canonical-form": false,
            "cdata-sections": false,
            "comments": false,
            "datatype-normalization": false,
            "element-content-whitespace": true,
            "entities": true,
            "error-handler": new XMLDOMErrorHandler(),
            "infoset": true,
            "validate-if-schema": false,
            "namespaces": true,
            "namespace-declarations": true,
            "normalize-characters": false,
            "schema-location": "",
            "schema-type": "",
            "split-cdata-sections": true,
            "validate": false,
            "well-formed": true
          };
          this.params = clonedSelf = Object.create(this.defaultParams);
        }
        Object.defineProperty(XMLDOMConfiguration2.prototype, "parameterNames", {
          get: function() {
            return new XMLDOMStringList(Object.keys(this.defaultParams));
          }
        });
        XMLDOMConfiguration2.prototype.getParameter = function(name) {
          if (this.params.hasOwnProperty(name)) {
            return this.params[name];
          } else {
            return null;
          }
        };
        XMLDOMConfiguration2.prototype.canSetParameter = function(name, value) {
          return true;
        };
        XMLDOMConfiguration2.prototype.setParameter = function(name, value) {
          if (value != null) {
            return this.params[name] = value;
          } else {
            return delete this.params[name];
          }
        };
        return XMLDOMConfiguration2;
      }();
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/NodeType.js
var require_NodeType = __commonJS({
  "node_modules/xmlbuilder/lib/NodeType.js"(exports2, module2) {
    (function() {
      module2.exports = {
        Element: 1,
        Attribute: 2,
        Text: 3,
        CData: 4,
        EntityReference: 5,
        EntityDeclaration: 6,
        ProcessingInstruction: 7,
        Comment: 8,
        Document: 9,
        DocType: 10,
        DocumentFragment: 11,
        NotationDeclaration: 12,
        Declaration: 201,
        Raw: 202,
        AttributeDeclaration: 203,
        ElementDeclaration: 204,
        Dummy: 205
      };
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLAttribute.js
var require_XMLAttribute = __commonJS({
  "node_modules/xmlbuilder/lib/XMLAttribute.js"(exports2, module2) {
    (function() {
      var NodeType, XMLAttribute, XMLNode;
      NodeType = require_NodeType();
      XMLNode = require_XMLNode();
      module2.exports = XMLAttribute = function() {
        function XMLAttribute2(parent, name, value) {
          this.parent = parent;
          if (this.parent) {
            this.options = this.parent.options;
            this.stringify = this.parent.stringify;
          }
          if (name == null) {
            throw new Error("Missing attribute name. " + this.debugInfo(name));
          }
          this.name = this.stringify.name(name);
          this.value = this.stringify.attValue(value);
          this.type = NodeType.Attribute;
          this.isId = false;
          this.schemaTypeInfo = null;
        }
        Object.defineProperty(XMLAttribute2.prototype, "nodeType", {
          get: function() {
            return this.type;
          }
        });
        Object.defineProperty(XMLAttribute2.prototype, "ownerElement", {
          get: function() {
            return this.parent;
          }
        });
        Object.defineProperty(XMLAttribute2.prototype, "textContent", {
          get: function() {
            return this.value;
          },
          set: function(value) {
            return this.value = value || "";
          }
        });
        Object.defineProperty(XMLAttribute2.prototype, "namespaceURI", {
          get: function() {
            return "";
          }
        });
        Object.defineProperty(XMLAttribute2.prototype, "prefix", {
          get: function() {
            return "";
          }
        });
        Object.defineProperty(XMLAttribute2.prototype, "localName", {
          get: function() {
            return this.name;
          }
        });
        Object.defineProperty(XMLAttribute2.prototype, "specified", {
          get: function() {
            return true;
          }
        });
        XMLAttribute2.prototype.clone = function() {
          return Object.create(this);
        };
        XMLAttribute2.prototype.toString = function(options) {
          return this.options.writer.attribute(this, this.options.writer.filterOptions(options));
        };
        XMLAttribute2.prototype.debugInfo = function(name) {
          name = name || this.name;
          if (name == null) {
            return "parent: <" + this.parent.name + ">";
          } else {
            return "attribute: {" + name + "}, parent: <" + this.parent.name + ">";
          }
        };
        XMLAttribute2.prototype.isEqualNode = function(node) {
          if (node.namespaceURI !== this.namespaceURI) {
            return false;
          }
          if (node.prefix !== this.prefix) {
            return false;
          }
          if (node.localName !== this.localName) {
            return false;
          }
          if (node.value !== this.value) {
            return false;
          }
          return true;
        };
        return XMLAttribute2;
      }();
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLNamedNodeMap.js
var require_XMLNamedNodeMap = __commonJS({
  "node_modules/xmlbuilder/lib/XMLNamedNodeMap.js"(exports2, module2) {
    (function() {
      var XMLNamedNodeMap;
      module2.exports = XMLNamedNodeMap = function() {
        function XMLNamedNodeMap2(nodes) {
          this.nodes = nodes;
        }
        Object.defineProperty(XMLNamedNodeMap2.prototype, "length", {
          get: function() {
            return Object.keys(this.nodes).length || 0;
          }
        });
        XMLNamedNodeMap2.prototype.clone = function() {
          return this.nodes = null;
        };
        XMLNamedNodeMap2.prototype.getNamedItem = function(name) {
          return this.nodes[name];
        };
        XMLNamedNodeMap2.prototype.setNamedItem = function(node) {
          var oldNode;
          oldNode = this.nodes[node.nodeName];
          this.nodes[node.nodeName] = node;
          return oldNode || null;
        };
        XMLNamedNodeMap2.prototype.removeNamedItem = function(name) {
          var oldNode;
          oldNode = this.nodes[name];
          delete this.nodes[name];
          return oldNode || null;
        };
        XMLNamedNodeMap2.prototype.item = function(index) {
          return this.nodes[Object.keys(this.nodes)[index]] || null;
        };
        XMLNamedNodeMap2.prototype.getNamedItemNS = function(namespaceURI, localName) {
          throw new Error("This DOM method is not implemented.");
        };
        XMLNamedNodeMap2.prototype.setNamedItemNS = function(node) {
          throw new Error("This DOM method is not implemented.");
        };
        XMLNamedNodeMap2.prototype.removeNamedItemNS = function(namespaceURI, localName) {
          throw new Error("This DOM method is not implemented.");
        };
        return XMLNamedNodeMap2;
      }();
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLElement.js
var require_XMLElement = __commonJS({
  "node_modules/xmlbuilder/lib/XMLElement.js"(exports2, module2) {
    (function() {
      var NodeType, XMLAttribute, XMLElement, XMLNamedNodeMap, XMLNode, getValue, isFunction, isObject, ref, extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key))
            child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      }, hasProp = {}.hasOwnProperty;
      ref = require_Utility(), isObject = ref.isObject, isFunction = ref.isFunction, getValue = ref.getValue;
      XMLNode = require_XMLNode();
      NodeType = require_NodeType();
      XMLAttribute = require_XMLAttribute();
      XMLNamedNodeMap = require_XMLNamedNodeMap();
      module2.exports = XMLElement = function(superClass) {
        extend(XMLElement2, superClass);
        function XMLElement2(parent, name, attributes) {
          var child, j, len, ref1;
          XMLElement2.__super__.constructor.call(this, parent);
          if (name == null) {
            throw new Error("Missing element name. " + this.debugInfo());
          }
          this.name = this.stringify.name(name);
          this.type = NodeType.Element;
          this.attribs = {};
          this.schemaTypeInfo = null;
          if (attributes != null) {
            this.attribute(attributes);
          }
          if (parent.type === NodeType.Document) {
            this.isRoot = true;
            this.documentObject = parent;
            parent.rootObject = this;
            if (parent.children) {
              ref1 = parent.children;
              for (j = 0, len = ref1.length; j < len; j++) {
                child = ref1[j];
                if (child.type === NodeType.DocType) {
                  child.name = this.name;
                  break;
                }
              }
            }
          }
        }
        Object.defineProperty(XMLElement2.prototype, "tagName", {
          get: function() {
            return this.name;
          }
        });
        Object.defineProperty(XMLElement2.prototype, "namespaceURI", {
          get: function() {
            return "";
          }
        });
        Object.defineProperty(XMLElement2.prototype, "prefix", {
          get: function() {
            return "";
          }
        });
        Object.defineProperty(XMLElement2.prototype, "localName", {
          get: function() {
            return this.name;
          }
        });
        Object.defineProperty(XMLElement2.prototype, "id", {
          get: function() {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          }
        });
        Object.defineProperty(XMLElement2.prototype, "className", {
          get: function() {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          }
        });
        Object.defineProperty(XMLElement2.prototype, "classList", {
          get: function() {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          }
        });
        Object.defineProperty(XMLElement2.prototype, "attributes", {
          get: function() {
            if (!this.attributeMap || !this.attributeMap.nodes) {
              this.attributeMap = new XMLNamedNodeMap(this.attribs);
            }
            return this.attributeMap;
          }
        });
        XMLElement2.prototype.clone = function() {
          var att, attName, clonedSelf, ref1;
          clonedSelf = Object.create(this);
          if (clonedSelf.isRoot) {
            clonedSelf.documentObject = null;
          }
          clonedSelf.attribs = {};
          ref1 = this.attribs;
          for (attName in ref1) {
            if (!hasProp.call(ref1, attName))
              continue;
            att = ref1[attName];
            clonedSelf.attribs[attName] = att.clone();
          }
          clonedSelf.children = [];
          this.children.forEach(function(child) {
            var clonedChild;
            clonedChild = child.clone();
            clonedChild.parent = clonedSelf;
            return clonedSelf.children.push(clonedChild);
          });
          return clonedSelf;
        };
        XMLElement2.prototype.attribute = function(name, value) {
          var attName, attValue;
          if (name != null) {
            name = getValue(name);
          }
          if (isObject(name)) {
            for (attName in name) {
              if (!hasProp.call(name, attName))
                continue;
              attValue = name[attName];
              this.attribute(attName, attValue);
            }
          } else {
            if (isFunction(value)) {
              value = value.apply();
            }
            if (this.options.keepNullAttributes && value == null) {
              this.attribs[name] = new XMLAttribute(this, name, "");
            } else if (value != null) {
              this.attribs[name] = new XMLAttribute(this, name, value);
            }
          }
          return this;
        };
        XMLElement2.prototype.removeAttribute = function(name) {
          var attName, j, len;
          if (name == null) {
            throw new Error("Missing attribute name. " + this.debugInfo());
          }
          name = getValue(name);
          if (Array.isArray(name)) {
            for (j = 0, len = name.length; j < len; j++) {
              attName = name[j];
              delete this.attribs[attName];
            }
          } else {
            delete this.attribs[name];
          }
          return this;
        };
        XMLElement2.prototype.toString = function(options) {
          return this.options.writer.element(this, this.options.writer.filterOptions(options));
        };
        XMLElement2.prototype.att = function(name, value) {
          return this.attribute(name, value);
        };
        XMLElement2.prototype.a = function(name, value) {
          return this.attribute(name, value);
        };
        XMLElement2.prototype.getAttribute = function(name) {
          if (this.attribs.hasOwnProperty(name)) {
            return this.attribs[name].value;
          } else {
            return null;
          }
        };
        XMLElement2.prototype.setAttribute = function(name, value) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLElement2.prototype.getAttributeNode = function(name) {
          if (this.attribs.hasOwnProperty(name)) {
            return this.attribs[name];
          } else {
            return null;
          }
        };
        XMLElement2.prototype.setAttributeNode = function(newAttr) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLElement2.prototype.removeAttributeNode = function(oldAttr) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLElement2.prototype.getElementsByTagName = function(name) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLElement2.prototype.getAttributeNS = function(namespaceURI, localName) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLElement2.prototype.setAttributeNS = function(namespaceURI, qualifiedName, value) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLElement2.prototype.removeAttributeNS = function(namespaceURI, localName) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLElement2.prototype.getAttributeNodeNS = function(namespaceURI, localName) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLElement2.prototype.setAttributeNodeNS = function(newAttr) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLElement2.prototype.getElementsByTagNameNS = function(namespaceURI, localName) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLElement2.prototype.hasAttribute = function(name) {
          return this.attribs.hasOwnProperty(name);
        };
        XMLElement2.prototype.hasAttributeNS = function(namespaceURI, localName) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLElement2.prototype.setIdAttribute = function(name, isId) {
          if (this.attribs.hasOwnProperty(name)) {
            return this.attribs[name].isId;
          } else {
            return isId;
          }
        };
        XMLElement2.prototype.setIdAttributeNS = function(namespaceURI, localName, isId) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLElement2.prototype.setIdAttributeNode = function(idAttr, isId) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLElement2.prototype.getElementsByTagName = function(tagname) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLElement2.prototype.getElementsByTagNameNS = function(namespaceURI, localName) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLElement2.prototype.getElementsByClassName = function(classNames) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLElement2.prototype.isEqualNode = function(node) {
          var i, j, ref1;
          if (!XMLElement2.__super__.isEqualNode.apply(this, arguments).isEqualNode(node)) {
            return false;
          }
          if (node.namespaceURI !== this.namespaceURI) {
            return false;
          }
          if (node.prefix !== this.prefix) {
            return false;
          }
          if (node.localName !== this.localName) {
            return false;
          }
          if (node.attribs.length !== this.attribs.length) {
            return false;
          }
          for (i = j = 0, ref1 = this.attribs.length - 1; 0 <= ref1 ? j <= ref1 : j >= ref1; i = 0 <= ref1 ? ++j : --j) {
            if (!this.attribs[i].isEqualNode(node.attribs[i])) {
              return false;
            }
          }
          return true;
        };
        return XMLElement2;
      }(XMLNode);
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLCharacterData.js
var require_XMLCharacterData = __commonJS({
  "node_modules/xmlbuilder/lib/XMLCharacterData.js"(exports2, module2) {
    (function() {
      var XMLCharacterData, XMLNode, extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key))
            child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      }, hasProp = {}.hasOwnProperty;
      XMLNode = require_XMLNode();
      module2.exports = XMLCharacterData = function(superClass) {
        extend(XMLCharacterData2, superClass);
        function XMLCharacterData2(parent) {
          XMLCharacterData2.__super__.constructor.call(this, parent);
          this.value = "";
        }
        Object.defineProperty(XMLCharacterData2.prototype, "data", {
          get: function() {
            return this.value;
          },
          set: function(value) {
            return this.value = value || "";
          }
        });
        Object.defineProperty(XMLCharacterData2.prototype, "length", {
          get: function() {
            return this.value.length;
          }
        });
        Object.defineProperty(XMLCharacterData2.prototype, "textContent", {
          get: function() {
            return this.value;
          },
          set: function(value) {
            return this.value = value || "";
          }
        });
        XMLCharacterData2.prototype.clone = function() {
          return Object.create(this);
        };
        XMLCharacterData2.prototype.substringData = function(offset, count) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLCharacterData2.prototype.appendData = function(arg) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLCharacterData2.prototype.insertData = function(offset, arg) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLCharacterData2.prototype.deleteData = function(offset, count) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLCharacterData2.prototype.replaceData = function(offset, count, arg) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLCharacterData2.prototype.isEqualNode = function(node) {
          if (!XMLCharacterData2.__super__.isEqualNode.apply(this, arguments).isEqualNode(node)) {
            return false;
          }
          if (node.data !== this.data) {
            return false;
          }
          return true;
        };
        return XMLCharacterData2;
      }(XMLNode);
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLCData.js
var require_XMLCData = __commonJS({
  "node_modules/xmlbuilder/lib/XMLCData.js"(exports2, module2) {
    (function() {
      var NodeType, XMLCData, XMLCharacterData, extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key))
            child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      }, hasProp = {}.hasOwnProperty;
      NodeType = require_NodeType();
      XMLCharacterData = require_XMLCharacterData();
      module2.exports = XMLCData = function(superClass) {
        extend(XMLCData2, superClass);
        function XMLCData2(parent, text) {
          XMLCData2.__super__.constructor.call(this, parent);
          if (text == null) {
            throw new Error("Missing CDATA text. " + this.debugInfo());
          }
          this.name = "#cdata-section";
          this.type = NodeType.CData;
          this.value = this.stringify.cdata(text);
        }
        XMLCData2.prototype.clone = function() {
          return Object.create(this);
        };
        XMLCData2.prototype.toString = function(options) {
          return this.options.writer.cdata(this, this.options.writer.filterOptions(options));
        };
        return XMLCData2;
      }(XMLCharacterData);
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLComment.js
var require_XMLComment = __commonJS({
  "node_modules/xmlbuilder/lib/XMLComment.js"(exports2, module2) {
    (function() {
      var NodeType, XMLCharacterData, XMLComment, extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key))
            child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      }, hasProp = {}.hasOwnProperty;
      NodeType = require_NodeType();
      XMLCharacterData = require_XMLCharacterData();
      module2.exports = XMLComment = function(superClass) {
        extend(XMLComment2, superClass);
        function XMLComment2(parent, text) {
          XMLComment2.__super__.constructor.call(this, parent);
          if (text == null) {
            throw new Error("Missing comment text. " + this.debugInfo());
          }
          this.name = "#comment";
          this.type = NodeType.Comment;
          this.value = this.stringify.comment(text);
        }
        XMLComment2.prototype.clone = function() {
          return Object.create(this);
        };
        XMLComment2.prototype.toString = function(options) {
          return this.options.writer.comment(this, this.options.writer.filterOptions(options));
        };
        return XMLComment2;
      }(XMLCharacterData);
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLDeclaration.js
var require_XMLDeclaration = __commonJS({
  "node_modules/xmlbuilder/lib/XMLDeclaration.js"(exports2, module2) {
    (function() {
      var NodeType, XMLDeclaration, XMLNode, isObject, extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key))
            child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      }, hasProp = {}.hasOwnProperty;
      isObject = require_Utility().isObject;
      XMLNode = require_XMLNode();
      NodeType = require_NodeType();
      module2.exports = XMLDeclaration = function(superClass) {
        extend(XMLDeclaration2, superClass);
        function XMLDeclaration2(parent, version, encoding, standalone) {
          var ref;
          XMLDeclaration2.__super__.constructor.call(this, parent);
          if (isObject(version)) {
            ref = version, version = ref.version, encoding = ref.encoding, standalone = ref.standalone;
          }
          if (!version) {
            version = "1.0";
          }
          this.type = NodeType.Declaration;
          this.version = this.stringify.xmlVersion(version);
          if (encoding != null) {
            this.encoding = this.stringify.xmlEncoding(encoding);
          }
          if (standalone != null) {
            this.standalone = this.stringify.xmlStandalone(standalone);
          }
        }
        XMLDeclaration2.prototype.toString = function(options) {
          return this.options.writer.declaration(this, this.options.writer.filterOptions(options));
        };
        return XMLDeclaration2;
      }(XMLNode);
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLDTDAttList.js
var require_XMLDTDAttList = __commonJS({
  "node_modules/xmlbuilder/lib/XMLDTDAttList.js"(exports2, module2) {
    (function() {
      var NodeType, XMLDTDAttList, XMLNode, extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key))
            child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      }, hasProp = {}.hasOwnProperty;
      XMLNode = require_XMLNode();
      NodeType = require_NodeType();
      module2.exports = XMLDTDAttList = function(superClass) {
        extend(XMLDTDAttList2, superClass);
        function XMLDTDAttList2(parent, elementName, attributeName, attributeType, defaultValueType, defaultValue) {
          XMLDTDAttList2.__super__.constructor.call(this, parent);
          if (elementName == null) {
            throw new Error("Missing DTD element name. " + this.debugInfo());
          }
          if (attributeName == null) {
            throw new Error("Missing DTD attribute name. " + this.debugInfo(elementName));
          }
          if (!attributeType) {
            throw new Error("Missing DTD attribute type. " + this.debugInfo(elementName));
          }
          if (!defaultValueType) {
            throw new Error("Missing DTD attribute default. " + this.debugInfo(elementName));
          }
          if (defaultValueType.indexOf("#") !== 0) {
            defaultValueType = "#" + defaultValueType;
          }
          if (!defaultValueType.match(/^(#REQUIRED|#IMPLIED|#FIXED|#DEFAULT)$/)) {
            throw new Error("Invalid default value type; expected: #REQUIRED, #IMPLIED, #FIXED or #DEFAULT. " + this.debugInfo(elementName));
          }
          if (defaultValue && !defaultValueType.match(/^(#FIXED|#DEFAULT)$/)) {
            throw new Error("Default value only applies to #FIXED or #DEFAULT. " + this.debugInfo(elementName));
          }
          this.elementName = this.stringify.name(elementName);
          this.type = NodeType.AttributeDeclaration;
          this.attributeName = this.stringify.name(attributeName);
          this.attributeType = this.stringify.dtdAttType(attributeType);
          if (defaultValue) {
            this.defaultValue = this.stringify.dtdAttDefault(defaultValue);
          }
          this.defaultValueType = defaultValueType;
        }
        XMLDTDAttList2.prototype.toString = function(options) {
          return this.options.writer.dtdAttList(this, this.options.writer.filterOptions(options));
        };
        return XMLDTDAttList2;
      }(XMLNode);
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLDTDEntity.js
var require_XMLDTDEntity = __commonJS({
  "node_modules/xmlbuilder/lib/XMLDTDEntity.js"(exports2, module2) {
    (function() {
      var NodeType, XMLDTDEntity, XMLNode, isObject, extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key))
            child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      }, hasProp = {}.hasOwnProperty;
      isObject = require_Utility().isObject;
      XMLNode = require_XMLNode();
      NodeType = require_NodeType();
      module2.exports = XMLDTDEntity = function(superClass) {
        extend(XMLDTDEntity2, superClass);
        function XMLDTDEntity2(parent, pe, name, value) {
          XMLDTDEntity2.__super__.constructor.call(this, parent);
          if (name == null) {
            throw new Error("Missing DTD entity name. " + this.debugInfo(name));
          }
          if (value == null) {
            throw new Error("Missing DTD entity value. " + this.debugInfo(name));
          }
          this.pe = !!pe;
          this.name = this.stringify.name(name);
          this.type = NodeType.EntityDeclaration;
          if (!isObject(value)) {
            this.value = this.stringify.dtdEntityValue(value);
            this.internal = true;
          } else {
            if (!value.pubID && !value.sysID) {
              throw new Error("Public and/or system identifiers are required for an external entity. " + this.debugInfo(name));
            }
            if (value.pubID && !value.sysID) {
              throw new Error("System identifier is required for a public external entity. " + this.debugInfo(name));
            }
            this.internal = false;
            if (value.pubID != null) {
              this.pubID = this.stringify.dtdPubID(value.pubID);
            }
            if (value.sysID != null) {
              this.sysID = this.stringify.dtdSysID(value.sysID);
            }
            if (value.nData != null) {
              this.nData = this.stringify.dtdNData(value.nData);
            }
            if (this.pe && this.nData) {
              throw new Error("Notation declaration is not allowed in a parameter entity. " + this.debugInfo(name));
            }
          }
        }
        Object.defineProperty(XMLDTDEntity2.prototype, "publicId", {
          get: function() {
            return this.pubID;
          }
        });
        Object.defineProperty(XMLDTDEntity2.prototype, "systemId", {
          get: function() {
            return this.sysID;
          }
        });
        Object.defineProperty(XMLDTDEntity2.prototype, "notationName", {
          get: function() {
            return this.nData || null;
          }
        });
        Object.defineProperty(XMLDTDEntity2.prototype, "inputEncoding", {
          get: function() {
            return null;
          }
        });
        Object.defineProperty(XMLDTDEntity2.prototype, "xmlEncoding", {
          get: function() {
            return null;
          }
        });
        Object.defineProperty(XMLDTDEntity2.prototype, "xmlVersion", {
          get: function() {
            return null;
          }
        });
        XMLDTDEntity2.prototype.toString = function(options) {
          return this.options.writer.dtdEntity(this, this.options.writer.filterOptions(options));
        };
        return XMLDTDEntity2;
      }(XMLNode);
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLDTDElement.js
var require_XMLDTDElement = __commonJS({
  "node_modules/xmlbuilder/lib/XMLDTDElement.js"(exports2, module2) {
    (function() {
      var NodeType, XMLDTDElement, XMLNode, extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key))
            child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      }, hasProp = {}.hasOwnProperty;
      XMLNode = require_XMLNode();
      NodeType = require_NodeType();
      module2.exports = XMLDTDElement = function(superClass) {
        extend(XMLDTDElement2, superClass);
        function XMLDTDElement2(parent, name, value) {
          XMLDTDElement2.__super__.constructor.call(this, parent);
          if (name == null) {
            throw new Error("Missing DTD element name. " + this.debugInfo());
          }
          if (!value) {
            value = "(#PCDATA)";
          }
          if (Array.isArray(value)) {
            value = "(" + value.join(",") + ")";
          }
          this.name = this.stringify.name(name);
          this.type = NodeType.ElementDeclaration;
          this.value = this.stringify.dtdElementValue(value);
        }
        XMLDTDElement2.prototype.toString = function(options) {
          return this.options.writer.dtdElement(this, this.options.writer.filterOptions(options));
        };
        return XMLDTDElement2;
      }(XMLNode);
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLDTDNotation.js
var require_XMLDTDNotation = __commonJS({
  "node_modules/xmlbuilder/lib/XMLDTDNotation.js"(exports2, module2) {
    (function() {
      var NodeType, XMLDTDNotation, XMLNode, extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key))
            child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      }, hasProp = {}.hasOwnProperty;
      XMLNode = require_XMLNode();
      NodeType = require_NodeType();
      module2.exports = XMLDTDNotation = function(superClass) {
        extend(XMLDTDNotation2, superClass);
        function XMLDTDNotation2(parent, name, value) {
          XMLDTDNotation2.__super__.constructor.call(this, parent);
          if (name == null) {
            throw new Error("Missing DTD notation name. " + this.debugInfo(name));
          }
          if (!value.pubID && !value.sysID) {
            throw new Error("Public or system identifiers are required for an external entity. " + this.debugInfo(name));
          }
          this.name = this.stringify.name(name);
          this.type = NodeType.NotationDeclaration;
          if (value.pubID != null) {
            this.pubID = this.stringify.dtdPubID(value.pubID);
          }
          if (value.sysID != null) {
            this.sysID = this.stringify.dtdSysID(value.sysID);
          }
        }
        Object.defineProperty(XMLDTDNotation2.prototype, "publicId", {
          get: function() {
            return this.pubID;
          }
        });
        Object.defineProperty(XMLDTDNotation2.prototype, "systemId", {
          get: function() {
            return this.sysID;
          }
        });
        XMLDTDNotation2.prototype.toString = function(options) {
          return this.options.writer.dtdNotation(this, this.options.writer.filterOptions(options));
        };
        return XMLDTDNotation2;
      }(XMLNode);
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLDocType.js
var require_XMLDocType = __commonJS({
  "node_modules/xmlbuilder/lib/XMLDocType.js"(exports2, module2) {
    (function() {
      var NodeType, XMLDTDAttList, XMLDTDElement, XMLDTDEntity, XMLDTDNotation, XMLDocType, XMLNamedNodeMap, XMLNode, isObject, extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key))
            child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      }, hasProp = {}.hasOwnProperty;
      isObject = require_Utility().isObject;
      XMLNode = require_XMLNode();
      NodeType = require_NodeType();
      XMLDTDAttList = require_XMLDTDAttList();
      XMLDTDEntity = require_XMLDTDEntity();
      XMLDTDElement = require_XMLDTDElement();
      XMLDTDNotation = require_XMLDTDNotation();
      XMLNamedNodeMap = require_XMLNamedNodeMap();
      module2.exports = XMLDocType = function(superClass) {
        extend(XMLDocType2, superClass);
        function XMLDocType2(parent, pubID, sysID) {
          var child, i, len, ref, ref1, ref2;
          XMLDocType2.__super__.constructor.call(this, parent);
          this.type = NodeType.DocType;
          if (parent.children) {
            ref = parent.children;
            for (i = 0, len = ref.length; i < len; i++) {
              child = ref[i];
              if (child.type === NodeType.Element) {
                this.name = child.name;
                break;
              }
            }
          }
          this.documentObject = parent;
          if (isObject(pubID)) {
            ref1 = pubID, pubID = ref1.pubID, sysID = ref1.sysID;
          }
          if (sysID == null) {
            ref2 = [pubID, sysID], sysID = ref2[0], pubID = ref2[1];
          }
          if (pubID != null) {
            this.pubID = this.stringify.dtdPubID(pubID);
          }
          if (sysID != null) {
            this.sysID = this.stringify.dtdSysID(sysID);
          }
        }
        Object.defineProperty(XMLDocType2.prototype, "entities", {
          get: function() {
            var child, i, len, nodes, ref;
            nodes = {};
            ref = this.children;
            for (i = 0, len = ref.length; i < len; i++) {
              child = ref[i];
              if (child.type === NodeType.EntityDeclaration && !child.pe) {
                nodes[child.name] = child;
              }
            }
            return new XMLNamedNodeMap(nodes);
          }
        });
        Object.defineProperty(XMLDocType2.prototype, "notations", {
          get: function() {
            var child, i, len, nodes, ref;
            nodes = {};
            ref = this.children;
            for (i = 0, len = ref.length; i < len; i++) {
              child = ref[i];
              if (child.type === NodeType.NotationDeclaration) {
                nodes[child.name] = child;
              }
            }
            return new XMLNamedNodeMap(nodes);
          }
        });
        Object.defineProperty(XMLDocType2.prototype, "publicId", {
          get: function() {
            return this.pubID;
          }
        });
        Object.defineProperty(XMLDocType2.prototype, "systemId", {
          get: function() {
            return this.sysID;
          }
        });
        Object.defineProperty(XMLDocType2.prototype, "internalSubset", {
          get: function() {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          }
        });
        XMLDocType2.prototype.element = function(name, value) {
          var child;
          child = new XMLDTDElement(this, name, value);
          this.children.push(child);
          return this;
        };
        XMLDocType2.prototype.attList = function(elementName, attributeName, attributeType, defaultValueType, defaultValue) {
          var child;
          child = new XMLDTDAttList(this, elementName, attributeName, attributeType, defaultValueType, defaultValue);
          this.children.push(child);
          return this;
        };
        XMLDocType2.prototype.entity = function(name, value) {
          var child;
          child = new XMLDTDEntity(this, false, name, value);
          this.children.push(child);
          return this;
        };
        XMLDocType2.prototype.pEntity = function(name, value) {
          var child;
          child = new XMLDTDEntity(this, true, name, value);
          this.children.push(child);
          return this;
        };
        XMLDocType2.prototype.notation = function(name, value) {
          var child;
          child = new XMLDTDNotation(this, name, value);
          this.children.push(child);
          return this;
        };
        XMLDocType2.prototype.toString = function(options) {
          return this.options.writer.docType(this, this.options.writer.filterOptions(options));
        };
        XMLDocType2.prototype.ele = function(name, value) {
          return this.element(name, value);
        };
        XMLDocType2.prototype.att = function(elementName, attributeName, attributeType, defaultValueType, defaultValue) {
          return this.attList(elementName, attributeName, attributeType, defaultValueType, defaultValue);
        };
        XMLDocType2.prototype.ent = function(name, value) {
          return this.entity(name, value);
        };
        XMLDocType2.prototype.pent = function(name, value) {
          return this.pEntity(name, value);
        };
        XMLDocType2.prototype.not = function(name, value) {
          return this.notation(name, value);
        };
        XMLDocType2.prototype.up = function() {
          return this.root() || this.documentObject;
        };
        XMLDocType2.prototype.isEqualNode = function(node) {
          if (!XMLDocType2.__super__.isEqualNode.apply(this, arguments).isEqualNode(node)) {
            return false;
          }
          if (node.name !== this.name) {
            return false;
          }
          if (node.publicId !== this.publicId) {
            return false;
          }
          if (node.systemId !== this.systemId) {
            return false;
          }
          return true;
        };
        return XMLDocType2;
      }(XMLNode);
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLRaw.js
var require_XMLRaw = __commonJS({
  "node_modules/xmlbuilder/lib/XMLRaw.js"(exports2, module2) {
    (function() {
      var NodeType, XMLNode, XMLRaw, extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key))
            child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      }, hasProp = {}.hasOwnProperty;
      NodeType = require_NodeType();
      XMLNode = require_XMLNode();
      module2.exports = XMLRaw = function(superClass) {
        extend(XMLRaw2, superClass);
        function XMLRaw2(parent, text) {
          XMLRaw2.__super__.constructor.call(this, parent);
          if (text == null) {
            throw new Error("Missing raw text. " + this.debugInfo());
          }
          this.type = NodeType.Raw;
          this.value = this.stringify.raw(text);
        }
        XMLRaw2.prototype.clone = function() {
          return Object.create(this);
        };
        XMLRaw2.prototype.toString = function(options) {
          return this.options.writer.raw(this, this.options.writer.filterOptions(options));
        };
        return XMLRaw2;
      }(XMLNode);
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLText.js
var require_XMLText = __commonJS({
  "node_modules/xmlbuilder/lib/XMLText.js"(exports2, module2) {
    (function() {
      var NodeType, XMLCharacterData, XMLText, extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key))
            child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      }, hasProp = {}.hasOwnProperty;
      NodeType = require_NodeType();
      XMLCharacterData = require_XMLCharacterData();
      module2.exports = XMLText = function(superClass) {
        extend(XMLText2, superClass);
        function XMLText2(parent, text) {
          XMLText2.__super__.constructor.call(this, parent);
          if (text == null) {
            throw new Error("Missing element text. " + this.debugInfo());
          }
          this.name = "#text";
          this.type = NodeType.Text;
          this.value = this.stringify.text(text);
        }
        Object.defineProperty(XMLText2.prototype, "isElementContentWhitespace", {
          get: function() {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          }
        });
        Object.defineProperty(XMLText2.prototype, "wholeText", {
          get: function() {
            var next, prev, str;
            str = "";
            prev = this.previousSibling;
            while (prev) {
              str = prev.data + str;
              prev = prev.previousSibling;
            }
            str += this.data;
            next = this.nextSibling;
            while (next) {
              str = str + next.data;
              next = next.nextSibling;
            }
            return str;
          }
        });
        XMLText2.prototype.clone = function() {
          return Object.create(this);
        };
        XMLText2.prototype.toString = function(options) {
          return this.options.writer.text(this, this.options.writer.filterOptions(options));
        };
        XMLText2.prototype.splitText = function(offset) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLText2.prototype.replaceWholeText = function(content) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        return XMLText2;
      }(XMLCharacterData);
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLProcessingInstruction.js
var require_XMLProcessingInstruction = __commonJS({
  "node_modules/xmlbuilder/lib/XMLProcessingInstruction.js"(exports2, module2) {
    (function() {
      var NodeType, XMLCharacterData, XMLProcessingInstruction, extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key))
            child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      }, hasProp = {}.hasOwnProperty;
      NodeType = require_NodeType();
      XMLCharacterData = require_XMLCharacterData();
      module2.exports = XMLProcessingInstruction = function(superClass) {
        extend(XMLProcessingInstruction2, superClass);
        function XMLProcessingInstruction2(parent, target, value) {
          XMLProcessingInstruction2.__super__.constructor.call(this, parent);
          if (target == null) {
            throw new Error("Missing instruction target. " + this.debugInfo());
          }
          this.type = NodeType.ProcessingInstruction;
          this.target = this.stringify.insTarget(target);
          this.name = this.target;
          if (value) {
            this.value = this.stringify.insValue(value);
          }
        }
        XMLProcessingInstruction2.prototype.clone = function() {
          return Object.create(this);
        };
        XMLProcessingInstruction2.prototype.toString = function(options) {
          return this.options.writer.processingInstruction(this, this.options.writer.filterOptions(options));
        };
        XMLProcessingInstruction2.prototype.isEqualNode = function(node) {
          if (!XMLProcessingInstruction2.__super__.isEqualNode.apply(this, arguments).isEqualNode(node)) {
            return false;
          }
          if (node.target !== this.target) {
            return false;
          }
          return true;
        };
        return XMLProcessingInstruction2;
      }(XMLCharacterData);
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLDummy.js
var require_XMLDummy = __commonJS({
  "node_modules/xmlbuilder/lib/XMLDummy.js"(exports2, module2) {
    (function() {
      var NodeType, XMLDummy, XMLNode, extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key))
            child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      }, hasProp = {}.hasOwnProperty;
      XMLNode = require_XMLNode();
      NodeType = require_NodeType();
      module2.exports = XMLDummy = function(superClass) {
        extend(XMLDummy2, superClass);
        function XMLDummy2(parent) {
          XMLDummy2.__super__.constructor.call(this, parent);
          this.type = NodeType.Dummy;
        }
        XMLDummy2.prototype.clone = function() {
          return Object.create(this);
        };
        XMLDummy2.prototype.toString = function(options) {
          return "";
        };
        return XMLDummy2;
      }(XMLNode);
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLNodeList.js
var require_XMLNodeList = __commonJS({
  "node_modules/xmlbuilder/lib/XMLNodeList.js"(exports2, module2) {
    (function() {
      var XMLNodeList;
      module2.exports = XMLNodeList = function() {
        function XMLNodeList2(nodes) {
          this.nodes = nodes;
        }
        Object.defineProperty(XMLNodeList2.prototype, "length", {
          get: function() {
            return this.nodes.length || 0;
          }
        });
        XMLNodeList2.prototype.clone = function() {
          return this.nodes = null;
        };
        XMLNodeList2.prototype.item = function(index) {
          return this.nodes[index] || null;
        };
        return XMLNodeList2;
      }();
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/DocumentPosition.js
var require_DocumentPosition = __commonJS({
  "node_modules/xmlbuilder/lib/DocumentPosition.js"(exports2, module2) {
    (function() {
      module2.exports = {
        Disconnected: 1,
        Preceding: 2,
        Following: 4,
        Contains: 8,
        ContainedBy: 16,
        ImplementationSpecific: 32
      };
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLNode.js
var require_XMLNode = __commonJS({
  "node_modules/xmlbuilder/lib/XMLNode.js"(exports2, module2) {
    (function() {
      var DocumentPosition, NodeType, XMLCData, XMLComment, XMLDeclaration, XMLDocType, XMLDummy, XMLElement, XMLNamedNodeMap, XMLNode, XMLNodeList, XMLProcessingInstruction, XMLRaw, XMLText, getValue, isEmpty, isFunction, isObject, ref1, hasProp = {}.hasOwnProperty;
      ref1 = require_Utility(), isObject = ref1.isObject, isFunction = ref1.isFunction, isEmpty = ref1.isEmpty, getValue = ref1.getValue;
      XMLElement = null;
      XMLCData = null;
      XMLComment = null;
      XMLDeclaration = null;
      XMLDocType = null;
      XMLRaw = null;
      XMLText = null;
      XMLProcessingInstruction = null;
      XMLDummy = null;
      NodeType = null;
      XMLNodeList = null;
      XMLNamedNodeMap = null;
      DocumentPosition = null;
      module2.exports = XMLNode = function() {
        function XMLNode2(parent1) {
          this.parent = parent1;
          if (this.parent) {
            this.options = this.parent.options;
            this.stringify = this.parent.stringify;
          }
          this.value = null;
          this.children = [];
          this.baseURI = null;
          if (!XMLElement) {
            XMLElement = require_XMLElement();
            XMLCData = require_XMLCData();
            XMLComment = require_XMLComment();
            XMLDeclaration = require_XMLDeclaration();
            XMLDocType = require_XMLDocType();
            XMLRaw = require_XMLRaw();
            XMLText = require_XMLText();
            XMLProcessingInstruction = require_XMLProcessingInstruction();
            XMLDummy = require_XMLDummy();
            NodeType = require_NodeType();
            XMLNodeList = require_XMLNodeList();
            XMLNamedNodeMap = require_XMLNamedNodeMap();
            DocumentPosition = require_DocumentPosition();
          }
        }
        Object.defineProperty(XMLNode2.prototype, "nodeName", {
          get: function() {
            return this.name;
          }
        });
        Object.defineProperty(XMLNode2.prototype, "nodeType", {
          get: function() {
            return this.type;
          }
        });
        Object.defineProperty(XMLNode2.prototype, "nodeValue", {
          get: function() {
            return this.value;
          }
        });
        Object.defineProperty(XMLNode2.prototype, "parentNode", {
          get: function() {
            return this.parent;
          }
        });
        Object.defineProperty(XMLNode2.prototype, "childNodes", {
          get: function() {
            if (!this.childNodeList || !this.childNodeList.nodes) {
              this.childNodeList = new XMLNodeList(this.children);
            }
            return this.childNodeList;
          }
        });
        Object.defineProperty(XMLNode2.prototype, "firstChild", {
          get: function() {
            return this.children[0] || null;
          }
        });
        Object.defineProperty(XMLNode2.prototype, "lastChild", {
          get: function() {
            return this.children[this.children.length - 1] || null;
          }
        });
        Object.defineProperty(XMLNode2.prototype, "previousSibling", {
          get: function() {
            var i;
            i = this.parent.children.indexOf(this);
            return this.parent.children[i - 1] || null;
          }
        });
        Object.defineProperty(XMLNode2.prototype, "nextSibling", {
          get: function() {
            var i;
            i = this.parent.children.indexOf(this);
            return this.parent.children[i + 1] || null;
          }
        });
        Object.defineProperty(XMLNode2.prototype, "ownerDocument", {
          get: function() {
            return this.document() || null;
          }
        });
        Object.defineProperty(XMLNode2.prototype, "textContent", {
          get: function() {
            var child, j, len, ref2, str;
            if (this.nodeType === NodeType.Element || this.nodeType === NodeType.DocumentFragment) {
              str = "";
              ref2 = this.children;
              for (j = 0, len = ref2.length; j < len; j++) {
                child = ref2[j];
                if (child.textContent) {
                  str += child.textContent;
                }
              }
              return str;
            } else {
              return null;
            }
          },
          set: function(value) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          }
        });
        XMLNode2.prototype.setParent = function(parent) {
          var child, j, len, ref2, results;
          this.parent = parent;
          if (parent) {
            this.options = parent.options;
            this.stringify = parent.stringify;
          }
          ref2 = this.children;
          results = [];
          for (j = 0, len = ref2.length; j < len; j++) {
            child = ref2[j];
            results.push(child.setParent(this));
          }
          return results;
        };
        XMLNode2.prototype.element = function(name, attributes, text) {
          var childNode, item, j, k, key, lastChild, len, len1, ref2, ref3, val;
          lastChild = null;
          if (attributes === null && text == null) {
            ref2 = [{}, null], attributes = ref2[0], text = ref2[1];
          }
          if (attributes == null) {
            attributes = {};
          }
          attributes = getValue(attributes);
          if (!isObject(attributes)) {
            ref3 = [attributes, text], text = ref3[0], attributes = ref3[1];
          }
          if (name != null) {
            name = getValue(name);
          }
          if (Array.isArray(name)) {
            for (j = 0, len = name.length; j < len; j++) {
              item = name[j];
              lastChild = this.element(item);
            }
          } else if (isFunction(name)) {
            lastChild = this.element(name.apply());
          } else if (isObject(name)) {
            for (key in name) {
              if (!hasProp.call(name, key))
                continue;
              val = name[key];
              if (isFunction(val)) {
                val = val.apply();
              }
              if (!this.options.ignoreDecorators && this.stringify.convertAttKey && key.indexOf(this.stringify.convertAttKey) === 0) {
                lastChild = this.attribute(key.substr(this.stringify.convertAttKey.length), val);
              } else if (!this.options.separateArrayItems && Array.isArray(val) && isEmpty(val)) {
                lastChild = this.dummy();
              } else if (isObject(val) && isEmpty(val)) {
                lastChild = this.element(key);
              } else if (!this.options.keepNullNodes && val == null) {
                lastChild = this.dummy();
              } else if (!this.options.separateArrayItems && Array.isArray(val)) {
                for (k = 0, len1 = val.length; k < len1; k++) {
                  item = val[k];
                  childNode = {};
                  childNode[key] = item;
                  lastChild = this.element(childNode);
                }
              } else if (isObject(val)) {
                if (!this.options.ignoreDecorators && this.stringify.convertTextKey && key.indexOf(this.stringify.convertTextKey) === 0) {
                  lastChild = this.element(val);
                } else {
                  lastChild = this.element(key);
                  lastChild.element(val);
                }
              } else {
                lastChild = this.element(key, val);
              }
            }
          } else if (!this.options.keepNullNodes && text === null) {
            lastChild = this.dummy();
          } else {
            if (!this.options.ignoreDecorators && this.stringify.convertTextKey && name.indexOf(this.stringify.convertTextKey) === 0) {
              lastChild = this.text(text);
            } else if (!this.options.ignoreDecorators && this.stringify.convertCDataKey && name.indexOf(this.stringify.convertCDataKey) === 0) {
              lastChild = this.cdata(text);
            } else if (!this.options.ignoreDecorators && this.stringify.convertCommentKey && name.indexOf(this.stringify.convertCommentKey) === 0) {
              lastChild = this.comment(text);
            } else if (!this.options.ignoreDecorators && this.stringify.convertRawKey && name.indexOf(this.stringify.convertRawKey) === 0) {
              lastChild = this.raw(text);
            } else if (!this.options.ignoreDecorators && this.stringify.convertPIKey && name.indexOf(this.stringify.convertPIKey) === 0) {
              lastChild = this.instruction(name.substr(this.stringify.convertPIKey.length), text);
            } else {
              lastChild = this.node(name, attributes, text);
            }
          }
          if (lastChild == null) {
            throw new Error("Could not create any elements with: " + name + ". " + this.debugInfo());
          }
          return lastChild;
        };
        XMLNode2.prototype.insertBefore = function(name, attributes, text) {
          var child, i, newChild, refChild, removed;
          if (name != null ? name.type : void 0) {
            newChild = name;
            refChild = attributes;
            newChild.setParent(this);
            if (refChild) {
              i = children.indexOf(refChild);
              removed = children.splice(i);
              children.push(newChild);
              Array.prototype.push.apply(children, removed);
            } else {
              children.push(newChild);
            }
            return newChild;
          } else {
            if (this.isRoot) {
              throw new Error("Cannot insert elements at root level. " + this.debugInfo(name));
            }
            i = this.parent.children.indexOf(this);
            removed = this.parent.children.splice(i);
            child = this.parent.element(name, attributes, text);
            Array.prototype.push.apply(this.parent.children, removed);
            return child;
          }
        };
        XMLNode2.prototype.insertAfter = function(name, attributes, text) {
          var child, i, removed;
          if (this.isRoot) {
            throw new Error("Cannot insert elements at root level. " + this.debugInfo(name));
          }
          i = this.parent.children.indexOf(this);
          removed = this.parent.children.splice(i + 1);
          child = this.parent.element(name, attributes, text);
          Array.prototype.push.apply(this.parent.children, removed);
          return child;
        };
        XMLNode2.prototype.remove = function() {
          var i, ref2;
          if (this.isRoot) {
            throw new Error("Cannot remove the root element. " + this.debugInfo());
          }
          i = this.parent.children.indexOf(this);
          [].splice.apply(this.parent.children, [i, i - i + 1].concat(ref2 = [])), ref2;
          return this.parent;
        };
        XMLNode2.prototype.node = function(name, attributes, text) {
          var child, ref2;
          if (name != null) {
            name = getValue(name);
          }
          attributes || (attributes = {});
          attributes = getValue(attributes);
          if (!isObject(attributes)) {
            ref2 = [attributes, text], text = ref2[0], attributes = ref2[1];
          }
          child = new XMLElement(this, name, attributes);
          if (text != null) {
            child.text(text);
          }
          this.children.push(child);
          return child;
        };
        XMLNode2.prototype.text = function(value) {
          var child;
          if (isObject(value)) {
            this.element(value);
          }
          child = new XMLText(this, value);
          this.children.push(child);
          return this;
        };
        XMLNode2.prototype.cdata = function(value) {
          var child;
          child = new XMLCData(this, value);
          this.children.push(child);
          return this;
        };
        XMLNode2.prototype.comment = function(value) {
          var child;
          child = new XMLComment(this, value);
          this.children.push(child);
          return this;
        };
        XMLNode2.prototype.commentBefore = function(value) {
          var child, i, removed;
          i = this.parent.children.indexOf(this);
          removed = this.parent.children.splice(i);
          child = this.parent.comment(value);
          Array.prototype.push.apply(this.parent.children, removed);
          return this;
        };
        XMLNode2.prototype.commentAfter = function(value) {
          var child, i, removed;
          i = this.parent.children.indexOf(this);
          removed = this.parent.children.splice(i + 1);
          child = this.parent.comment(value);
          Array.prototype.push.apply(this.parent.children, removed);
          return this;
        };
        XMLNode2.prototype.raw = function(value) {
          var child;
          child = new XMLRaw(this, value);
          this.children.push(child);
          return this;
        };
        XMLNode2.prototype.dummy = function() {
          var child;
          child = new XMLDummy(this);
          return child;
        };
        XMLNode2.prototype.instruction = function(target, value) {
          var insTarget, insValue, instruction, j, len;
          if (target != null) {
            target = getValue(target);
          }
          if (value != null) {
            value = getValue(value);
          }
          if (Array.isArray(target)) {
            for (j = 0, len = target.length; j < len; j++) {
              insTarget = target[j];
              this.instruction(insTarget);
            }
          } else if (isObject(target)) {
            for (insTarget in target) {
              if (!hasProp.call(target, insTarget))
                continue;
              insValue = target[insTarget];
              this.instruction(insTarget, insValue);
            }
          } else {
            if (isFunction(value)) {
              value = value.apply();
            }
            instruction = new XMLProcessingInstruction(this, target, value);
            this.children.push(instruction);
          }
          return this;
        };
        XMLNode2.prototype.instructionBefore = function(target, value) {
          var child, i, removed;
          i = this.parent.children.indexOf(this);
          removed = this.parent.children.splice(i);
          child = this.parent.instruction(target, value);
          Array.prototype.push.apply(this.parent.children, removed);
          return this;
        };
        XMLNode2.prototype.instructionAfter = function(target, value) {
          var child, i, removed;
          i = this.parent.children.indexOf(this);
          removed = this.parent.children.splice(i + 1);
          child = this.parent.instruction(target, value);
          Array.prototype.push.apply(this.parent.children, removed);
          return this;
        };
        XMLNode2.prototype.declaration = function(version, encoding, standalone) {
          var doc, xmldec;
          doc = this.document();
          xmldec = new XMLDeclaration(doc, version, encoding, standalone);
          if (doc.children.length === 0) {
            doc.children.unshift(xmldec);
          } else if (doc.children[0].type === NodeType.Declaration) {
            doc.children[0] = xmldec;
          } else {
            doc.children.unshift(xmldec);
          }
          return doc.root() || doc;
        };
        XMLNode2.prototype.dtd = function(pubID, sysID) {
          var child, doc, doctype, i, j, k, len, len1, ref2, ref3;
          doc = this.document();
          doctype = new XMLDocType(doc, pubID, sysID);
          ref2 = doc.children;
          for (i = j = 0, len = ref2.length; j < len; i = ++j) {
            child = ref2[i];
            if (child.type === NodeType.DocType) {
              doc.children[i] = doctype;
              return doctype;
            }
          }
          ref3 = doc.children;
          for (i = k = 0, len1 = ref3.length; k < len1; i = ++k) {
            child = ref3[i];
            if (child.isRoot) {
              doc.children.splice(i, 0, doctype);
              return doctype;
            }
          }
          doc.children.push(doctype);
          return doctype;
        };
        XMLNode2.prototype.up = function() {
          if (this.isRoot) {
            throw new Error("The root node has no parent. Use doc() if you need to get the document object.");
          }
          return this.parent;
        };
        XMLNode2.prototype.root = function() {
          var node;
          node = this;
          while (node) {
            if (node.type === NodeType.Document) {
              return node.rootObject;
            } else if (node.isRoot) {
              return node;
            } else {
              node = node.parent;
            }
          }
        };
        XMLNode2.prototype.document = function() {
          var node;
          node = this;
          while (node) {
            if (node.type === NodeType.Document) {
              return node;
            } else {
              node = node.parent;
            }
          }
        };
        XMLNode2.prototype.end = function(options) {
          return this.document().end(options);
        };
        XMLNode2.prototype.prev = function() {
          var i;
          i = this.parent.children.indexOf(this);
          if (i < 1) {
            throw new Error("Already at the first node. " + this.debugInfo());
          }
          return this.parent.children[i - 1];
        };
        XMLNode2.prototype.next = function() {
          var i;
          i = this.parent.children.indexOf(this);
          if (i === -1 || i === this.parent.children.length - 1) {
            throw new Error("Already at the last node. " + this.debugInfo());
          }
          return this.parent.children[i + 1];
        };
        XMLNode2.prototype.importDocument = function(doc) {
          var clonedRoot;
          clonedRoot = doc.root().clone();
          clonedRoot.parent = this;
          clonedRoot.isRoot = false;
          this.children.push(clonedRoot);
          return this;
        };
        XMLNode2.prototype.debugInfo = function(name) {
          var ref2, ref3;
          name = name || this.name;
          if (name == null && !((ref2 = this.parent) != null ? ref2.name : void 0)) {
            return "";
          } else if (name == null) {
            return "parent: <" + this.parent.name + ">";
          } else if (!((ref3 = this.parent) != null ? ref3.name : void 0)) {
            return "node: <" + name + ">";
          } else {
            return "node: <" + name + ">, parent: <" + this.parent.name + ">";
          }
        };
        XMLNode2.prototype.ele = function(name, attributes, text) {
          return this.element(name, attributes, text);
        };
        XMLNode2.prototype.nod = function(name, attributes, text) {
          return this.node(name, attributes, text);
        };
        XMLNode2.prototype.txt = function(value) {
          return this.text(value);
        };
        XMLNode2.prototype.dat = function(value) {
          return this.cdata(value);
        };
        XMLNode2.prototype.com = function(value) {
          return this.comment(value);
        };
        XMLNode2.prototype.ins = function(target, value) {
          return this.instruction(target, value);
        };
        XMLNode2.prototype.doc = function() {
          return this.document();
        };
        XMLNode2.prototype.dec = function(version, encoding, standalone) {
          return this.declaration(version, encoding, standalone);
        };
        XMLNode2.prototype.e = function(name, attributes, text) {
          return this.element(name, attributes, text);
        };
        XMLNode2.prototype.n = function(name, attributes, text) {
          return this.node(name, attributes, text);
        };
        XMLNode2.prototype.t = function(value) {
          return this.text(value);
        };
        XMLNode2.prototype.d = function(value) {
          return this.cdata(value);
        };
        XMLNode2.prototype.c = function(value) {
          return this.comment(value);
        };
        XMLNode2.prototype.r = function(value) {
          return this.raw(value);
        };
        XMLNode2.prototype.i = function(target, value) {
          return this.instruction(target, value);
        };
        XMLNode2.prototype.u = function() {
          return this.up();
        };
        XMLNode2.prototype.importXMLBuilder = function(doc) {
          return this.importDocument(doc);
        };
        XMLNode2.prototype.replaceChild = function(newChild, oldChild) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLNode2.prototype.removeChild = function(oldChild) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLNode2.prototype.appendChild = function(newChild) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLNode2.prototype.hasChildNodes = function() {
          return this.children.length !== 0;
        };
        XMLNode2.prototype.cloneNode = function(deep) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLNode2.prototype.normalize = function() {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLNode2.prototype.isSupported = function(feature, version) {
          return true;
        };
        XMLNode2.prototype.hasAttributes = function() {
          return this.attribs.length !== 0;
        };
        XMLNode2.prototype.compareDocumentPosition = function(other) {
          var ref, res;
          ref = this;
          if (ref === other) {
            return 0;
          } else if (this.document() !== other.document()) {
            res = DocumentPosition.Disconnected | DocumentPosition.ImplementationSpecific;
            if (Math.random() < 0.5) {
              res |= DocumentPosition.Preceding;
            } else {
              res |= DocumentPosition.Following;
            }
            return res;
          } else if (ref.isAncestor(other)) {
            return DocumentPosition.Contains | DocumentPosition.Preceding;
          } else if (ref.isDescendant(other)) {
            return DocumentPosition.Contains | DocumentPosition.Following;
          } else if (ref.isPreceding(other)) {
            return DocumentPosition.Preceding;
          } else {
            return DocumentPosition.Following;
          }
        };
        XMLNode2.prototype.isSameNode = function(other) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLNode2.prototype.lookupPrefix = function(namespaceURI) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLNode2.prototype.isDefaultNamespace = function(namespaceURI) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLNode2.prototype.lookupNamespaceURI = function(prefix2) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLNode2.prototype.isEqualNode = function(node) {
          var i, j, ref2;
          if (node.nodeType !== this.nodeType) {
            return false;
          }
          if (node.children.length !== this.children.length) {
            return false;
          }
          for (i = j = 0, ref2 = this.children.length - 1; 0 <= ref2 ? j <= ref2 : j >= ref2; i = 0 <= ref2 ? ++j : --j) {
            if (!this.children[i].isEqualNode(node.children[i])) {
              return false;
            }
          }
          return true;
        };
        XMLNode2.prototype.getFeature = function(feature, version) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLNode2.prototype.setUserData = function(key, data, handler) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLNode2.prototype.getUserData = function(key) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLNode2.prototype.contains = function(other) {
          if (!other) {
            return false;
          }
          return other === this || this.isDescendant(other);
        };
        XMLNode2.prototype.isDescendant = function(node) {
          var child, isDescendantChild, j, len, ref2;
          ref2 = this.children;
          for (j = 0, len = ref2.length; j < len; j++) {
            child = ref2[j];
            if (node === child) {
              return true;
            }
            isDescendantChild = child.isDescendant(node);
            if (isDescendantChild) {
              return true;
            }
          }
          return false;
        };
        XMLNode2.prototype.isAncestor = function(node) {
          return node.isDescendant(this);
        };
        XMLNode2.prototype.isPreceding = function(node) {
          var nodePos, thisPos;
          nodePos = this.treePosition(node);
          thisPos = this.treePosition(this);
          if (nodePos === -1 || thisPos === -1) {
            return false;
          } else {
            return nodePos < thisPos;
          }
        };
        XMLNode2.prototype.isFollowing = function(node) {
          var nodePos, thisPos;
          nodePos = this.treePosition(node);
          thisPos = this.treePosition(this);
          if (nodePos === -1 || thisPos === -1) {
            return false;
          } else {
            return nodePos > thisPos;
          }
        };
        XMLNode2.prototype.treePosition = function(node) {
          var found, pos;
          pos = 0;
          found = false;
          this.foreachTreeNode(this.document(), function(childNode) {
            pos++;
            if (!found && childNode === node) {
              return found = true;
            }
          });
          if (found) {
            return pos;
          } else {
            return -1;
          }
        };
        XMLNode2.prototype.foreachTreeNode = function(node, func) {
          var child, j, len, ref2, res;
          node || (node = this.document());
          ref2 = node.children;
          for (j = 0, len = ref2.length; j < len; j++) {
            child = ref2[j];
            if (res = func(child)) {
              return res;
            } else {
              res = this.foreachTreeNode(child, func);
              if (res) {
                return res;
              }
            }
          }
        };
        return XMLNode2;
      }();
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLStringifier.js
var require_XMLStringifier = __commonJS({
  "node_modules/xmlbuilder/lib/XMLStringifier.js"(exports2, module2) {
    (function() {
      var XMLStringifier, bind = function(fn, me) {
        return function() {
          return fn.apply(me, arguments);
        };
      }, hasProp = {}.hasOwnProperty;
      module2.exports = XMLStringifier = function() {
        function XMLStringifier2(options) {
          this.assertLegalName = bind(this.assertLegalName, this);
          this.assertLegalChar = bind(this.assertLegalChar, this);
          var key, ref, value;
          options || (options = {});
          this.options = options;
          if (!this.options.version) {
            this.options.version = "1.0";
          }
          ref = options.stringify || {};
          for (key in ref) {
            if (!hasProp.call(ref, key))
              continue;
            value = ref[key];
            this[key] = value;
          }
        }
        XMLStringifier2.prototype.name = function(val) {
          if (this.options.noValidation) {
            return val;
          }
          return this.assertLegalName("" + val || "");
        };
        XMLStringifier2.prototype.text = function(val) {
          if (this.options.noValidation) {
            return val;
          }
          return this.assertLegalChar(this.textEscape("" + val || ""));
        };
        XMLStringifier2.prototype.cdata = function(val) {
          if (this.options.noValidation) {
            return val;
          }
          val = "" + val || "";
          val = val.replace("]]>", "]]]]><![CDATA[>");
          return this.assertLegalChar(val);
        };
        XMLStringifier2.prototype.comment = function(val) {
          if (this.options.noValidation) {
            return val;
          }
          val = "" + val || "";
          if (val.match(/--/)) {
            throw new Error("Comment text cannot contain double-hypen: " + val);
          }
          return this.assertLegalChar(val);
        };
        XMLStringifier2.prototype.raw = function(val) {
          if (this.options.noValidation) {
            return val;
          }
          return "" + val || "";
        };
        XMLStringifier2.prototype.attValue = function(val) {
          if (this.options.noValidation) {
            return val;
          }
          return this.assertLegalChar(this.attEscape(val = "" + val || ""));
        };
        XMLStringifier2.prototype.insTarget = function(val) {
          if (this.options.noValidation) {
            return val;
          }
          return this.assertLegalChar("" + val || "");
        };
        XMLStringifier2.prototype.insValue = function(val) {
          if (this.options.noValidation) {
            return val;
          }
          val = "" + val || "";
          if (val.match(/\?>/)) {
            throw new Error("Invalid processing instruction value: " + val);
          }
          return this.assertLegalChar(val);
        };
        XMLStringifier2.prototype.xmlVersion = function(val) {
          if (this.options.noValidation) {
            return val;
          }
          val = "" + val || "";
          if (!val.match(/1\.[0-9]+/)) {
            throw new Error("Invalid version number: " + val);
          }
          return val;
        };
        XMLStringifier2.prototype.xmlEncoding = function(val) {
          if (this.options.noValidation) {
            return val;
          }
          val = "" + val || "";
          if (!val.match(/^[A-Za-z](?:[A-Za-z0-9._-])*$/)) {
            throw new Error("Invalid encoding: " + val);
          }
          return this.assertLegalChar(val);
        };
        XMLStringifier2.prototype.xmlStandalone = function(val) {
          if (this.options.noValidation) {
            return val;
          }
          if (val) {
            return "yes";
          } else {
            return "no";
          }
        };
        XMLStringifier2.prototype.dtdPubID = function(val) {
          if (this.options.noValidation) {
            return val;
          }
          return this.assertLegalChar("" + val || "");
        };
        XMLStringifier2.prototype.dtdSysID = function(val) {
          if (this.options.noValidation) {
            return val;
          }
          return this.assertLegalChar("" + val || "");
        };
        XMLStringifier2.prototype.dtdElementValue = function(val) {
          if (this.options.noValidation) {
            return val;
          }
          return this.assertLegalChar("" + val || "");
        };
        XMLStringifier2.prototype.dtdAttType = function(val) {
          if (this.options.noValidation) {
            return val;
          }
          return this.assertLegalChar("" + val || "");
        };
        XMLStringifier2.prototype.dtdAttDefault = function(val) {
          if (this.options.noValidation) {
            return val;
          }
          return this.assertLegalChar("" + val || "");
        };
        XMLStringifier2.prototype.dtdEntityValue = function(val) {
          if (this.options.noValidation) {
            return val;
          }
          return this.assertLegalChar("" + val || "");
        };
        XMLStringifier2.prototype.dtdNData = function(val) {
          if (this.options.noValidation) {
            return val;
          }
          return this.assertLegalChar("" + val || "");
        };
        XMLStringifier2.prototype.convertAttKey = "@";
        XMLStringifier2.prototype.convertPIKey = "?";
        XMLStringifier2.prototype.convertTextKey = "#text";
        XMLStringifier2.prototype.convertCDataKey = "#cdata";
        XMLStringifier2.prototype.convertCommentKey = "#comment";
        XMLStringifier2.prototype.convertRawKey = "#raw";
        XMLStringifier2.prototype.assertLegalChar = function(str) {
          var regex, res;
          if (this.options.noValidation) {
            return str;
          }
          regex = "";
          if (this.options.version === "1.0") {
            regex = /[\0-\x08\x0B\f\x0E-\x1F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
            if (res = str.match(regex)) {
              throw new Error("Invalid character in string: " + str + " at index " + res.index);
            }
          } else if (this.options.version === "1.1") {
            regex = /[\0\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
            if (res = str.match(regex)) {
              throw new Error("Invalid character in string: " + str + " at index " + res.index);
            }
          }
          return str;
        };
        XMLStringifier2.prototype.assertLegalName = function(str) {
          var regex;
          if (this.options.noValidation) {
            return str;
          }
          this.assertLegalChar(str);
          regex = /^([:A-Z_a-z\xC0-\xD6\xD8-\xF6\xF8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])([\x2D\.0-:A-Z_a-z\xB7\xC0-\xD6\xD8-\xF6\xF8-\u037D\u037F-\u1FFF\u200C\u200D\u203F\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])*$/;
          if (!str.match(regex)) {
            throw new Error("Invalid character in name");
          }
          return str;
        };
        XMLStringifier2.prototype.textEscape = function(str) {
          var ampregex;
          if (this.options.noValidation) {
            return str;
          }
          ampregex = this.options.noDoubleEncoding ? /(?!&\S+;)&/g : /&/g;
          return str.replace(ampregex, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\r/g, "&#xD;");
        };
        XMLStringifier2.prototype.attEscape = function(str) {
          var ampregex;
          if (this.options.noValidation) {
            return str;
          }
          ampregex = this.options.noDoubleEncoding ? /(?!&\S+;)&/g : /&/g;
          return str.replace(ampregex, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;").replace(/\t/g, "&#x9;").replace(/\n/g, "&#xA;").replace(/\r/g, "&#xD;");
        };
        return XMLStringifier2;
      }();
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/WriterState.js
var require_WriterState = __commonJS({
  "node_modules/xmlbuilder/lib/WriterState.js"(exports2, module2) {
    (function() {
      module2.exports = {
        None: 0,
        OpenTag: 1,
        InsideTag: 2,
        CloseTag: 3
      };
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLWriterBase.js
var require_XMLWriterBase = __commonJS({
  "node_modules/xmlbuilder/lib/XMLWriterBase.js"(exports2, module2) {
    (function() {
      var NodeType, WriterState, XMLCData, XMLComment, XMLDTDAttList, XMLDTDElement, XMLDTDEntity, XMLDTDNotation, XMLDeclaration, XMLDocType, XMLDummy, XMLElement, XMLProcessingInstruction, XMLRaw, XMLText, XMLWriterBase, assign, hasProp = {}.hasOwnProperty;
      assign = require_Utility().assign;
      NodeType = require_NodeType();
      XMLDeclaration = require_XMLDeclaration();
      XMLDocType = require_XMLDocType();
      XMLCData = require_XMLCData();
      XMLComment = require_XMLComment();
      XMLElement = require_XMLElement();
      XMLRaw = require_XMLRaw();
      XMLText = require_XMLText();
      XMLProcessingInstruction = require_XMLProcessingInstruction();
      XMLDummy = require_XMLDummy();
      XMLDTDAttList = require_XMLDTDAttList();
      XMLDTDElement = require_XMLDTDElement();
      XMLDTDEntity = require_XMLDTDEntity();
      XMLDTDNotation = require_XMLDTDNotation();
      WriterState = require_WriterState();
      module2.exports = XMLWriterBase = function() {
        function XMLWriterBase2(options) {
          var key, ref, value;
          options || (options = {});
          this.options = options;
          ref = options.writer || {};
          for (key in ref) {
            if (!hasProp.call(ref, key))
              continue;
            value = ref[key];
            this["_" + key] = this[key];
            this[key] = value;
          }
        }
        XMLWriterBase2.prototype.filterOptions = function(options) {
          var filteredOptions, ref, ref1, ref2, ref3, ref4, ref5, ref6;
          options || (options = {});
          options = assign({}, this.options, options);
          filteredOptions = {
            writer: this
          };
          filteredOptions.pretty = options.pretty || false;
          filteredOptions.allowEmpty = options.allowEmpty || false;
          filteredOptions.indent = (ref = options.indent) != null ? ref : "  ";
          filteredOptions.newline = (ref1 = options.newline) != null ? ref1 : "\n";
          filteredOptions.offset = (ref2 = options.offset) != null ? ref2 : 0;
          filteredOptions.dontPrettyTextNodes = (ref3 = (ref4 = options.dontPrettyTextNodes) != null ? ref4 : options.dontprettytextnodes) != null ? ref3 : 0;
          filteredOptions.spaceBeforeSlash = (ref5 = (ref6 = options.spaceBeforeSlash) != null ? ref6 : options.spacebeforeslash) != null ? ref5 : "";
          if (filteredOptions.spaceBeforeSlash === true) {
            filteredOptions.spaceBeforeSlash = " ";
          }
          filteredOptions.suppressPrettyCount = 0;
          filteredOptions.user = {};
          filteredOptions.state = WriterState.None;
          return filteredOptions;
        };
        XMLWriterBase2.prototype.indent = function(node, options, level) {
          var indentLevel;
          if (!options.pretty || options.suppressPrettyCount) {
            return "";
          } else if (options.pretty) {
            indentLevel = (level || 0) + options.offset + 1;
            if (indentLevel > 0) {
              return new Array(indentLevel).join(options.indent);
            }
          }
          return "";
        };
        XMLWriterBase2.prototype.endline = function(node, options, level) {
          if (!options.pretty || options.suppressPrettyCount) {
            return "";
          } else {
            return options.newline;
          }
        };
        XMLWriterBase2.prototype.attribute = function(att, options, level) {
          var r;
          this.openAttribute(att, options, level);
          r = " " + att.name + '="' + att.value + '"';
          this.closeAttribute(att, options, level);
          return r;
        };
        XMLWriterBase2.prototype.cdata = function(node, options, level) {
          var r;
          this.openNode(node, options, level);
          options.state = WriterState.OpenTag;
          r = this.indent(node, options, level) + "<![CDATA[";
          options.state = WriterState.InsideTag;
          r += node.value;
          options.state = WriterState.CloseTag;
          r += "]]>" + this.endline(node, options, level);
          options.state = WriterState.None;
          this.closeNode(node, options, level);
          return r;
        };
        XMLWriterBase2.prototype.comment = function(node, options, level) {
          var r;
          this.openNode(node, options, level);
          options.state = WriterState.OpenTag;
          r = this.indent(node, options, level) + "<!-- ";
          options.state = WriterState.InsideTag;
          r += node.value;
          options.state = WriterState.CloseTag;
          r += " -->" + this.endline(node, options, level);
          options.state = WriterState.None;
          this.closeNode(node, options, level);
          return r;
        };
        XMLWriterBase2.prototype.declaration = function(node, options, level) {
          var r;
          this.openNode(node, options, level);
          options.state = WriterState.OpenTag;
          r = this.indent(node, options, level) + "<?xml";
          options.state = WriterState.InsideTag;
          r += ' version="' + node.version + '"';
          if (node.encoding != null) {
            r += ' encoding="' + node.encoding + '"';
          }
          if (node.standalone != null) {
            r += ' standalone="' + node.standalone + '"';
          }
          options.state = WriterState.CloseTag;
          r += options.spaceBeforeSlash + "?>";
          r += this.endline(node, options, level);
          options.state = WriterState.None;
          this.closeNode(node, options, level);
          return r;
        };
        XMLWriterBase2.prototype.docType = function(node, options, level) {
          var child, i, len, r, ref;
          level || (level = 0);
          this.openNode(node, options, level);
          options.state = WriterState.OpenTag;
          r = this.indent(node, options, level);
          r += "<!DOCTYPE " + node.root().name;
          if (node.pubID && node.sysID) {
            r += ' PUBLIC "' + node.pubID + '" "' + node.sysID + '"';
          } else if (node.sysID) {
            r += ' SYSTEM "' + node.sysID + '"';
          }
          if (node.children.length > 0) {
            r += " [";
            r += this.endline(node, options, level);
            options.state = WriterState.InsideTag;
            ref = node.children;
            for (i = 0, len = ref.length; i < len; i++) {
              child = ref[i];
              r += this.writeChildNode(child, options, level + 1);
            }
            options.state = WriterState.CloseTag;
            r += "]";
          }
          options.state = WriterState.CloseTag;
          r += options.spaceBeforeSlash + ">";
          r += this.endline(node, options, level);
          options.state = WriterState.None;
          this.closeNode(node, options, level);
          return r;
        };
        XMLWriterBase2.prototype.element = function(node, options, level) {
          var att, child, childNodeCount, firstChildNode, i, j, len, len1, name, prettySuppressed, r, ref, ref1, ref2;
          level || (level = 0);
          prettySuppressed = false;
          r = "";
          this.openNode(node, options, level);
          options.state = WriterState.OpenTag;
          r += this.indent(node, options, level) + "<" + node.name;
          ref = node.attribs;
          for (name in ref) {
            if (!hasProp.call(ref, name))
              continue;
            att = ref[name];
            r += this.attribute(att, options, level);
          }
          childNodeCount = node.children.length;
          firstChildNode = childNodeCount === 0 ? null : node.children[0];
          if (childNodeCount === 0 || node.children.every(function(e) {
            return (e.type === NodeType.Text || e.type === NodeType.Raw) && e.value === "";
          })) {
            if (options.allowEmpty) {
              r += ">";
              options.state = WriterState.CloseTag;
              r += "</" + node.name + ">" + this.endline(node, options, level);
            } else {
              options.state = WriterState.CloseTag;
              r += options.spaceBeforeSlash + "/>" + this.endline(node, options, level);
            }
          } else if (options.pretty && childNodeCount === 1 && (firstChildNode.type === NodeType.Text || firstChildNode.type === NodeType.Raw) && firstChildNode.value != null) {
            r += ">";
            options.state = WriterState.InsideTag;
            options.suppressPrettyCount++;
            prettySuppressed = true;
            r += this.writeChildNode(firstChildNode, options, level + 1);
            options.suppressPrettyCount--;
            prettySuppressed = false;
            options.state = WriterState.CloseTag;
            r += "</" + node.name + ">" + this.endline(node, options, level);
          } else {
            if (options.dontPrettyTextNodes) {
              ref1 = node.children;
              for (i = 0, len = ref1.length; i < len; i++) {
                child = ref1[i];
                if ((child.type === NodeType.Text || child.type === NodeType.Raw) && child.value != null) {
                  options.suppressPrettyCount++;
                  prettySuppressed = true;
                  break;
                }
              }
            }
            r += ">" + this.endline(node, options, level);
            options.state = WriterState.InsideTag;
            ref2 = node.children;
            for (j = 0, len1 = ref2.length; j < len1; j++) {
              child = ref2[j];
              r += this.writeChildNode(child, options, level + 1);
            }
            options.state = WriterState.CloseTag;
            r += this.indent(node, options, level) + "</" + node.name + ">";
            if (prettySuppressed) {
              options.suppressPrettyCount--;
            }
            r += this.endline(node, options, level);
            options.state = WriterState.None;
          }
          this.closeNode(node, options, level);
          return r;
        };
        XMLWriterBase2.prototype.writeChildNode = function(node, options, level) {
          switch (node.type) {
            case NodeType.CData:
              return this.cdata(node, options, level);
            case NodeType.Comment:
              return this.comment(node, options, level);
            case NodeType.Element:
              return this.element(node, options, level);
            case NodeType.Raw:
              return this.raw(node, options, level);
            case NodeType.Text:
              return this.text(node, options, level);
            case NodeType.ProcessingInstruction:
              return this.processingInstruction(node, options, level);
            case NodeType.Dummy:
              return "";
            case NodeType.Declaration:
              return this.declaration(node, options, level);
            case NodeType.DocType:
              return this.docType(node, options, level);
            case NodeType.AttributeDeclaration:
              return this.dtdAttList(node, options, level);
            case NodeType.ElementDeclaration:
              return this.dtdElement(node, options, level);
            case NodeType.EntityDeclaration:
              return this.dtdEntity(node, options, level);
            case NodeType.NotationDeclaration:
              return this.dtdNotation(node, options, level);
            default:
              throw new Error("Unknown XML node type: " + node.constructor.name);
          }
        };
        XMLWriterBase2.prototype.processingInstruction = function(node, options, level) {
          var r;
          this.openNode(node, options, level);
          options.state = WriterState.OpenTag;
          r = this.indent(node, options, level) + "<?";
          options.state = WriterState.InsideTag;
          r += node.target;
          if (node.value) {
            r += " " + node.value;
          }
          options.state = WriterState.CloseTag;
          r += options.spaceBeforeSlash + "?>";
          r += this.endline(node, options, level);
          options.state = WriterState.None;
          this.closeNode(node, options, level);
          return r;
        };
        XMLWriterBase2.prototype.raw = function(node, options, level) {
          var r;
          this.openNode(node, options, level);
          options.state = WriterState.OpenTag;
          r = this.indent(node, options, level);
          options.state = WriterState.InsideTag;
          r += node.value;
          options.state = WriterState.CloseTag;
          r += this.endline(node, options, level);
          options.state = WriterState.None;
          this.closeNode(node, options, level);
          return r;
        };
        XMLWriterBase2.prototype.text = function(node, options, level) {
          var r;
          this.openNode(node, options, level);
          options.state = WriterState.OpenTag;
          r = this.indent(node, options, level);
          options.state = WriterState.InsideTag;
          r += node.value;
          options.state = WriterState.CloseTag;
          r += this.endline(node, options, level);
          options.state = WriterState.None;
          this.closeNode(node, options, level);
          return r;
        };
        XMLWriterBase2.prototype.dtdAttList = function(node, options, level) {
          var r;
          this.openNode(node, options, level);
          options.state = WriterState.OpenTag;
          r = this.indent(node, options, level) + "<!ATTLIST";
          options.state = WriterState.InsideTag;
          r += " " + node.elementName + " " + node.attributeName + " " + node.attributeType;
          if (node.defaultValueType !== "#DEFAULT") {
            r += " " + node.defaultValueType;
          }
          if (node.defaultValue) {
            r += ' "' + node.defaultValue + '"';
          }
          options.state = WriterState.CloseTag;
          r += options.spaceBeforeSlash + ">" + this.endline(node, options, level);
          options.state = WriterState.None;
          this.closeNode(node, options, level);
          return r;
        };
        XMLWriterBase2.prototype.dtdElement = function(node, options, level) {
          var r;
          this.openNode(node, options, level);
          options.state = WriterState.OpenTag;
          r = this.indent(node, options, level) + "<!ELEMENT";
          options.state = WriterState.InsideTag;
          r += " " + node.name + " " + node.value;
          options.state = WriterState.CloseTag;
          r += options.spaceBeforeSlash + ">" + this.endline(node, options, level);
          options.state = WriterState.None;
          this.closeNode(node, options, level);
          return r;
        };
        XMLWriterBase2.prototype.dtdEntity = function(node, options, level) {
          var r;
          this.openNode(node, options, level);
          options.state = WriterState.OpenTag;
          r = this.indent(node, options, level) + "<!ENTITY";
          options.state = WriterState.InsideTag;
          if (node.pe) {
            r += " %";
          }
          r += " " + node.name;
          if (node.value) {
            r += ' "' + node.value + '"';
          } else {
            if (node.pubID && node.sysID) {
              r += ' PUBLIC "' + node.pubID + '" "' + node.sysID + '"';
            } else if (node.sysID) {
              r += ' SYSTEM "' + node.sysID + '"';
            }
            if (node.nData) {
              r += " NDATA " + node.nData;
            }
          }
          options.state = WriterState.CloseTag;
          r += options.spaceBeforeSlash + ">" + this.endline(node, options, level);
          options.state = WriterState.None;
          this.closeNode(node, options, level);
          return r;
        };
        XMLWriterBase2.prototype.dtdNotation = function(node, options, level) {
          var r;
          this.openNode(node, options, level);
          options.state = WriterState.OpenTag;
          r = this.indent(node, options, level) + "<!NOTATION";
          options.state = WriterState.InsideTag;
          r += " " + node.name;
          if (node.pubID && node.sysID) {
            r += ' PUBLIC "' + node.pubID + '" "' + node.sysID + '"';
          } else if (node.pubID) {
            r += ' PUBLIC "' + node.pubID + '"';
          } else if (node.sysID) {
            r += ' SYSTEM "' + node.sysID + '"';
          }
          options.state = WriterState.CloseTag;
          r += options.spaceBeforeSlash + ">" + this.endline(node, options, level);
          options.state = WriterState.None;
          this.closeNode(node, options, level);
          return r;
        };
        XMLWriterBase2.prototype.openNode = function(node, options, level) {
        };
        XMLWriterBase2.prototype.closeNode = function(node, options, level) {
        };
        XMLWriterBase2.prototype.openAttribute = function(att, options, level) {
        };
        XMLWriterBase2.prototype.closeAttribute = function(att, options, level) {
        };
        return XMLWriterBase2;
      }();
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLStringWriter.js
var require_XMLStringWriter = __commonJS({
  "node_modules/xmlbuilder/lib/XMLStringWriter.js"(exports2, module2) {
    (function() {
      var XMLStringWriter, XMLWriterBase, extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key))
            child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      }, hasProp = {}.hasOwnProperty;
      XMLWriterBase = require_XMLWriterBase();
      module2.exports = XMLStringWriter = function(superClass) {
        extend(XMLStringWriter2, superClass);
        function XMLStringWriter2(options) {
          XMLStringWriter2.__super__.constructor.call(this, options);
        }
        XMLStringWriter2.prototype.document = function(doc, options) {
          var child, i, len, r, ref;
          options = this.filterOptions(options);
          r = "";
          ref = doc.children;
          for (i = 0, len = ref.length; i < len; i++) {
            child = ref[i];
            r += this.writeChildNode(child, options, 0);
          }
          if (options.pretty && r.slice(-options.newline.length) === options.newline) {
            r = r.slice(0, -options.newline.length);
          }
          return r;
        };
        return XMLStringWriter2;
      }(XMLWriterBase);
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLDocument.js
var require_XMLDocument = __commonJS({
  "node_modules/xmlbuilder/lib/XMLDocument.js"(exports2, module2) {
    (function() {
      var NodeType, XMLDOMConfiguration, XMLDOMImplementation, XMLDocument, XMLNode, XMLStringWriter, XMLStringifier, isPlainObject, extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key))
            child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      }, hasProp = {}.hasOwnProperty;
      isPlainObject = require_Utility().isPlainObject;
      XMLDOMImplementation = require_XMLDOMImplementation();
      XMLDOMConfiguration = require_XMLDOMConfiguration();
      XMLNode = require_XMLNode();
      NodeType = require_NodeType();
      XMLStringifier = require_XMLStringifier();
      XMLStringWriter = require_XMLStringWriter();
      module2.exports = XMLDocument = function(superClass) {
        extend(XMLDocument2, superClass);
        function XMLDocument2(options) {
          XMLDocument2.__super__.constructor.call(this, null);
          this.name = "#document";
          this.type = NodeType.Document;
          this.documentURI = null;
          this.domConfig = new XMLDOMConfiguration();
          options || (options = {});
          if (!options.writer) {
            options.writer = new XMLStringWriter();
          }
          this.options = options;
          this.stringify = new XMLStringifier(options);
        }
        Object.defineProperty(XMLDocument2.prototype, "implementation", {
          value: new XMLDOMImplementation()
        });
        Object.defineProperty(XMLDocument2.prototype, "doctype", {
          get: function() {
            var child, i, len, ref;
            ref = this.children;
            for (i = 0, len = ref.length; i < len; i++) {
              child = ref[i];
              if (child.type === NodeType.DocType) {
                return child;
              }
            }
            return null;
          }
        });
        Object.defineProperty(XMLDocument2.prototype, "documentElement", {
          get: function() {
            return this.rootObject || null;
          }
        });
        Object.defineProperty(XMLDocument2.prototype, "inputEncoding", {
          get: function() {
            return null;
          }
        });
        Object.defineProperty(XMLDocument2.prototype, "strictErrorChecking", {
          get: function() {
            return false;
          }
        });
        Object.defineProperty(XMLDocument2.prototype, "xmlEncoding", {
          get: function() {
            if (this.children.length !== 0 && this.children[0].type === NodeType.Declaration) {
              return this.children[0].encoding;
            } else {
              return null;
            }
          }
        });
        Object.defineProperty(XMLDocument2.prototype, "xmlStandalone", {
          get: function() {
            if (this.children.length !== 0 && this.children[0].type === NodeType.Declaration) {
              return this.children[0].standalone === "yes";
            } else {
              return false;
            }
          }
        });
        Object.defineProperty(XMLDocument2.prototype, "xmlVersion", {
          get: function() {
            if (this.children.length !== 0 && this.children[0].type === NodeType.Declaration) {
              return this.children[0].version;
            } else {
              return "1.0";
            }
          }
        });
        Object.defineProperty(XMLDocument2.prototype, "URL", {
          get: function() {
            return this.documentURI;
          }
        });
        Object.defineProperty(XMLDocument2.prototype, "origin", {
          get: function() {
            return null;
          }
        });
        Object.defineProperty(XMLDocument2.prototype, "compatMode", {
          get: function() {
            return null;
          }
        });
        Object.defineProperty(XMLDocument2.prototype, "characterSet", {
          get: function() {
            return null;
          }
        });
        Object.defineProperty(XMLDocument2.prototype, "contentType", {
          get: function() {
            return null;
          }
        });
        XMLDocument2.prototype.end = function(writer) {
          var writerOptions;
          writerOptions = {};
          if (!writer) {
            writer = this.options.writer;
          } else if (isPlainObject(writer)) {
            writerOptions = writer;
            writer = this.options.writer;
          }
          return writer.document(this, writer.filterOptions(writerOptions));
        };
        XMLDocument2.prototype.toString = function(options) {
          return this.options.writer.document(this, this.options.writer.filterOptions(options));
        };
        XMLDocument2.prototype.createElement = function(tagName) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLDocument2.prototype.createDocumentFragment = function() {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLDocument2.prototype.createTextNode = function(data) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLDocument2.prototype.createComment = function(data) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLDocument2.prototype.createCDATASection = function(data) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLDocument2.prototype.createProcessingInstruction = function(target, data) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLDocument2.prototype.createAttribute = function(name) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLDocument2.prototype.createEntityReference = function(name) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLDocument2.prototype.getElementsByTagName = function(tagname) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLDocument2.prototype.importNode = function(importedNode, deep) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLDocument2.prototype.createElementNS = function(namespaceURI, qualifiedName) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLDocument2.prototype.createAttributeNS = function(namespaceURI, qualifiedName) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLDocument2.prototype.getElementsByTagNameNS = function(namespaceURI, localName) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLDocument2.prototype.getElementById = function(elementId) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLDocument2.prototype.adoptNode = function(source) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLDocument2.prototype.normalizeDocument = function() {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLDocument2.prototype.renameNode = function(node, namespaceURI, qualifiedName) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLDocument2.prototype.getElementsByClassName = function(classNames) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLDocument2.prototype.createEvent = function(eventInterface) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLDocument2.prototype.createRange = function() {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLDocument2.prototype.createNodeIterator = function(root, whatToShow, filter) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLDocument2.prototype.createTreeWalker = function(root, whatToShow, filter) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        return XMLDocument2;
      }(XMLNode);
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLDocumentCB.js
var require_XMLDocumentCB = __commonJS({
  "node_modules/xmlbuilder/lib/XMLDocumentCB.js"(exports2, module2) {
    (function() {
      var NodeType, WriterState, XMLAttribute, XMLCData, XMLComment, XMLDTDAttList, XMLDTDElement, XMLDTDEntity, XMLDTDNotation, XMLDeclaration, XMLDocType, XMLDocument, XMLDocumentCB, XMLElement, XMLProcessingInstruction, XMLRaw, XMLStringWriter, XMLStringifier, XMLText, getValue, isFunction, isObject, isPlainObject, ref, hasProp = {}.hasOwnProperty;
      ref = require_Utility(), isObject = ref.isObject, isFunction = ref.isFunction, isPlainObject = ref.isPlainObject, getValue = ref.getValue;
      NodeType = require_NodeType();
      XMLDocument = require_XMLDocument();
      XMLElement = require_XMLElement();
      XMLCData = require_XMLCData();
      XMLComment = require_XMLComment();
      XMLRaw = require_XMLRaw();
      XMLText = require_XMLText();
      XMLProcessingInstruction = require_XMLProcessingInstruction();
      XMLDeclaration = require_XMLDeclaration();
      XMLDocType = require_XMLDocType();
      XMLDTDAttList = require_XMLDTDAttList();
      XMLDTDEntity = require_XMLDTDEntity();
      XMLDTDElement = require_XMLDTDElement();
      XMLDTDNotation = require_XMLDTDNotation();
      XMLAttribute = require_XMLAttribute();
      XMLStringifier = require_XMLStringifier();
      XMLStringWriter = require_XMLStringWriter();
      WriterState = require_WriterState();
      module2.exports = XMLDocumentCB = function() {
        function XMLDocumentCB2(options, onData, onEnd) {
          var writerOptions;
          this.name = "?xml";
          this.type = NodeType.Document;
          options || (options = {});
          writerOptions = {};
          if (!options.writer) {
            options.writer = new XMLStringWriter();
          } else if (isPlainObject(options.writer)) {
            writerOptions = options.writer;
            options.writer = new XMLStringWriter();
          }
          this.options = options;
          this.writer = options.writer;
          this.writerOptions = this.writer.filterOptions(writerOptions);
          this.stringify = new XMLStringifier(options);
          this.onDataCallback = onData || function() {
          };
          this.onEndCallback = onEnd || function() {
          };
          this.currentNode = null;
          this.currentLevel = -1;
          this.openTags = {};
          this.documentStarted = false;
          this.documentCompleted = false;
          this.root = null;
        }
        XMLDocumentCB2.prototype.createChildNode = function(node) {
          var att, attName, attributes, child, i, len, ref1, ref2;
          switch (node.type) {
            case NodeType.CData:
              this.cdata(node.value);
              break;
            case NodeType.Comment:
              this.comment(node.value);
              break;
            case NodeType.Element:
              attributes = {};
              ref1 = node.attribs;
              for (attName in ref1) {
                if (!hasProp.call(ref1, attName))
                  continue;
                att = ref1[attName];
                attributes[attName] = att.value;
              }
              this.node(node.name, attributes);
              break;
            case NodeType.Dummy:
              this.dummy();
              break;
            case NodeType.Raw:
              this.raw(node.value);
              break;
            case NodeType.Text:
              this.text(node.value);
              break;
            case NodeType.ProcessingInstruction:
              this.instruction(node.target, node.value);
              break;
            default:
              throw new Error("This XML node type is not supported in a JS object: " + node.constructor.name);
          }
          ref2 = node.children;
          for (i = 0, len = ref2.length; i < len; i++) {
            child = ref2[i];
            this.createChildNode(child);
            if (child.type === NodeType.Element) {
              this.up();
            }
          }
          return this;
        };
        XMLDocumentCB2.prototype.dummy = function() {
          return this;
        };
        XMLDocumentCB2.prototype.node = function(name, attributes, text) {
          var ref1;
          if (name == null) {
            throw new Error("Missing node name.");
          }
          if (this.root && this.currentLevel === -1) {
            throw new Error("Document can only have one root node. " + this.debugInfo(name));
          }
          this.openCurrent();
          name = getValue(name);
          if (attributes == null) {
            attributes = {};
          }
          attributes = getValue(attributes);
          if (!isObject(attributes)) {
            ref1 = [attributes, text], text = ref1[0], attributes = ref1[1];
          }
          this.currentNode = new XMLElement(this, name, attributes);
          this.currentNode.children = false;
          this.currentLevel++;
          this.openTags[this.currentLevel] = this.currentNode;
          if (text != null) {
            this.text(text);
          }
          return this;
        };
        XMLDocumentCB2.prototype.element = function(name, attributes, text) {
          var child, i, len, oldValidationFlag, ref1, root;
          if (this.currentNode && this.currentNode.type === NodeType.DocType) {
            this.dtdElement.apply(this, arguments);
          } else {
            if (Array.isArray(name) || isObject(name) || isFunction(name)) {
              oldValidationFlag = this.options.noValidation;
              this.options.noValidation = true;
              root = new XMLDocument(this.options).element("TEMP_ROOT");
              root.element(name);
              this.options.noValidation = oldValidationFlag;
              ref1 = root.children;
              for (i = 0, len = ref1.length; i < len; i++) {
                child = ref1[i];
                this.createChildNode(child);
                if (child.type === NodeType.Element) {
                  this.up();
                }
              }
            } else {
              this.node(name, attributes, text);
            }
          }
          return this;
        };
        XMLDocumentCB2.prototype.attribute = function(name, value) {
          var attName, attValue;
          if (!this.currentNode || this.currentNode.children) {
            throw new Error("att() can only be used immediately after an ele() call in callback mode. " + this.debugInfo(name));
          }
          if (name != null) {
            name = getValue(name);
          }
          if (isObject(name)) {
            for (attName in name) {
              if (!hasProp.call(name, attName))
                continue;
              attValue = name[attName];
              this.attribute(attName, attValue);
            }
          } else {
            if (isFunction(value)) {
              value = value.apply();
            }
            if (this.options.keepNullAttributes && value == null) {
              this.currentNode.attribs[name] = new XMLAttribute(this, name, "");
            } else if (value != null) {
              this.currentNode.attribs[name] = new XMLAttribute(this, name, value);
            }
          }
          return this;
        };
        XMLDocumentCB2.prototype.text = function(value) {
          var node;
          this.openCurrent();
          node = new XMLText(this, value);
          this.onData(this.writer.text(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
          return this;
        };
        XMLDocumentCB2.prototype.cdata = function(value) {
          var node;
          this.openCurrent();
          node = new XMLCData(this, value);
          this.onData(this.writer.cdata(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
          return this;
        };
        XMLDocumentCB2.prototype.comment = function(value) {
          var node;
          this.openCurrent();
          node = new XMLComment(this, value);
          this.onData(this.writer.comment(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
          return this;
        };
        XMLDocumentCB2.prototype.raw = function(value) {
          var node;
          this.openCurrent();
          node = new XMLRaw(this, value);
          this.onData(this.writer.raw(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
          return this;
        };
        XMLDocumentCB2.prototype.instruction = function(target, value) {
          var i, insTarget, insValue, len, node;
          this.openCurrent();
          if (target != null) {
            target = getValue(target);
          }
          if (value != null) {
            value = getValue(value);
          }
          if (Array.isArray(target)) {
            for (i = 0, len = target.length; i < len; i++) {
              insTarget = target[i];
              this.instruction(insTarget);
            }
          } else if (isObject(target)) {
            for (insTarget in target) {
              if (!hasProp.call(target, insTarget))
                continue;
              insValue = target[insTarget];
              this.instruction(insTarget, insValue);
            }
          } else {
            if (isFunction(value)) {
              value = value.apply();
            }
            node = new XMLProcessingInstruction(this, target, value);
            this.onData(this.writer.processingInstruction(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
          }
          return this;
        };
        XMLDocumentCB2.prototype.declaration = function(version, encoding, standalone) {
          var node;
          this.openCurrent();
          if (this.documentStarted) {
            throw new Error("declaration() must be the first node.");
          }
          node = new XMLDeclaration(this, version, encoding, standalone);
          this.onData(this.writer.declaration(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
          return this;
        };
        XMLDocumentCB2.prototype.doctype = function(root, pubID, sysID) {
          this.openCurrent();
          if (root == null) {
            throw new Error("Missing root node name.");
          }
          if (this.root) {
            throw new Error("dtd() must come before the root node.");
          }
          this.currentNode = new XMLDocType(this, pubID, sysID);
          this.currentNode.rootNodeName = root;
          this.currentNode.children = false;
          this.currentLevel++;
          this.openTags[this.currentLevel] = this.currentNode;
          return this;
        };
        XMLDocumentCB2.prototype.dtdElement = function(name, value) {
          var node;
          this.openCurrent();
          node = new XMLDTDElement(this, name, value);
          this.onData(this.writer.dtdElement(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
          return this;
        };
        XMLDocumentCB2.prototype.attList = function(elementName, attributeName, attributeType, defaultValueType, defaultValue) {
          var node;
          this.openCurrent();
          node = new XMLDTDAttList(this, elementName, attributeName, attributeType, defaultValueType, defaultValue);
          this.onData(this.writer.dtdAttList(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
          return this;
        };
        XMLDocumentCB2.prototype.entity = function(name, value) {
          var node;
          this.openCurrent();
          node = new XMLDTDEntity(this, false, name, value);
          this.onData(this.writer.dtdEntity(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
          return this;
        };
        XMLDocumentCB2.prototype.pEntity = function(name, value) {
          var node;
          this.openCurrent();
          node = new XMLDTDEntity(this, true, name, value);
          this.onData(this.writer.dtdEntity(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
          return this;
        };
        XMLDocumentCB2.prototype.notation = function(name, value) {
          var node;
          this.openCurrent();
          node = new XMLDTDNotation(this, name, value);
          this.onData(this.writer.dtdNotation(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
          return this;
        };
        XMLDocumentCB2.prototype.up = function() {
          if (this.currentLevel < 0) {
            throw new Error("The document node has no parent.");
          }
          if (this.currentNode) {
            if (this.currentNode.children) {
              this.closeNode(this.currentNode);
            } else {
              this.openNode(this.currentNode);
            }
            this.currentNode = null;
          } else {
            this.closeNode(this.openTags[this.currentLevel]);
          }
          delete this.openTags[this.currentLevel];
          this.currentLevel--;
          return this;
        };
        XMLDocumentCB2.prototype.end = function() {
          while (this.currentLevel >= 0) {
            this.up();
          }
          return this.onEnd();
        };
        XMLDocumentCB2.prototype.openCurrent = function() {
          if (this.currentNode) {
            this.currentNode.children = true;
            return this.openNode(this.currentNode);
          }
        };
        XMLDocumentCB2.prototype.openNode = function(node) {
          var att, chunk, name, ref1;
          if (!node.isOpen) {
            if (!this.root && this.currentLevel === 0 && node.type === NodeType.Element) {
              this.root = node;
            }
            chunk = "";
            if (node.type === NodeType.Element) {
              this.writerOptions.state = WriterState.OpenTag;
              chunk = this.writer.indent(node, this.writerOptions, this.currentLevel) + "<" + node.name;
              ref1 = node.attribs;
              for (name in ref1) {
                if (!hasProp.call(ref1, name))
                  continue;
                att = ref1[name];
                chunk += this.writer.attribute(att, this.writerOptions, this.currentLevel);
              }
              chunk += (node.children ? ">" : "/>") + this.writer.endline(node, this.writerOptions, this.currentLevel);
              this.writerOptions.state = WriterState.InsideTag;
            } else {
              this.writerOptions.state = WriterState.OpenTag;
              chunk = this.writer.indent(node, this.writerOptions, this.currentLevel) + "<!DOCTYPE " + node.rootNodeName;
              if (node.pubID && node.sysID) {
                chunk += ' PUBLIC "' + node.pubID + '" "' + node.sysID + '"';
              } else if (node.sysID) {
                chunk += ' SYSTEM "' + node.sysID + '"';
              }
              if (node.children) {
                chunk += " [";
                this.writerOptions.state = WriterState.InsideTag;
              } else {
                this.writerOptions.state = WriterState.CloseTag;
                chunk += ">";
              }
              chunk += this.writer.endline(node, this.writerOptions, this.currentLevel);
            }
            this.onData(chunk, this.currentLevel);
            return node.isOpen = true;
          }
        };
        XMLDocumentCB2.prototype.closeNode = function(node) {
          var chunk;
          if (!node.isClosed) {
            chunk = "";
            this.writerOptions.state = WriterState.CloseTag;
            if (node.type === NodeType.Element) {
              chunk = this.writer.indent(node, this.writerOptions, this.currentLevel) + "</" + node.name + ">" + this.writer.endline(node, this.writerOptions, this.currentLevel);
            } else {
              chunk = this.writer.indent(node, this.writerOptions, this.currentLevel) + "]>" + this.writer.endline(node, this.writerOptions, this.currentLevel);
            }
            this.writerOptions.state = WriterState.None;
            this.onData(chunk, this.currentLevel);
            return node.isClosed = true;
          }
        };
        XMLDocumentCB2.prototype.onData = function(chunk, level) {
          this.documentStarted = true;
          return this.onDataCallback(chunk, level + 1);
        };
        XMLDocumentCB2.prototype.onEnd = function() {
          this.documentCompleted = true;
          return this.onEndCallback();
        };
        XMLDocumentCB2.prototype.debugInfo = function(name) {
          if (name == null) {
            return "";
          } else {
            return "node: <" + name + ">";
          }
        };
        XMLDocumentCB2.prototype.ele = function() {
          return this.element.apply(this, arguments);
        };
        XMLDocumentCB2.prototype.nod = function(name, attributes, text) {
          return this.node(name, attributes, text);
        };
        XMLDocumentCB2.prototype.txt = function(value) {
          return this.text(value);
        };
        XMLDocumentCB2.prototype.dat = function(value) {
          return this.cdata(value);
        };
        XMLDocumentCB2.prototype.com = function(value) {
          return this.comment(value);
        };
        XMLDocumentCB2.prototype.ins = function(target, value) {
          return this.instruction(target, value);
        };
        XMLDocumentCB2.prototype.dec = function(version, encoding, standalone) {
          return this.declaration(version, encoding, standalone);
        };
        XMLDocumentCB2.prototype.dtd = function(root, pubID, sysID) {
          return this.doctype(root, pubID, sysID);
        };
        XMLDocumentCB2.prototype.e = function(name, attributes, text) {
          return this.element(name, attributes, text);
        };
        XMLDocumentCB2.prototype.n = function(name, attributes, text) {
          return this.node(name, attributes, text);
        };
        XMLDocumentCB2.prototype.t = function(value) {
          return this.text(value);
        };
        XMLDocumentCB2.prototype.d = function(value) {
          return this.cdata(value);
        };
        XMLDocumentCB2.prototype.c = function(value) {
          return this.comment(value);
        };
        XMLDocumentCB2.prototype.r = function(value) {
          return this.raw(value);
        };
        XMLDocumentCB2.prototype.i = function(target, value) {
          return this.instruction(target, value);
        };
        XMLDocumentCB2.prototype.att = function() {
          if (this.currentNode && this.currentNode.type === NodeType.DocType) {
            return this.attList.apply(this, arguments);
          } else {
            return this.attribute.apply(this, arguments);
          }
        };
        XMLDocumentCB2.prototype.a = function() {
          if (this.currentNode && this.currentNode.type === NodeType.DocType) {
            return this.attList.apply(this, arguments);
          } else {
            return this.attribute.apply(this, arguments);
          }
        };
        XMLDocumentCB2.prototype.ent = function(name, value) {
          return this.entity(name, value);
        };
        XMLDocumentCB2.prototype.pent = function(name, value) {
          return this.pEntity(name, value);
        };
        XMLDocumentCB2.prototype.not = function(name, value) {
          return this.notation(name, value);
        };
        return XMLDocumentCB2;
      }();
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLStreamWriter.js
var require_XMLStreamWriter = __commonJS({
  "node_modules/xmlbuilder/lib/XMLStreamWriter.js"(exports2, module2) {
    (function() {
      var NodeType, WriterState, XMLStreamWriter, XMLWriterBase, extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key))
            child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      }, hasProp = {}.hasOwnProperty;
      NodeType = require_NodeType();
      XMLWriterBase = require_XMLWriterBase();
      WriterState = require_WriterState();
      module2.exports = XMLStreamWriter = function(superClass) {
        extend(XMLStreamWriter2, superClass);
        function XMLStreamWriter2(stream, options) {
          this.stream = stream;
          XMLStreamWriter2.__super__.constructor.call(this, options);
        }
        XMLStreamWriter2.prototype.endline = function(node, options, level) {
          if (node.isLastRootNode && options.state === WriterState.CloseTag) {
            return "";
          } else {
            return XMLStreamWriter2.__super__.endline.call(this, node, options, level);
          }
        };
        XMLStreamWriter2.prototype.document = function(doc, options) {
          var child, i, j, k, len, len1, ref, ref1, results;
          ref = doc.children;
          for (i = j = 0, len = ref.length; j < len; i = ++j) {
            child = ref[i];
            child.isLastRootNode = i === doc.children.length - 1;
          }
          options = this.filterOptions(options);
          ref1 = doc.children;
          results = [];
          for (k = 0, len1 = ref1.length; k < len1; k++) {
            child = ref1[k];
            results.push(this.writeChildNode(child, options, 0));
          }
          return results;
        };
        XMLStreamWriter2.prototype.attribute = function(att, options, level) {
          return this.stream.write(XMLStreamWriter2.__super__.attribute.call(this, att, options, level));
        };
        XMLStreamWriter2.prototype.cdata = function(node, options, level) {
          return this.stream.write(XMLStreamWriter2.__super__.cdata.call(this, node, options, level));
        };
        XMLStreamWriter2.prototype.comment = function(node, options, level) {
          return this.stream.write(XMLStreamWriter2.__super__.comment.call(this, node, options, level));
        };
        XMLStreamWriter2.prototype.declaration = function(node, options, level) {
          return this.stream.write(XMLStreamWriter2.__super__.declaration.call(this, node, options, level));
        };
        XMLStreamWriter2.prototype.docType = function(node, options, level) {
          var child, j, len, ref;
          level || (level = 0);
          this.openNode(node, options, level);
          options.state = WriterState.OpenTag;
          this.stream.write(this.indent(node, options, level));
          this.stream.write("<!DOCTYPE " + node.root().name);
          if (node.pubID && node.sysID) {
            this.stream.write(' PUBLIC "' + node.pubID + '" "' + node.sysID + '"');
          } else if (node.sysID) {
            this.stream.write(' SYSTEM "' + node.sysID + '"');
          }
          if (node.children.length > 0) {
            this.stream.write(" [");
            this.stream.write(this.endline(node, options, level));
            options.state = WriterState.InsideTag;
            ref = node.children;
            for (j = 0, len = ref.length; j < len; j++) {
              child = ref[j];
              this.writeChildNode(child, options, level + 1);
            }
            options.state = WriterState.CloseTag;
            this.stream.write("]");
          }
          options.state = WriterState.CloseTag;
          this.stream.write(options.spaceBeforeSlash + ">");
          this.stream.write(this.endline(node, options, level));
          options.state = WriterState.None;
          return this.closeNode(node, options, level);
        };
        XMLStreamWriter2.prototype.element = function(node, options, level) {
          var att, child, childNodeCount, firstChildNode, j, len, name, prettySuppressed, ref, ref1;
          level || (level = 0);
          this.openNode(node, options, level);
          options.state = WriterState.OpenTag;
          this.stream.write(this.indent(node, options, level) + "<" + node.name);
          ref = node.attribs;
          for (name in ref) {
            if (!hasProp.call(ref, name))
              continue;
            att = ref[name];
            this.attribute(att, options, level);
          }
          childNodeCount = node.children.length;
          firstChildNode = childNodeCount === 0 ? null : node.children[0];
          if (childNodeCount === 0 || node.children.every(function(e) {
            return (e.type === NodeType.Text || e.type === NodeType.Raw) && e.value === "";
          })) {
            if (options.allowEmpty) {
              this.stream.write(">");
              options.state = WriterState.CloseTag;
              this.stream.write("</" + node.name + ">");
            } else {
              options.state = WriterState.CloseTag;
              this.stream.write(options.spaceBeforeSlash + "/>");
            }
          } else if (options.pretty && childNodeCount === 1 && (firstChildNode.type === NodeType.Text || firstChildNode.type === NodeType.Raw) && firstChildNode.value != null) {
            this.stream.write(">");
            options.state = WriterState.InsideTag;
            options.suppressPrettyCount++;
            prettySuppressed = true;
            this.writeChildNode(firstChildNode, options, level + 1);
            options.suppressPrettyCount--;
            prettySuppressed = false;
            options.state = WriterState.CloseTag;
            this.stream.write("</" + node.name + ">");
          } else {
            this.stream.write(">" + this.endline(node, options, level));
            options.state = WriterState.InsideTag;
            ref1 = node.children;
            for (j = 0, len = ref1.length; j < len; j++) {
              child = ref1[j];
              this.writeChildNode(child, options, level + 1);
            }
            options.state = WriterState.CloseTag;
            this.stream.write(this.indent(node, options, level) + "</" + node.name + ">");
          }
          this.stream.write(this.endline(node, options, level));
          options.state = WriterState.None;
          return this.closeNode(node, options, level);
        };
        XMLStreamWriter2.prototype.processingInstruction = function(node, options, level) {
          return this.stream.write(XMLStreamWriter2.__super__.processingInstruction.call(this, node, options, level));
        };
        XMLStreamWriter2.prototype.raw = function(node, options, level) {
          return this.stream.write(XMLStreamWriter2.__super__.raw.call(this, node, options, level));
        };
        XMLStreamWriter2.prototype.text = function(node, options, level) {
          return this.stream.write(XMLStreamWriter2.__super__.text.call(this, node, options, level));
        };
        XMLStreamWriter2.prototype.dtdAttList = function(node, options, level) {
          return this.stream.write(XMLStreamWriter2.__super__.dtdAttList.call(this, node, options, level));
        };
        XMLStreamWriter2.prototype.dtdElement = function(node, options, level) {
          return this.stream.write(XMLStreamWriter2.__super__.dtdElement.call(this, node, options, level));
        };
        XMLStreamWriter2.prototype.dtdEntity = function(node, options, level) {
          return this.stream.write(XMLStreamWriter2.__super__.dtdEntity.call(this, node, options, level));
        };
        XMLStreamWriter2.prototype.dtdNotation = function(node, options, level) {
          return this.stream.write(XMLStreamWriter2.__super__.dtdNotation.call(this, node, options, level));
        };
        return XMLStreamWriter2;
      }(XMLWriterBase);
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/index.js
var require_lib = __commonJS({
  "node_modules/xmlbuilder/lib/index.js"(exports2, module2) {
    (function() {
      var NodeType, WriterState, XMLDOMImplementation, XMLDocument, XMLDocumentCB, XMLStreamWriter, XMLStringWriter, assign, isFunction, ref;
      ref = require_Utility(), assign = ref.assign, isFunction = ref.isFunction;
      XMLDOMImplementation = require_XMLDOMImplementation();
      XMLDocument = require_XMLDocument();
      XMLDocumentCB = require_XMLDocumentCB();
      XMLStringWriter = require_XMLStringWriter();
      XMLStreamWriter = require_XMLStreamWriter();
      NodeType = require_NodeType();
      WriterState = require_WriterState();
      module2.exports.create = function(name, xmldec, doctype, options) {
        var doc, root;
        if (name == null) {
          throw new Error("Root element needs a name.");
        }
        options = assign({}, xmldec, doctype, options);
        doc = new XMLDocument(options);
        root = doc.element(name);
        if (!options.headless) {
          doc.declaration(options);
          if (options.pubID != null || options.sysID != null) {
            doc.dtd(options);
          }
        }
        return root;
      };
      module2.exports.begin = function(options, onData, onEnd) {
        var ref1;
        if (isFunction(options)) {
          ref1 = [options, onData], onData = ref1[0], onEnd = ref1[1];
          options = {};
        }
        if (onData) {
          return new XMLDocumentCB(options, onData, onEnd);
        } else {
          return new XMLDocument(options);
        }
      };
      module2.exports.stringWriter = function(options) {
        return new XMLStringWriter(options);
      };
      module2.exports.streamWriter = function(stream, options) {
        return new XMLStreamWriter(stream, options);
      };
      module2.exports.implementation = new XMLDOMImplementation();
      module2.exports.nodeType = NodeType;
      module2.exports.writerState = WriterState;
    }).call(exports2);
  }
});

// node_modules/xml2js/lib/builder.js
var require_builder = __commonJS({
  "node_modules/xml2js/lib/builder.js"(exports2) {
    (function() {
      "use strict";
      var builder, defaults, escapeCDATA, requiresCDATA, wrapCDATA, hasProp = {}.hasOwnProperty;
      builder = require_lib();
      defaults = require_defaults().defaults;
      requiresCDATA = function(entry) {
        return typeof entry === "string" && (entry.indexOf("&") >= 0 || entry.indexOf(">") >= 0 || entry.indexOf("<") >= 0);
      };
      wrapCDATA = function(entry) {
        return "<![CDATA[" + escapeCDATA(entry) + "]]>";
      };
      escapeCDATA = function(entry) {
        return entry.replace("]]>", "]]]]><![CDATA[>");
      };
      exports2.Builder = function() {
        function Builder(opts) {
          var key, ref, value;
          this.options = {};
          ref = defaults["0.2"];
          for (key in ref) {
            if (!hasProp.call(ref, key))
              continue;
            value = ref[key];
            this.options[key] = value;
          }
          for (key in opts) {
            if (!hasProp.call(opts, key))
              continue;
            value = opts[key];
            this.options[key] = value;
          }
        }
        Builder.prototype.buildObject = function(rootObj) {
          var attrkey, charkey, render, rootElement, rootName;
          attrkey = this.options.attrkey;
          charkey = this.options.charkey;
          if (Object.keys(rootObj).length === 1 && this.options.rootName === defaults["0.2"].rootName) {
            rootName = Object.keys(rootObj)[0];
            rootObj = rootObj[rootName];
          } else {
            rootName = this.options.rootName;
          }
          render = /* @__PURE__ */ function(_this) {
            return function(element, obj) {
              var attr, child, entry, index, key, value;
              if (typeof obj !== "object") {
                if (_this.options.cdata && requiresCDATA(obj)) {
                  element.raw(wrapCDATA(obj));
                } else {
                  element.txt(obj);
                }
              } else if (Array.isArray(obj)) {
                for (index in obj) {
                  if (!hasProp.call(obj, index))
                    continue;
                  child = obj[index];
                  for (key in child) {
                    entry = child[key];
                    element = render(element.ele(key), entry).up();
                  }
                }
              } else {
                for (key in obj) {
                  if (!hasProp.call(obj, key))
                    continue;
                  child = obj[key];
                  if (key === attrkey) {
                    if (typeof child === "object") {
                      for (attr in child) {
                        value = child[attr];
                        element = element.att(attr, value);
                      }
                    }
                  } else if (key === charkey) {
                    if (_this.options.cdata && requiresCDATA(child)) {
                      element = element.raw(wrapCDATA(child));
                    } else {
                      element = element.txt(child);
                    }
                  } else if (Array.isArray(child)) {
                    for (index in child) {
                      if (!hasProp.call(child, index))
                        continue;
                      entry = child[index];
                      if (typeof entry === "string") {
                        if (_this.options.cdata && requiresCDATA(entry)) {
                          element = element.ele(key).raw(wrapCDATA(entry)).up();
                        } else {
                          element = element.ele(key, entry).up();
                        }
                      } else {
                        element = render(element.ele(key), entry).up();
                      }
                    }
                  } else if (typeof child === "object") {
                    element = render(element.ele(key), child).up();
                  } else {
                    if (typeof child === "string" && _this.options.cdata && requiresCDATA(child)) {
                      element = element.ele(key).raw(wrapCDATA(child)).up();
                    } else {
                      if (child == null) {
                        child = "";
                      }
                      element = element.ele(key, child.toString()).up();
                    }
                  }
                }
              }
              return element;
            };
          }(this);
          rootElement = builder.create(rootName, this.options.xmldec, this.options.doctype, {
            headless: this.options.headless,
            allowSurrogateChars: this.options.allowSurrogateChars
          });
          return render(rootElement, rootObj).end(this.options.renderOpts);
        };
        return Builder;
      }();
    }).call(exports2);
  }
});

// node_modules/sax/lib/sax.js
var require_sax = __commonJS({
  "node_modules/sax/lib/sax.js"(exports2) {
    (function(sax) {
      sax.parser = function(strict, opt) {
        return new SAXParser(strict, opt);
      };
      sax.SAXParser = SAXParser;
      sax.SAXStream = SAXStream;
      sax.createStream = createStream;
      sax.MAX_BUFFER_LENGTH = 64 * 1024;
      var buffers2 = [
        "comment",
        "sgmlDecl",
        "textNode",
        "tagName",
        "doctype",
        "procInstName",
        "procInstBody",
        "entity",
        "attribName",
        "attribValue",
        "cdata",
        "script"
      ];
      sax.EVENTS = [
        "text",
        "processinginstruction",
        "sgmldeclaration",
        "doctype",
        "comment",
        "opentagstart",
        "attribute",
        "opentag",
        "closetag",
        "opencdata",
        "cdata",
        "closecdata",
        "error",
        "end",
        "ready",
        "script",
        "opennamespace",
        "closenamespace"
      ];
      function SAXParser(strict, opt) {
        if (!(this instanceof SAXParser)) {
          return new SAXParser(strict, opt);
        }
        var parser = this;
        clearBuffers(parser);
        parser.q = parser.c = "";
        parser.bufferCheckPosition = sax.MAX_BUFFER_LENGTH;
        parser.opt = opt || {};
        parser.opt.lowercase = parser.opt.lowercase || parser.opt.lowercasetags;
        parser.looseCase = parser.opt.lowercase ? "toLowerCase" : "toUpperCase";
        parser.tags = [];
        parser.closed = parser.closedRoot = parser.sawRoot = false;
        parser.tag = parser.error = null;
        parser.strict = !!strict;
        parser.noscript = !!(strict || parser.opt.noscript);
        parser.state = S.BEGIN;
        parser.strictEntities = parser.opt.strictEntities;
        parser.ENTITIES = parser.strictEntities ? Object.create(sax.XML_ENTITIES) : Object.create(sax.ENTITIES);
        parser.attribList = [];
        if (parser.opt.xmlns) {
          parser.ns = Object.create(rootNS);
        }
        if (parser.opt.unquotedAttributeValues === void 0) {
          parser.opt.unquotedAttributeValues = !strict;
        }
        parser.trackPosition = parser.opt.position !== false;
        if (parser.trackPosition) {
          parser.position = parser.line = parser.column = 0;
        }
        emit(parser, "onready");
      }
      if (!Object.create) {
        Object.create = function(o) {
          function F() {
          }
          F.prototype = o;
          var newf = new F();
          return newf;
        };
      }
      if (!Object.keys) {
        Object.keys = function(o) {
          var a = [];
          for (var i in o)
            if (o.hasOwnProperty(i))
              a.push(i);
          return a;
        };
      }
      function checkBufferLength(parser) {
        var maxAllowed = Math.max(sax.MAX_BUFFER_LENGTH, 10);
        var maxActual = 0;
        for (var i = 0, l = buffers2.length; i < l; i++) {
          var len = parser[buffers2[i]].length;
          if (len > maxAllowed) {
            switch (buffers2[i]) {
              case "textNode":
                closeText(parser);
                break;
              case "cdata":
                emitNode(parser, "oncdata", parser.cdata);
                parser.cdata = "";
                break;
              case "script":
                emitNode(parser, "onscript", parser.script);
                parser.script = "";
                break;
              default:
                error(parser, "Max buffer length exceeded: " + buffers2[i]);
            }
          }
          maxActual = Math.max(maxActual, len);
        }
        var m = sax.MAX_BUFFER_LENGTH - maxActual;
        parser.bufferCheckPosition = m + parser.position;
      }
      function clearBuffers(parser) {
        for (var i = 0, l = buffers2.length; i < l; i++) {
          parser[buffers2[i]] = "";
        }
      }
      function flushBuffers(parser) {
        closeText(parser);
        if (parser.cdata !== "") {
          emitNode(parser, "oncdata", parser.cdata);
          parser.cdata = "";
        }
        if (parser.script !== "") {
          emitNode(parser, "onscript", parser.script);
          parser.script = "";
        }
      }
      SAXParser.prototype = {
        end: function() {
          end(this);
        },
        write,
        resume: function() {
          this.error = null;
          return this;
        },
        close: function() {
          return this.write(null);
        },
        flush: function() {
          flushBuffers(this);
        }
      };
      var Stream;
      try {
        Stream = require("stream").Stream;
      } catch (ex) {
        Stream = function() {
        };
      }
      if (!Stream)
        Stream = function() {
        };
      var streamWraps = sax.EVENTS.filter(function(ev) {
        return ev !== "error" && ev !== "end";
      });
      function createStream(strict, opt) {
        return new SAXStream(strict, opt);
      }
      function SAXStream(strict, opt) {
        if (!(this instanceof SAXStream)) {
          return new SAXStream(strict, opt);
        }
        Stream.apply(this);
        this._parser = new SAXParser(strict, opt);
        this.writable = true;
        this.readable = true;
        var me = this;
        this._parser.onend = function() {
          me.emit("end");
        };
        this._parser.onerror = function(er) {
          me.emit("error", er);
          me._parser.error = null;
        };
        this._decoder = null;
        streamWraps.forEach(function(ev) {
          Object.defineProperty(me, "on" + ev, {
            get: function() {
              return me._parser["on" + ev];
            },
            set: function(h) {
              if (!h) {
                me.removeAllListeners(ev);
                me._parser["on" + ev] = h;
                return h;
              }
              me.on(ev, h);
            },
            enumerable: true,
            configurable: false
          });
        });
      }
      SAXStream.prototype = Object.create(Stream.prototype, {
        constructor: {
          value: SAXStream
        }
      });
      SAXStream.prototype.write = function(data) {
        if (typeof Buffer === "function" && typeof Buffer.isBuffer === "function" && Buffer.isBuffer(data)) {
          if (!this._decoder) {
            var SD = require("string_decoder").StringDecoder;
            this._decoder = new SD("utf8");
          }
          data = this._decoder.write(data);
        }
        this._parser.write(data.toString());
        this.emit("data", data);
        return true;
      };
      SAXStream.prototype.end = function(chunk) {
        if (chunk && chunk.length) {
          this.write(chunk);
        }
        this._parser.end();
        return true;
      };
      SAXStream.prototype.on = function(ev, handler) {
        var me = this;
        if (!me._parser["on" + ev] && streamWraps.indexOf(ev) !== -1) {
          me._parser["on" + ev] = function() {
            var args = arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments);
            args.splice(0, 0, ev);
            me.emit.apply(me, args);
          };
        }
        return Stream.prototype.on.call(me, ev, handler);
      };
      var CDATA = "[CDATA[";
      var DOCTYPE = "DOCTYPE";
      var XML_NAMESPACE = "http://www.w3.org/XML/1998/namespace";
      var XMLNS_NAMESPACE = "http://www.w3.org/2000/xmlns/";
      var rootNS = { xml: XML_NAMESPACE, xmlns: XMLNS_NAMESPACE };
      var nameStart = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/;
      var nameBody = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/;
      var entityStart = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/;
      var entityBody = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/;
      function isWhitespace(c) {
        return c === " " || c === "\n" || c === "\r" || c === "	";
      }
      function isQuote(c) {
        return c === '"' || c === "'";
      }
      function isAttribEnd(c) {
        return c === ">" || isWhitespace(c);
      }
      function isMatch(regex, c) {
        return regex.test(c);
      }
      function notMatch(regex, c) {
        return !isMatch(regex, c);
      }
      var S = 0;
      sax.STATE = {
        BEGIN: S++,
        // leading byte order mark or whitespace
        BEGIN_WHITESPACE: S++,
        // leading whitespace
        TEXT: S++,
        // general stuff
        TEXT_ENTITY: S++,
        // &amp and such.
        OPEN_WAKA: S++,
        // <
        SGML_DECL: S++,
        // <!BLARG
        SGML_DECL_QUOTED: S++,
        // <!BLARG foo "bar
        DOCTYPE: S++,
        // <!DOCTYPE
        DOCTYPE_QUOTED: S++,
        // <!DOCTYPE "//blah
        DOCTYPE_DTD: S++,
        // <!DOCTYPE "//blah" [ ...
        DOCTYPE_DTD_QUOTED: S++,
        // <!DOCTYPE "//blah" [ "foo
        COMMENT_STARTING: S++,
        // <!-
        COMMENT: S++,
        // <!--
        COMMENT_ENDING: S++,
        // <!-- blah -
        COMMENT_ENDED: S++,
        // <!-- blah --
        CDATA: S++,
        // <![CDATA[ something
        CDATA_ENDING: S++,
        // ]
        CDATA_ENDING_2: S++,
        // ]]
        PROC_INST: S++,
        // <?hi
        PROC_INST_BODY: S++,
        // <?hi there
        PROC_INST_ENDING: S++,
        // <?hi "there" ?
        OPEN_TAG: S++,
        // <strong
        OPEN_TAG_SLASH: S++,
        // <strong /
        ATTRIB: S++,
        // <a
        ATTRIB_NAME: S++,
        // <a foo
        ATTRIB_NAME_SAW_WHITE: S++,
        // <a foo _
        ATTRIB_VALUE: S++,
        // <a foo=
        ATTRIB_VALUE_QUOTED: S++,
        // <a foo="bar
        ATTRIB_VALUE_CLOSED: S++,
        // <a foo="bar"
        ATTRIB_VALUE_UNQUOTED: S++,
        // <a foo=bar
        ATTRIB_VALUE_ENTITY_Q: S++,
        // <foo bar="&quot;"
        ATTRIB_VALUE_ENTITY_U: S++,
        // <foo bar=&quot
        CLOSE_TAG: S++,
        // </a
        CLOSE_TAG_SAW_WHITE: S++,
        // </a   >
        SCRIPT: S++,
        // <script> ...
        SCRIPT_ENDING: S++
        // <script> ... <
      };
      sax.XML_ENTITIES = {
        "amp": "&",
        "gt": ">",
        "lt": "<",
        "quot": '"',
        "apos": "'"
      };
      sax.ENTITIES = {
        "amp": "&",
        "gt": ">",
        "lt": "<",
        "quot": '"',
        "apos": "'",
        "AElig": 198,
        "Aacute": 193,
        "Acirc": 194,
        "Agrave": 192,
        "Aring": 197,
        "Atilde": 195,
        "Auml": 196,
        "Ccedil": 199,
        "ETH": 208,
        "Eacute": 201,
        "Ecirc": 202,
        "Egrave": 200,
        "Euml": 203,
        "Iacute": 205,
        "Icirc": 206,
        "Igrave": 204,
        "Iuml": 207,
        "Ntilde": 209,
        "Oacute": 211,
        "Ocirc": 212,
        "Ograve": 210,
        "Oslash": 216,
        "Otilde": 213,
        "Ouml": 214,
        "THORN": 222,
        "Uacute": 218,
        "Ucirc": 219,
        "Ugrave": 217,
        "Uuml": 220,
        "Yacute": 221,
        "aacute": 225,
        "acirc": 226,
        "aelig": 230,
        "agrave": 224,
        "aring": 229,
        "atilde": 227,
        "auml": 228,
        "ccedil": 231,
        "eacute": 233,
        "ecirc": 234,
        "egrave": 232,
        "eth": 240,
        "euml": 235,
        "iacute": 237,
        "icirc": 238,
        "igrave": 236,
        "iuml": 239,
        "ntilde": 241,
        "oacute": 243,
        "ocirc": 244,
        "ograve": 242,
        "oslash": 248,
        "otilde": 245,
        "ouml": 246,
        "szlig": 223,
        "thorn": 254,
        "uacute": 250,
        "ucirc": 251,
        "ugrave": 249,
        "uuml": 252,
        "yacute": 253,
        "yuml": 255,
        "copy": 169,
        "reg": 174,
        "nbsp": 160,
        "iexcl": 161,
        "cent": 162,
        "pound": 163,
        "curren": 164,
        "yen": 165,
        "brvbar": 166,
        "sect": 167,
        "uml": 168,
        "ordf": 170,
        "laquo": 171,
        "not": 172,
        "shy": 173,
        "macr": 175,
        "deg": 176,
        "plusmn": 177,
        "sup1": 185,
        "sup2": 178,
        "sup3": 179,
        "acute": 180,
        "micro": 181,
        "para": 182,
        "middot": 183,
        "cedil": 184,
        "ordm": 186,
        "raquo": 187,
        "frac14": 188,
        "frac12": 189,
        "frac34": 190,
        "iquest": 191,
        "times": 215,
        "divide": 247,
        "OElig": 338,
        "oelig": 339,
        "Scaron": 352,
        "scaron": 353,
        "Yuml": 376,
        "fnof": 402,
        "circ": 710,
        "tilde": 732,
        "Alpha": 913,
        "Beta": 914,
        "Gamma": 915,
        "Delta": 916,
        "Epsilon": 917,
        "Zeta": 918,
        "Eta": 919,
        "Theta": 920,
        "Iota": 921,
        "Kappa": 922,
        "Lambda": 923,
        "Mu": 924,
        "Nu": 925,
        "Xi": 926,
        "Omicron": 927,
        "Pi": 928,
        "Rho": 929,
        "Sigma": 931,
        "Tau": 932,
        "Upsilon": 933,
        "Phi": 934,
        "Chi": 935,
        "Psi": 936,
        "Omega": 937,
        "alpha": 945,
        "beta": 946,
        "gamma": 947,
        "delta": 948,
        "epsilon": 949,
        "zeta": 950,
        "eta": 951,
        "theta": 952,
        "iota": 953,
        "kappa": 954,
        "lambda": 955,
        "mu": 956,
        "nu": 957,
        "xi": 958,
        "omicron": 959,
        "pi": 960,
        "rho": 961,
        "sigmaf": 962,
        "sigma": 963,
        "tau": 964,
        "upsilon": 965,
        "phi": 966,
        "chi": 967,
        "psi": 968,
        "omega": 969,
        "thetasym": 977,
        "upsih": 978,
        "piv": 982,
        "ensp": 8194,
        "emsp": 8195,
        "thinsp": 8201,
        "zwnj": 8204,
        "zwj": 8205,
        "lrm": 8206,
        "rlm": 8207,
        "ndash": 8211,
        "mdash": 8212,
        "lsquo": 8216,
        "rsquo": 8217,
        "sbquo": 8218,
        "ldquo": 8220,
        "rdquo": 8221,
        "bdquo": 8222,
        "dagger": 8224,
        "Dagger": 8225,
        "bull": 8226,
        "hellip": 8230,
        "permil": 8240,
        "prime": 8242,
        "Prime": 8243,
        "lsaquo": 8249,
        "rsaquo": 8250,
        "oline": 8254,
        "frasl": 8260,
        "euro": 8364,
        "image": 8465,
        "weierp": 8472,
        "real": 8476,
        "trade": 8482,
        "alefsym": 8501,
        "larr": 8592,
        "uarr": 8593,
        "rarr": 8594,
        "darr": 8595,
        "harr": 8596,
        "crarr": 8629,
        "lArr": 8656,
        "uArr": 8657,
        "rArr": 8658,
        "dArr": 8659,
        "hArr": 8660,
        "forall": 8704,
        "part": 8706,
        "exist": 8707,
        "empty": 8709,
        "nabla": 8711,
        "isin": 8712,
        "notin": 8713,
        "ni": 8715,
        "prod": 8719,
        "sum": 8721,
        "minus": 8722,
        "lowast": 8727,
        "radic": 8730,
        "prop": 8733,
        "infin": 8734,
        "ang": 8736,
        "and": 8743,
        "or": 8744,
        "cap": 8745,
        "cup": 8746,
        "int": 8747,
        "there4": 8756,
        "sim": 8764,
        "cong": 8773,
        "asymp": 8776,
        "ne": 8800,
        "equiv": 8801,
        "le": 8804,
        "ge": 8805,
        "sub": 8834,
        "sup": 8835,
        "nsub": 8836,
        "sube": 8838,
        "supe": 8839,
        "oplus": 8853,
        "otimes": 8855,
        "perp": 8869,
        "sdot": 8901,
        "lceil": 8968,
        "rceil": 8969,
        "lfloor": 8970,
        "rfloor": 8971,
        "lang": 9001,
        "rang": 9002,
        "loz": 9674,
        "spades": 9824,
        "clubs": 9827,
        "hearts": 9829,
        "diams": 9830
      };
      Object.keys(sax.ENTITIES).forEach(function(key) {
        var e = sax.ENTITIES[key];
        var s2 = typeof e === "number" ? String.fromCharCode(e) : e;
        sax.ENTITIES[key] = s2;
      });
      for (var s in sax.STATE) {
        sax.STATE[sax.STATE[s]] = s;
      }
      S = sax.STATE;
      function emit(parser, event, data) {
        parser[event] && parser[event](data);
      }
      function emitNode(parser, nodeType, data) {
        if (parser.textNode)
          closeText(parser);
        emit(parser, nodeType, data);
      }
      function closeText(parser) {
        parser.textNode = textopts(parser.opt, parser.textNode);
        if (parser.textNode)
          emit(parser, "ontext", parser.textNode);
        parser.textNode = "";
      }
      function textopts(opt, text) {
        if (opt.trim)
          text = text.trim();
        if (opt.normalize)
          text = text.replace(/\s+/g, " ");
        return text;
      }
      function error(parser, er) {
        closeText(parser);
        if (parser.trackPosition) {
          er += "\nLine: " + parser.line + "\nColumn: " + parser.column + "\nChar: " + parser.c;
        }
        er = new Error(er);
        parser.error = er;
        emit(parser, "onerror", er);
        return parser;
      }
      function end(parser) {
        if (parser.sawRoot && !parser.closedRoot)
          strictFail(parser, "Unclosed root tag");
        if (parser.state !== S.BEGIN && parser.state !== S.BEGIN_WHITESPACE && parser.state !== S.TEXT) {
          error(parser, "Unexpected end");
        }
        closeText(parser);
        parser.c = "";
        parser.closed = true;
        emit(parser, "onend");
        SAXParser.call(parser, parser.strict, parser.opt);
        return parser;
      }
      function strictFail(parser, message) {
        if (typeof parser !== "object" || !(parser instanceof SAXParser)) {
          throw new Error("bad call to strictFail");
        }
        if (parser.strict) {
          error(parser, message);
        }
      }
      function newTag(parser) {
        if (!parser.strict)
          parser.tagName = parser.tagName[parser.looseCase]();
        var parent = parser.tags[parser.tags.length - 1] || parser;
        var tag = parser.tag = { name: parser.tagName, attributes: {} };
        if (parser.opt.xmlns) {
          tag.ns = parent.ns;
        }
        parser.attribList.length = 0;
        emitNode(parser, "onopentagstart", tag);
      }
      function qname(name, attribute) {
        var i = name.indexOf(":");
        var qualName = i < 0 ? ["", name] : name.split(":");
        var prefix2 = qualName[0];
        var local = qualName[1];
        if (attribute && name === "xmlns") {
          prefix2 = "xmlns";
          local = "";
        }
        return { prefix: prefix2, local };
      }
      function attrib(parser) {
        if (!parser.strict) {
          parser.attribName = parser.attribName[parser.looseCase]();
        }
        if (parser.attribList.indexOf(parser.attribName) !== -1 || parser.tag.attributes.hasOwnProperty(parser.attribName)) {
          parser.attribName = parser.attribValue = "";
          return;
        }
        if (parser.opt.xmlns) {
          var qn = qname(parser.attribName, true);
          var prefix2 = qn.prefix;
          var local = qn.local;
          if (prefix2 === "xmlns") {
            if (local === "xml" && parser.attribValue !== XML_NAMESPACE) {
              strictFail(
                parser,
                "xml: prefix must be bound to " + XML_NAMESPACE + "\nActual: " + parser.attribValue
              );
            } else if (local === "xmlns" && parser.attribValue !== XMLNS_NAMESPACE) {
              strictFail(
                parser,
                "xmlns: prefix must be bound to " + XMLNS_NAMESPACE + "\nActual: " + parser.attribValue
              );
            } else {
              var tag = parser.tag;
              var parent = parser.tags[parser.tags.length - 1] || parser;
              if (tag.ns === parent.ns) {
                tag.ns = Object.create(parent.ns);
              }
              tag.ns[local] = parser.attribValue;
            }
          }
          parser.attribList.push([parser.attribName, parser.attribValue]);
        } else {
          parser.tag.attributes[parser.attribName] = parser.attribValue;
          emitNode(parser, "onattribute", {
            name: parser.attribName,
            value: parser.attribValue
          });
        }
        parser.attribName = parser.attribValue = "";
      }
      function openTag(parser, selfClosing) {
        if (parser.opt.xmlns) {
          var tag = parser.tag;
          var qn = qname(parser.tagName);
          tag.prefix = qn.prefix;
          tag.local = qn.local;
          tag.uri = tag.ns[qn.prefix] || "";
          if (tag.prefix && !tag.uri) {
            strictFail(parser, "Unbound namespace prefix: " + JSON.stringify(parser.tagName));
            tag.uri = qn.prefix;
          }
          var parent = parser.tags[parser.tags.length - 1] || parser;
          if (tag.ns && parent.ns !== tag.ns) {
            Object.keys(tag.ns).forEach(function(p) {
              emitNode(parser, "onopennamespace", {
                prefix: p,
                uri: tag.ns[p]
              });
            });
          }
          for (var i = 0, l = parser.attribList.length; i < l; i++) {
            var nv = parser.attribList[i];
            var name = nv[0];
            var value = nv[1];
            var qualName = qname(name, true);
            var prefix2 = qualName.prefix;
            var local = qualName.local;
            var uri = prefix2 === "" ? "" : tag.ns[prefix2] || "";
            var a = {
              name,
              value,
              prefix: prefix2,
              local,
              uri
            };
            if (prefix2 && prefix2 !== "xmlns" && !uri) {
              strictFail(parser, "Unbound namespace prefix: " + JSON.stringify(prefix2));
              a.uri = prefix2;
            }
            parser.tag.attributes[name] = a;
            emitNode(parser, "onattribute", a);
          }
          parser.attribList.length = 0;
        }
        parser.tag.isSelfClosing = !!selfClosing;
        parser.sawRoot = true;
        parser.tags.push(parser.tag);
        emitNode(parser, "onopentag", parser.tag);
        if (!selfClosing) {
          if (!parser.noscript && parser.tagName.toLowerCase() === "script") {
            parser.state = S.SCRIPT;
          } else {
            parser.state = S.TEXT;
          }
          parser.tag = null;
          parser.tagName = "";
        }
        parser.attribName = parser.attribValue = "";
        parser.attribList.length = 0;
      }
      function closeTag(parser) {
        if (!parser.tagName) {
          strictFail(parser, "Weird empty close tag.");
          parser.textNode += "</>";
          parser.state = S.TEXT;
          return;
        }
        if (parser.script) {
          if (parser.tagName !== "script") {
            parser.script += "</" + parser.tagName + ">";
            parser.tagName = "";
            parser.state = S.SCRIPT;
            return;
          }
          emitNode(parser, "onscript", parser.script);
          parser.script = "";
        }
        var t = parser.tags.length;
        var tagName = parser.tagName;
        if (!parser.strict) {
          tagName = tagName[parser.looseCase]();
        }
        var closeTo = tagName;
        while (t--) {
          var close = parser.tags[t];
          if (close.name !== closeTo) {
            strictFail(parser, "Unexpected close tag");
          } else {
            break;
          }
        }
        if (t < 0) {
          strictFail(parser, "Unmatched closing tag: " + parser.tagName);
          parser.textNode += "</" + parser.tagName + ">";
          parser.state = S.TEXT;
          return;
        }
        parser.tagName = tagName;
        var s2 = parser.tags.length;
        while (s2-- > t) {
          var tag = parser.tag = parser.tags.pop();
          parser.tagName = parser.tag.name;
          emitNode(parser, "onclosetag", parser.tagName);
          var x = {};
          for (var i in tag.ns) {
            x[i] = tag.ns[i];
          }
          var parent = parser.tags[parser.tags.length - 1] || parser;
          if (parser.opt.xmlns && tag.ns !== parent.ns) {
            Object.keys(tag.ns).forEach(function(p) {
              var n = tag.ns[p];
              emitNode(parser, "onclosenamespace", { prefix: p, uri: n });
            });
          }
        }
        if (t === 0)
          parser.closedRoot = true;
        parser.tagName = parser.attribValue = parser.attribName = "";
        parser.attribList.length = 0;
        parser.state = S.TEXT;
      }
      function parseEntity(parser) {
        var entity = parser.entity;
        var entityLC = entity.toLowerCase();
        var num;
        var numStr = "";
        if (parser.ENTITIES[entity]) {
          return parser.ENTITIES[entity];
        }
        if (parser.ENTITIES[entityLC]) {
          return parser.ENTITIES[entityLC];
        }
        entity = entityLC;
        if (entity.charAt(0) === "#") {
          if (entity.charAt(1) === "x") {
            entity = entity.slice(2);
            num = parseInt(entity, 16);
            numStr = num.toString(16);
          } else {
            entity = entity.slice(1);
            num = parseInt(entity, 10);
            numStr = num.toString(10);
          }
        }
        entity = entity.replace(/^0+/, "");
        if (isNaN(num) || numStr.toLowerCase() !== entity) {
          strictFail(parser, "Invalid character entity");
          return "&" + parser.entity + ";";
        }
        return String.fromCodePoint(num);
      }
      function beginWhiteSpace(parser, c) {
        if (c === "<") {
          parser.state = S.OPEN_WAKA;
          parser.startTagPosition = parser.position;
        } else if (!isWhitespace(c)) {
          strictFail(parser, "Non-whitespace before first tag.");
          parser.textNode = c;
          parser.state = S.TEXT;
        }
      }
      function charAt(chunk, i) {
        var result = "";
        if (i < chunk.length) {
          result = chunk.charAt(i);
        }
        return result;
      }
      function write(chunk) {
        var parser = this;
        if (this.error) {
          throw this.error;
        }
        if (parser.closed) {
          return error(
            parser,
            "Cannot write after close. Assign an onready handler."
          );
        }
        if (chunk === null) {
          return end(parser);
        }
        if (typeof chunk === "object") {
          chunk = chunk.toString();
        }
        var i = 0;
        var c = "";
        while (true) {
          c = charAt(chunk, i++);
          parser.c = c;
          if (!c) {
            break;
          }
          if (parser.trackPosition) {
            parser.position++;
            if (c === "\n") {
              parser.line++;
              parser.column = 0;
            } else {
              parser.column++;
            }
          }
          switch (parser.state) {
            case S.BEGIN:
              parser.state = S.BEGIN_WHITESPACE;
              if (c === "\uFEFF") {
                continue;
              }
              beginWhiteSpace(parser, c);
              continue;
            case S.BEGIN_WHITESPACE:
              beginWhiteSpace(parser, c);
              continue;
            case S.TEXT:
              if (parser.sawRoot && !parser.closedRoot) {
                var starti = i - 1;
                while (c && c !== "<" && c !== "&") {
                  c = charAt(chunk, i++);
                  if (c && parser.trackPosition) {
                    parser.position++;
                    if (c === "\n") {
                      parser.line++;
                      parser.column = 0;
                    } else {
                      parser.column++;
                    }
                  }
                }
                parser.textNode += chunk.substring(starti, i - 1);
              }
              if (c === "<" && !(parser.sawRoot && parser.closedRoot && !parser.strict)) {
                parser.state = S.OPEN_WAKA;
                parser.startTagPosition = parser.position;
              } else {
                if (!isWhitespace(c) && (!parser.sawRoot || parser.closedRoot)) {
                  strictFail(parser, "Text data outside of root node.");
                }
                if (c === "&") {
                  parser.state = S.TEXT_ENTITY;
                } else {
                  parser.textNode += c;
                }
              }
              continue;
            case S.SCRIPT:
              if (c === "<") {
                parser.state = S.SCRIPT_ENDING;
              } else {
                parser.script += c;
              }
              continue;
            case S.SCRIPT_ENDING:
              if (c === "/") {
                parser.state = S.CLOSE_TAG;
              } else {
                parser.script += "<" + c;
                parser.state = S.SCRIPT;
              }
              continue;
            case S.OPEN_WAKA:
              if (c === "!") {
                parser.state = S.SGML_DECL;
                parser.sgmlDecl = "";
              } else if (isWhitespace(c)) {
              } else if (isMatch(nameStart, c)) {
                parser.state = S.OPEN_TAG;
                parser.tagName = c;
              } else if (c === "/") {
                parser.state = S.CLOSE_TAG;
                parser.tagName = "";
              } else if (c === "?") {
                parser.state = S.PROC_INST;
                parser.procInstName = parser.procInstBody = "";
              } else {
                strictFail(parser, "Unencoded <");
                if (parser.startTagPosition + 1 < parser.position) {
                  var pad = parser.position - parser.startTagPosition;
                  c = new Array(pad).join(" ") + c;
                }
                parser.textNode += "<" + c;
                parser.state = S.TEXT;
              }
              continue;
            case S.SGML_DECL:
              if (parser.sgmlDecl + c === "--") {
                parser.state = S.COMMENT;
                parser.comment = "";
                parser.sgmlDecl = "";
                continue;
              }
              if (parser.doctype && parser.doctype !== true && parser.sgmlDecl) {
                parser.state = S.DOCTYPE_DTD;
                parser.doctype += "<!" + parser.sgmlDecl + c;
                parser.sgmlDecl = "";
              } else if ((parser.sgmlDecl + c).toUpperCase() === CDATA) {
                emitNode(parser, "onopencdata");
                parser.state = S.CDATA;
                parser.sgmlDecl = "";
                parser.cdata = "";
              } else if ((parser.sgmlDecl + c).toUpperCase() === DOCTYPE) {
                parser.state = S.DOCTYPE;
                if (parser.doctype || parser.sawRoot) {
                  strictFail(
                    parser,
                    "Inappropriately located doctype declaration"
                  );
                }
                parser.doctype = "";
                parser.sgmlDecl = "";
              } else if (c === ">") {
                emitNode(parser, "onsgmldeclaration", parser.sgmlDecl);
                parser.sgmlDecl = "";
                parser.state = S.TEXT;
              } else if (isQuote(c)) {
                parser.state = S.SGML_DECL_QUOTED;
                parser.sgmlDecl += c;
              } else {
                parser.sgmlDecl += c;
              }
              continue;
            case S.SGML_DECL_QUOTED:
              if (c === parser.q) {
                parser.state = S.SGML_DECL;
                parser.q = "";
              }
              parser.sgmlDecl += c;
              continue;
            case S.DOCTYPE:
              if (c === ">") {
                parser.state = S.TEXT;
                emitNode(parser, "ondoctype", parser.doctype);
                parser.doctype = true;
              } else {
                parser.doctype += c;
                if (c === "[") {
                  parser.state = S.DOCTYPE_DTD;
                } else if (isQuote(c)) {
                  parser.state = S.DOCTYPE_QUOTED;
                  parser.q = c;
                }
              }
              continue;
            case S.DOCTYPE_QUOTED:
              parser.doctype += c;
              if (c === parser.q) {
                parser.q = "";
                parser.state = S.DOCTYPE;
              }
              continue;
            case S.DOCTYPE_DTD:
              if (c === "]") {
                parser.doctype += c;
                parser.state = S.DOCTYPE;
              } else if (c === "<") {
                parser.state = S.OPEN_WAKA;
                parser.startTagPosition = parser.position;
              } else if (isQuote(c)) {
                parser.doctype += c;
                parser.state = S.DOCTYPE_DTD_QUOTED;
                parser.q = c;
              } else {
                parser.doctype += c;
              }
              continue;
            case S.DOCTYPE_DTD_QUOTED:
              parser.doctype += c;
              if (c === parser.q) {
                parser.state = S.DOCTYPE_DTD;
                parser.q = "";
              }
              continue;
            case S.COMMENT:
              if (c === "-") {
                parser.state = S.COMMENT_ENDING;
              } else {
                parser.comment += c;
              }
              continue;
            case S.COMMENT_ENDING:
              if (c === "-") {
                parser.state = S.COMMENT_ENDED;
                parser.comment = textopts(parser.opt, parser.comment);
                if (parser.comment) {
                  emitNode(parser, "oncomment", parser.comment);
                }
                parser.comment = "";
              } else {
                parser.comment += "-" + c;
                parser.state = S.COMMENT;
              }
              continue;
            case S.COMMENT_ENDED:
              if (c !== ">") {
                strictFail(parser, "Malformed comment");
                parser.comment += "--" + c;
                parser.state = S.COMMENT;
              } else if (parser.doctype && parser.doctype !== true) {
                parser.state = S.DOCTYPE_DTD;
              } else {
                parser.state = S.TEXT;
              }
              continue;
            case S.CDATA:
              if (c === "]") {
                parser.state = S.CDATA_ENDING;
              } else {
                parser.cdata += c;
              }
              continue;
            case S.CDATA_ENDING:
              if (c === "]") {
                parser.state = S.CDATA_ENDING_2;
              } else {
                parser.cdata += "]" + c;
                parser.state = S.CDATA;
              }
              continue;
            case S.CDATA_ENDING_2:
              if (c === ">") {
                if (parser.cdata) {
                  emitNode(parser, "oncdata", parser.cdata);
                }
                emitNode(parser, "onclosecdata");
                parser.cdata = "";
                parser.state = S.TEXT;
              } else if (c === "]") {
                parser.cdata += "]";
              } else {
                parser.cdata += "]]" + c;
                parser.state = S.CDATA;
              }
              continue;
            case S.PROC_INST:
              if (c === "?") {
                parser.state = S.PROC_INST_ENDING;
              } else if (isWhitespace(c)) {
                parser.state = S.PROC_INST_BODY;
              } else {
                parser.procInstName += c;
              }
              continue;
            case S.PROC_INST_BODY:
              if (!parser.procInstBody && isWhitespace(c)) {
                continue;
              } else if (c === "?") {
                parser.state = S.PROC_INST_ENDING;
              } else {
                parser.procInstBody += c;
              }
              continue;
            case S.PROC_INST_ENDING:
              if (c === ">") {
                emitNode(parser, "onprocessinginstruction", {
                  name: parser.procInstName,
                  body: parser.procInstBody
                });
                parser.procInstName = parser.procInstBody = "";
                parser.state = S.TEXT;
              } else {
                parser.procInstBody += "?" + c;
                parser.state = S.PROC_INST_BODY;
              }
              continue;
            case S.OPEN_TAG:
              if (isMatch(nameBody, c)) {
                parser.tagName += c;
              } else {
                newTag(parser);
                if (c === ">") {
                  openTag(parser);
                } else if (c === "/") {
                  parser.state = S.OPEN_TAG_SLASH;
                } else {
                  if (!isWhitespace(c)) {
                    strictFail(parser, "Invalid character in tag name");
                  }
                  parser.state = S.ATTRIB;
                }
              }
              continue;
            case S.OPEN_TAG_SLASH:
              if (c === ">") {
                openTag(parser, true);
                closeTag(parser);
              } else {
                strictFail(parser, "Forward-slash in opening tag not followed by >");
                parser.state = S.ATTRIB;
              }
              continue;
            case S.ATTRIB:
              if (isWhitespace(c)) {
                continue;
              } else if (c === ">") {
                openTag(parser);
              } else if (c === "/") {
                parser.state = S.OPEN_TAG_SLASH;
              } else if (isMatch(nameStart, c)) {
                parser.attribName = c;
                parser.attribValue = "";
                parser.state = S.ATTRIB_NAME;
              } else {
                strictFail(parser, "Invalid attribute name");
              }
              continue;
            case S.ATTRIB_NAME:
              if (c === "=") {
                parser.state = S.ATTRIB_VALUE;
              } else if (c === ">") {
                strictFail(parser, "Attribute without value");
                parser.attribValue = parser.attribName;
                attrib(parser);
                openTag(parser);
              } else if (isWhitespace(c)) {
                parser.state = S.ATTRIB_NAME_SAW_WHITE;
              } else if (isMatch(nameBody, c)) {
                parser.attribName += c;
              } else {
                strictFail(parser, "Invalid attribute name");
              }
              continue;
            case S.ATTRIB_NAME_SAW_WHITE:
              if (c === "=") {
                parser.state = S.ATTRIB_VALUE;
              } else if (isWhitespace(c)) {
                continue;
              } else {
                strictFail(parser, "Attribute without value");
                parser.tag.attributes[parser.attribName] = "";
                parser.attribValue = "";
                emitNode(parser, "onattribute", {
                  name: parser.attribName,
                  value: ""
                });
                parser.attribName = "";
                if (c === ">") {
                  openTag(parser);
                } else if (isMatch(nameStart, c)) {
                  parser.attribName = c;
                  parser.state = S.ATTRIB_NAME;
                } else {
                  strictFail(parser, "Invalid attribute name");
                  parser.state = S.ATTRIB;
                }
              }
              continue;
            case S.ATTRIB_VALUE:
              if (isWhitespace(c)) {
                continue;
              } else if (isQuote(c)) {
                parser.q = c;
                parser.state = S.ATTRIB_VALUE_QUOTED;
              } else {
                if (!parser.opt.unquotedAttributeValues) {
                  error(parser, "Unquoted attribute value");
                }
                parser.state = S.ATTRIB_VALUE_UNQUOTED;
                parser.attribValue = c;
              }
              continue;
            case S.ATTRIB_VALUE_QUOTED:
              if (c !== parser.q) {
                if (c === "&") {
                  parser.state = S.ATTRIB_VALUE_ENTITY_Q;
                } else {
                  parser.attribValue += c;
                }
                continue;
              }
              attrib(parser);
              parser.q = "";
              parser.state = S.ATTRIB_VALUE_CLOSED;
              continue;
            case S.ATTRIB_VALUE_CLOSED:
              if (isWhitespace(c)) {
                parser.state = S.ATTRIB;
              } else if (c === ">") {
                openTag(parser);
              } else if (c === "/") {
                parser.state = S.OPEN_TAG_SLASH;
              } else if (isMatch(nameStart, c)) {
                strictFail(parser, "No whitespace between attributes");
                parser.attribName = c;
                parser.attribValue = "";
                parser.state = S.ATTRIB_NAME;
              } else {
                strictFail(parser, "Invalid attribute name");
              }
              continue;
            case S.ATTRIB_VALUE_UNQUOTED:
              if (!isAttribEnd(c)) {
                if (c === "&") {
                  parser.state = S.ATTRIB_VALUE_ENTITY_U;
                } else {
                  parser.attribValue += c;
                }
                continue;
              }
              attrib(parser);
              if (c === ">") {
                openTag(parser);
              } else {
                parser.state = S.ATTRIB;
              }
              continue;
            case S.CLOSE_TAG:
              if (!parser.tagName) {
                if (isWhitespace(c)) {
                  continue;
                } else if (notMatch(nameStart, c)) {
                  if (parser.script) {
                    parser.script += "</" + c;
                    parser.state = S.SCRIPT;
                  } else {
                    strictFail(parser, "Invalid tagname in closing tag.");
                  }
                } else {
                  parser.tagName = c;
                }
              } else if (c === ">") {
                closeTag(parser);
              } else if (isMatch(nameBody, c)) {
                parser.tagName += c;
              } else if (parser.script) {
                parser.script += "</" + parser.tagName;
                parser.tagName = "";
                parser.state = S.SCRIPT;
              } else {
                if (!isWhitespace(c)) {
                  strictFail(parser, "Invalid tagname in closing tag");
                }
                parser.state = S.CLOSE_TAG_SAW_WHITE;
              }
              continue;
            case S.CLOSE_TAG_SAW_WHITE:
              if (isWhitespace(c)) {
                continue;
              }
              if (c === ">") {
                closeTag(parser);
              } else {
                strictFail(parser, "Invalid characters in closing tag");
              }
              continue;
            case S.TEXT_ENTITY:
            case S.ATTRIB_VALUE_ENTITY_Q:
            case S.ATTRIB_VALUE_ENTITY_U:
              var returnState;
              var buffer;
              switch (parser.state) {
                case S.TEXT_ENTITY:
                  returnState = S.TEXT;
                  buffer = "textNode";
                  break;
                case S.ATTRIB_VALUE_ENTITY_Q:
                  returnState = S.ATTRIB_VALUE_QUOTED;
                  buffer = "attribValue";
                  break;
                case S.ATTRIB_VALUE_ENTITY_U:
                  returnState = S.ATTRIB_VALUE_UNQUOTED;
                  buffer = "attribValue";
                  break;
              }
              if (c === ";") {
                var parsedEntity = parseEntity(parser);
                if (parser.opt.unparsedEntities && !Object.values(sax.XML_ENTITIES).includes(parsedEntity)) {
                  parser.entity = "";
                  parser.state = returnState;
                  parser.write(parsedEntity);
                } else {
                  parser[buffer] += parsedEntity;
                  parser.entity = "";
                  parser.state = returnState;
                }
              } else if (isMatch(parser.entity.length ? entityBody : entityStart, c)) {
                parser.entity += c;
              } else {
                strictFail(parser, "Invalid character in entity name");
                parser[buffer] += "&" + parser.entity + c;
                parser.entity = "";
                parser.state = returnState;
              }
              continue;
            default: {
              throw new Error(parser, "Unknown state: " + parser.state);
            }
          }
        }
        if (parser.position >= parser.bufferCheckPosition) {
          checkBufferLength(parser);
        }
        return parser;
      }
      if (!String.fromCodePoint) {
        (function() {
          var stringFromCharCode = String.fromCharCode;
          var floor = Math.floor;
          var fromCodePoint = function() {
            var MAX_SIZE = 16384;
            var codeUnits = [];
            var highSurrogate;
            var lowSurrogate;
            var index = -1;
            var length = arguments.length;
            if (!length) {
              return "";
            }
            var result = "";
            while (++index < length) {
              var codePoint = Number(arguments[index]);
              if (!isFinite(codePoint) || // `NaN`, `+Infinity`, or `-Infinity`
              codePoint < 0 || // not a valid Unicode code point
              codePoint > 1114111 || // not a valid Unicode code point
              floor(codePoint) !== codePoint) {
                throw RangeError("Invalid code point: " + codePoint);
              }
              if (codePoint <= 65535) {
                codeUnits.push(codePoint);
              } else {
                codePoint -= 65536;
                highSurrogate = (codePoint >> 10) + 55296;
                lowSurrogate = codePoint % 1024 + 56320;
                codeUnits.push(highSurrogate, lowSurrogate);
              }
              if (index + 1 === length || codeUnits.length > MAX_SIZE) {
                result += stringFromCharCode.apply(null, codeUnits);
                codeUnits.length = 0;
              }
            }
            return result;
          };
          if (Object.defineProperty) {
            Object.defineProperty(String, "fromCodePoint", {
              value: fromCodePoint,
              configurable: true,
              writable: true
            });
          } else {
            String.fromCodePoint = fromCodePoint;
          }
        })();
      }
    })(typeof exports2 === "undefined" ? exports2.sax = {} : exports2);
  }
});

// node_modules/xml2js/lib/bom.js
var require_bom = __commonJS({
  "node_modules/xml2js/lib/bom.js"(exports2) {
    (function() {
      "use strict";
      exports2.stripBOM = function(str) {
        if (str[0] === "\uFEFF") {
          return str.substring(1);
        } else {
          return str;
        }
      };
    }).call(exports2);
  }
});

// node_modules/xml2js/lib/processors.js
var require_processors = __commonJS({
  "node_modules/xml2js/lib/processors.js"(exports2) {
    (function() {
      "use strict";
      var prefixMatch;
      prefixMatch = new RegExp(/(?!xmlns)^.*:/);
      exports2.normalize = function(str) {
        return str.toLowerCase();
      };
      exports2.firstCharLowerCase = function(str) {
        return str.charAt(0).toLowerCase() + str.slice(1);
      };
      exports2.stripPrefix = function(str) {
        return str.replace(prefixMatch, "");
      };
      exports2.parseNumbers = function(str) {
        if (!isNaN(str)) {
          str = str % 1 === 0 ? parseInt(str, 10) : parseFloat(str);
        }
        return str;
      };
      exports2.parseBooleans = function(str) {
        if (/^(?:true|false)$/i.test(str)) {
          str = str.toLowerCase() === "true";
        }
        return str;
      };
    }).call(exports2);
  }
});

// node_modules/xml2js/lib/parser.js
var require_parser = __commonJS({
  "node_modules/xml2js/lib/parser.js"(exports2) {
    (function() {
      "use strict";
      var bom, defaults, events, isEmpty, processItem, processors, sax, setImmediate2, bind = function(fn, me) {
        return function() {
          return fn.apply(me, arguments);
        };
      }, extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key))
            child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      }, hasProp = {}.hasOwnProperty;
      sax = require_sax();
      events = require("events");
      bom = require_bom();
      processors = require_processors();
      setImmediate2 = require("timers").setImmediate;
      defaults = require_defaults().defaults;
      isEmpty = function(thing) {
        return typeof thing === "object" && thing != null && Object.keys(thing).length === 0;
      };
      processItem = function(processors2, item, key) {
        var i, len, process2;
        for (i = 0, len = processors2.length; i < len; i++) {
          process2 = processors2[i];
          item = process2(item, key);
        }
        return item;
      };
      exports2.Parser = function(superClass) {
        extend(Parser, superClass);
        function Parser(opts) {
          this.parseStringPromise = bind(this.parseStringPromise, this);
          this.parseString = bind(this.parseString, this);
          this.reset = bind(this.reset, this);
          this.assignOrPush = bind(this.assignOrPush, this);
          this.processAsync = bind(this.processAsync, this);
          var key, ref, value;
          if (!(this instanceof exports2.Parser)) {
            return new exports2.Parser(opts);
          }
          this.options = {};
          ref = defaults["0.2"];
          for (key in ref) {
            if (!hasProp.call(ref, key))
              continue;
            value = ref[key];
            this.options[key] = value;
          }
          for (key in opts) {
            if (!hasProp.call(opts, key))
              continue;
            value = opts[key];
            this.options[key] = value;
          }
          if (this.options.xmlns) {
            this.options.xmlnskey = this.options.attrkey + "ns";
          }
          if (this.options.normalizeTags) {
            if (!this.options.tagNameProcessors) {
              this.options.tagNameProcessors = [];
            }
            this.options.tagNameProcessors.unshift(processors.normalize);
          }
          this.reset();
        }
        Parser.prototype.processAsync = function() {
          var chunk, err;
          try {
            if (this.remaining.length <= this.options.chunkSize) {
              chunk = this.remaining;
              this.remaining = "";
              this.saxParser = this.saxParser.write(chunk);
              return this.saxParser.close();
            } else {
              chunk = this.remaining.substr(0, this.options.chunkSize);
              this.remaining = this.remaining.substr(this.options.chunkSize, this.remaining.length);
              this.saxParser = this.saxParser.write(chunk);
              return setImmediate2(this.processAsync);
            }
          } catch (error1) {
            err = error1;
            if (!this.saxParser.errThrown) {
              this.saxParser.errThrown = true;
              return this.emit(err);
            }
          }
        };
        Parser.prototype.assignOrPush = function(obj, key, newValue) {
          if (!(key in obj)) {
            if (!this.options.explicitArray) {
              return obj[key] = newValue;
            } else {
              return obj[key] = [newValue];
            }
          } else {
            if (!(obj[key] instanceof Array)) {
              obj[key] = [obj[key]];
            }
            return obj[key].push(newValue);
          }
        };
        Parser.prototype.reset = function() {
          var attrkey, charkey, ontext, stack;
          this.removeAllListeners();
          this.saxParser = sax.parser(this.options.strict, {
            trim: false,
            normalize: false,
            xmlns: this.options.xmlns
          });
          this.saxParser.errThrown = false;
          this.saxParser.onerror = /* @__PURE__ */ function(_this) {
            return function(error) {
              _this.saxParser.resume();
              if (!_this.saxParser.errThrown) {
                _this.saxParser.errThrown = true;
                return _this.emit("error", error);
              }
            };
          }(this);
          this.saxParser.onend = /* @__PURE__ */ function(_this) {
            return function() {
              if (!_this.saxParser.ended) {
                _this.saxParser.ended = true;
                return _this.emit("end", _this.resultObject);
              }
            };
          }(this);
          this.saxParser.ended = false;
          this.EXPLICIT_CHARKEY = this.options.explicitCharkey;
          this.resultObject = null;
          stack = [];
          attrkey = this.options.attrkey;
          charkey = this.options.charkey;
          this.saxParser.onopentag = /* @__PURE__ */ function(_this) {
            return function(node) {
              var key, newValue, obj, processedKey, ref;
              obj = {};
              obj[charkey] = "";
              if (!_this.options.ignoreAttrs) {
                ref = node.attributes;
                for (key in ref) {
                  if (!hasProp.call(ref, key))
                    continue;
                  if (!(attrkey in obj) && !_this.options.mergeAttrs) {
                    obj[attrkey] = {};
                  }
                  newValue = _this.options.attrValueProcessors ? processItem(_this.options.attrValueProcessors, node.attributes[key], key) : node.attributes[key];
                  processedKey = _this.options.attrNameProcessors ? processItem(_this.options.attrNameProcessors, key) : key;
                  if (_this.options.mergeAttrs) {
                    _this.assignOrPush(obj, processedKey, newValue);
                  } else {
                    obj[attrkey][processedKey] = newValue;
                  }
                }
              }
              obj["#name"] = _this.options.tagNameProcessors ? processItem(_this.options.tagNameProcessors, node.name) : node.name;
              if (_this.options.xmlns) {
                obj[_this.options.xmlnskey] = {
                  uri: node.uri,
                  local: node.local
                };
              }
              return stack.push(obj);
            };
          }(this);
          this.saxParser.onclosetag = /* @__PURE__ */ function(_this) {
            return function() {
              var cdata, emptyStr, key, node, nodeName, obj, objClone, old, s, xpath;
              obj = stack.pop();
              nodeName = obj["#name"];
              if (!_this.options.explicitChildren || !_this.options.preserveChildrenOrder) {
                delete obj["#name"];
              }
              if (obj.cdata === true) {
                cdata = obj.cdata;
                delete obj.cdata;
              }
              s = stack[stack.length - 1];
              if (obj[charkey].match(/^\s*$/) && !cdata) {
                emptyStr = obj[charkey];
                delete obj[charkey];
              } else {
                if (_this.options.trim) {
                  obj[charkey] = obj[charkey].trim();
                }
                if (_this.options.normalize) {
                  obj[charkey] = obj[charkey].replace(/\s{2,}/g, " ").trim();
                }
                obj[charkey] = _this.options.valueProcessors ? processItem(_this.options.valueProcessors, obj[charkey], nodeName) : obj[charkey];
                if (Object.keys(obj).length === 1 && charkey in obj && !_this.EXPLICIT_CHARKEY) {
                  obj = obj[charkey];
                }
              }
              if (isEmpty(obj)) {
                obj = _this.options.emptyTag !== "" ? _this.options.emptyTag : emptyStr;
              }
              if (_this.options.validator != null) {
                xpath = "/" + function() {
                  var i, len, results;
                  results = [];
                  for (i = 0, len = stack.length; i < len; i++) {
                    node = stack[i];
                    results.push(node["#name"]);
                  }
                  return results;
                }().concat(nodeName).join("/");
                (function() {
                  var err;
                  try {
                    return obj = _this.options.validator(xpath, s && s[nodeName], obj);
                  } catch (error1) {
                    err = error1;
                    return _this.emit("error", err);
                  }
                })();
              }
              if (_this.options.explicitChildren && !_this.options.mergeAttrs && typeof obj === "object") {
                if (!_this.options.preserveChildrenOrder) {
                  node = {};
                  if (_this.options.attrkey in obj) {
                    node[_this.options.attrkey] = obj[_this.options.attrkey];
                    delete obj[_this.options.attrkey];
                  }
                  if (!_this.options.charsAsChildren && _this.options.charkey in obj) {
                    node[_this.options.charkey] = obj[_this.options.charkey];
                    delete obj[_this.options.charkey];
                  }
                  if (Object.getOwnPropertyNames(obj).length > 0) {
                    node[_this.options.childkey] = obj;
                  }
                  obj = node;
                } else if (s) {
                  s[_this.options.childkey] = s[_this.options.childkey] || [];
                  objClone = {};
                  for (key in obj) {
                    if (!hasProp.call(obj, key))
                      continue;
                    objClone[key] = obj[key];
                  }
                  s[_this.options.childkey].push(objClone);
                  delete obj["#name"];
                  if (Object.keys(obj).length === 1 && charkey in obj && !_this.EXPLICIT_CHARKEY) {
                    obj = obj[charkey];
                  }
                }
              }
              if (stack.length > 0) {
                return _this.assignOrPush(s, nodeName, obj);
              } else {
                if (_this.options.explicitRoot) {
                  old = obj;
                  obj = {};
                  obj[nodeName] = old;
                }
                _this.resultObject = obj;
                _this.saxParser.ended = true;
                return _this.emit("end", _this.resultObject);
              }
            };
          }(this);
          ontext = /* @__PURE__ */ function(_this) {
            return function(text) {
              var charChild, s;
              s = stack[stack.length - 1];
              if (s) {
                s[charkey] += text;
                if (_this.options.explicitChildren && _this.options.preserveChildrenOrder && _this.options.charsAsChildren && (_this.options.includeWhiteChars || text.replace(/\\n/g, "").trim() !== "")) {
                  s[_this.options.childkey] = s[_this.options.childkey] || [];
                  charChild = {
                    "#name": "__text__"
                  };
                  charChild[charkey] = text;
                  if (_this.options.normalize) {
                    charChild[charkey] = charChild[charkey].replace(/\s{2,}/g, " ").trim();
                  }
                  s[_this.options.childkey].push(charChild);
                }
                return s;
              }
            };
          }(this);
          this.saxParser.ontext = ontext;
          return this.saxParser.oncdata = /* @__PURE__ */ function(_this) {
            return function(text) {
              var s;
              s = ontext(text);
              if (s) {
                return s.cdata = true;
              }
            };
          }(this);
        };
        Parser.prototype.parseString = function(str, cb) {
          var err;
          if (cb != null && typeof cb === "function") {
            this.on("end", function(result) {
              this.reset();
              return cb(null, result);
            });
            this.on("error", function(err2) {
              this.reset();
              return cb(err2);
            });
          }
          try {
            str = str.toString();
            if (str.trim() === "") {
              this.emit("end", null);
              return true;
            }
            str = bom.stripBOM(str);
            if (this.options.async) {
              this.remaining = str;
              setImmediate2(this.processAsync);
              return this.saxParser;
            }
            return this.saxParser.write(str).close();
          } catch (error1) {
            err = error1;
            if (!(this.saxParser.errThrown || this.saxParser.ended)) {
              this.emit("error", err);
              return this.saxParser.errThrown = true;
            } else if (this.saxParser.ended) {
              throw err;
            }
          }
        };
        Parser.prototype.parseStringPromise = function(str) {
          return new Promise(/* @__PURE__ */ function(_this) {
            return function(resolve, reject) {
              return _this.parseString(str, function(err, value) {
                if (err) {
                  return reject(err);
                } else {
                  return resolve(value);
                }
              });
            };
          }(this));
        };
        return Parser;
      }(events);
      exports2.parseString = function(str, a, b) {
        var cb, options, parser;
        if (b != null) {
          if (typeof b === "function") {
            cb = b;
          }
          if (typeof a === "object") {
            options = a;
          }
        } else {
          if (typeof a === "function") {
            cb = a;
          }
          options = {};
        }
        parser = new exports2.Parser(options);
        return parser.parseString(str, cb);
      };
      exports2.parseStringPromise = function(str, a) {
        var options, parser;
        if (typeof a === "object") {
          options = a;
        }
        parser = new exports2.Parser(options);
        return parser.parseStringPromise(str);
      };
    }).call(exports2);
  }
});

// node_modules/xml2js/lib/xml2js.js
var require_xml2js = __commonJS({
  "node_modules/xml2js/lib/xml2js.js"(exports2) {
    (function() {
      "use strict";
      var builder, defaults, parser, processors, extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key))
            child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      }, hasProp = {}.hasOwnProperty;
      defaults = require_defaults();
      builder = require_builder();
      parser = require_parser();
      processors = require_processors();
      exports2.defaults = defaults.defaults;
      exports2.processors = processors;
      exports2.ValidationError = function(superClass) {
        extend(ValidationError, superClass);
        function ValidationError(message) {
          this.message = message;
        }
        return ValidationError;
      }(Error);
      exports2.Builder = builder.Builder;
      exports2.Parser = parser.Parser;
      exports2.parseString = parser.parseString;
      exports2.parseStringPromise = parser.parseStringPromise;
    }).call(exports2);
  }
});

// node_modules/dbus-next/lib/client/proxy-interface.js
var require_proxy_interface = __commonJS({
  "node_modules/dbus-next/lib/client/proxy-interface.js"(exports2, module2) {
    var EventEmitter = require("events");
    var {
      isInterfaceNameValid,
      isMemberNameValid
    } = require_validators();
    var ProxyListener = class {
      constructor(signal, iface) {
        this.refcount = 0;
        this.fn = (msg) => {
          const { body, signature, sender } = msg;
          if (iface.$object.bus._nameOwners[iface.$object.name] !== sender) {
            return;
          }
          if (signature !== signal.signature) {
            console.error(`warning: got signature ${signature} for signal ${msg.interface}.${signal.name} (expected ${signal.signature})`);
            return;
          }
          iface.emit.apply(iface, [signal.name].concat(body));
        };
      }
    };
    var ProxyInterface = class _ProxyInterface extends EventEmitter {
      /**
       * Create a new `ProxyInterface`. This constructor should not be called
       * directly. Use {@link ProxyObject#getInterface} to get a proxy interface.
       */
      constructor(name, object) {
        super();
        this.$name = name;
        this.$object = object;
        this.$properties = [];
        this.$methods = [];
        this.$signals = [];
        this.$listeners = {};
        const getEventDetails = (eventName) => {
          const signal = this.$signals.find((s) => s.name === eventName);
          if (!signal) {
            return [null, null];
          }
          const detailedEvent = JSON.stringify({
            path: this.$object.path,
            interface: this.$name,
            member: eventName
          });
          return [signal, detailedEvent];
        };
        this.on("removeListener", (eventName, listener) => {
          const [signal, detailedEvent] = getEventDetails(eventName);
          if (!signal) {
            return;
          }
          const proxyListener = this._getEventListener(signal);
          if (proxyListener.refcount <= 0) {
            return;
          }
          proxyListener.refcount -= 1;
          if (proxyListener.refcount > 0) {
            return;
          }
          this.$object.bus._removeMatch(this._signalMatchRuleString(eventName)).catch((error) => {
            this.$object.bus.emit("error", error);
          });
          this.$object.bus._signals.removeListener(detailedEvent, proxyListener.fn);
        });
        this.on("newListener", (eventName, listener) => {
          const [signal, detailedEvent] = getEventDetails(eventName);
          if (!signal) {
            return;
          }
          const proxyListener = this._getEventListener(signal);
          if (proxyListener.refcount > 0) {
            proxyListener.refcount += 1;
            return;
          }
          proxyListener.refcount = 1;
          this.$object.bus._addMatch(this._signalMatchRuleString(eventName)).catch((error) => {
            this.$object.bus.emit("error", error);
          });
          this.$object.bus._signals.on(detailedEvent, proxyListener.fn);
        });
      }
      _signalMatchRuleString(eventName) {
        return `type='signal',sender=${this.$object.name},interface='${this.$name}',path='${this.$object.path}',member='${eventName}'`;
      }
      _getEventListener(signal) {
        if (this.$listeners[signal.name]) {
          return this.$listeners[signal.name];
        }
        this.$listeners[signal.name] = new ProxyListener(signal, this);
        return this.$listeners[signal.name];
      }
      static _fromXml(object, xml) {
        if (!("$" in xml) || !isInterfaceNameValid(xml.$.name)) {
          return null;
        }
        const name = xml.$.name;
        const iface = new _ProxyInterface(name, object);
        if (Array.isArray(xml.property)) {
          for (const p of xml.property) {
            if ("$" in p) {
              iface.$properties.push(p.$);
            }
          }
        }
        if (Array.isArray(xml.signal)) {
          for (const s of xml.signal) {
            if (!("$" in s) || !isMemberNameValid(s.$.name)) {
              continue;
            }
            const signal = {
              name: s.$.name,
              signature: ""
            };
            if (Array.isArray(s.arg)) {
              for (const a of s.arg) {
                if ("$" in a && "type" in a.$) {
                  signal.signature += a.$.type;
                }
              }
            }
            iface.$signals.push(signal);
          }
        }
        if (Array.isArray(xml.method)) {
          for (const m of xml.method) {
            if (!("$" in m) || !isMemberNameValid(m.$.name)) {
              continue;
            }
            const method = {
              name: m.$.name,
              inSignature: "",
              outSignature: ""
            };
            if (Array.isArray(m.arg)) {
              for (const a of m.arg) {
                if (!("$" in a) || typeof a.$.type !== "string") {
                  continue;
                }
                const arg = a.$;
                if (arg.direction === "in") {
                  method.inSignature += arg.type;
                } else if (arg.direction === "out") {
                  method.outSignature += arg.type;
                }
              }
            }
            iface.$methods.push(method);
            iface[method.name] = function(...args) {
              const objArgs = [
                name,
                method.name,
                method.inSignature,
                method.outSignature
              ].concat(args);
              return object._callMethod.apply(object, objArgs);
            };
          }
        }
        return iface;
      }
    };
    module2.exports = ProxyInterface;
  }
});

// node_modules/dbus-next/lib/client/proxy-object.js
var require_proxy_object = __commonJS({
  "node_modules/dbus-next/lib/client/proxy-object.js"(exports2, module2) {
    var xml2js = require_xml2js();
    var { parseSignature } = require_signature();
    var ProxyInterface = require_proxy_interface();
    var { Message } = require_message_type();
    var {
      assertBusNameValid,
      assertObjectPathValid,
      isObjectPathValid
    } = require_validators();
    var ProxyObject = class {
      /**
       * Create a new `ProxyObject`. This constructor should not be called
       * directly. Use {@link MessageBus#getProxyObject} to get a proxy object.
       */
      constructor(bus, name, path) {
        assertBusNameValid(name);
        assertObjectPathValid(path);
        this.bus = bus;
        this.name = name;
        this.path = path;
        this.nodes = [];
        this.interfaces = {};
        this._parser = new xml2js.Parser();
      }
      /**
       * Get a {@link ProxyInterface} for the given interface name.
       *
       * @param name {string} - the interface name to get.
       * @returns {ProxyInterface} - the proxy interface with this name exported by
       * the object or `undefined` if the object does not export an interface with
       * that name.
       * @throws {Error} Throws an error if the interface is not found on this object.
       */
      getInterface(name) {
        if (!Object.keys(this.interfaces).includes(name)) {
          throw new Error(`interface not found in proxy object: ${name}`);
        }
        return this.interfaces[name];
      }
      _initXml(xml) {
        const root = xml.node;
        if (Array.isArray(root.node)) {
          for (const n of root.node) {
            if (!("$" in n)) {
              continue;
            }
            const name = n.$.name;
            const path = `${this.path}/${name}`;
            if (isObjectPathValid(path)) {
              this.nodes.push(path);
            }
          }
        }
        if (Array.isArray(root.interface)) {
          for (const i of root.interface) {
            const iface = ProxyInterface._fromXml(this, i);
            if (iface !== null) {
              this.interfaces[iface.$name] = iface;
            }
          }
        }
      }
      _init(xml) {
        return new Promise((resolve, reject) => {
          if (xml) {
            this._parser.parseString(xml, (err, data) => {
              if (err) {
                return reject(err);
              }
              this._initXml(data);
              const nameOwnerMessage = new Message({
                destination: "org.freedesktop.DBus",
                path: "/org/freedesktop/DBus",
                interface: "org.freedesktop.DBus",
                member: "GetNameOwner",
                signature: "s",
                body: [this.name]
              });
              this.bus.call(nameOwnerMessage).then((msg) => {
                this.bus._nameOwners[this.name] = msg.body[0];
                resolve(this);
              }).catch((err2) => {
                if (err2.type === "org.freedesktop.DBus.Error.NameHasNoOwner") {
                  return resolve(this);
                }
                return reject(err2);
              });
            });
          } else {
            const introspectMessage = new Message({
              destination: this.name,
              path: this.path,
              interface: "org.freedesktop.DBus.Introspectable",
              member: "Introspect",
              signature: "",
              body: []
            });
            this.bus.call(introspectMessage).then((msg) => {
              const xml2 = msg.body[0];
              this._parser.parseString(xml2, (err, data) => {
                if (err) {
                  return reject(err);
                }
                this._initXml(data);
                resolve(this);
              });
            }).catch((err) => {
              return reject(err);
            });
          }
        });
      }
      _callMethod(iface, member, inSignature, outSignature, ...args) {
        return new Promise((resolve, reject) => {
          args = args || [];
          const methodCallMessage = new Message({
            destination: this.name,
            interface: iface,
            path: this.path,
            member,
            signature: inSignature,
            body: args
          });
          this.bus.call(methodCallMessage).then((msg) => {
            const outSignatureTree = parseSignature(outSignature);
            if (outSignatureTree.length === 0) {
              resolve(null);
              return;
            }
            if (outSignatureTree.length === 1) {
              resolve(msg.body[0]);
            } else {
              resolve(msg.body);
            }
          }).catch((err) => {
            return reject(err);
          });
        });
      }
    };
    module2.exports = ProxyObject;
  }
});

// node_modules/dbus-next/lib/bus.js
var require_bus = __commonJS({
  "node_modules/dbus-next/lib/bus.js"(exports2, module2) {
    var EventEmitter = require("events").EventEmitter;
    var constants = require_constants();
    var handleMethod = require_handlers();
    var { DBusError } = require_errors();
    var { Message } = require_message_type();
    var ServiceObject = require_object();
    var xml2js = require_xml2js();
    var {
      METHOD_CALL,
      METHOD_RETURN,
      ERROR,
      SIGNAL
    } = constants.MessageType;
    var {
      NO_REPLY_EXPECTED
    } = constants.MessageFlag;
    var {
      assertBusNameValid,
      assertObjectPathValid
    } = require_validators();
    var ProxyObject = require_proxy_object();
    var xmlHeader = '<!DOCTYPE node PUBLIC "-//freedesktop//DTD D-BUS Object Introspection 1.0//EN" "http://www.freedesktop.org/standards/dbus/1.0/introspect.dtd">\n';
    var MessageBus = class extends EventEmitter {
      /**
       * Create a new `MessageBus`. This constructor is not to be called directly.
       * Use `dbus.sessionBus()` or `dbus.systemBus()` to set up the connection to
        * the bus.
       */
      constructor(conn) {
        super();
        this._builder = new xml2js.Builder({ headless: true });
        this._connection = conn;
        this._serial = 1;
        this._methodReturnHandlers = {};
        this._signals = new EventEmitter();
        this._nameOwners = {};
        this._methodHandlers = [];
        this._serviceObjects = {};
        this._matchRules = {};
        this.name = null;
        const handleMessage = (msg) => {
          if (this.name && msg.destination) {
            if (msg.destination[0] === ":" && msg.destination !== this.name) {
              return;
            }
            if (this._nameOwners[msg.destination] && this._nameOwners[msg.destination] !== this.name) {
              return;
            }
          }
          if (msg.type === METHOD_RETURN || msg.type === ERROR) {
            const handler = this._methodReturnHandlers[msg.replySerial];
            if (handler) {
              delete this._methodReturnHandlers[msg.replySerial];
              handler(msg);
            }
          } else if (msg.type === SIGNAL) {
            const { sender, path, iface, member } = msg;
            if (sender === "org.freedesktop.DBus" && path === "/org/freedesktop/DBus" && iface === "org.freedesktop.DBus" && member === "NameOwnerChanged") {
              const name = msg.body[0];
              const newOwner = msg.body[2];
              if (!name.startsWith(":")) {
                this._nameOwners[name] = newOwner;
              }
            }
            const mangled = JSON.stringify({
              path: msg.path,
              interface: msg.interface,
              member: msg.member
            });
            this._signals.emit(mangled, msg);
          } else {
            let handled = false;
            for (const handler of this._methodHandlers) {
              handled = handler(msg);
              if (handled) {
                break;
              }
            }
            if (!handled) {
              handled = handleMethod(msg, this);
            }
            if (!handled) {
              this.send(Message.newError(
                msg,
                "org.freedesktop.DBus.Error.UnknownMethod",
                `Method '${msg.member}' on interface '${msg.interface || "(none)"}' does not exist`
              ));
            }
          }
        };
        conn.on("message", (msg) => {
          try {
            this.emit("message", msg);
            handleMessage(msg);
          } catch (e) {
            this.send(Message.newError(msg, "com.github.dbus_next.Error", `The DBus library encountered an error.
${e.stack}`));
          }
        });
        conn.on("error", (err) => {
          this.emit("error", err);
        });
        const helloMessage = new Message({
          path: "/org/freedesktop/DBus",
          destination: "org.freedesktop.DBus",
          interface: "org.freedesktop.DBus",
          member: "Hello"
        });
        this.call(helloMessage).then((msg) => {
          this.name = msg.body[0];
          this.emit("connect");
        }).catch((err) => {
          this.emit("error", err);
          throw new Error(err);
        });
      }
      /**
       * Get a {@link ProxyObject} on the bus for the given name and path for interacting
       * with a service as a client. The proxy object contains a list of the
       * [`ProxyInterface`s]{@link ProxyInterface} exported at the name and object path as well as a list
       * of `node`s.
       *
       * @param name {string} - the well-known name on the bus.
       * @param path {string} - the object path exported on the name.
       * @param [xml] {string} - xml introspection data.
       * @returns {Promise} - a Promise that resolves with the `ProxyObject`.
       */
      getProxyObject(name, path, xml) {
        const obj = new ProxyObject(this, name, path);
        return obj._init(xml);
      }
      /**
       * Request a well-known name on the bus.
       *
       * @see {@link https://dbus.freedesktop.org/doc/dbus-specification.html#bus-messages-request-name}
       *
       * @param name {string} - the well-known name on the bus to request.
       * @param flags {NameFlag} - DBus name flags which affect the behavior of taking the name.
       * @returns {Promise} - a Promise that resolves with the {@link RequestNameReply}.
       */
      requestName(name, flags) {
        flags = flags || 0;
        return new Promise((resolve, reject) => {
          assertBusNameValid(name);
          const requestNameMessage = new Message({
            path: "/org/freedesktop/DBus",
            destination: "org.freedesktop.DBus",
            interface: "org.freedesktop.DBus",
            member: "RequestName",
            signature: "su",
            body: [name, flags]
          });
          this.call(requestNameMessage).then((msg) => {
            return resolve(msg.body[0]);
          }).catch((err) => {
            return reject(err);
          });
        });
      }
      /**
       * Release this name. Requests that the name should no longer be owned by the
       * {@link MessageBus}.
       *
       * @returns {Promise} A Promise that will resolve with the {@link ReleaseNameReply}.
       */
      releaseName(name) {
        return new Promise((resolve, reject) => {
          const msg = new Message({
            path: "/org/freedesktop/DBus",
            destination: "org.freedesktop.DBus",
            interface: "org.freedesktop.DBus",
            member: "ReleaseName",
            signature: "s",
            body: [name]
          });
          this.call(msg).then((reply) => {
            return resolve(reply.body[0]);
          }).catch((err) => {
            return reject(err);
          });
        });
      }
      /**
       * Disconnect this `MessageBus` from the bus.
       */
      disconnect() {
        this._connection.stream.end();
        this._signals.removeAllListeners();
      }
      /**
       * Get a new serial for this bus. These can be used to set the {@link
       * Message#serial} member to send the message on this bus.
       *
       * @returns {int} - A new serial for this bus.
       */
      newSerial() {
        return this._serial++;
      }
      /**
       * A function to call when a message of type {@link MessageType.METHOD_RETURN} is received. User handlers are run before
       * default handlers.
       *
       * @callback methodHandler
       * @param {Message} msg - The message to handle.
       * @returns {boolean} Return `true` if the message is handled and no further
       * handlers will run.
       */
      /**
       * Add a user method return handler. Remove the handler with {@link
       * MessageBus#removeMethodHandler}
       *
       * @param {methodHandler} - A function to handle a {@link Message} of type
       * {@link MessageType.METHOD_RETURN}. Takes the `Message` as the first
        * argument. Return `true` if the method is handled and no further handlers
        * will run.
       */
      addMethodHandler(fn) {
        this._methodHandlers.push(fn);
      }
      /**
       * Remove a user method return handler that was previously added with {@link
       * MessageBus#addMethodHandler}.
       *
       * @param {methodHandler} - A function that was previously added as a method handler.
       */
      removeMethodHandler(fn) {
        for (let i = 0; i < this._methodHandlers.length; ++i) {
          if (this._methodHandlers[i] === fn) {
            this._methodHandlers.splice(i, 1);
          }
        }
      }
      /**
       * Send a {@link Message} of type {@link MessageType.METHOD_CALL} to the bus
       * and wait for the reply.
       *
       * @example
       * let message = new Message({
       *   destination: 'org.freedesktop.DBus',
       *   path: '/org/freedesktop/DBus',
       *   interface: 'org.freedesktop.DBus',
       *   member: 'ListNames'
       * });
       * let reply = await bus.call(message);
       *
       * @param {Message} msg - The message to send.
       * @returns {Promise} reply - A `Promise` that resolves to the {@link
       * Message} which is a reply to the call.
       */
      call(msg) {
        return new Promise((resolve, reject) => {
          if (!(msg instanceof Message)) {
            throw new Error("The call() method takes a Message class as the first argument.");
          }
          if (msg.type !== METHOD_CALL) {
            throw new Error("Only messages of type METHOD_CALL can expect a call reply.");
          }
          if (msg.serial === null || msg._sent) {
            msg.serial = this.newSerial();
          }
          msg._sent = true;
          if (msg.flags & NO_REPLY_EXPECTED) {
            resolve(null);
          } else {
            this._methodReturnHandlers[msg.serial] = (reply) => {
              this._nameOwners[msg.destination] = reply.sender;
              if (reply.type === ERROR) {
                return reject(new DBusError(reply.errorName, reply.body[0], reply));
              } else {
                return resolve(reply);
              }
            };
          }
          this._connection.message(msg);
        });
      }
      /**
       * Send a {@link Message} on the bus that does not expect a reply.
       *
       * @example
       * let message = Message.newSignal('/org/test/path/,
       *                                 'org.test.interface',
       *                                 'SomeSignal');
       * bus.send(message);
       *
       * @param {Message} msg - The message to send.
       */
      send(msg) {
        if (!(msg instanceof Message)) {
          throw new Error("The send() method takes a Message class as the first argument.");
        }
        if (msg.serial === null || msg._sent) {
          msg.serial = this.newSerial();
        }
        this._connection.message(msg);
      }
      /**
       * Export an [`Interface`]{@link module:interface~Interface} on the bus. See
       * the documentation for that class for how to define service interfaces.
       *
       * @param path {string} - The object path to export this `Interface` on.
       * @param iface {module:interface~Interface} - The service interface to export.
       */
      export(path, iface) {
        const obj = this._getServiceObject(path);
        obj.addInterface(iface);
      }
      /**
       * Unexport an `Interface` on the bus. The interface will no longer be
       * advertised to clients.
       *
       * @param {string} path - The object path on which to unexport.
       * @param {module:interface~Interface} [iface] - The `Interface` to unexport.
       * If not given, this will remove all interfaces on the path.
       */
      unexport(path, iface) {
        iface = iface || null;
        if (iface === null) {
          this._removeServiceObject(path);
        } else {
          const obj = this._getServiceObject(path);
          obj.removeInterface(iface);
          if (!obj.interfaces.length) {
            this._removeServiceObject(path);
          }
        }
      }
      _introspect(path) {
        assertObjectPathValid(path);
        const xml = {
          node: {
            node: []
          }
        };
        if (this._serviceObjects[path]) {
          xml.node.interface = this._serviceObjects[path].introspect();
        }
        const pathSplit = path.split("/").filter((n) => n);
        const children2 = /* @__PURE__ */ new Set();
        for (const key of Object.keys(this._serviceObjects)) {
          const keySplit = key.split("/").filter((n) => n);
          if (keySplit.length <= pathSplit.length) {
            continue;
          }
          if (pathSplit.every((v, i) => v === keySplit[i])) {
            children2.add(keySplit[pathSplit.length]);
          }
        }
        for (const child of children2) {
          xml.node.node.push({
            $: {
              name: child
            }
          });
        }
        return xmlHeader + this._builder.buildObject(xml);
      }
      _getServiceObject(path) {
        assertObjectPathValid(path);
        if (!this._serviceObjects[path]) {
          this._serviceObjects[path] = new ServiceObject(path, this);
        }
        return this._serviceObjects[path];
      }
      _removeServiceObject(path) {
        assertObjectPathValid(path);
        if (this._serviceObjects[path]) {
          const obj = this._serviceObjects[path];
          for (const i of Object.keys(obj.interfaces)) {
            obj.removeInterface(obj.interfaces[i]);
          }
          delete this._serviceObjects[path];
        }
      }
      _addMatch(match) {
        if (Object.prototype.hasOwnProperty.call(match, this._matchRules)) {
          this._matchRules[match] += 1;
          return Promise.resolve();
        }
        this._matchRules[match] = 1;
        const msg = new Message({
          path: "/org/freedesktop/DBus",
          destination: "org.freedesktop.DBus",
          interface: "org.freedesktop.DBus",
          member: "AddMatch",
          signature: "s",
          body: [match]
        });
        return this.call(msg);
      }
      _removeMatch(match) {
        if (!this._connection.stream.writable) {
          return Promise.resolve();
        }
        if (Object.prototype.hasOwnProperty.call(match, this._matchRules)) {
          this._matchRules[match] -= 1;
          if (this._matchRules[match] > 0) {
            return Promise.resolve();
          }
        } else {
          return Promise.resolve();
        }
        delete this._matchRules[match];
        const msg = new Message({
          path: "/org/freedesktop/DBus",
          destination: "org.freedesktop.DBus",
          interface: "org.freedesktop.DBus",
          member: "RemoveMatch",
          signature: "s",
          body: [match]
        });
        return this.call(msg);
      }
    };
    module2.exports = MessageBus;
  }
});

// node_modules/safe-buffer/index.js
var require_safe_buffer = __commonJS({
  "node_modules/safe-buffer/index.js"(exports2, module2) {
    var buffer = require("buffer");
    var Buffer2 = buffer.Buffer;
    function copyProps(src2, dst) {
      for (var key in src2) {
        dst[key] = src2[key];
      }
    }
    if (Buffer2.from && Buffer2.alloc && Buffer2.allocUnsafe && Buffer2.allocUnsafeSlow) {
      module2.exports = buffer;
    } else {
      copyProps(buffer, exports2);
      exports2.Buffer = SafeBuffer;
    }
    function SafeBuffer(arg, encodingOrOffset, length) {
      return Buffer2(arg, encodingOrOffset, length);
    }
    SafeBuffer.prototype = Object.create(Buffer2.prototype);
    copyProps(Buffer2, SafeBuffer);
    SafeBuffer.from = function(arg, encodingOrOffset, length) {
      if (typeof arg === "number") {
        throw new TypeError("Argument must not be a number");
      }
      return Buffer2(arg, encodingOrOffset, length);
    };
    SafeBuffer.alloc = function(size, fill, encoding) {
      if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
      }
      var buf = Buffer2(size);
      if (fill !== void 0) {
        if (typeof encoding === "string") {
          buf.fill(fill, encoding);
        } else {
          buf.fill(fill);
        }
      } else {
        buf.fill(0);
      }
      return buf;
    };
    SafeBuffer.allocUnsafe = function(size) {
      if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
      }
      return Buffer2(size);
    };
    SafeBuffer.allocUnsafeSlow = function(size) {
      if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
      }
      return buffer.SlowBuffer(size);
    };
  }
});

// node_modules/@nornagon/put/index.js
var require_put = __commonJS({
  "node_modules/@nornagon/put/index.js"(exports2, module2) {
    module2.exports = Put;
    function Put() {
      if (!(this instanceof Put))
        return new Put();
      var words = [];
      var len = 0;
      this.put = function(buf) {
        words.push({ buffer: buf });
        len += buf.length;
        return this;
      };
      this.word8 = function(x) {
        words.push({ bytes: 1, value: x });
        len += 1;
        return this;
      };
      this.floatle = function(x) {
        words.push({ bytes: "float", endian: "little", value: x });
        len += 4;
        return this;
      };
      [8, 16, 24, 32, 64].forEach(function(bits) {
        this["word" + bits + "be"] = function(x) {
          words.push({ endian: "big", bytes: bits / 8, value: x });
          len += bits / 8;
          return this;
        };
        this["word" + bits + "le"] = function(x) {
          words.push({ endian: "little", bytes: bits / 8, value: x });
          len += bits / 8;
          return this;
        };
      }.bind(this));
      this.pad = function(bytes) {
        words.push({ endian: "big", bytes, value: 0 });
        len += bytes;
        return this;
      };
      this.length = function() {
        return len;
      };
      this.buffer = function() {
        var buf = Buffer.alloc(len);
        var offset = 0;
        words.forEach(function(word) {
          if (word.buffer) {
            word.buffer.copy(buf, offset, 0);
            offset += word.buffer.length;
          } else if (word.bytes == "float") {
            var v = Math.abs(word.value);
            var s = (word.value >= 0) * 1;
            var e = Math.ceil(Math.log(v) / Math.LN2);
            var f = v / (1 << e);
            console.dir([s, e, f]);
            console.log(word.value);
            buf[offset++] = s << 7 & ~~(e / 2);
            buf[offset++] = (e & 1) << 7 & ~~(f / (1 << 16));
            buf[offset++] = 0;
            buf[offset++] = 0;
            offset += 4;
          } else {
            var big = word.endian === "big";
            var ix = big ? [(word.bytes - 1) * 8, -8] : [0, 8];
            for (var i = ix[0]; big ? i >= 0 : i < word.bytes * 8; i += ix[1]) {
              if (i >= 32) {
                buf[offset++] = Math.floor(word.value / Math.pow(2, i)) & 255;
              } else {
                buf[offset++] = word.value >> i & 255;
              }
            }
          }
        });
        return buf;
      };
      this.write = function(stream) {
        stream.write(this.buffer());
      };
    }
  }
});

// node_modules/dbus-next/lib/align.js
var require_align = __commonJS({
  "node_modules/dbus-next/lib/align.js"(exports2) {
    var Buffer2 = require_safe_buffer().Buffer;
    function align(ps, n) {
      const pad = n - ps._offset % n;
      if (pad === 0 || pad === n)
        return;
      const padBuff = Buffer2.alloc(pad);
      ps.put(Buffer2.from(padBuff));
      ps._offset += pad;
    }
    exports2.align = align;
  }
});

// node_modules/long/src/long.js
var require_long = __commonJS({
  "node_modules/long/src/long.js"(exports2, module2) {
    module2.exports = Long;
    var wasm = null;
    try {
      wasm = new WebAssembly.Instance(new WebAssembly.Module(new Uint8Array([
        0,
        97,
        115,
        109,
        1,
        0,
        0,
        0,
        1,
        13,
        2,
        96,
        0,
        1,
        127,
        96,
        4,
        127,
        127,
        127,
        127,
        1,
        127,
        3,
        7,
        6,
        0,
        1,
        1,
        1,
        1,
        1,
        6,
        6,
        1,
        127,
        1,
        65,
        0,
        11,
        7,
        50,
        6,
        3,
        109,
        117,
        108,
        0,
        1,
        5,
        100,
        105,
        118,
        95,
        115,
        0,
        2,
        5,
        100,
        105,
        118,
        95,
        117,
        0,
        3,
        5,
        114,
        101,
        109,
        95,
        115,
        0,
        4,
        5,
        114,
        101,
        109,
        95,
        117,
        0,
        5,
        8,
        103,
        101,
        116,
        95,
        104,
        105,
        103,
        104,
        0,
        0,
        10,
        191,
        1,
        6,
        4,
        0,
        35,
        0,
        11,
        36,
        1,
        1,
        126,
        32,
        0,
        173,
        32,
        1,
        173,
        66,
        32,
        134,
        132,
        32,
        2,
        173,
        32,
        3,
        173,
        66,
        32,
        134,
        132,
        126,
        34,
        4,
        66,
        32,
        135,
        167,
        36,
        0,
        32,
        4,
        167,
        11,
        36,
        1,
        1,
        126,
        32,
        0,
        173,
        32,
        1,
        173,
        66,
        32,
        134,
        132,
        32,
        2,
        173,
        32,
        3,
        173,
        66,
        32,
        134,
        132,
        127,
        34,
        4,
        66,
        32,
        135,
        167,
        36,
        0,
        32,
        4,
        167,
        11,
        36,
        1,
        1,
        126,
        32,
        0,
        173,
        32,
        1,
        173,
        66,
        32,
        134,
        132,
        32,
        2,
        173,
        32,
        3,
        173,
        66,
        32,
        134,
        132,
        128,
        34,
        4,
        66,
        32,
        135,
        167,
        36,
        0,
        32,
        4,
        167,
        11,
        36,
        1,
        1,
        126,
        32,
        0,
        173,
        32,
        1,
        173,
        66,
        32,
        134,
        132,
        32,
        2,
        173,
        32,
        3,
        173,
        66,
        32,
        134,
        132,
        129,
        34,
        4,
        66,
        32,
        135,
        167,
        36,
        0,
        32,
        4,
        167,
        11,
        36,
        1,
        1,
        126,
        32,
        0,
        173,
        32,
        1,
        173,
        66,
        32,
        134,
        132,
        32,
        2,
        173,
        32,
        3,
        173,
        66,
        32,
        134,
        132,
        130,
        34,
        4,
        66,
        32,
        135,
        167,
        36,
        0,
        32,
        4,
        167,
        11
      ])), {}).exports;
    } catch (e) {
    }
    function Long(low, high, unsigned) {
      this.low = low | 0;
      this.high = high | 0;
      this.unsigned = !!unsigned;
    }
    Long.prototype.__isLong__;
    Object.defineProperty(Long.prototype, "__isLong__", { value: true });
    function isLong(obj) {
      return (obj && obj["__isLong__"]) === true;
    }
    Long.isLong = isLong;
    var INT_CACHE = {};
    var UINT_CACHE = {};
    function fromInt(value, unsigned) {
      var obj, cachedObj, cache;
      if (unsigned) {
        value >>>= 0;
        if (cache = 0 <= value && value < 256) {
          cachedObj = UINT_CACHE[value];
          if (cachedObj)
            return cachedObj;
        }
        obj = fromBits(value, (value | 0) < 0 ? -1 : 0, true);
        if (cache)
          UINT_CACHE[value] = obj;
        return obj;
      } else {
        value |= 0;
        if (cache = -128 <= value && value < 128) {
          cachedObj = INT_CACHE[value];
          if (cachedObj)
            return cachedObj;
        }
        obj = fromBits(value, value < 0 ? -1 : 0, false);
        if (cache)
          INT_CACHE[value] = obj;
        return obj;
      }
    }
    Long.fromInt = fromInt;
    function fromNumber(value, unsigned) {
      if (isNaN(value))
        return unsigned ? UZERO : ZERO;
      if (unsigned) {
        if (value < 0)
          return UZERO;
        if (value >= TWO_PWR_64_DBL)
          return MAX_UNSIGNED_VALUE;
      } else {
        if (value <= -TWO_PWR_63_DBL)
          return MIN_VALUE;
        if (value + 1 >= TWO_PWR_63_DBL)
          return MAX_VALUE;
      }
      if (value < 0)
        return fromNumber(-value, unsigned).neg();
      return fromBits(value % TWO_PWR_32_DBL | 0, value / TWO_PWR_32_DBL | 0, unsigned);
    }
    Long.fromNumber = fromNumber;
    function fromBits(lowBits, highBits, unsigned) {
      return new Long(lowBits, highBits, unsigned);
    }
    Long.fromBits = fromBits;
    var pow_dbl = Math.pow;
    function fromString(str, unsigned, radix) {
      if (str.length === 0)
        throw Error("empty string");
      if (str === "NaN" || str === "Infinity" || str === "+Infinity" || str === "-Infinity")
        return ZERO;
      if (typeof unsigned === "number") {
        radix = unsigned, unsigned = false;
      } else {
        unsigned = !!unsigned;
      }
      radix = radix || 10;
      if (radix < 2 || 36 < radix)
        throw RangeError("radix");
      var p;
      if ((p = str.indexOf("-")) > 0)
        throw Error("interior hyphen");
      else if (p === 0) {
        return fromString(str.substring(1), unsigned, radix).neg();
      }
      var radixToPower = fromNumber(pow_dbl(radix, 8));
      var result = ZERO;
      for (var i = 0; i < str.length; i += 8) {
        var size = Math.min(8, str.length - i), value = parseInt(str.substring(i, i + size), radix);
        if (size < 8) {
          var power = fromNumber(pow_dbl(radix, size));
          result = result.mul(power).add(fromNumber(value));
        } else {
          result = result.mul(radixToPower);
          result = result.add(fromNumber(value));
        }
      }
      result.unsigned = unsigned;
      return result;
    }
    Long.fromString = fromString;
    function fromValue(val, unsigned) {
      if (typeof val === "number")
        return fromNumber(val, unsigned);
      if (typeof val === "string")
        return fromString(val, unsigned);
      return fromBits(val.low, val.high, typeof unsigned === "boolean" ? unsigned : val.unsigned);
    }
    Long.fromValue = fromValue;
    var TWO_PWR_16_DBL = 1 << 16;
    var TWO_PWR_24_DBL = 1 << 24;
    var TWO_PWR_32_DBL = TWO_PWR_16_DBL * TWO_PWR_16_DBL;
    var TWO_PWR_64_DBL = TWO_PWR_32_DBL * TWO_PWR_32_DBL;
    var TWO_PWR_63_DBL = TWO_PWR_64_DBL / 2;
    var TWO_PWR_24 = fromInt(TWO_PWR_24_DBL);
    var ZERO = fromInt(0);
    Long.ZERO = ZERO;
    var UZERO = fromInt(0, true);
    Long.UZERO = UZERO;
    var ONE = fromInt(1);
    Long.ONE = ONE;
    var UONE = fromInt(1, true);
    Long.UONE = UONE;
    var NEG_ONE = fromInt(-1);
    Long.NEG_ONE = NEG_ONE;
    var MAX_VALUE = fromBits(4294967295 | 0, 2147483647 | 0, false);
    Long.MAX_VALUE = MAX_VALUE;
    var MAX_UNSIGNED_VALUE = fromBits(4294967295 | 0, 4294967295 | 0, true);
    Long.MAX_UNSIGNED_VALUE = MAX_UNSIGNED_VALUE;
    var MIN_VALUE = fromBits(0, 2147483648 | 0, false);
    Long.MIN_VALUE = MIN_VALUE;
    var LongPrototype = Long.prototype;
    LongPrototype.toInt = function toInt() {
      return this.unsigned ? this.low >>> 0 : this.low;
    };
    LongPrototype.toNumber = function toNumber() {
      if (this.unsigned)
        return (this.high >>> 0) * TWO_PWR_32_DBL + (this.low >>> 0);
      return this.high * TWO_PWR_32_DBL + (this.low >>> 0);
    };
    LongPrototype.toString = function toString(radix) {
      radix = radix || 10;
      if (radix < 2 || 36 < radix)
        throw RangeError("radix");
      if (this.isZero())
        return "0";
      if (this.isNegative()) {
        if (this.eq(MIN_VALUE)) {
          var radixLong = fromNumber(radix), div = this.div(radixLong), rem1 = div.mul(radixLong).sub(this);
          return div.toString(radix) + rem1.toInt().toString(radix);
        } else
          return "-" + this.neg().toString(radix);
      }
      var radixToPower = fromNumber(pow_dbl(radix, 6), this.unsigned), rem = this;
      var result = "";
      while (true) {
        var remDiv = rem.div(radixToPower), intval = rem.sub(remDiv.mul(radixToPower)).toInt() >>> 0, digits = intval.toString(radix);
        rem = remDiv;
        if (rem.isZero())
          return digits + result;
        else {
          while (digits.length < 6)
            digits = "0" + digits;
          result = "" + digits + result;
        }
      }
    };
    LongPrototype.getHighBits = function getHighBits() {
      return this.high;
    };
    LongPrototype.getHighBitsUnsigned = function getHighBitsUnsigned() {
      return this.high >>> 0;
    };
    LongPrototype.getLowBits = function getLowBits() {
      return this.low;
    };
    LongPrototype.getLowBitsUnsigned = function getLowBitsUnsigned() {
      return this.low >>> 0;
    };
    LongPrototype.getNumBitsAbs = function getNumBitsAbs() {
      if (this.isNegative())
        return this.eq(MIN_VALUE) ? 64 : this.neg().getNumBitsAbs();
      var val = this.high != 0 ? this.high : this.low;
      for (var bit = 31; bit > 0; bit--)
        if ((val & 1 << bit) != 0)
          break;
      return this.high != 0 ? bit + 33 : bit + 1;
    };
    LongPrototype.isZero = function isZero() {
      return this.high === 0 && this.low === 0;
    };
    LongPrototype.eqz = LongPrototype.isZero;
    LongPrototype.isNegative = function isNegative() {
      return !this.unsigned && this.high < 0;
    };
    LongPrototype.isPositive = function isPositive() {
      return this.unsigned || this.high >= 0;
    };
    LongPrototype.isOdd = function isOdd() {
      return (this.low & 1) === 1;
    };
    LongPrototype.isEven = function isEven() {
      return (this.low & 1) === 0;
    };
    LongPrototype.equals = function equals(other) {
      if (!isLong(other))
        other = fromValue(other);
      if (this.unsigned !== other.unsigned && this.high >>> 31 === 1 && other.high >>> 31 === 1)
        return false;
      return this.high === other.high && this.low === other.low;
    };
    LongPrototype.eq = LongPrototype.equals;
    LongPrototype.notEquals = function notEquals(other) {
      return !this.eq(
        /* validates */
        other
      );
    };
    LongPrototype.neq = LongPrototype.notEquals;
    LongPrototype.ne = LongPrototype.notEquals;
    LongPrototype.lessThan = function lessThan(other) {
      return this.comp(
        /* validates */
        other
      ) < 0;
    };
    LongPrototype.lt = LongPrototype.lessThan;
    LongPrototype.lessThanOrEqual = function lessThanOrEqual(other) {
      return this.comp(
        /* validates */
        other
      ) <= 0;
    };
    LongPrototype.lte = LongPrototype.lessThanOrEqual;
    LongPrototype.le = LongPrototype.lessThanOrEqual;
    LongPrototype.greaterThan = function greaterThan(other) {
      return this.comp(
        /* validates */
        other
      ) > 0;
    };
    LongPrototype.gt = LongPrototype.greaterThan;
    LongPrototype.greaterThanOrEqual = function greaterThanOrEqual(other) {
      return this.comp(
        /* validates */
        other
      ) >= 0;
    };
    LongPrototype.gte = LongPrototype.greaterThanOrEqual;
    LongPrototype.ge = LongPrototype.greaterThanOrEqual;
    LongPrototype.compare = function compare(other) {
      if (!isLong(other))
        other = fromValue(other);
      if (this.eq(other))
        return 0;
      var thisNeg = this.isNegative(), otherNeg = other.isNegative();
      if (thisNeg && !otherNeg)
        return -1;
      if (!thisNeg && otherNeg)
        return 1;
      if (!this.unsigned)
        return this.sub(other).isNegative() ? -1 : 1;
      return other.high >>> 0 > this.high >>> 0 || other.high === this.high && other.low >>> 0 > this.low >>> 0 ? -1 : 1;
    };
    LongPrototype.comp = LongPrototype.compare;
    LongPrototype.negate = function negate() {
      if (!this.unsigned && this.eq(MIN_VALUE))
        return MIN_VALUE;
      return this.not().add(ONE);
    };
    LongPrototype.neg = LongPrototype.negate;
    LongPrototype.add = function add(addend) {
      if (!isLong(addend))
        addend = fromValue(addend);
      var a48 = this.high >>> 16;
      var a32 = this.high & 65535;
      var a16 = this.low >>> 16;
      var a00 = this.low & 65535;
      var b48 = addend.high >>> 16;
      var b32 = addend.high & 65535;
      var b16 = addend.low >>> 16;
      var b00 = addend.low & 65535;
      var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
      c00 += a00 + b00;
      c16 += c00 >>> 16;
      c00 &= 65535;
      c16 += a16 + b16;
      c32 += c16 >>> 16;
      c16 &= 65535;
      c32 += a32 + b32;
      c48 += c32 >>> 16;
      c32 &= 65535;
      c48 += a48 + b48;
      c48 &= 65535;
      return fromBits(c16 << 16 | c00, c48 << 16 | c32, this.unsigned);
    };
    LongPrototype.subtract = function subtract(subtrahend) {
      if (!isLong(subtrahend))
        subtrahend = fromValue(subtrahend);
      return this.add(subtrahend.neg());
    };
    LongPrototype.sub = LongPrototype.subtract;
    LongPrototype.multiply = function multiply(multiplier) {
      if (this.isZero())
        return ZERO;
      if (!isLong(multiplier))
        multiplier = fromValue(multiplier);
      if (wasm) {
        var low = wasm.mul(
          this.low,
          this.high,
          multiplier.low,
          multiplier.high
        );
        return fromBits(low, wasm.get_high(), this.unsigned);
      }
      if (multiplier.isZero())
        return ZERO;
      if (this.eq(MIN_VALUE))
        return multiplier.isOdd() ? MIN_VALUE : ZERO;
      if (multiplier.eq(MIN_VALUE))
        return this.isOdd() ? MIN_VALUE : ZERO;
      if (this.isNegative()) {
        if (multiplier.isNegative())
          return this.neg().mul(multiplier.neg());
        else
          return this.neg().mul(multiplier).neg();
      } else if (multiplier.isNegative())
        return this.mul(multiplier.neg()).neg();
      if (this.lt(TWO_PWR_24) && multiplier.lt(TWO_PWR_24))
        return fromNumber(this.toNumber() * multiplier.toNumber(), this.unsigned);
      var a48 = this.high >>> 16;
      var a32 = this.high & 65535;
      var a16 = this.low >>> 16;
      var a00 = this.low & 65535;
      var b48 = multiplier.high >>> 16;
      var b32 = multiplier.high & 65535;
      var b16 = multiplier.low >>> 16;
      var b00 = multiplier.low & 65535;
      var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
      c00 += a00 * b00;
      c16 += c00 >>> 16;
      c00 &= 65535;
      c16 += a16 * b00;
      c32 += c16 >>> 16;
      c16 &= 65535;
      c16 += a00 * b16;
      c32 += c16 >>> 16;
      c16 &= 65535;
      c32 += a32 * b00;
      c48 += c32 >>> 16;
      c32 &= 65535;
      c32 += a16 * b16;
      c48 += c32 >>> 16;
      c32 &= 65535;
      c32 += a00 * b32;
      c48 += c32 >>> 16;
      c32 &= 65535;
      c48 += a48 * b00 + a32 * b16 + a16 * b32 + a00 * b48;
      c48 &= 65535;
      return fromBits(c16 << 16 | c00, c48 << 16 | c32, this.unsigned);
    };
    LongPrototype.mul = LongPrototype.multiply;
    LongPrototype.divide = function divide(divisor) {
      if (!isLong(divisor))
        divisor = fromValue(divisor);
      if (divisor.isZero())
        throw Error("division by zero");
      if (wasm) {
        if (!this.unsigned && this.high === -2147483648 && divisor.low === -1 && divisor.high === -1) {
          return this;
        }
        var low = (this.unsigned ? wasm.div_u : wasm.div_s)(
          this.low,
          this.high,
          divisor.low,
          divisor.high
        );
        return fromBits(low, wasm.get_high(), this.unsigned);
      }
      if (this.isZero())
        return this.unsigned ? UZERO : ZERO;
      var approx, rem, res;
      if (!this.unsigned) {
        if (this.eq(MIN_VALUE)) {
          if (divisor.eq(ONE) || divisor.eq(NEG_ONE))
            return MIN_VALUE;
          else if (divisor.eq(MIN_VALUE))
            return ONE;
          else {
            var halfThis = this.shr(1);
            approx = halfThis.div(divisor).shl(1);
            if (approx.eq(ZERO)) {
              return divisor.isNegative() ? ONE : NEG_ONE;
            } else {
              rem = this.sub(divisor.mul(approx));
              res = approx.add(rem.div(divisor));
              return res;
            }
          }
        } else if (divisor.eq(MIN_VALUE))
          return this.unsigned ? UZERO : ZERO;
        if (this.isNegative()) {
          if (divisor.isNegative())
            return this.neg().div(divisor.neg());
          return this.neg().div(divisor).neg();
        } else if (divisor.isNegative())
          return this.div(divisor.neg()).neg();
        res = ZERO;
      } else {
        if (!divisor.unsigned)
          divisor = divisor.toUnsigned();
        if (divisor.gt(this))
          return UZERO;
        if (divisor.gt(this.shru(1)))
          return UONE;
        res = UZERO;
      }
      rem = this;
      while (rem.gte(divisor)) {
        approx = Math.max(1, Math.floor(rem.toNumber() / divisor.toNumber()));
        var log2 = Math.ceil(Math.log(approx) / Math.LN2), delta = log2 <= 48 ? 1 : pow_dbl(2, log2 - 48), approxRes = fromNumber(approx), approxRem = approxRes.mul(divisor);
        while (approxRem.isNegative() || approxRem.gt(rem)) {
          approx -= delta;
          approxRes = fromNumber(approx, this.unsigned);
          approxRem = approxRes.mul(divisor);
        }
        if (approxRes.isZero())
          approxRes = ONE;
        res = res.add(approxRes);
        rem = rem.sub(approxRem);
      }
      return res;
    };
    LongPrototype.div = LongPrototype.divide;
    LongPrototype.modulo = function modulo(divisor) {
      if (!isLong(divisor))
        divisor = fromValue(divisor);
      if (wasm) {
        var low = (this.unsigned ? wasm.rem_u : wasm.rem_s)(
          this.low,
          this.high,
          divisor.low,
          divisor.high
        );
        return fromBits(low, wasm.get_high(), this.unsigned);
      }
      return this.sub(this.div(divisor).mul(divisor));
    };
    LongPrototype.mod = LongPrototype.modulo;
    LongPrototype.rem = LongPrototype.modulo;
    LongPrototype.not = function not() {
      return fromBits(~this.low, ~this.high, this.unsigned);
    };
    LongPrototype.and = function and(other) {
      if (!isLong(other))
        other = fromValue(other);
      return fromBits(this.low & other.low, this.high & other.high, this.unsigned);
    };
    LongPrototype.or = function or(other) {
      if (!isLong(other))
        other = fromValue(other);
      return fromBits(this.low | other.low, this.high | other.high, this.unsigned);
    };
    LongPrototype.xor = function xor(other) {
      if (!isLong(other))
        other = fromValue(other);
      return fromBits(this.low ^ other.low, this.high ^ other.high, this.unsigned);
    };
    LongPrototype.shiftLeft = function shiftLeft(numBits) {
      if (isLong(numBits))
        numBits = numBits.toInt();
      if ((numBits &= 63) === 0)
        return this;
      else if (numBits < 32)
        return fromBits(this.low << numBits, this.high << numBits | this.low >>> 32 - numBits, this.unsigned);
      else
        return fromBits(0, this.low << numBits - 32, this.unsigned);
    };
    LongPrototype.shl = LongPrototype.shiftLeft;
    LongPrototype.shiftRight = function shiftRight(numBits) {
      if (isLong(numBits))
        numBits = numBits.toInt();
      if ((numBits &= 63) === 0)
        return this;
      else if (numBits < 32)
        return fromBits(this.low >>> numBits | this.high << 32 - numBits, this.high >> numBits, this.unsigned);
      else
        return fromBits(this.high >> numBits - 32, this.high >= 0 ? 0 : -1, this.unsigned);
    };
    LongPrototype.shr = LongPrototype.shiftRight;
    LongPrototype.shiftRightUnsigned = function shiftRightUnsigned(numBits) {
      if (isLong(numBits))
        numBits = numBits.toInt();
      numBits &= 63;
      if (numBits === 0)
        return this;
      else {
        var high = this.high;
        if (numBits < 32) {
          var low = this.low;
          return fromBits(low >>> numBits | high << 32 - numBits, high >>> numBits, this.unsigned);
        } else if (numBits === 32)
          return fromBits(high, 0, this.unsigned);
        else
          return fromBits(high >>> numBits - 32, 0, this.unsigned);
      }
    };
    LongPrototype.shru = LongPrototype.shiftRightUnsigned;
    LongPrototype.shr_u = LongPrototype.shiftRightUnsigned;
    LongPrototype.toSigned = function toSigned() {
      if (!this.unsigned)
        return this;
      return fromBits(this.low, this.high, false);
    };
    LongPrototype.toUnsigned = function toUnsigned() {
      if (this.unsigned)
        return this;
      return fromBits(this.low, this.high, true);
    };
    LongPrototype.toBytes = function toBytes(le) {
      return le ? this.toBytesLE() : this.toBytesBE();
    };
    LongPrototype.toBytesLE = function toBytesLE() {
      var hi = this.high, lo = this.low;
      return [
        lo & 255,
        lo >>> 8 & 255,
        lo >>> 16 & 255,
        lo >>> 24,
        hi & 255,
        hi >>> 8 & 255,
        hi >>> 16 & 255,
        hi >>> 24
      ];
    };
    LongPrototype.toBytesBE = function toBytesBE() {
      var hi = this.high, lo = this.low;
      return [
        hi >>> 24,
        hi >>> 16 & 255,
        hi >>> 8 & 255,
        hi & 255,
        lo >>> 24,
        lo >>> 16 & 255,
        lo >>> 8 & 255,
        lo & 255
      ];
    };
    Long.fromBytes = function fromBytes(bytes, unsigned, le) {
      return le ? Long.fromBytesLE(bytes, unsigned) : Long.fromBytesBE(bytes, unsigned);
    };
    Long.fromBytesLE = function fromBytesLE(bytes, unsigned) {
      return new Long(
        bytes[0] | bytes[1] << 8 | bytes[2] << 16 | bytes[3] << 24,
        bytes[4] | bytes[5] << 8 | bytes[6] << 16 | bytes[7] << 24,
        unsigned
      );
    };
    Long.fromBytesBE = function fromBytesBE(bytes, unsigned) {
      return new Long(
        bytes[4] << 24 | bytes[5] << 16 | bytes[6] << 8 | bytes[7],
        bytes[0] << 24 | bytes[1] << 16 | bytes[2] << 8 | bytes[3],
        unsigned
      );
    };
  }
});

// node_modules/dbus-next/lib/library-options.js
var require_library_options = __commonJS({
  "node_modules/dbus-next/lib/library-options.js"(exports2, module2) {
    var libraryOptions = {
      bigIntCompat: false
    };
    module2.exports.getBigIntCompat = function() {
      return libraryOptions.bigIntCompat;
    };
    module2.exports.setBigIntCompat = function(val) {
      if (typeof val !== "boolean") {
        throw new Error("dbus.setBigIntCompat() must be called with a boolean parameter");
      }
      libraryOptions.bigIntCompat = val;
    };
  }
});

// node_modules/dbus-next/lib/marshallers.js
var require_marshallers = __commonJS({
  "node_modules/dbus-next/lib/marshallers.js"(exports2) {
    var Buffer2 = require_safe_buffer().Buffer;
    var align = require_align().align;
    var { parseSignature } = require_signature();
    var Long = require_long();
    var { getBigIntCompat } = require_library_options();
    var JSBI = require_jsbi_cjs();
    var {
      _getJSBIConstants,
      _getBigIntConstants
    } = require_constants();
    var MakeSimpleMarshaller = function(signature) {
      const marshaller = {};
      function checkValidString(data) {
        if (typeof data !== "string") {
          throw new Error(`Data: ${data} was not of type string`);
        } else if (data.indexOf("\0") !== -1) {
          throw new Error("String contains null byte");
        }
      }
      function checkValidSignature(data) {
        if (data.length > 255) {
          throw new Error(
            `Data: ${data} is too long for signature type (${data.length} > 255)`
          );
        }
        let parenCount = 0;
        for (let ii = 0; ii < data.length; ++ii) {
          if (parenCount > 32) {
            throw new Error(
              `Maximum container type nesting exceeded in signature type:${data}`
            );
          }
          switch (data[ii]) {
            case "(":
              ++parenCount;
              break;
            case ")":
              --parenCount;
              break;
            default:
              break;
          }
        }
        parseSignature(data);
      }
      switch (signature) {
        case "o":
        case "s":
          marshaller.check = function(data) {
            checkValidString(data);
          };
          marshaller.marshall = function(ps, data) {
            this.check(data);
            align(ps, 4);
            const buff = Buffer2.from(data, "utf8");
            ps.word32le(buff.length).put(buff).word8(0);
            ps._offset += 5 + buff.length;
          };
          break;
        case "g":
          marshaller.check = function(data) {
            checkValidString(data);
            checkValidSignature(data);
          };
          marshaller.marshall = function(ps, data) {
            this.check(data);
            const buff = Buffer2.from(data, "ascii");
            ps.word8(data.length).put(buff).word8(0);
            ps._offset += 2 + buff.length;
          };
          break;
        case "y":
          marshaller.check = function(data) {
            checkInteger(data);
            checkRange(0, 255, data);
          };
          marshaller.marshall = function(ps, data) {
            this.check(data);
            ps.word8(data);
            ps._offset++;
          };
          break;
        case "b":
          marshaller.check = function(data) {
            checkBoolean(data);
          };
          marshaller.marshall = function(ps, data) {
            this.check(data);
            data = data ? 1 : 0;
            align(ps, 4);
            ps.word32le(data);
            ps._offset += 4;
          };
          break;
        case "n":
          marshaller.check = function(data) {
            checkInteger(data);
            checkRange(-32767 - 1, 32767, data);
          };
          marshaller.marshall = function(ps, data) {
            this.check(data);
            align(ps, 2);
            const buff = Buffer2.alloc(2);
            buff.writeInt16LE(parseInt(data), 0);
            ps.put(buff);
            ps._offset += 2;
          };
          break;
        case "q":
          marshaller.check = function(data) {
            checkInteger(data);
            checkRange(0, 65535, data);
          };
          marshaller.marshall = function(ps, data) {
            this.check(data);
            align(ps, 2);
            ps.word16le(data);
            ps._offset += 2;
          };
          break;
        case "h":
        case "i":
          marshaller.check = function(data) {
            checkInteger(data);
            checkRange(-2147483647 - 1, 2147483647, data);
          };
          marshaller.marshall = function(ps, data) {
            this.check(data);
            align(ps, 4);
            const buff = Buffer2.alloc(4);
            buff.writeInt32LE(parseInt(data), 0);
            ps.put(buff);
            ps._offset += 4;
          };
          break;
        case "u":
          marshaller.check = function(data) {
            checkInteger(data);
            checkRange(0, 4294967295, data);
          };
          marshaller.marshall = function(ps, data) {
            this.check(data);
            align(ps, 4);
            ps.word32le(data);
            ps._offset += 4;
          };
          break;
        case "t":
          marshaller.check = function(data) {
            return checkLong(data, false);
          };
          marshaller.marshall = function(ps, data) {
            data = this.check(data);
            align(ps, 8);
            ps.word32le(data.low);
            ps.word32le(data.high);
            ps._offset += 8;
          };
          break;
        case "x":
          marshaller.check = function(data) {
            return checkLong(data, true);
          };
          marshaller.marshall = function(ps, data) {
            data = this.check(data);
            align(ps, 8);
            ps.word32le(data.low);
            ps.word32le(data.high);
            ps._offset += 8;
          };
          break;
        case "d":
          marshaller.check = function(data) {
            if (typeof data !== "number") {
              throw new Error(`Data: ${data} was not of type number`);
            } else if (Number.isNaN(data)) {
              throw new Error(`Data: ${data} was not a number`);
            } else if (!Number.isFinite(data)) {
              throw new Error("Number outside range");
            }
          };
          marshaller.marshall = function(ps, data) {
            this.check(data);
            align(ps, 8);
            const buff = Buffer2.alloc(8);
            buff.writeDoubleLE(parseFloat(data), 0);
            ps.put(buff);
            ps._offset += 8;
          };
          break;
        default:
          throw new Error(`Unknown data type format: ${signature}`);
      }
      return marshaller;
    };
    exports2.MakeSimpleMarshaller = MakeSimpleMarshaller;
    var checkRange = function(minValue, maxValue, data) {
      if (data > maxValue || data < minValue) {
        throw new Error("Number outside range");
      }
    };
    var checkInteger = function(data) {
      if (typeof data !== "number") {
        throw new Error(`Data: ${data} was not of type number`);
      }
      if (Math.floor(data) !== data) {
        throw new Error(`Data: ${data} was not an integer`);
      }
    };
    var checkBoolean = function(data) {
      if (!(typeof data === "boolean" || data === 0 || data === 1)) {
        throw new Error(`Data: ${data} was not of type boolean`);
      }
    };
    var checkJSBILong = function(data, signed) {
      const { MAX_INT64, MIN_INT64, MAX_UINT64, MIN_UINT64 } = _getJSBIConstants();
      data = JSBI.BigInt(data.toString());
      if (signed) {
        if (JSBI.greaterThan(data, MAX_INT64)) {
          throw new Error("data was out of range (greater than max int64)");
        } else if (JSBI.lessThan(data, MIN_INT64)) {
          throw new Error("data was out of range (less than min int64)");
        }
      } else {
        if (JSBI.greaterThan(data, MAX_UINT64)) {
          throw new Error("data was out of range (greater than max uint64)");
        } else if (JSBI.lessThan(data, MIN_UINT64)) {
          throw new Error("data was out of range (less than min uint64)");
        }
      }
      return Long.fromString(data.toString(), true);
    };
    var checkBigIntLong = function(data, signed) {
      const { MAX_INT64, MIN_INT64, MAX_UINT64, MIN_UINT64 } = _getBigIntConstants();
      if (typeof data !== "bigint") {
        data = BigInt(data.toString());
      }
      if (signed) {
        if (data > MAX_INT64) {
          throw new Error("data was out of range (greater than max int64)");
        } else if (data < MIN_INT64) {
          throw new Error("data was out of range (less than min int64)");
        }
      } else {
        if (data > MAX_UINT64) {
          throw new Error("data was out of range (greater than max uint64)");
        } else if (data < MIN_UINT64) {
          throw new Error("data was out of range (less than min uint64)");
        }
      }
      return Long.fromString(data.toString(), true);
    };
    var checkLong = function(data, signed) {
      const compat = getBigIntCompat();
      if (compat) {
        return checkJSBILong(data, signed);
      } else {
        return checkBigIntLong(data, signed);
      }
    };
  }
});

// node_modules/dbus-next/lib/marshall.js
var require_marshall = __commonJS({
  "node_modules/dbus-next/lib/marshall.js"(exports2, module2) {
    var assert = require("assert");
    var { parseSignature } = require_signature();
    var put = require_put();
    var Marshallers = require_marshallers();
    var align = require_align().align;
    module2.exports = function marshall(signature, data, offset, fds) {
      if (typeof offset === "undefined")
        offset = 0;
      const tree = parseSignature(signature);
      if (!Array.isArray(data) || data.length !== tree.length) {
        throw new Error(
          `message body does not match message signature. Body:${JSON.stringify(
            data
          )}, signature:${signature}`
        );
      }
      const putstream = put();
      putstream._offset = offset;
      const buf = writeStruct(putstream, tree, data, fds).buffer();
      return buf;
    };
    function writeStruct(ps, tree, data, fds) {
      if (tree.length !== data.length) {
        throw new Error("Invalid struct data");
      }
      for (let i = 0; i < tree.length; ++i) {
        write(ps, tree[i], data[i], fds);
      }
      return ps;
    }
    function write(ps, ele, data, fds) {
      switch (ele.type) {
        case "(":
        case "{":
          align(ps, 8);
          writeStruct(ps, ele.child, data, fds);
          break;
        case "a": {
          const arrPut = put();
          arrPut._offset = ps._offset;
          const _offset = arrPut._offset;
          writeSimple(arrPut, "u", 0);
          const lengthOffset = arrPut._offset - 4 - _offset;
          if (["x", "t", "d", "{", "("].indexOf(ele.child[0].type) !== -1) {
            align(arrPut, 8);
          }
          const startOffset = arrPut._offset;
          for (let i = 0; i < data.length; ++i) {
            write(arrPut, ele.child[0], data[i], fds);
          }
          const arrBuff = arrPut.buffer();
          const length = arrPut._offset - startOffset;
          arrBuff.writeUInt32LE(length, lengthOffset);
          ps.put(arrBuff);
          ps._offset += arrBuff.length;
          break;
        }
        case "v": {
          assert.strictEqual(data.length, 2, "variant data should be [signature, data]");
          const signatureEle = {
            type: "g",
            child: []
          };
          write(ps, signatureEle, data[0], fds);
          const tree = parseSignature(data[0]);
          assert(tree.length === 1);
          write(ps, tree[0], data[1], fds);
          break;
        }
        case "h": {
          if (fds) {
            const idx = fds.push(data);
            return writeSimple(ps, ele.type, idx - 1);
          }
        }
        default:
          return writeSimple(ps, ele.type, data);
      }
    }
    var stringTypes = ["g", "o", "s"];
    function writeSimple(ps, type, data) {
      if (typeof data === "undefined") {
        throw new Error(
          "Serialisation of JS 'undefined' type is not supported by d-bus"
        );
      }
      if (data === null) {
        throw new Error("Serialisation of null value is not supported by d-bus");
      }
      if (Buffer.isBuffer(data))
        data = data.toString();
      if (stringTypes.indexOf(type) !== -1 && typeof data !== "string") {
        throw new Error(
          `Expected string or buffer argument, got ${JSON.stringify(
            data
          )} of type '${type}'`
        );
      }
      const simpleMarshaller = Marshallers.MakeSimpleMarshaller(type);
      simpleMarshaller.marshall(ps, data);
      return ps;
    }
  }
});

// node_modules/dbus-next/lib/dbus-buffer.js
var require_dbus_buffer = __commonJS({
  "node_modules/dbus-next/lib/dbus-buffer.js"(exports2, module2) {
    var { parseSignature } = require_signature();
    var { getBigIntCompat } = require_library_options();
    var JSBI = require_jsbi_cjs();
    var Long = require_long();
    var LE = require_constants().endianness.le;
    function DBusBuffer(buffer, startPos, endian, fds, options) {
      if (typeof options !== "object") {
        options = { ayBuffer: true };
      } else if (options.ayBuffer === void 0) {
        options.ayBuffer = true;
      }
      this.options = options;
      this.buffer = buffer;
      this.endian = endian;
      this.fds = fds;
      this.startPos = startPos || 0;
      this.pos = 0;
    }
    DBusBuffer.prototype.align = function(power) {
      const allbits = (1 << power) - 1;
      const paddedOffset = this.pos + this.startPos + allbits >> power << power;
      this.pos = paddedOffset - this.startPos;
    };
    DBusBuffer.prototype.readInt8 = function() {
      this.pos++;
      return this.buffer[this.pos - 1];
    };
    DBusBuffer.prototype.readSInt16 = function() {
      this.align(1);
      const res = this.endian === LE ? this.buffer.readInt16LE(this.pos) : this.buffer.readInt16BE(this.pos);
      this.pos += 2;
      return res;
    };
    DBusBuffer.prototype.readInt16 = function() {
      this.align(1);
      const res = this.endian === LE ? this.buffer.readUInt16LE(this.pos) : this.buffer.readUInt16BE(this.pos);
      this.pos += 2;
      return res;
    };
    DBusBuffer.prototype.readSInt32 = function() {
      this.align(2);
      const res = this.endian === LE ? this.buffer.readInt32LE(this.pos) : this.buffer.readInt32BE(this.pos);
      this.pos += 4;
      return res;
    };
    DBusBuffer.prototype.readInt32 = function() {
      this.align(2);
      const res = this.endian === LE ? this.buffer.readUInt32LE(this.pos) : this.buffer.readUInt32BE(this.pos);
      this.pos += 4;
      return res;
    };
    DBusBuffer.prototype.readDouble = function() {
      this.align(3);
      const res = this.endian === LE ? this.buffer.readDoubleLE(this.pos) : this.buffer.readDoubleBE(this.pos);
      this.pos += 8;
      return res;
    };
    DBusBuffer.prototype.readString = function(len) {
      if (len === 0) {
        this.pos++;
        return "";
      }
      const res = this.buffer.toString("utf8", this.pos, this.pos + len);
      this.pos += len + 1;
      return res;
    };
    DBusBuffer.prototype.readTree = function readTree(tree) {
      switch (tree.type) {
        case "(":
        case "{":
        case "r":
          this.align(3);
          return this.readStruct(tree.child);
        case "a":
          if (!tree.child || tree.child.length !== 1) {
            throw new Error("Incorrect array element signature");
          }
          return this.readArray(tree.child[0], this.readInt32());
        case "v":
          return this.readVariant();
        default:
          return this.readSimpleType(tree.type);
      }
    };
    DBusBuffer.prototype.read = function read(signature) {
      const tree = parseSignature(signature);
      return this.readStruct(tree);
    };
    DBusBuffer.prototype.readVariant = function readVariant() {
      const signature = this.readSimpleType("g");
      const tree = parseSignature(signature);
      return [tree, this.readStruct(tree)];
    };
    DBusBuffer.prototype.readStruct = function readStruct(struct) {
      const result = [];
      for (let i = 0; i < struct.length; ++i) {
        result.push(this.readTree(struct[i]));
      }
      return result;
    };
    DBusBuffer.prototype.readArray = function readArray(eleType, arrayBlobSize) {
      const result = [];
      const start2 = this.pos;
      if (eleType.type === "y" && this.options.ayBuffer) {
        this.pos += arrayBlobSize;
        return this.buffer.slice(start2, this.pos);
      }
      if (["x", "t", "d", "{", "(", "r"].indexOf(eleType.type) !== -1) {
        this.align(3);
      }
      const end = this.pos + arrayBlobSize;
      while (this.pos < end) {
        result.push(this.readTree(eleType));
      }
      return result;
    };
    DBusBuffer.prototype.readSimpleType = function readSimpleType(t) {
      let len, word0, word1;
      switch (t) {
        case "y":
          return this.readInt8();
        case "b":
          return !!this.readInt32();
        case "n":
          return this.readSInt16();
        case "q":
          return this.readInt16();
        case "h": {
          const idx = this.readInt32();
          if (!this.fds || this.fds.length <= idx)
            throw new Error("No FDs available");
          return this.fds[idx];
        }
        case "u":
          return this.readInt32();
        case "i":
          return this.readSInt32();
        case "g":
          len = this.readInt8();
          return this.readString(len);
        case "s":
        case "o":
          len = this.readInt32();
          return this.readString(len);
        case "x": {
          this.align(3);
          word0 = this.readInt32();
          word1 = this.readInt32();
          const signedLong = new Long(word0, word1, false);
          if (getBigIntCompat()) {
            return JSBI.BigInt(signedLong.toString());
          } else if (typeof BigInt !== "function") {
            throw new Error("BigInt is not supported in this Node version. Use dbus.setBigIntCompat(true) to use a polyfill");
          } else {
            return BigInt(signedLong.toString());
          }
        }
        case "t": {
          this.align(3);
          word0 = this.readInt32();
          word1 = this.readInt32();
          const unsignedLong = new Long(word0, word1, true);
          if (getBigIntCompat()) {
            return JSBI.BigInt(unsignedLong.toString());
          } else if (typeof BigInt !== "function") {
            throw new Error("BigInt is not supported in this Node version. Use dbus.setBigIntCompat(true) to use a polyfill");
          } else {
            return BigInt(unsignedLong.toString());
          }
        }
        case "d":
          return this.readDouble();
        default:
          throw new Error(`Unsupported type: ${t}`);
      }
    };
    module2.exports = DBusBuffer;
  }
});

// node_modules/dbus-next/lib/header-signature.json
var require_header_signature = __commonJS({
  "node_modules/dbus-next/lib/header-signature.json"(exports2, module2) {
    module2.exports = [
      {
        type: "a",
        child: [
          {
            type: "(",
            child: [
              {
                type: "y",
                child: []
              },
              {
                type: "v",
                child: []
              }
            ]
          }
        ]
      }
    ];
  }
});

// node_modules/dbus-next/lib/message.js
var require_message = __commonJS({
  "node_modules/dbus-next/lib/message.js"(exports2, module2) {
    var Buffer2 = require_safe_buffer().Buffer;
    var marshall = require_marshall();
    var constants = require_constants();
    var DBusBuffer = require_dbus_buffer();
    var headerSignature = require_header_signature();
    module2.exports.unmarshalMessages = function messageParser(stream, onMessage, opts) {
      let state = 0;
      let header, fieldsAndBody;
      let fieldsLength, fieldsLengthPadded;
      let fieldsAndBodyLength = 0;
      let bodyLength = 0;
      let endian = 0;
      const LE = constants.endianness.le;
      stream.on("readable", function() {
        while (1) {
          if (state === 0) {
            header = stream.read(16);
            if (!header) {
              break;
            }
            state = 1;
            endian = header.readUInt8(0);
            fieldsLength = endian === LE ? header.readUInt32LE(12) : header.readUInt32BE(12);
            fieldsLengthPadded = fieldsLength + 7 >> 3 << 3;
            bodyLength = endian === LE ? header.readUInt32LE(4) : header.readUInt32BE(4);
            fieldsAndBodyLength = fieldsLengthPadded + bodyLength;
          } else {
            const readBuf = stream.read(fieldsAndBodyLength, null);
            fieldsAndBody = readBuf ? readBuf.data || readBuf : readBuf;
            if (!fieldsAndBody) {
              break;
            }
            state = 0;
            const messageBuffer = new DBusBuffer(fieldsAndBody, 0, endian, readBuf.fds, opts);
            const unmarshalledHeader = messageBuffer.readArray(
              headerSignature[0].child[0],
              fieldsLength
            );
            messageBuffer.align(3);
            let headerName;
            const message = {};
            message.serial = endian === LE ? header.readUInt32LE(8) : header.readUInt32BE(8);
            for (let i = 0; i < unmarshalledHeader.length; ++i) {
              headerName = constants.headerTypeName[unmarshalledHeader[i][0]];
              message[headerName] = unmarshalledHeader[i][1][1][0];
            }
            message.type = header[1];
            message.flags = header[2];
            if (bodyLength > 0 && message.signature) {
              message.body = messageBuffer.read(message.signature);
            }
            onMessage(message);
          }
        }
      });
    };
    module2.exports.unmarshall = function unmarshall(buff, opts) {
      const endian = buff.readUInt8();
      const msgBuf = new DBusBuffer(buff, 0, endian, null, opts);
      const headers = msgBuf.read("yyyyuua(yv)");
      const message = {};
      for (let i = 0; i < headers[6].length; ++i) {
        const headerName = constants.headerTypeName[headers[6][i][0]];
        message[headerName] = headers[6][i][1][1][0];
      }
      message.type = headers[1];
      message.flags = headers[2];
      message.serial = headers[5];
      msgBuf.align(3);
      message.body = msgBuf.read(message.signature);
      return message;
    };
    module2.exports.marshall = function marshallMessage(message) {
      if (!message.serial)
        throw new Error("Missing or invalid serial");
      const flags = message.flags || 0;
      const type = message.type || constants.messageType.METHOD_CALL;
      let bodyLength = 0;
      let bodyBuff;
      const fds = [];
      if (message.signature && message.body) {
        bodyBuff = marshall(message.signature, message.body, 0, fds);
        bodyLength = bodyBuff.length;
        message.unixFd = fds.length;
      }
      const header = [
        constants.endianness.le,
        type,
        flags,
        constants.protocolVersion,
        bodyLength,
        message.serial
      ];
      const headerBuff = marshall("yyyyuu", header);
      const fields = [];
      constants.headerTypeName.forEach(function(fieldName) {
        const fieldVal = message[fieldName];
        if (fieldVal) {
          fields.push([
            constants.headerTypeId[fieldName],
            [constants.fieldSignature[fieldName], fieldVal]
          ]);
        }
      });
      const fieldsBuff = marshall("a(yv)", [fields], 12);
      const headerLenAligned = headerBuff.length + fieldsBuff.length + 7 >> 3 << 3;
      const messageLen = headerLenAligned + bodyLength;
      const messageBuff = Buffer2.alloc(messageLen);
      headerBuff.copy(messageBuff);
      fieldsBuff.copy(messageBuff, headerBuff.length);
      if (bodyLength > 0)
        bodyBuff.copy(messageBuff, headerLenAligned);
      return [messageBuff, fds];
    };
  }
});

// node_modules/dbus-next/lib/readline.js
var require_readline = __commonJS({
  "node_modules/dbus-next/lib/readline.js"(exports2, module2) {
    var Buffer2 = require_safe_buffer().Buffer;
    module2.exports = function readOneLine(stream, cb) {
      const bytes = [];
      function readable() {
        while (1) {
          const buf = stream.read(1);
          if (!buf)
            return;
          const b = buf[0];
          if (b === 10) {
            try {
              cb(Buffer2.from(bytes));
            } catch (error) {
              stream.emit("error", error);
            }
            stream.removeListener("readable", readable);
            return;
          }
          bytes.push(b);
        }
      }
      stream.on("readable", readable);
    };
  }
});

// node_modules/dbus-next/lib/handshake.js
var require_handshake = __commonJS({
  "node_modules/dbus-next/lib/handshake.js"(exports2, module2) {
    var Buffer2 = require_safe_buffer().Buffer;
    var crypto = require("crypto");
    var fs = require("fs");
    var path = require("path");
    var constants = require_constants();
    var readLine = require_readline();
    function sha1(input) {
      const shasum = crypto.createHash("sha1");
      shasum.update(input);
      return shasum.digest("hex");
    }
    function getUserHome() {
      return process.env[process.platform.match(/$win/) ? "USERPROFILE" : "HOME"];
    }
    function getCookie(context, id, cb) {
      const dirname = path.join(getUserHome(), ".dbus-keyrings");
      if (context.length === 0)
        context = "org_freedesktop_general";
      const filename = path.join(dirname, context);
      fs.stat(dirname, function(err, stat) {
        if (err)
          return cb(err);
        if (stat.mode & 18) {
          return cb(
            new Error(
              "User keyrings directory is writeable by other users. Aborting authentication"
            )
          );
        }
        if ("getuid" in process && stat.uid !== process.getuid()) {
          return cb(
            new Error(
              "Keyrings directory is not owned by the current user. Aborting authentication!"
            )
          );
        }
        fs.readFile(filename, "ascii", function(err2, keyrings) {
          if (err2)
            return cb(err2);
          const lines = keyrings.split("\n");
          for (let l = 0; l < lines.length; ++l) {
            const data = lines[l].split(" ");
            if (id === data[0])
              return cb(null, data[2]);
          }
          return cb(new Error("cookie not found"));
        });
      });
    }
    function hexlify(input) {
      return Buffer2.from(input.toString(), "ascii").toString("hex");
    }
    module2.exports = function auth(stream, opts, cb) {
      let authMethods;
      if (opts.authMethods) {
        authMethods = opts.authMethods;
      } else {
        authMethods = constants.defaultAuthMethods;
      }
      stream.write("\0");
      tryAuth(stream, authMethods.slice(), cb);
    };
    function tryAuth(stream, methods, cb) {
      if (methods.length === 0) {
        return cb(new Error("No authentication methods left to try"));
      }
      const authMethod = methods.shift();
      const uid = "getuid" in process ? process.getuid() : 0;
      const id = hexlify(uid);
      let guid = "";
      function beginOrNextAuth() {
        readLine(stream, function(line) {
          const ok = line.toString("ascii").match(/^([A-Za-z]+) (.*)/);
          if (ok && ok[1] === "OK") {
            guid = ok[2];
            if (stream.supportsUnixFd) {
              negotiateUnixFd();
            } else {
              stream.write("BEGIN\r\n");
              return cb(null, guid);
            }
          } else {
            if (!methods.empty) {
              tryAuth(stream, methods, cb);
            } else {
              return cb(line);
            }
          }
        });
      }
      function negotiateUnixFd() {
        stream.write("NEGOTIATE_UNIX_FD\r\n");
        readLine(stream, function(line) {
          const res = line.toString("ascii").trim();
          if (res === "AGREE_UNIX_FD") {
          } else if (res === "ERROR") {
            stream.supportsUnixFd = false;
          } else {
            return cb(line);
          }
          stream.write("BEGIN\r\n");
          return cb(null, guid);
        });
      }
      switch (authMethod) {
        case "EXTERNAL":
          stream.write(`AUTH ${authMethod} ${id}\r
`);
          beginOrNextAuth();
          break;
        case "DBUS_COOKIE_SHA1":
          stream.write(`AUTH ${authMethod} ${id}\r
`);
          readLine(stream, function(line) {
            const data = Buffer2.from(
              line.toString().split(" ")[1].trim(),
              "hex"
            ).toString().split(" ");
            const cookieContext = data[0];
            const cookieId = data[1];
            const serverChallenge = data[2];
            const clientChallenge = crypto.randomBytes(16).toString("hex");
            getCookie(cookieContext, cookieId, function(err, cookie) {
              if (err)
                return cb(err);
              const response = sha1(
                [serverChallenge, clientChallenge, cookie].join(":")
              );
              const reply = hexlify(clientChallenge + response);
              stream.write(`DATA ${reply}\r
`);
              beginOrNextAuth();
            });
          });
          break;
        case "ANONYMOUS":
          stream.write("AUTH ANONYMOUS \r\n");
          beginOrNextAuth();
          break;
        default:
          console.error(`Unsupported auth method: ${authMethod}`);
          beginOrNextAuth();
          break;
      }
    }
  }
});

// node_modules/x11/lib/xutil.js
var require_xutil = __commonJS({
  "node_modules/x11/lib/xutil.js"(exports2, module2) {
    function padded_length(len) {
      return len + 3 >> 2 << 2;
    }
    function padded_string(str) {
      if (str.length == 0)
        return "";
      var pad = padded_length(str.length) - str.length;
      var res = str;
      for (var i = 0; i < pad; ++i)
        res += String.fromCharCode(0);
      return res;
    }
    module2.exports.padded_length = padded_length;
    module2.exports.padded_string = padded_string;
  }
});

// node_modules/x11/lib/ext/apple-wm.js
var require_apple_wm = __commonJS({
  "node_modules/x11/lib/ext/apple-wm.js"(exports2) {
    var x11 = require_lib2();
    var xutil = require_xutil();
    exports2.requireExt = function(display, callback2) {
      var X = display.client;
      X.QueryExtension("Apple-WM", function(err, ext) {
        if (!ext.present)
          callback2(new Error("extension not available"));
        ext.QueryVersion = function(cb) {
          X.seq_num++;
          X.pack_stream.pack("CCS", [ext.majorOpcode, 0, 1]);
          X.replies[X.seq_num] = [
            function(buf, opt) {
              var res = buf.unpack("SSL");
              return res;
            },
            cb
          ];
          X.pack_stream.flush();
        };
        ext.FrameRect = {
          Titlebar: 1,
          Tracking: 2,
          Growbox: 3
        };
        ext.FrameGetRect = function(frame_class, frame_rect, ix, iy, iw, ih, ox, oy, ow, oh, cb) {
          X.seq_num++;
          X.pack_stream.pack("CCSSSSSSSSSSS", [ext.majorOpcode, 1, 6, frame_class, frame_rect, ix, iy, iw, ih, ox, oy, ow, oh, cb]);
          X.replies[X.seq_num] = [
            function(buf, opt) {
              var res = buf.unpack("SSSS");
              return {
                x: res[0],
                y: res[1],
                w: res[2],
                h: res[3]
              };
            },
            cb
          ];
          X.pack_stream.flush();
        };
        ext.FrameHitTest = function(frame_class, px, py, ix, iy, iw, ih, ox, oy, ow, oh, cb) {
          X.seq_num++;
          X.pack_stream.pack("CCSSxxSSSSSSSSSS", [ext.majorOpcode, 2, 7, frame_class, px, py, ix, iy, iw, ih, ox, oy, ow, oh]);
          X.replies[X.seq_num] = [
            function(buf, opt) {
              var res = buf.unpack("L");
              return res[0];
            },
            cb
          ];
          X.pack_stream.flush();
        };
        ext.FrameClass = {
          DecorLarge: 1,
          Reserved1: 2,
          Reserved2: 4,
          Reserved3: 8,
          DecorSmall: 16,
          Reserved5: 32,
          Reserved6: 64,
          Reserved8: 128,
          Managed: 1 << 15,
          Transient: 1 << 16,
          Stationary: 1 << 17
        };
        ext.FrameAttr = {
          Active: 1,
          Urgent: 2,
          Title: 4,
          Prelight: 8,
          Shaded: 16,
          CloseBox: 256,
          Collapse: 512,
          Zoom: 1024,
          CloseBoxClicked: 2048,
          CollapseBoxClicked: 4096,
          ZoomBoxClicked: 8192,
          GrowBox: 16384
        };
        ext.FrameDraw = function(screen, window, frameClass, attr, ix, iy, iw, ih, ox, oy, ow, oh, title) {
          X.seq_num++;
          var titleReqWords = xutil.padded_length(title.length) / 4;
          X.pack_stream.pack("CCSLLSSSSSSSSSSLp", [ext.majorOpcode, 3, 9 + titleReqWords, screen, window, frameClass, attr, ix, iy, iw, ih, ox, oy, ow, oh, title.length, title]);
          X.pack_stream.flush();
        };
        ext.NotifyMask = {
          Controller: 1,
          Activation: 2,
          Pasteboard: 4,
          All: 7
        };
        ext.SelectInput = function(mask) {
          X.seq_num++;
          X.pack_stream.pack("CCSL", [ext.majorOpcode, 6, 2, mask]);
          X.pack_stream.flush();
        };
        ext.SetFrontProcess = function() {
          X.seq_num++;
          X.pack_stream.pack("CCS", [ext.majorOpcode, 8, 1]);
          X.pack_stream.flush();
        };
        ext.WindowLevel = {
          Normal: 0,
          Floating: 1,
          TornOff: 2,
          Dock: 3,
          Desktop: 4
        };
        ext.SetWindowLevel = function(window, level) {
          X.seq_num++;
          X.pack_stream.pack("CCSLL", [ext.majorOpcode, 9, 3, window, level]);
          X.pack_stream.flush();
        };
        ext.CanQuit = function(state) {
          X.seq_num++;
          X.pack_stream.pack("CCSCxxx", [ext.majorOpcode, 10, 2, state]);
          X.pack_stream.flush();
        };
        ext.SetWindowMenu = function(items) {
          var reqlen = 8;
          var extlength = 0;
          items.forEach(function(i) {
          });
        };
        ext.SendPSN = function(hi, lo) {
          X.seq_num++;
          X.pack_stream.pack("CCSLL", [ext.majorOpcode, 12, 3, hi, lo]);
          X.pack_stream.flush();
        };
        ext.AttachTransient = function(child, parent) {
          X.seq_num++;
          X.pack_stream.pack("CCSLL", [ext.majorOpcode, 13, 3, child, parent]);
          X.pack_stream.flush();
        };
        callback2(null, ext);
        ext.events = {
          AppleWMControllerNotify: 0,
          AppleWMActivationNotify: 1,
          AppleWMPasteboardNotify: 2
        };
        ext.EventKind = {
          Controller: {
            MinimizeWindow: 0,
            ZoomWindow: 1,
            CloseWindow: 2,
            BringAllToFront: 3,
            WideWindow: 4,
            HideAll: 5,
            ShowAll: 6,
            WindowMenuItem: 9,
            WindowMenuNotify: 10,
            NextWindow: 11,
            PreviousWindow: 12
          },
          Activation: {
            IsActive: 0,
            IsInactive: 1,
            ReloadPreferences: 2
          },
          Pasteboard: {
            CopyToPasteboard: 0
          }
        };
        X.eventParsers[ext.firstEvent + ext.events.AppleWMControllerNotify] = X.eventParsers[ext.firstEvent + ext.events.AppleWMActivationNotify] = X.eventParsers[ext.firstEvent + ext.events.AppleWMPasteboardNotify] = function(type, seq, extra, code, raw) {
          var event = {};
          switch (type) {
            case ext.firstEvent + ext.events.AppleWMControllerNotify:
              event.name = "AppleWMControllerNotify";
              break;
            case ext.firstEvent + ext.events.AppleWMActivationNotify:
              event.name = "AppleWMActivationNotify";
              break;
            case ext.firstEvent + ext.events.AppleWMPasteboardNotify:
              event.name = "AppleWMPasteboardNotify";
              break;
          }
          event.type = code;
          event.time = extra;
          event.arg = raw.unpack("xxL")[0];
          return event;
        };
      });
    };
  }
});

// node_modules/x11/lib/ext/big-requests.js
var require_big_requests = __commonJS({
  "node_modules/x11/lib/ext/big-requests.js"(exports2) {
    exports2.requireExt = function(display, callback2) {
      var X = display.client;
      X.QueryExtension("BIG-REQUESTS", function(err, ext) {
        if (!ext.present)
          return callback2(new Error("extension not available"));
        ext.Enable = function(cb) {
          X.seq_num++;
          X.pack_stream.pack("CCS", [ext.majorOpcode, 0, 1]);
          X.replies[X.seq_num] = [
            function(buf, opt) {
              return buf.unpack("L")[0];
            },
            cb
          ];
          X.pack_stream.flush();
        };
        callback2(null, ext);
      });
    };
  }
});

// node_modules/x11/lib/ext/composite.js
var require_composite = __commonJS({
  "node_modules/x11/lib/ext/composite.js"(exports2) {
    var x11 = require_lib2();
    exports2.requireExt = function(display, callback2) {
      var X = display.client;
      X.QueryExtension("Composite", function(err, ext) {
        if (!ext.present)
          return callback2(new Error("extension not available"));
        ext.Redirect = {
          Automatic: 0,
          Manual: 1
        };
        ext.QueryVersion = function(clientMaj, clientMin, callback3) {
          X.seq_num++;
          X.pack_stream.pack("CCSLL", [ext.majorOpcode, 0, 3, clientMaj, clientMin]);
          X.replies[X.seq_num] = [
            function(buf, opt) {
              var res = buf.unpack("LL");
              return res;
            },
            callback3
          ];
          X.pack_stream.flush();
        };
        ext.RedirectWindow = function(window, updateType) {
          X.seq_num++;
          X.pack_stream.pack("CCSLCxxx", [ext.majorOpcode, 1, 3, window, updateType]);
          X.pack_stream.flush();
        };
        ext.RedirectSubwindows = function(window, updateType) {
          X.seq_num++;
          X.pack_stream.pack("CCSLCxxx", [ext.majorOpcode, 2, 3, window, updateType]);
          X.pack_stream.flush();
        };
        ext.UnredirectWindow = function(window) {
          X.seq_num++;
          X.pack_stream.pack("CCSL", [ext.majorOpcode, 3, 2, window]);
          X.pack_stream.flush();
        };
        ext.UnredirectSubwindows = function(window) {
          X.seq_num++;
          X.pack_stream.pack("CCSL", [ext.majorOpcode, 4, 2, window]);
          X.pack_stream.flush();
        };
        ext.CreateRegionFromBorderClip = function(region, window) {
          X.seq_num++;
          X.pack_stream.pack("CCSLL", [ext.majorOpcode, 5, 3, damage, region]);
          X.pack_stream.flush();
        };
        ext.NameWindowPixmap = function(window, pixmap) {
          X.seq_num++;
          X.pack_stream.pack("CCSLL", [ext.majorOpcode, 6, 3, window, pixmap]);
          X.pack_stream.flush();
        };
        ext.GetOverlayWindow = function(window, callback3) {
          X.seq_num++;
          X.pack_stream.pack("CCSL", [ext.majorOpcode, 7, 2, window]);
          X.replies[X.seq_num] = [
            function(buf, opt) {
              var res = buf.unpack("L");
              return res[0];
            },
            callback3
          ];
          X.pack_stream.flush();
        };
        ext.ReleaseOverlayWindow = function(window) {
          X.seq_num++;
          X.pack_stream.pack("CCSL", [ext.majorOpcode, 8, 2, window]);
          X.pack_stream.flush();
        };
        ext.QueryVersion(0, 4, function(err2, vers) {
          if (err2)
            return callback2(err2);
          ext.major = vers[0];
          ext.minor = vers[1];
          callback2(null, ext);
        });
      });
    };
  }
});

// node_modules/x11/lib/ext/damage.js
var require_damage = __commonJS({
  "node_modules/x11/lib/ext/damage.js"(exports2) {
    var x11 = require_lib2();
    exports2.requireExt = function(display, callback2) {
      var X = display.client;
      X.QueryExtension("DAMAGE", function(err, ext) {
        if (!ext.present)
          return callback2(new Error("extension not available"));
        ext.ReportLevel = {
          RawRectangles: 0,
          DeltaRectangles: 1,
          BoundingBox: 2,
          NonEmpty: 3
        };
        ext.QueryVersion = function(clientMaj, clientMin, callback3) {
          X.seq_num++;
          X.pack_stream.pack("CCSLL", [ext.majorOpcode, 0, 3, clientMaj, clientMin]);
          X.replies[X.seq_num] = [
            function(buf, opt) {
              var res = buf.unpack("LL");
              return res;
            },
            callback3
          ];
          X.pack_stream.flush();
        };
        ext.Create = function(damage2, drawable, reportlevel) {
          X.seq_num++;
          X.pack_stream.pack("CCSLLCxxx", [ext.majorOpcode, 1, 4, damage2, drawable, reportlevel]);
          X.pack_stream.flush();
        };
        ext.Destroy = function(damage2) {
          X.seq_num++;
          X.pack_stream.pack("CCSLL", [ext.majorOpcode, 2, 3, damage2]);
          X.pack_stream.flush();
        };
        ext.Subtract = function(damage2, repair, parts) {
          X.seq_num++;
          X.pack_stream.pack("CCSLLL", [ext.majorOpcode, 3, 4, damage2, repair, parts]);
          X.pack_stream.flush();
        };
        ext.Add = function(damage2, region) {
          X.seq_num++;
          X.pack_stream.pack("CCSLL", [ext.majorOpcode, 4, 3, damage2, region]);
          X.pack_stream.flush();
        };
        ext.QueryVersion(1, 1, function(err2, vers) {
          if (err2)
            return callback2(err2);
          ext.major = vers[0];
          ext.minor = vers[1];
          callback2(null, ext);
        });
        ext.events = {
          DamageNotify: 0
        };
        X.eventParsers[ext.firstEvent + ext.events.DamageNotify] = function(type, seq, extra, code, raw) {
          var event = {};
          event.level = code;
          event.seq = seq;
          event.drawable = extra;
          var values = raw.unpack("LLssSSssSS");
          event.damage = values[0];
          event.time = values[1];
          event.area = {
            x: values[2],
            y: values[3],
            w: values[4],
            h: values[5]
          };
          event.geometry = {
            x: values[6],
            y: values[7],
            w: values[8],
            h: values[9]
          };
          event.name = "DamageNotify";
          return event;
        };
      });
    };
  }
});

// node_modules/x11/lib/ext/dpms.js
var require_dpms = __commonJS({
  "node_modules/x11/lib/ext/dpms.js"(exports2) {
    var x11 = require_lib2();
    exports2.requireExt = function(display, callback2) {
      var X = display.client;
      X.QueryExtension("DPMS", function(err, ext) {
        if (!ext.present)
          return callback2(new Error("extension not available"));
        ext.GetVersion = function(clientMaj, clientMin, callback3) {
          X.seq_num++;
          X.pack_stream.pack("CCSSS", [ext.majorOpcode, 0, 2, clientMaj, clientMin]);
          X.replies[X.seq_num] = [
            function(buf, opt) {
              var res = buf.unpack("SS");
              return res;
            },
            callback3
          ];
          X.pack_stream.flush();
        };
        ext.Capable = function(callback3) {
          X.seq_num++;
          X.pack_stream.pack("CCS", [ext.majorOpcode, 1, 1]);
          X.replies[X.seq_num] = [
            function(buf, opt) {
              var res = buf.unpack("C");
              return res;
            },
            callback3
          ];
          X.pack_stream.flush();
        };
        ext.GetTimeouts = function(callback3) {
          X.seq_num++;
          X.pack_stream.pack("CCS", [ext.majorOpcode, 2, 1]);
          X.replies[X.seq_num] = [
            function(buf, opt) {
              var res = buf.unpack("SSS");
              return res;
            },
            callback3
          ];
          X.pack_stream.flush();
        };
        ext.SetTimeouts = function(standby_t, suspend_t, off_t) {
          X.seq_num++;
          X.pack_stream.pack("CCSSSSxx", [ext.majorOpcode, 3, 3, standby_t, suspend_t, off_t]);
          X.pack_stream.flush();
        };
        ext.Enable = function() {
          X.seq_num++;
          X.pack_stream.pack("CCS", [ext.majorOpcode, 4, 1]);
          X.pack_stream.flush();
        };
        ext.Disable = function() {
          X.seq_num++;
          X.pack_stream.pack("CCS", [ext.majorOpcode, 5, 1]);
          X.pack_stream.flush();
        };
        ext.ForceLevel = function(level) {
          X.seq_num++;
          X.pack_stream.pack("CCSSxx", [ext.majorOpcode, 6, 2, level]);
          X.pack_stream.flush();
        };
        ext.Info = function(callback3) {
          X.seq_num++;
          X.pack_stream.pack("CCS", [ext.majorOpcode, 7, 1]);
          X.replies[X.seq_num] = [
            function(buf, opt) {
              var res = buf.unpack("SC");
              return res;
            },
            callback3
          ];
          X.pack_stream.flush();
        };
        callback2(null, ext);
      });
    };
  }
});

// node_modules/x11/lib/ext/fixes.js
var require_fixes = __commonJS({
  "node_modules/x11/lib/ext/fixes.js"(exports2) {
    var x11 = require_lib2();
    function parse_rectangle(buf, pos) {
      if (!pos) {
        pos = 0;
      }
      return {
        x: buf[pos],
        y: buf[pos + 1],
        width: buf[pos + 2],
        height: buf[pos + 3]
      };
    }
    exports2.requireExt = function(display, callback2) {
      var X = display.client;
      X.QueryExtension("XFIXES", function(err, ext) {
        if (!ext.present)
          return callback2(new Error("extension not available"));
        ext.QueryVersion = function(clientMaj, clientMin, callback3) {
          X.seq_num++;
          X.pack_stream.pack("CCSLL", [ext.majorOpcode, 0, 3, clientMaj, clientMin]);
          X.replies[X.seq_num] = [
            function(buf, opt) {
              var res = buf.unpack("LL");
              return res;
            },
            callback3
          ];
          X.pack_stream.flush();
        };
        ext.SaveSetMode = { Insert: 0, Delete: 1 };
        ext.SaveSetTarget = { Nearest: 0, Root: 1 };
        ext.SaveSetMap = { Map: 0, Unmap: 1 };
        ext.ChangeSaveSet = function(window, mode, target, map) {
          X.seq_num++;
          X.pack_stream.pack("CCSCCxL", [ext.majorOpcode, 1, 3, mode, target, map]);
          X.pack_stream.flush();
        };
        ext.WindowRegionKind = {
          Bounding: 0,
          Clip: 1
        };
        ext.CreateRegion = function(region, rects) {
          X.seq_num++;
          var format2 = "CCSL";
          format2 += Array(rects.length + 1).join("ssSS");
          var args = [ext.majorOpcode, 5, 2 + (rects.length << 1), region];
          rects.forEach(function(rect) {
            args.push(rect.x);
            args.push(rect.y);
            args.push(rect.width);
            args.push(rect.height);
          });
          X.pack_stream.pack(format2, args);
          X.pack_stream.flush();
        };
        ext.CreateRegionFromWindow = function(region, wid, kind) {
          X.seq_num++;
          X.pack_stream.pack("CCSLLCxxx", [ext.majorOpcode, 7, 4, region, wid, kind]);
          X.pack_stream.flush();
        };
        ext.DestroyRegion = function(region) {
          X.seq_num++;
          X.pack_stream.pack("CCSL", [ext.majorOpcode, 10, 2, region]);
          X.pack_stream.flush();
        };
        ext.UnionRegion = function(src1, src2, dst) {
          X.seq_num++;
          X.pack_stream.pack("CCSLLL", [ext.majorOpcode, 13, 4, src1, src2, dst]);
          X.pack_stream.flush();
        };
        ext.TranslateRegion = function(region, dx, dy) {
          X.seq_num++;
          X.pack_stream.pack("CCSLss", [ext.majorOpcode, 17, 3, region, dx, dy]);
          X.pack_stream.flush();
        };
        ext.FetchRegion = function(region, cb) {
          X.seq_num++;
          X.pack_stream.pack("CCSL", [ext.majorOpcode, 19, 2, region]);
          X.replies[X.seq_num] = [
            function(buf, opt) {
              var n_rectangles = buf.length - 24 >> 3;
              var format2 = "ssSSxxxxxxxxxxxxxxxx";
              format2 += Array(n_rectangles + 1).join("ssSS");
              var res = buf.unpack(format2);
              var reg = {
                extents: parse_rectangle(res),
                rectangles: []
              };
              for (var i = 0; i < n_rectangles; ++i) {
                reg.rectangles.push(parse_rectangle(res, 4 + (i << 2)));
              }
              return reg;
            },
            cb
          ];
          X.pack_stream.flush();
        };
        ext.QueryVersion(5, 0, function(err2, vers) {
          if (err2)
            return callback2(err2);
          ext.major = vers[0];
          ext.minor = vers[1];
          callback2(null, ext);
        });
        ext.events = {
          DamageNotify: 0
        };
        X.eventParsers[ext.firstEvent + ext.events.DamageNotify] = function(type, seq, extra, code, raw) {
          var event = {};
          event.level = code;
          event.seq = seq;
          event.drawable = extra;
          var values = raw.unpack("LLssSSssSS");
          event.damage = values[0];
          event.time = values[1];
          event.area = {
            x: values[2],
            y: values[3],
            w: values[4],
            h: values[5]
          };
          event.geometry = {
            x: values[6],
            y: values[7],
            w: values[8],
            h: values[9]
          };
          event.name = "DamageNotify";
          return event;
        };
      });
    };
  }
});

// node_modules/x11/lib/ext/glxconstants.js
var require_glxconstants = __commonJS({
  "node_modules/x11/lib/ext/glxconstants.js"(exports2, module2) {
    module2.exports = {
      VERSION_1_1: 1,
      VERSION_1_2: 1,
      VERSION_1_3: 1,
      FALSE: 0,
      TRUE: 1,
      BYTE: 5120,
      UNSIGNED_BYTE: 5121,
      SHORT: 5122,
      UNSIGNED_SHORT: 5123,
      INT: 5124,
      UNSIGNED_INT: 5125,
      FLOAT: 5126,
      "2_BYTES": 5127,
      "3_BYTES": 5128,
      "4_BYTES": 5129,
      DOUBLE: 5130,
      POINTS: 0,
      LINES: 1,
      LINE_LOOP: 2,
      LINE_STRIP: 3,
      TRIANGLES: 4,
      TRIANGLE_STRIP: 5,
      TRIANGLE_FAN: 6,
      QUADS: 7,
      QUAD_STRIP: 8,
      POLYGON: 9,
      VERTEX_ARRAY: 32884,
      NORMAL_ARRAY: 32885,
      COLOR_ARRAY: 32886,
      INDEX_ARRAY: 32887,
      TEXTURE_COORD_ARRAY: 32888,
      EDGE_FLAG_ARRAY: 32889,
      VERTEX_ARRAY_SIZE: 32890,
      VERTEX_ARRAY_TYPE: 32891,
      VERTEX_ARRAY_STRIDE: 32892,
      NORMAL_ARRAY_TYPE: 32894,
      NORMAL_ARRAY_STRIDE: 32895,
      COLOR_ARRAY_SIZE: 32897,
      COLOR_ARRAY_TYPE: 32898,
      COLOR_ARRAY_STRIDE: 32899,
      INDEX_ARRAY_TYPE: 32901,
      INDEX_ARRAY_STRIDE: 32902,
      TEXTURE_COORD_ARRAY_SIZE: 32904,
      TEXTURE_COORD_ARRAY_TYPE: 32905,
      TEXTURE_COORD_ARRAY_STRIDE: 32906,
      EDGE_FLAG_ARRAY_STRIDE: 32908,
      VERTEX_ARRAY_POINTER: 32910,
      NORMAL_ARRAY_POINTER: 32911,
      COLOR_ARRAY_POINTER: 32912,
      INDEX_ARRAY_POINTER: 32913,
      TEXTURE_COORD_ARRAY_POINTER: 32914,
      EDGE_FLAG_ARRAY_POINTER: 32915,
      V2F: 10784,
      V3F: 10785,
      C4UB_V2F: 10786,
      C4UB_V3F: 10787,
      C3F_V3F: 10788,
      N3F_V3F: 10789,
      C4F_N3F_V3F: 10790,
      T2F_V3F: 10791,
      T4F_V4F: 10792,
      T2F_C4UB_V3F: 10793,
      T2F_C3F_V3F: 10794,
      T2F_N3F_V3F: 10795,
      T2F_C4F_N3F_V3F: 10796,
      T4F_C4F_N3F_V4F: 10797,
      MATRIX_MODE: 2976,
      MODELVIEW: 5888,
      PROJECTION: 5889,
      TEXTURE: 5890,
      POINT_SMOOTH: 2832,
      POINT_SIZE: 2833,
      POINT_SIZE_GRANULARITY: 2835,
      POINT_SIZE_RANGE: 2834,
      LINE_SMOOTH: 2848,
      LINE_STIPPLE: 2852,
      LINE_STIPPLE_PATTERN: 2853,
      LINE_STIPPLE_REPEAT: 2854,
      LINE_WIDTH: 2849,
      LINE_WIDTH_GRANULARITY: 2851,
      LINE_WIDTH_RANGE: 2850,
      POINT: 6912,
      LINE: 6913,
      FILL: 6914,
      CW: 2304,
      CCW: 2305,
      FRONT: 1028,
      BACK: 1029,
      POLYGON_MODE: 2880,
      POLYGON_SMOOTH: 2881,
      POLYGON_STIPPLE: 2882,
      EDGE_FLAG: 2883,
      CULL_FACE: 2884,
      CULL_FACE_MODE: 2885,
      FRONT_FACE: 2886,
      POLYGON_OFFSET_FACTOR: 32824,
      POLYGON_OFFSET_UNITS: 10752,
      POLYGON_OFFSET_POINT: 10753,
      POLYGON_OFFSET_LINE: 10754,
      POLYGON_OFFSET_FILL: 32823,
      COMPILE: 4864,
      COMPILE_AND_EXECUTE: 4865,
      LIST_BASE: 2866,
      LIST_INDEX: 2867,
      LIST_MODE: 2864,
      NEVER: 512,
      LESS: 513,
      EQUAL: 514,
      LEQUAL: 515,
      GREATER: 516,
      NOTEQUAL: 517,
      GEQUAL: 518,
      ALWAYS: 519,
      DEPTH_TEST: 2929,
      DEPTH_BITS: 3414,
      DEPTH_CLEAR_VALUE: 2931,
      DEPTH_FUNC: 2932,
      DEPTH_RANGE: 2928,
      DEPTH_WRITEMASK: 2930,
      DEPTH_COMPONENT: 6402,
      LIGHTING: 2896,
      LIGHT0: 16384,
      LIGHT1: 16385,
      LIGHT2: 16386,
      LIGHT3: 16387,
      LIGHT4: 16388,
      LIGHT5: 16389,
      LIGHT6: 16390,
      LIGHT7: 16391,
      SPOT_EXPONENT: 4613,
      SPOT_CUTOFF: 4614,
      CONSTANT_ATTENUATION: 4615,
      LINEAR_ATTENUATION: 4616,
      QUADRATIC_ATTENUATION: 4617,
      AMBIENT: 4608,
      DIFFUSE: 4609,
      SPECULAR: 4610,
      SHININESS: 5633,
      EMISSION: 5632,
      POSITION: 4611,
      SPOT_DIRECTION: 4612,
      AMBIENT_AND_DIFFUSE: 5634,
      COLOR_INDEXES: 5635,
      LIGHT_MODEL_TWO_SIDE: 2898,
      LIGHT_MODEL_LOCAL_VIEWER: 2897,
      LIGHT_MODEL_AMBIENT: 2899,
      FRONT_AND_BACK: 1032,
      SHADE_MODEL: 2900,
      FLAT: 7424,
      SMOOTH: 7425,
      COLOR_MATERIAL: 2903,
      COLOR_MATERIAL_FACE: 2901,
      COLOR_MATERIAL_PARAMETER: 2902,
      NORMALIZE: 2977,
      CLIP_PLANE0: 12288,
      CLIP_PLANE1: 12289,
      CLIP_PLANE2: 12290,
      CLIP_PLANE3: 12291,
      CLIP_PLANE4: 12292,
      CLIP_PLANE5: 12293,
      ACCUM_RED_BITS: 3416,
      ACCUM_GREEN_BITS: 3417,
      ACCUM_BLUE_BITS: 3418,
      ACCUM_ALPHA_BITS: 3419,
      ACCUM_CLEAR_VALUE: 2944,
      ACCUM: 256,
      ADD: 260,
      LOAD: 257,
      MULT: 259,
      RETURN: 258,
      ALPHA_TEST: 3008,
      ALPHA_TEST_REF: 3010,
      ALPHA_TEST_FUNC: 3009,
      BLEND: 3042,
      BLEND_SRC: 3041,
      BLEND_DST: 3040,
      ZERO: 0,
      ONE: 1,
      SRC_COLOR: 768,
      ONE_MINUS_SRC_COLOR: 769,
      SRC_ALPHA: 770,
      ONE_MINUS_SRC_ALPHA: 771,
      DST_ALPHA: 772,
      ONE_MINUS_DST_ALPHA: 773,
      DST_COLOR: 774,
      ONE_MINUS_DST_COLOR: 775,
      SRC_ALPHA_SATURATE: 776,
      FEEDBACK: 7169,
      RENDER: 7168,
      SELECT: 7170,
      "2D": 1536,
      "3D": 1537,
      "3D_COLOR": 1538,
      "3D_COLOR_TEXTURE": 1539,
      "4D_COLOR_TEXTURE": 1540,
      POINT_TOKEN: 1793,
      LINE_TOKEN: 1794,
      LINE_RESET_TOKEN: 1799,
      POLYGON_TOKEN: 1795,
      BITMAP_TOKEN: 1796,
      DRAW_PIXEL_TOKEN: 1797,
      COPY_PIXEL_TOKEN: 1798,
      PASS_THROUGH_TOKEN: 1792,
      FEEDBACK_BUFFER_POINTER: 3568,
      FEEDBACK_BUFFER_SIZE: 3569,
      FEEDBACK_BUFFER_TYPE: 3570,
      SELECTION_BUFFER_POINTER: 3571,
      SELECTION_BUFFER_SIZE: 3572,
      FOG: 2912,
      FOG_MODE: 2917,
      FOG_DENSITY: 2914,
      FOG_COLOR: 2918,
      FOG_INDEX: 2913,
      FOG_START: 2915,
      FOG_END: 2916,
      LINEAR: 9729,
      EXP: 2048,
      EXP2: 2049,
      LOGIC_OP: 3057,
      INDEX_LOGIC_OP: 3057,
      COLOR_LOGIC_OP: 3058,
      LOGIC_OP_MODE: 3056,
      CLEAR: 5376,
      SET: 5391,
      COPY: 5379,
      COPY_INVERTED: 5388,
      NOOP: 5381,
      INVERT: 5386,
      AND: 5377,
      NAND: 5390,
      OR: 5383,
      NOR: 5384,
      XOR: 5382,
      EQUIV: 5385,
      AND_REVERSE: 5378,
      AND_INVERTED: 5380,
      OR_REVERSE: 5387,
      OR_INVERTED: 5389,
      STENCIL_BITS: 3415,
      STENCIL_TEST: 2960,
      STENCIL_CLEAR_VALUE: 2961,
      STENCIL_FUNC: 2962,
      STENCIL_VALUE_MASK: 2963,
      STENCIL_FAIL: 2964,
      STENCIL_PASS_DEPTH_FAIL: 2965,
      STENCIL_PASS_DEPTH_PASS: 2966,
      STENCIL_REF: 2967,
      STENCIL_WRITEMASK: 2968,
      STENCIL_INDEX: 6401,
      KEEP: 7680,
      REPLACE: 7681,
      INCR: 7682,
      DECR: 7683,
      NONE: 0,
      LEFT: 1030,
      RIGHT: 1031,
      FRONT: 1028,
      BACK: 1029,
      FRONT_AND_BACK: 1032,
      FRONT_LEFT: 1024,
      FRONT_RIGHT: 1025,
      BACK_LEFT: 1026,
      BACK_RIGHT: 1027,
      AUX0: 1033,
      AUX1: 1034,
      AUX2: 1035,
      AUX3: 1036,
      COLOR_INDEX: 6400,
      RED: 6403,
      GREEN: 6404,
      BLUE: 6405,
      ALPHA: 6406,
      LUMINANCE: 6409,
      LUMINANCE_ALPHA: 6410,
      ALPHA_BITS: 3413,
      RED_BITS: 3410,
      GREEN_BITS: 3411,
      BLUE_BITS: 3412,
      INDEX_BITS: 3409,
      SUBPIXEL_BITS: 3408,
      AUX_BUFFERS: 3072,
      READ_BUFFER: 3074,
      DRAW_BUFFER: 3073,
      DOUBLEBUFFER: 3122,
      STEREO: 3123,
      BITMAP: 6656,
      COLOR: 6144,
      DEPTH: 6145,
      STENCIL: 6146,
      DITHER: 3024,
      RGB: 6407,
      RGBA: 6408,
      MAX_LIST_NESTING: 2865,
      MAX_EVAL_ORDER: 3376,
      MAX_LIGHTS: 3377,
      MAX_CLIP_PLANES: 3378,
      MAX_TEXTURE_SIZE: 3379,
      MAX_PIXEL_MAP_TABLE: 3380,
      MAX_ATTRIB_STACK_DEPTH: 3381,
      MAX_MODELVIEW_STACK_DEPTH: 3382,
      MAX_NAME_STACK_DEPTH: 3383,
      MAX_PROJECTION_STACK_DEPTH: 3384,
      MAX_TEXTURE_STACK_DEPTH: 3385,
      MAX_VIEWPORT_DIMS: 3386,
      MAX_CLIENT_ATTRIB_STACK_DEPTH: 3387,
      ATTRIB_STACK_DEPTH: 2992,
      CLIENT_ATTRIB_STACK_DEPTH: 2993,
      COLOR_CLEAR_VALUE: 3106,
      COLOR_WRITEMASK: 3107,
      CURRENT_INDEX: 2817,
      CURRENT_COLOR: 2816,
      CURRENT_NORMAL: 2818,
      CURRENT_RASTER_COLOR: 2820,
      CURRENT_RASTER_DISTANCE: 2825,
      CURRENT_RASTER_INDEX: 2821,
      CURRENT_RASTER_POSITION: 2823,
      CURRENT_RASTER_TEXTURE_COORDS: 2822,
      CURRENT_RASTER_POSITION_VALID: 2824,
      CURRENT_TEXTURE_COORDS: 2819,
      INDEX_CLEAR_VALUE: 3104,
      INDEX_MODE: 3120,
      INDEX_WRITEMASK: 3105,
      MODELVIEW_MATRIX: 2982,
      MODELVIEW_STACK_DEPTH: 2979,
      NAME_STACK_DEPTH: 3440,
      PROJECTION_MATRIX: 2983,
      PROJECTION_STACK_DEPTH: 2980,
      RENDER_MODE: 3136,
      RGBA_MODE: 3121,
      TEXTURE_MATRIX: 2984,
      TEXTURE_STACK_DEPTH: 2981,
      VIEWPORT: 2978,
      AUTO_NORMAL: 3456,
      MAP1_COLOR_4: 3472,
      MAP1_INDEX: 3473,
      MAP1_NORMAL: 3474,
      MAP1_TEXTURE_COORD_1: 3475,
      MAP1_TEXTURE_COORD_2: 3476,
      MAP1_TEXTURE_COORD_3: 3477,
      MAP1_TEXTURE_COORD_4: 3478,
      MAP1_VERTEX_3: 3479,
      MAP1_VERTEX_4: 3480,
      MAP2_COLOR_4: 3504,
      MAP2_INDEX: 3505,
      MAP2_NORMAL: 3506,
      MAP2_TEXTURE_COORD_1: 3507,
      MAP2_TEXTURE_COORD_2: 3508,
      MAP2_TEXTURE_COORD_3: 3509,
      MAP2_TEXTURE_COORD_4: 3510,
      MAP2_VERTEX_3: 3511,
      MAP2_VERTEX_4: 3512,
      MAP1_GRID_DOMAIN: 3536,
      MAP1_GRID_SEGMENTS: 3537,
      MAP2_GRID_DOMAIN: 3538,
      MAP2_GRID_SEGMENTS: 3539,
      COEFF: 2560,
      ORDER: 2561,
      DOMAIN: 2562,
      PERSPECTIVE_CORRECTION_HINT: 3152,
      POINT_SMOOTH_HINT: 3153,
      LINE_SMOOTH_HINT: 3154,
      POLYGON_SMOOTH_HINT: 3155,
      FOG_HINT: 3156,
      DONT_CARE: 4352,
      FASTEST: 4353,
      NICEST: 4354,
      SCISSOR_BOX: 3088,
      SCISSOR_TEST: 3089,
      MAP_COLOR: 3344,
      MAP_STENCIL: 3345,
      INDEX_SHIFT: 3346,
      INDEX_OFFSET: 3347,
      RED_SCALE: 3348,
      RED_BIAS: 3349,
      GREEN_SCALE: 3352,
      GREEN_BIAS: 3353,
      BLUE_SCALE: 3354,
      BLUE_BIAS: 3355,
      ALPHA_SCALE: 3356,
      ALPHA_BIAS: 3357,
      DEPTH_SCALE: 3358,
      DEPTH_BIAS: 3359,
      PIXEL_MAP_S_TO_S_SIZE: 3249,
      PIXEL_MAP_I_TO_I_SIZE: 3248,
      PIXEL_MAP_I_TO_R_SIZE: 3250,
      PIXEL_MAP_I_TO_G_SIZE: 3251,
      PIXEL_MAP_I_TO_B_SIZE: 3252,
      PIXEL_MAP_I_TO_A_SIZE: 3253,
      PIXEL_MAP_R_TO_R_SIZE: 3254,
      PIXEL_MAP_G_TO_G_SIZE: 3255,
      PIXEL_MAP_B_TO_B_SIZE: 3256,
      PIXEL_MAP_A_TO_A_SIZE: 3257,
      PIXEL_MAP_S_TO_S: 3185,
      PIXEL_MAP_I_TO_I: 3184,
      PIXEL_MAP_I_TO_R: 3186,
      PIXEL_MAP_I_TO_G: 3187,
      PIXEL_MAP_I_TO_B: 3188,
      PIXEL_MAP_I_TO_A: 3189,
      PIXEL_MAP_R_TO_R: 3190,
      PIXEL_MAP_G_TO_G: 3191,
      PIXEL_MAP_B_TO_B: 3192,
      PIXEL_MAP_A_TO_A: 3193,
      PACK_ALIGNMENT: 3333,
      PACK_LSB_FIRST: 3329,
      PACK_ROW_LENGTH: 3330,
      PACK_SKIP_PIXELS: 3332,
      PACK_SKIP_ROWS: 3331,
      PACK_SWAP_BYTES: 3328,
      UNPACK_ALIGNMENT: 3317,
      UNPACK_LSB_FIRST: 3313,
      UNPACK_ROW_LENGTH: 3314,
      UNPACK_SKIP_PIXELS: 3316,
      UNPACK_SKIP_ROWS: 3315,
      UNPACK_SWAP_BYTES: 3312,
      ZOOM_X: 3350,
      ZOOM_Y: 3351,
      TEXTURE_ENV: 8960,
      TEXTURE_ENV_MODE: 8704,
      TEXTURE_1D: 3552,
      TEXTURE_2D: 3553,
      TEXTURE_WRAP_S: 10242,
      TEXTURE_WRAP_T: 10243,
      TEXTURE_MAG_FILTER: 10240,
      TEXTURE_MIN_FILTER: 10241,
      TEXTURE_ENV_COLOR: 8705,
      TEXTURE_GEN_S: 3168,
      TEXTURE_GEN_T: 3169,
      TEXTURE_GEN_R: 3170,
      TEXTURE_GEN_Q: 3171,
      TEXTURE_GEN_MODE: 9472,
      TEXTURE_BORDER_COLOR: 4100,
      TEXTURE_WIDTH: 4096,
      TEXTURE_HEIGHT: 4097,
      TEXTURE_BORDER: 4101,
      TEXTURE_COMPONENTS: 4099,
      TEXTURE_RED_SIZE: 32860,
      TEXTURE_GREEN_SIZE: 32861,
      TEXTURE_BLUE_SIZE: 32862,
      TEXTURE_ALPHA_SIZE: 32863,
      TEXTURE_LUMINANCE_SIZE: 32864,
      TEXTURE_INTENSITY_SIZE: 32865,
      NEAREST_MIPMAP_NEAREST: 9984,
      NEAREST_MIPMAP_LINEAR: 9986,
      LINEAR_MIPMAP_NEAREST: 9985,
      LINEAR_MIPMAP_LINEAR: 9987,
      OBJECT_LINEAR: 9217,
      OBJECT_PLANE: 9473,
      EYE_LINEAR: 9216,
      EYE_PLANE: 9474,
      SPHERE_MAP: 9218,
      DECAL: 8449,
      MODULATE: 8448,
      NEAREST: 9728,
      REPEAT: 10497,
      CLAMP: 10496,
      VENDOR: 7936,
      RENDERER: 7937,
      VERSION: 7938,
      EXTENSIONS: 7939,
      NO_ERROR: 0,
      INVALID_ENUM: 1280,
      INVALID_VALUE: 1281,
      INVALID_OPERATION: 1282,
      STACK_OVERFLOW: 1283,
      STACK_UNDERFLOW: 1284,
      OUT_OF_MEMORY: 1285,
      CURRENT_BIT: 1,
      POINT_BIT: 2,
      LINE_BIT: 4,
      POLYGON_BIT: 8,
      POLYGON_STIPPLE_BIT: 16,
      PIXEL_MODE_BIT: 32,
      LIGHTING_BIT: 64,
      FOG_BIT: 128,
      DEPTH_BUFFER_BIT: 256,
      ACCUM_BUFFER_BIT: 512,
      STENCIL_BUFFER_BIT: 1024,
      VIEWPORT_BIT: 2048,
      TRANSFORM_BIT: 4096,
      ENABLE_BIT: 8192,
      COLOR_BUFFER_BIT: 16384,
      HINT_BIT: 32768,
      EVAL_BIT: 65536,
      LIST_BIT: 131072,
      TEXTURE_BIT: 262144,
      SCISSOR_BIT: 524288,
      ALL_ATTRIB_BITS: 1048575,
      PROXY_TEXTURE_1D: 32867,
      PROXY_TEXTURE_2D: 32868,
      TEXTURE_PRIORITY: 32870,
      TEXTURE_RESIDENT: 32871,
      TEXTURE_BINDING_1D: 32872,
      TEXTURE_BINDING_2D: 32873,
      TEXTURE_INTERNAL_FORMAT: 4099,
      ALPHA4: 32827,
      ALPHA8: 32828,
      ALPHA12: 32829,
      ALPHA16: 32830,
      LUMINANCE4: 32831,
      LUMINANCE8: 32832,
      LUMINANCE12: 32833,
      LUMINANCE16: 32834,
      LUMINANCE4_ALPHA4: 32835,
      LUMINANCE6_ALPHA2: 32836,
      LUMINANCE8_ALPHA8: 32837,
      LUMINANCE12_ALPHA4: 32838,
      LUMINANCE12_ALPHA12: 32839,
      LUMINANCE16_ALPHA16: 32840,
      INTENSITY: 32841,
      INTENSITY4: 32842,
      INTENSITY8: 32843,
      INTENSITY12: 32844,
      INTENSITY16: 32845,
      R3_G3_B2: 10768,
      RGB4: 32847,
      RGB5: 32848,
      RGB8: 32849,
      RGB10: 32850,
      RGB12: 32851,
      RGB16: 32852,
      RGBA2: 32853,
      RGBA4: 32854,
      RGB5_A1: 32855,
      RGBA8: 32856,
      RGB10_A2: 32857,
      RGBA12: 32858,
      RGBA16: 32859,
      CLIENT_PIXEL_STORE_BIT: 1,
      CLIENT_VERTEX_ARRAY_BIT: 2,
      ALL_CLIENT_ATTRIB_BITS: 4294967295,
      CLIENT_ALL_ATTRIB_BITS: 4294967295,
      RESCALE_NORMAL: 32826,
      CLAMP_TO_EDGE: 33071,
      MAX_ELEMENTS_VERTICES: 33e3,
      MAX_ELEMENTS_INDICES: 33001,
      BGR: 32992,
      BGRA: 32993,
      UNSIGNED_BYTE_3_3_2: 32818,
      UNSIGNED_BYTE_2_3_3_REV: 33634,
      UNSIGNED_SHORT_5_6_5: 33635,
      UNSIGNED_SHORT_5_6_5_REV: 33636,
      UNSIGNED_SHORT_4_4_4_4: 32819,
      UNSIGNED_SHORT_4_4_4_4_REV: 33637,
      UNSIGNED_SHORT_5_5_5_1: 32820,
      UNSIGNED_SHORT_1_5_5_5_REV: 33638,
      UNSIGNED_INT_8_8_8_8: 32821,
      UNSIGNED_INT_8_8_8_8_REV: 33639,
      UNSIGNED_INT_10_10_10_2: 32822,
      UNSIGNED_INT_2_10_10_10_REV: 33640,
      LIGHT_MODEL_COLOR_CONTROL: 33272,
      SINGLE_COLOR: 33273,
      SEPARATE_SPECULAR_COLOR: 33274,
      TEXTURE_MIN_LOD: 33082,
      TEXTURE_MAX_LOD: 33083,
      TEXTURE_BASE_LEVEL: 33084,
      TEXTURE_MAX_LEVEL: 33085,
      SMOOTH_POINT_SIZE_RANGE: 2834,
      SMOOTH_POINT_SIZE_GRANULARITY: 2835,
      SMOOTH_LINE_WIDTH_RANGE: 2850,
      SMOOTH_LINE_WIDTH_GRANULARITY: 2851,
      ALIASED_POINT_SIZE_RANGE: 33901,
      ALIASED_LINE_WIDTH_RANGE: 33902,
      PACK_SKIP_IMAGES: 32875,
      PACK_IMAGE_HEIGHT: 32876,
      UNPACK_SKIP_IMAGES: 32877,
      UNPACK_IMAGE_HEIGHT: 32878,
      TEXTURE_3D: 32879,
      PROXY_TEXTURE_3D: 32880,
      TEXTURE_DEPTH: 32881,
      TEXTURE_WRAP_R: 32882,
      MAX_3D_TEXTURE_SIZE: 32883,
      TEXTURE_BINDING_3D: 32874,
      CONSTANT_COLOR: 32769,
      ONE_MINUS_CONSTANT_COLOR: 32770,
      CONSTANT_ALPHA: 32771,
      ONE_MINUS_CONSTANT_ALPHA: 32772,
      COLOR_TABLE: 32976,
      POST_CONVOLUTION_COLOR_TABLE: 32977,
      POST_COLOR_MATRIX_COLOR_TABLE: 32978,
      PROXY_COLOR_TABLE: 32979,
      PROXY_POST_CONVOLUTION_COLOR_TABLE: 32980,
      PROXY_POST_COLOR_MATRIX_COLOR_TABLE: 32981,
      COLOR_TABLE_SCALE: 32982,
      COLOR_TABLE_BIAS: 32983,
      COLOR_TABLE_FORMAT: 32984,
      COLOR_TABLE_WIDTH: 32985,
      COLOR_TABLE_RED_SIZE: 32986,
      COLOR_TABLE_GREEN_SIZE: 32987,
      COLOR_TABLE_BLUE_SIZE: 32988,
      COLOR_TABLE_ALPHA_SIZE: 32989,
      COLOR_TABLE_LUMINANCE_SIZE: 32990,
      COLOR_TABLE_INTENSITY_SIZE: 32991,
      CONVOLUTION_1D: 32784,
      CONVOLUTION_2D: 32785,
      SEPARABLE_2D: 32786,
      CONVOLUTION_BORDER_MODE: 32787,
      CONVOLUTION_FILTER_SCALE: 32788,
      CONVOLUTION_FILTER_BIAS: 32789,
      REDUCE: 32790,
      CONVOLUTION_FORMAT: 32791,
      CONVOLUTION_WIDTH: 32792,
      CONVOLUTION_HEIGHT: 32793,
      MAX_CONVOLUTION_WIDTH: 32794,
      MAX_CONVOLUTION_HEIGHT: 32795,
      POST_CONVOLUTION_RED_SCALE: 32796,
      POST_CONVOLUTION_GREEN_SCALE: 32797,
      POST_CONVOLUTION_BLUE_SCALE: 32798,
      POST_CONVOLUTION_ALPHA_SCALE: 32799,
      POST_CONVOLUTION_RED_BIAS: 32800,
      POST_CONVOLUTION_GREEN_BIAS: 32801,
      POST_CONVOLUTION_BLUE_BIAS: 32802,
      POST_CONVOLUTION_ALPHA_BIAS: 32803,
      CONSTANT_BORDER: 33105,
      REPLICATE_BORDER: 33107,
      CONVOLUTION_BORDER_COLOR: 33108,
      COLOR_MATRIX: 32945,
      COLOR_MATRIX_STACK_DEPTH: 32946,
      MAX_COLOR_MATRIX_STACK_DEPTH: 32947,
      POST_COLOR_MATRIX_RED_SCALE: 32948,
      POST_COLOR_MATRIX_GREEN_SCALE: 32949,
      POST_COLOR_MATRIX_BLUE_SCALE: 32950,
      POST_COLOR_MATRIX_ALPHA_SCALE: 32951,
      POST_COLOR_MATRIX_RED_BIAS: 32952,
      POST_COLOR_MATRIX_GREEN_BIAS: 32953,
      POST_COLOR_MATRIX_BLUE_BIAS: 32954,
      POST_COLOR_MATRIX_ALPHA_BIAS: 32955,
      HISTOGRAM: 32804,
      PROXY_HISTOGRAM: 32805,
      HISTOGRAM_WIDTH: 32806,
      HISTOGRAM_FORMAT: 32807,
      HISTOGRAM_RED_SIZE: 32808,
      HISTOGRAM_GREEN_SIZE: 32809,
      HISTOGRAM_BLUE_SIZE: 32810,
      HISTOGRAM_ALPHA_SIZE: 32811,
      HISTOGRAM_LUMINANCE_SIZE: 32812,
      HISTOGRAM_SINK: 32813,
      MINMAX: 32814,
      MINMAX_FORMAT: 32815,
      MINMAX_SINK: 32816,
      TABLE_TOO_LARGE: 32817,
      BLEND_EQUATION: 32777,
      MIN: 32775,
      MAX: 32776,
      FUNC_ADD: 32774,
      FUNC_SUBTRACT: 32778,
      FUNC_REVERSE_SUBTRACT: 32779,
      BLEND_COLOR: 32773,
      TEXTURE0: 33984,
      TEXTURE1: 33985,
      TEXTURE2: 33986,
      TEXTURE3: 33987,
      TEXTURE4: 33988,
      TEXTURE5: 33989,
      TEXTURE6: 33990,
      TEXTURE7: 33991,
      TEXTURE8: 33992,
      TEXTURE9: 33993,
      TEXTURE10: 33994,
      TEXTURE11: 33995,
      TEXTURE12: 33996,
      TEXTURE13: 33997,
      TEXTURE14: 33998,
      TEXTURE15: 33999,
      TEXTURE16: 34e3,
      TEXTURE17: 34001,
      TEXTURE18: 34002,
      TEXTURE19: 34003,
      TEXTURE20: 34004,
      TEXTURE21: 34005,
      TEXTURE22: 34006,
      TEXTURE23: 34007,
      TEXTURE24: 34008,
      TEXTURE25: 34009,
      TEXTURE26: 34010,
      TEXTURE27: 34011,
      TEXTURE28: 34012,
      TEXTURE29: 34013,
      TEXTURE30: 34014,
      TEXTURE31: 34015,
      ACTIVE_TEXTURE: 34016,
      CLIENT_ACTIVE_TEXTURE: 34017,
      MAX_TEXTURE_UNITS: 34018,
      NORMAL_MAP: 34065,
      REFLECTION_MAP: 34066,
      TEXTURE_CUBE_MAP: 34067,
      TEXTURE_BINDING_CUBE_MAP: 34068,
      TEXTURE_CUBE_MAP_POSITIVE_X: 34069,
      TEXTURE_CUBE_MAP_NEGATIVE_X: 34070,
      TEXTURE_CUBE_MAP_POSITIVE_Y: 34071,
      TEXTURE_CUBE_MAP_NEGATIVE_Y: 34072,
      TEXTURE_CUBE_MAP_POSITIVE_Z: 34073,
      TEXTURE_CUBE_MAP_NEGATIVE_Z: 34074,
      PROXY_TEXTURE_CUBE_MAP: 34075,
      MAX_CUBE_MAP_TEXTURE_SIZE: 34076,
      COMPRESSED_ALPHA: 34025,
      COMPRESSED_LUMINANCE: 34026,
      COMPRESSED_LUMINANCE_ALPHA: 34027,
      COMPRESSED_INTENSITY: 34028,
      COMPRESSED_RGB: 34029,
      COMPRESSED_RGBA: 34030,
      TEXTURE_COMPRESSION_HINT: 34031,
      TEXTURE_COMPRESSED_IMAGE_SIZE: 34464,
      TEXTURE_COMPRESSED: 34465,
      NUM_COMPRESSED_TEXTURE_FORMATS: 34466,
      COMPRESSED_TEXTURE_FORMATS: 34467,
      MULTISAMPLE: 32925,
      SAMPLE_ALPHA_TO_COVERAGE: 32926,
      SAMPLE_ALPHA_TO_ONE: 32927,
      SAMPLE_COVERAGE: 32928,
      SAMPLE_BUFFERS: 32936,
      SAMPLES: 32937,
      SAMPLE_COVERAGE_VALUE: 32938,
      SAMPLE_COVERAGE_INVERT: 32939,
      MULTISAMPLE_BIT: 536870912,
      TRANSPOSE_MODELVIEW_MATRIX: 34019,
      TRANSPOSE_PROJECTION_MATRIX: 34020,
      TRANSPOSE_TEXTURE_MATRIX: 34021,
      TRANSPOSE_COLOR_MATRIX: 34022,
      COMBINE: 34160,
      COMBINE_RGB: 34161,
      COMBINE_ALPHA: 34162,
      SOURCE0_RGB: 34176,
      SOURCE1_RGB: 34177,
      SOURCE2_RGB: 34178,
      SOURCE0_ALPHA: 34184,
      SOURCE1_ALPHA: 34185,
      SOURCE2_ALPHA: 34186,
      OPERAND0_RGB: 34192,
      OPERAND1_RGB: 34193,
      OPERAND2_RGB: 34194,
      OPERAND0_ALPHA: 34200,
      OPERAND1_ALPHA: 34201,
      OPERAND2_ALPHA: 34202,
      RGB_SCALE: 34163,
      ADD_SIGNED: 34164,
      INTERPOLATE: 34165,
      SUBTRACT: 34023,
      CONSTANT: 34166,
      PRIMARY_COLOR: 34167,
      PREVIOUS: 34168,
      DOT3_RGB: 34478,
      DOT3_RGBA: 34479,
      CLAMP_TO_BORDER: 33069,
      TEXTURE0_ARB: 33984,
      TEXTURE1_ARB: 33985,
      TEXTURE2_ARB: 33986,
      TEXTURE3_ARB: 33987,
      TEXTURE4_ARB: 33988,
      TEXTURE5_ARB: 33989,
      TEXTURE6_ARB: 33990,
      TEXTURE7_ARB: 33991,
      TEXTURE8_ARB: 33992,
      TEXTURE9_ARB: 33993,
      TEXTURE10_ARB: 33994,
      TEXTURE11_ARB: 33995,
      TEXTURE12_ARB: 33996,
      TEXTURE13_ARB: 33997,
      TEXTURE14_ARB: 33998,
      TEXTURE15_ARB: 33999,
      TEXTURE16_ARB: 34e3,
      TEXTURE17_ARB: 34001,
      TEXTURE18_ARB: 34002,
      TEXTURE19_ARB: 34003,
      TEXTURE20_ARB: 34004,
      TEXTURE21_ARB: 34005,
      TEXTURE22_ARB: 34006,
      TEXTURE23_ARB: 34007,
      TEXTURE24_ARB: 34008,
      TEXTURE25_ARB: 34009,
      TEXTURE26_ARB: 34010,
      TEXTURE27_ARB: 34011,
      TEXTURE28_ARB: 34012,
      TEXTURE29_ARB: 34013,
      TEXTURE30_ARB: 34014,
      TEXTURE31_ARB: 34015,
      ACTIVE_TEXTURE_ARB: 34016,
      CLIENT_ACTIVE_TEXTURE_ARB: 34017,
      MAX_TEXTURE_UNITS_ARB: 34018,
      DEBUG_OBJECT_MESA: 34649,
      DEBUG_PRINT_MESA: 34650,
      DEBUG_ASSERT_MESA: 34651,
      DEPTH_STENCIL_MESA: 34640,
      UNSIGNED_INT_24_8_MESA: 34641,
      UNSIGNED_INT_8_24_REV_MESA: 34642,
      UNSIGNED_SHORT_15_1_MESA: 34643,
      UNSIGNED_SHORT_1_15_REV_MESA: 34644,
      FRAGMENT_PROGRAM_POSITION_MESA: 35760,
      FRAGMENT_PROGRAM_CALLBACK_MESA: 35761,
      FRAGMENT_PROGRAM_CALLBACK_FUNC_MESA: 35762,
      FRAGMENT_PROGRAM_CALLBACK_DATA_MESA: 35763,
      VERTEX_PROGRAM_POSITION_MESA: 35764,
      VERTEX_PROGRAM_CALLBACK_MESA: 35765,
      VERTEX_PROGRAM_CALLBACK_FUNC_MESA: 35766,
      VERTEX_PROGRAM_CALLBACK_DATA_MESA: 35767,
      TEXTURE_1D_ARRAY_EXT: 35864,
      PROXY_TEXTURE_1D_ARRAY_EXT: 35865,
      TEXTURE_2D_ARRAY_EXT: 35866,
      PROXY_TEXTURE_2D_ARRAY_EXT: 35867,
      TEXTURE_BINDING_1D_ARRAY_EXT: 35868,
      TEXTURE_BINDING_2D_ARRAY_EXT: 35869,
      MAX_ARRAY_TEXTURE_LAYERS_EXT: 35071,
      FRAMEBUFFER_ATTACHMENT_TEXTURE_LAYER_EXT: 36052,
      ALPHA_BLEND_EQUATION_ATI: 34877
    };
  }
});

// node_modules/x11/lib/ext/glxrender.js
var require_glxrender = __commonJS({
  "node_modules/x11/lib/ext/glxrender.js"(exports2, module2) {
    var constants = require_glxconstants();
    var MAX_SMALL_RENDER = 65536 - 16;
    module2.exports = function(GLX, ctx) {
      buffers = [];
      var currentLength = 0;
      function commandBuffer(opcode, len) {
        if (currentLength + len > MAX_SMALL_RENDER) {
          render();
        }
        if (len > MAX_SMALL_RENDER)
          throw Error("Buffer too big. Make sure you are using RenderLarge for large commands");
        currentLength += len;
        var res = Buffer(len);
        res.writeUInt16LE(len, 0);
        res.writeUInt16LE(opcode, 2);
        return res;
      }
      function serialize0(opcode) {
        buffers.push(commandBuffer(opcode, 4));
      }
      function serialize3fv(opcode, c1, c2, c3) {
        var res = commandBuffer(opcode, 16);
        res.writeFloatLE(c1, 4);
        res.writeFloatLE(c2, 8);
        res.writeFloatLE(c3, 12);
        buffers.push(res);
      }
      function serialize4fv(opcode, c1, c2, c3, c4) {
        var res = commandBuffer(opcode, 20);
        res.writeFloatLE(c1, 4);
        res.writeFloatLE(c2, 8);
        res.writeFloatLE(c3, 12);
        res.writeFloatLE(c4, 16);
        buffers.push(res);
      }
      function serialize4i(opcode, c1, c2, c3, c4) {
        var res = commandBuffer(opcode, 20);
        res.writeInt32LE(c1, 4);
        res.writeInt32LE(c2, 8);
        res.writeInt32LE(c3, 12);
        res.writeInt32LE(c4, 16);
        buffers.push(res);
      }
      function serialize6d(opcode, d1, d2, d3, d4, d5, d6) {
        var res = commandBuffer(opcode, 52);
        res.writeDoubleLE(d1, 4);
        res.writeDoubleLE(d2, 12);
        res.writeDoubleLE(d3, 20);
        res.writeDoubleLE(d4, 28);
        res.writeDoubleLE(d5, 36);
        res.writeDoubleLE(d6, 44);
        buffers.push(res);
      }
      ;
      function serialize2i(opcode, value1, value2) {
        var res = commandBuffer(opcode, 12);
        res.writeUInt32LE(value1, 4);
        res.writeUInt32LE(value2, 8);
        buffers.push(res);
      }
      function serialize1i(opcode, value) {
        var res = commandBuffer(opcode, 8);
        res.writeUInt32LE(value, 4);
        buffers.push(res);
      }
      function serialize1f(opcode, value) {
        var res = commandBuffer(opcode, 8);
        res.writeFloatLE(value, 4);
        buffers.push(res);
      }
      function serialize2f(opcode, f1, f2) {
        var res = commandBuffer(opcode, 12);
        res.writeFloatLE(f1, 4);
        res.writeFloatLE(f2, 8);
        buffers.push(res);
      }
      function serialize2i(opcode, i1, i2) {
        var res = commandBuffer(opcode, 12);
        res.writeUInt32LE(i1, 4);
        res.writeUInt32LE(i2, 8);
        buffers.push(res);
      }
      function serialize3i(opcode, i1, i2, i3) {
        var res = commandBuffer(opcode, 16);
        res.writeUInt32LE(i1, 4);
        res.writeUInt32LE(i2, 8);
        res.writeUInt32LE(i3, 12);
        buffers.push(res);
      }
      function serialize2i1f(opcode, i1, i2, f1) {
        var res = commandBuffer(opcode, 16);
        res.writeUInt32LE(i1, 4);
        res.writeUInt32LE(i2, 8);
        res.writeFloatLE(f1, 12);
        buffers.push(res);
      }
      function serialize2ifv(opcode, i1, i2, fv) {
        var res = commandBuffer(opcode, 12 + fv.length * 4);
        res.writeUInt32LE(i1, 4);
        res.writeUInt32LE(i2, 8);
        for (var i = 0; i < fv.length; ++i)
          res.writeFloatLE(fv[i], 12 + i * 4);
        buffers.push(res);
      }
      function serialize2i4f(opcode, i1, i2, f1, f2, f3, f4) {
        var res = commandBuffer(opcode, 28);
        res.writeUInt32LE(i1, 4);
        res.writeUInt32LE(i2, 8);
        res.writeFloatLE(f1, 12);
        res.writeFloatLE(f2, 16);
        res.writeFloatLE(f3, 20);
        res.writeFloatLE(f4, 24);
        buffers.push(res);
      }
      function render(ctxLocal) {
        if (!ctxLocal)
          ctxLocal = ctx;
        if (buffers.length == 0) {
          buffers = [];
          currentLength = 0;
          return;
        }
        GLX.Render(ctxLocal, buffers);
        buffers = [];
        currentLength = 0;
      }
      var renderContext = {
        Render: render,
        Begin: function(what) {
          serialize1i(4, what);
        },
        End: function() {
          serialize0(23);
        },
        Ortho: function(left, right, bottom, top, znear, zfar) {
          serialize6d(182, left, right, bottom, top, znear, zfar);
        },
        Frustum: function(left, right, bottom, top, znear, zfar) {
          serialize6d(182, left, right, bottom, top, znear, zfar);
        },
        PopMatrix: function() {
          serialize0(183);
        },
        PushMatrix: function() {
          serialize0(184);
        },
        LoadIdentity: function() {
          serialize0(176);
        },
        Rotatef: function(a, x, y, z) {
          serialize4fv(186, a, x, y, z);
        },
        CallList: function(list) {
          serialize1i(1, list);
        },
        Viewport: function(x, y, w, h) {
          serialize4i(191, x, y, w, h);
        },
        Vertex3f: function(x, y, z) {
          serialize3fv(70, x, y, z);
        },
        Vertex3fv: function(v) {
          serialize3fv(70, v[0], v[1], v[2]);
        },
        Color3f: function(r, g, b) {
          serialize3fv(8, r, g, b);
        },
        Normal3f: function(x, y, z) {
          serialize3fv(30, x, y, z);
        },
        Normal3fv: function(v) {
          serialize3fv(70, v[0], v[1], v[2]);
        },
        Color4f: function(r, g, b, a) {
          serialize4fv(16, r, g, b, a);
        },
        Scalef: function(x, y, z) {
          serialize3fv(188, x, y, z);
        },
        Translatef: function(x, y, z) {
          serialize3fv(190, x, y, z);
        },
        ClearColor: function(r, g, b, a) {
          serialize4fv(130, r, g, b, a);
        },
        MatrixMode: function(mode) {
          serialize1i(179, mode);
        },
        Enable: function(value) {
          serialize1i(139, value);
        },
        Lightfv: function(light, name, p1, p2, p3, p4) {
          if (p1.length)
            serialize2i4f(87, light, name, p1[0], p1[1], p1[2], p1[3]);
          else
            serialize2i4f(87, light, name, p1, p2, p3, p4);
        },
        Materialfv: function(light, name, p1, p2, p3, p4) {
          if (p1.length)
            serialize2i4f(97, light, name, p1[0], p1[1], p1[2], p1[3]);
          else
            serialize2i4f(97, light, name, p1, p2, p3, p4);
        },
        Clear: function(mask) {
          serialize1i(127, mask);
        },
        ShadeModel: function(model) {
          serialize1i(104, model);
        },
        BlendFunc: function(sfactor, dfactor) {
          serialize2i(160, sfactor, dfactor);
        },
        PointSize: function(r) {
          serialize1f(100, r);
        },
        Hint: function(target, mode) {
          serialize2i(85, target, mode);
        },
        BindTexture: function(target, texture) {
          serialize2i(4117, target, texture);
        },
        TexEnvf: function(target, pname, param) {
          serialize2i1f(112, target, pname, param);
        },
        TexParameterf: function(target, pname, param) {
          serialize2i1f(105, target, pname, param);
        },
        TexParameterfv: function(target, pname, param) {
          serialize2ifv(106, target, pname, param);
        },
        TexParameteri: function(target, pname, param) {
          serialize3i(107, target, pname, param);
        },
        TexImage2D: function(target, level, internalFormat, width, height, border, format2, type, data) {
          render();
          var typeSize = [];
          typeSize[constants.FLOAT] = 4;
          typeSize[constants.BYTE] = 1;
          typeSize[constants.UNSIGNED_BYTE] = 1;
          var res = new Buffer(60 + data.length * typeSize[type]);
          res.writeUInt32LE(res.length, 0);
          res.writeUInt32LE(110, 4);
          res[8] = 0;
          res[9] = 0;
          res.writeUInt16LE(0, 10);
          res.writeUInt32LE(0, 12);
          res.writeUInt32LE(0, 16);
          res.writeUInt32LE(0, 20);
          res.writeUInt32LE(4, 24);
          res.writeUInt32LE(target, 28);
          res.writeUInt32LE(level, 32);
          res.writeUInt32LE(internalFormat, 36);
          res.writeUInt32LE(width, 40);
          res.writeUInt32LE(height, 44);
          res.writeUInt32LE(border, 48);
          res.writeUInt32LE(format2, 52);
          res.writeUInt32LE(type, 56);
          switch (type) {
            case constants.FLOAT:
              for (var i = 0; i < data.length; ++i)
                res.writeFloatLE(data[i], 60 + i * typeSize[type]);
              break;
            case constants.BYTE:
            case constants.UNSIGNED_BYTE:
              for (var i = 0; i < data.length; ++i)
                res[60 + i] = data[i];
              break;
            default:
              throw new Error("unsupported texture type:" + type);
          }
          render();
          var dataLen = res.length;
          var maxSize = 262124;
          var totalRequests = 1 + parseInt(dataLen / maxSize) - 1;
          if (dataLen % maxSize)
            totalRequests++;
          if (dataLen < maxSize) {
            GLX.RenderLarge(ctx, 1, 2, res);
            GLX.RenderLarge(ctx, 2, 2, Buffer(0));
            return;
          }
          var pos = 0;
          var reqNum = 1;
          while (dataLen > 0) {
            if (dataLen < maxSize) {
              GLX.RenderLarge(ctx, reqNum, totalRequests, res.slice(pos));
              break;
            } else {
              GLX.RenderLarge(ctx, reqNum, totalRequests, res.slice(pos, pos + maxSize));
              pos += maxSize;
              dataLen -= maxSize;
              reqNum++;
            }
          }
        },
        ProgramString: function(target, format2, src2) {
          serialize3i(target, format2, src2);
          buffers.push(Buffer(src2));
        },
        BindProgram: function(target, program) {
          serialize2i(target, format, src);
        },
        TexCoord2f: function(x, y) {
          serialize2f(54, x, y);
        }
      };
      for (var c in constants)
        renderContext[c] = constants[c];
      "NewList EndList GenLists GenTextures IsTexture SwapBuffers Finish".split(" ").forEach(function(name) {
        renderContext[name] = function(p1, p2, p3, p4, p5, p6, p7, p8) {
          render();
          GLX[name](ctx, p1, p2, p3, p4, p5, p6, p7, p8);
        };
      });
      return renderContext;
    };
  }
});

// node_modules/x11/lib/ext/glx.js
var require_glx = __commonJS({
  "node_modules/x11/lib/ext/glx.js"(exports2) {
    var x11 = require_lib2();
    exports2.requireExt = function(display, callback2) {
      var X = display.client;
      X.QueryExtension("GLX", function(err, ext) {
        var constants = require_glxconstants();
        for (var i in constants)
          ext[i] = constants[i];
        if (!ext.present)
          return callback2(new Error("extension not available"));
        ext.QueryVersion = function(clientMaj, clientMin, callback3) {
          X.seq_num++;
          X.pack_stream.pack("CCSLL", [ext.majorOpcode, 7, 3, clientMaj, clientMin]);
          X.replies[X.seq_num] = [
            function(buf, opt) {
              var res = buf.unpack("LL");
              return res;
            },
            callback3
          ];
          X.pack_stream.flush();
        };
        ext.QueryServerString = function(screen, name, callback3) {
          X.seq_num++;
          X.pack_stream.pack("CCSLL", [ext.majorOpcode, 19, 3, screen, name]);
          X.replies[X.seq_num] = [
            function(buf, opt) {
              var len = buf.unpack("xxxxL")[0];
              return buf.toString().substring(24, 24 + len * 4);
            },
            callback3
          ];
          X.pack_stream.flush();
        };
        ext.CreateGLXPixmap = function(screen, visual, pixmap, glxpixmap) {
          X.seq_num++;
          X.pack_stream.pack("CCSLLLL", [ext.majorOpcode, 13, 5, screen, visual, pixmap, glxpixmap]);
          console.log("CreateGlxPix", X.seq_num);
          console.log(ext.majorOpcode, 13, 5, screen, visual, pixmap, glxpixmap);
          console.trace();
          X.pack_stream.flush();
        };
        ext.QueryExtensionsString = function(screen, callback3) {
          X.seq_num++;
          X.pack_stream.pack("CCSL", [ext.majorOpcode, 18, 2, screen]);
          X.replies[X.seq_num] = [
            function(buf, opt) {
              var len = buf.unpack("xxxxL")[0];
              return buf.toString().substring(24, 24 + len * 4);
            },
            callback3
          ];
          X.pack_stream.flush();
        };
        ext.GetVisualConfigs = function(screen, callback3) {
          X.seq_num++;
          X.pack_stream.pack("CCSL", [ext.majorOpcode, 14, 2, screen]);
          X.replies[X.seq_num] = [
            function(buf, opt) {
              var res = buf.unpack("LL");
              var numConfigs = res[0];
              var numProps = res[1];
              var configs = new Array(numConfigs);
              var i2, j;
              for (i2 = 0; i2 < numConfigs; ++i2) {
                var props = {};
                var names = "visualID visualType rgbMode redBits greenBits blueBits alphaBits accumRedBits accumGreen accumBlueBits accumAlphaBits doubleBufferMode stereoMode rgbBits depthBits stencilBits numAuxBuffers level".split(" ");
                for (var j = 0; j < 18 && j < numProps; ++j) {
                  props[names[j]] = buf.unpack("L", 24 + (i2 * numProps + j) * 4)[0];
                }
                configs[i2] = props;
              }
              return configs;
            },
            callback3
          ];
          X.pack_stream.flush();
        };
        ext.GetFBConfigs = function(screen, callback3) {
          X.seq_num++;
          X.pack_stream.pack("CCSL", [ext.majorOpcode, 21, 2, screen]);
          X.replies[X.seq_num] = [
            function(buf, opt) {
              var res = buf.unpack("LL");
              var numConfigs = res[0];
              var numProps = res[1];
              var configs = new Array(numConfigs);
              var i2, j;
              for (i2 = 0; i2 < numConfigs; ++i2) {
                var props = new Array(numProps);
                for (var j = 0; j < numProps; ++j) {
                  props[j] = buf.unpack("LL", 24 + (i2 * numProps + j) * 8);
                }
                configs[i2] = props;
              }
              return configs;
            },
            callback3
          ];
          X.pack_stream.flush();
        };
        ext.CreateContext = function(ctx, visual, screen, shareListCtx, isDirect) {
          X.seq_num++;
          X.pack_stream.pack("CCSLLLLCxxx", [ext.majorOpcode, 3, 6, ctx, visual, screen, shareListCtx, isDirect]);
          X.pack_stream.flush();
        };
        ext.SwapBuffers = function(ctx, drawable) {
          X.seq_num++;
          X.pack_stream.pack("CCSLL", [ext.majorOpcode, 11, 3, ctx, drawable]);
          X.pack_stream.flush();
        };
        ext.NewList = function(ctx, list, mode) {
          X.seq_num++;
          X.pack_stream.pack("CCSLLL", [ext.majorOpcode, 101, 4, ctx, list, mode]);
          X.pack_stream.flush();
        };
        ext.EndList = function(ctx) {
          X.seq_num++;
          X.pack_stream.pack("CCSL", [ext.majorOpcode, 102, 2, ctx]);
          X.pack_stream.flush();
        };
        ext.GenLists = function(ctx, count, callback3) {
          X.seq_num++;
          X.pack_stream.pack("CCSLL", [ext.majorOpcode, 104, 3, ctx, count]);
          X.replies[X.seq_num] = [
            function(buf, opt) {
              return buf.unpack("L")[0];
            },
            callback3
          ];
          X.pack_stream.flush();
        };
        ext.GenTextures = function(ctx, count, callback3) {
          X.seq_num++;
          X.pack_stream.pack("CCSLL", [ext.majorOpcode, 145, 3, ctx, count]);
          X.replies[X.seq_num] = [
            function(buf, opt) {
              var format2 = Buffer(count);
              format2.fill("L");
              return buf.unpack("xxxxxxxxxxxxxxxxxxxxxxxx" + format2.toString());
            },
            callback3
          ];
          X.pack_stream.flush();
        };
        ext.IsTexture = function(ctx, texture, callback3) {
          X.seq_num++;
          X.pack_stream.pack("CCSLL", [ext.majorOpcode, 146, 3, ctx, texture]);
          X.replies[X.seq_num] = [
            function(buf, opt) {
              return buf.unpack("CCCCCCCCCCCCCCCCCCCCCCCCCC");
            },
            callback3
          ];
          X.pack_stream.flush();
        };
        ext.MakeCurrent = function(drawable, ctx, oldctx, callback3) {
          X.seq_num++;
          X.pack_stream.pack("CCSLLL", [ext.majorOpcode, 5, 4, drawable, ctx, oldctx]);
          X.replies[X.seq_num] = [
            function(buf, opt) {
              return buf.unpack("L")[0];
            },
            callback3
          ];
          X.pack_stream.flush();
        };
        ext.Finish = function(ctx, callback3) {
          X.seq_num++;
          X.pack_stream.pack("CCSL", [ext.majorOpcode, 108, 2, ctx]);
          X.replies[X.seq_num] = [
            function(buf, opt) {
              return;
            },
            callback3
          ];
          X.pack_stream.flush();
        };
        ext.Render = function(ctx, data) {
          X.seq_num++;
          var length = 0;
          if (Buffer.isBuffer(data))
            length = 2 + data.length / 4;
          else if (Array.isArray(data)) {
            length = 2;
            for (var i2 = 0; i2 < data.length; ++i2)
              length += data[i2].length / 4;
          }
          X.pack_stream.pack("CCSL", [ext.majorOpcode, 1, length, ctx]);
          if (Buffer.isBuffer(data))
            X.pack_stream.write_queue.push(data);
          else if (Array.isArray(data))
            for (var i2 = 0; i2 < data.length; ++i2)
              X.pack_stream.write_queue.push(data[i2]);
          else
            throw new Error("invalid data, expected buffer or buffers array", data);
          X.pack_stream.flush();
        };
        ext.VendorPrivate = function(ctx, code, data) {
          X.seq_num++;
          X.pack_stream.pack("CCSLL", [ext.majorOpcode, 16, 3 + data.length / 4, code, ctx]);
          X.pack_stream.write_queue.push(data);
          X.pack_stream.flush();
        };
        ext.BindTexImage = function(ctx, drawable, buffer, attribs) {
          if (!attribs)
            attribs = [];
          var data = new Buffer(12 + attribs.length * 4);
          data.writeUInt32LE(drawable, 0);
          data.writeUInt32LE(buffer, 4);
          data.writeUInt32LE(attribs.length, 8);
          for (var i2 = 0; i2 < attribs.length; ++i2)
            data.writeUint32LE(attribs.length, 12 + i2 * 4);
          ext.VendorPrivate(ctx, 1330, data);
        };
        ext.ReleaseTexImage = function(ctx, drawable, buffer) {
          var data = new Buffer(8);
          data.writeUint32LE(drawable, 0);
          data.writeUint32LE(buffer, 4);
          ext.VendorPrivate(ctx, 1331, data);
        };
        ext.RenderLarge = function(ctx, requestNum, requestTotal, data) {
          X.seq_num++;
          var padLength = 4 - data.length % 4;
          if (padLength == 4)
            padLength = 0;
          var length = 4 + (data.length + padLength) / 4;
          X.pack_stream.pack("CCSLSSL", [ext.majorOpcode, 2, length, ctx, requestNum, requestTotal, data.length]);
          X.pack_stream.write_queue.push(data);
          var pad = new Buffer(padLength);
          pad.fill(0);
          X.pack_stream.write_queue.push(pad);
          X.pack_stream.flush();
        };
        ext.renderPipeline = function(ctx) {
          return require_glxrender()(this, ctx);
        };
        var errors = [
          "context",
          "contect state",
          "drawable",
          "pixmap",
          "context tag",
          "current window",
          "Render request",
          "RenderLarge request",
          "(unsupported) VendorPrivate request",
          "FB config",
          "pbuffer",
          "current drawable",
          "window"
        ];
        errors.forEach(function(message, code) {
          X.errorParsers[ext.firstError + code] = function(err2) {
            err2.message = "GLX: Bad " + message;
          };
        });
        callback2(null, ext);
      });
    };
  }
});

// node_modules/x11/lib/ext/randr.js
var require_randr = __commonJS({
  "node_modules/x11/lib/ext/randr.js"(exports2) {
    var x11 = require_lib2();
    exports2.requireExt = function(display, callback2) {
      var X = display.client;
      X.QueryExtension("RANDR", function(err, ext) {
        if (!ext.present)
          return callback2(new Error("extension not available"));
        ext.QueryVersion = function(clientMaj, clientMin, callback3) {
          X.seq_num++;
          X.pack_stream.pack("CCSLL", [ext.majorOpcode, 0, 3, clientMaj, clientMin]);
          X.replies[X.seq_num] = [
            function(buf, opt) {
              var res = buf.unpack("LL");
              return res;
            },
            callback3
          ];
          X.pack_stream.flush();
        }, ext.events = {
          RRScreenChangeNotify: 0
        }, ext.NotifyMask = {
          ScreenChange: 1,
          CrtcChange: 2,
          OutputChange: 4,
          OutputProperty: 8,
          All: 15
        };
        ext.Rotation = {
          Rotate_0: 1,
          Rotate_90: 2,
          Rotate_180: 4,
          Rotate_270: 8,
          Reflect_X: 16,
          Reflect_Y: 32
        };
        ext.ConfigStatus = {
          Sucess: 0,
          InvalidConfigTime: 1,
          InvalidTime: 2,
          Failed: 3
        };
        ext.ModeFlag = {
          HSyncPositive: 1,
          HSyncNegative: 2,
          VSyncPositive: 4,
          VSyncNegative: 8,
          Interlace: 16,
          DoubleScan: 32,
          CSync: 64,
          CSyncPositive: 128,
          CSyncNegative: 256,
          HSkewPresent: 512,
          BCast: 1024,
          PixelMultiplex: 2048,
          DoubleClock: 4096,
          ClockDivideBy2: 8192
        };
        ext.SetScreenConfig = function(win, ts, configTs, sizeId, rotation, rate, cb) {
          X.seq_num++;
          X.pack_stream.pack("CCSLLLSSSS", [ext.majorOpcode, 2, 6, win, ts, configTs, sizeId, rotation, rate, 0]);
          X.replies[X.seq_num] = [
            function(buf, opt) {
              var res = buf.unpack("LLLSSLL");
              return {
                status: opt,
                newTs: res[0],
                configTs: res[1],
                root: res[2],
                subpixelOrder: res[3]
              };
            },
            function(err2, res) {
              var err2;
              if (res.status !== 0) {
                err2 = new Error("SetScreenConfig error");
                err2.code = res.status;
              }
              cb(err2, res);
            }
          ];
          X.pack_stream.flush();
        }, ext.SelectInput = function(win, mask) {
          X.seq_num++;
          X.pack_stream.pack("CCSLSS", [ext.majorOpcode, 4, 3, win, mask, 0]);
          X.pack_stream.flush();
        }, ext.GetScreenInfo = function(win, cb) {
          X.seq_num++;
          X.pack_stream.pack("CCSL", [ext.majorOpcode, 5, 2, win]);
          X.replies[X.seq_num] = [
            function(buf, opt) {
              var i, j;
              var res = buf.unpack("LLLSSSSSS");
              var info = {
                rotations: opt,
                root: res[0],
                timestamp: res[1],
                config_timestamp: res[2],
                sizeID: res[4],
                rotation: res[5],
                rate: res[6],
                rates: []
              };
              var nSizes = res[3];
              var nRates = res[7];
              var screens_len = nSizes << 2;
              var format2 = Array(screens_len + 1).join("S");
              res = buf.unpack(format2, 24);
              info.screens = [];
              for (i = 0; i < screens_len; i += 4) {
                info.screens.push({
                  px_width: res[i],
                  px_height: res[i + 1],
                  mm_width: res[i + 2],
                  mm_height: res[i + 3]
                });
              }
              format2 = Array(nRates + 1).join("S");
              info.rates = buf.unpack(format2, 24 + screens_len * 2);
              return info;
            },
            cb
          ];
          X.pack_stream.flush();
        }, ext.GetScreenResources = function(win, cb) {
          X.seq_num++;
          X.pack_stream.pack("CCSL", [ext.majorOpcode, 8, 2, win]);
          X.replies[X.seq_num] = [
            function(buf, opt) {
              var i;
              var pos = 0;
              var res = buf.unpack("LLSSSSxxxxxxxx");
              var resources = {
                timestamp: res[0],
                config_timestamp: res[1],
                modeinfos: []
              };
              pos += 24;
              var format2 = Array(res[2] + 1).join("L");
              resources.crtcs = buf.unpack(format2, pos);
              pos += res[2] << 2;
              format2 = Array(res[3] + 1).join("L");
              resources.outputs = buf.unpack(format2, pos);
              pos += res[3] << 2;
              format2 = Array(res[4] + 1).join("LSSLSSSSSSSSL");
              res_modes = buf.unpack(format2, pos);
              pos += res[4] << 5;
              for (i = 0; i < res[4]; i += 13) {
                resources.modeinfos.push({
                  id: res_modes[i + 0],
                  width: res_modes[i + 1],
                  height: res_modes[i + 2],
                  dot_clock: res_modes[i + 3],
                  h_sync_start: res_modes[i + 4],
                  h_sync_end: res_modes[i + 5],
                  h_total: res_modes[i + 6],
                  h_skew: res_modes[i + 7],
                  v_sync_start: res_modes[i + 8],
                  v_sync_end: res_modes[i + 9],
                  v_total: res_modes[i + 10],
                  modeflags: res_modes[i + 12],
                  name: buf.slice(pos, pos + res_modes[i + 11]).toString()
                });
                pos += res_modes[i + 11];
              }
              return resources;
            },
            cb
          ];
          X.pack_stream.flush();
        }, ext.GetOutputInfo = function(output, ts, cb) {
          X.seq_num++;
          X.pack_stream.pack("CCSLL", [ext.majorOpcode, 9, 3, output, ts]);
          X.replies[X.seq_num] = [
            function(buf, opt) {
              var i;
              var pos = 0;
              var res = buf.unpack("LLLLCCSSSSS");
              var info = {
                timestamp: res[0],
                crtc: res[1],
                mm_width: res[2],
                mm_height: res[3],
                connection: res[4],
                subpixelOrder: res[5],
                preferredModes: res[8]
              };
              pos += 28;
              var format2 = Array(res[6] + 1).join("L");
              info.crtcs = buf.unpack(format2, pos);
              pos += res[6] << 2;
              format2 = Array(res[7] + 1).join("L");
              info.modes = buf.unpack(format2, pos);
              pos += res[7] << 2;
              format2 = Array(res[9] + 1).join("L");
              info.clones = buf.unpack(format2, pos);
              pos += res[9] << 2;
              info.name = buf.slice(pos, pos + res_modes[10]).toString("binary");
              return info;
            },
            cb
          ];
          X.pack_stream.flush();
        }, ext.GetCrtcInfo = function(crtc, configTs, cb) {
          X.seq_num++;
          X.pack_stream.pack("CCSLL", [ext.majorOpcode, 20, 3, crtc, configTs]);
          X.replies[X.seq_num] = [
            function(buf, opt) {
              var pos = 0;
              var res = buf.unpack("LssSSLSSSS");
              var info = {
                status: opt,
                timestamp: res[0],
                x: res[1],
                y: res[2],
                width: res[3],
                height: res[4],
                mode: res[5],
                rotation: res[6],
                rotations: res[7]
              };
              pos += 24;
              var format2 = Array(res[8] + 1).join("L");
              info.output = buf.unpack(format2, pos);
              format2 = Array(res[9] + 1).join("L");
              info.possible = buf.unpack(format2, pos);
              return info;
            },
            cb
          ];
          X.pack_stream.flush();
        }, X.eventParsers[ext.firstEvent + ext.events.RRScreenChangeNotify] = function(type, seq, extra, code, raw) {
          var event = {};
          event.raw = raw;
          event.type = type;
          event.seq = seq;
          event.rotation = code;
          var values = raw.unpack("LLLSSSSSS");
          event.time = extra;
          event.configtime = values[0];
          event.root = values[1];
          event.requestWindow = values[2];
          event.sizeId = values[3];
          event.subpixelOrder = values[4];
          event.width = values[5];
          event.height = values[6];
          event.physWidth = values[7];
          event.physHeight = values[8];
          event.name = "RRScreenChangeNotify";
          return event;
        };
        ext.QueryVersion(255, 255, function(err2, version) {
          if (err2)
            return callback2(err2);
          ext.major_version = version[0];
          ext.minor_version = version[1];
          callback2(null, ext);
        });
      });
    };
  }
});

// node_modules/x11/lib/ext/render.js
var require_render = __commonJS({
  "node_modules/x11/lib/ext/render.js"(exports2) {
    var x11 = require_lib2();
    var xutil = require_xutil();
    exports2.requireExt = function(display, callback2) {
      var X = display.client;
      X.QueryExtension("RENDER", function(err, ext) {
        if (!ext.present) {
          return callback2(new Error("extension not available"));
        }
        ext.QueryVersion = function(clientMaj, clientMin, callback3) {
          X.seq_num++;
          X.pack_stream.pack("CCSLL", [ext.majorOpcode, 0, 3, clientMaj, clientMin]);
          X.replies[X.seq_num] = [
            function(buf, opt) {
              var res = buf.unpack("LL");
              return res;
            },
            callback3
          ];
          X.pack_stream.flush();
        };
        ext.QueryPictFormat = function(callback3) {
          X.pack_stream.pack("CCS", [ext.majorOpcode, 1, 1]);
          X.seq_num++;
          X.replies[X.seq_num] = [
            function(buf, opt) {
              var res = {};
              var res1 = buf.unpack("LLLLL");
              var num_formats = res1[0];
              var num_screens = res1[1];
              var num_depths = res1[2];
              var num_visuals = res1[3];
              var num_subpixel = res1[4];
              var offset = 24;
              res.formats = [];
              for (var i = 0; i < num_formats; ++i) {
                var format2 = {};
                var f = buf.unpack("LCCxxSSSSSSSSL", offset);
                res.formats.push(f);
                offset += 28;
              }
              return res;
            },
            callback3
          ];
          X.pack_stream.flush();
        };
        ext.QueryFilters = function(callback3) {
          X.pack_stream.pack("CCSL", [ext.majorOpcode, 29, 2, display.screen[0].root]);
          X.seq_num++;
          X.replies[X.seq_num] = [
            function(buf, opt) {
              var h = buf.unpack("LL");
              var num_aliases = h[0];
              var num_filters = h[1];
              var aliases = [];
              var offset = 24;
              for (var i = 0; i < num_aliases; ++i) {
                aliases.push(buf.unpack("S", offset)[0]);
                offset += 2;
              }
              var filters = [];
              for (var i = 0; i < num_filters; ++i) {
                var len = buf.unpack("C", offset)[0];
                offset++;
                filters.push(buf.toString("ascii", offset, offset + len));
                offset += len;
              }
              return [aliases, filters];
            },
            callback3
          ];
          X.pack_stream.flush();
        };
        var valueList = [
          ["repeat", "Cxxx"],
          ["alphaMap", "L"],
          ["alphaXOrigin", "sxx"],
          ["alphaYOrigin", "sxx"],
          ["clipXOrigin", "sxx"],
          ["clipYOrigin", "sxx"],
          ["clipMask", "L"],
          ["graphicsExposures", "Cxxx"],
          ["subwindowMode", "Cxxx"],
          ["polyEdge", "Cxxx"],
          ["polyMode", "Cxxx"],
          ["dither", "L"],
          ["componentAlpha", "Cxxx"]
        ];
        var argumentLength = {
          C: 1,
          S: 2,
          s: 2,
          L: 4,
          x: 1
        };
        ext.CreatePicture = function(pid, drawable, pictformat, values) {
          var mask = 0;
          var reqLen = 5;
          var format2 = "CCSLLLL";
          var params = [ext.majorOpcode, 4, reqLen, pid, drawable, pictformat, mask];
          if (values) {
            var valuesLength = 0;
            for (var i = 0; i < valueList.length; ++i) {
              var name = valueList[i][0];
              var val = values[name];
              if (val) {
                mask |= 1 << i;
                params.push(val);
                var valueFormat = valueList[i][1];
                format2 += valueFormat;
                valuesLength += 4;
              }
            }
            var pad4 = valuesLength + 3 >> 2;
            var toPad = (pad4 << 2) - valuesLength;
            for (var i = 0; i < toPad; ++i)
              format2 += "x";
            reqLen += pad4;
            params[2] = reqLen;
            params[6] = mask;
          }
          X.pack_stream.pack(format2, params);
          X.pack_stream.flush();
          X.seq_num++;
        };
        ext.FreePicture = function(pid) {
          X.pack_stream.pack("CCSL", [ext.majorOpcode, 7, 2, pid]);
          X.pack_stream.flush();
          X.seq_num++;
        };
        function floatToFix(f) {
          return parseInt(f * 65536);
        }
        function colorToFix(f) {
          if (f < 0)
            f = 0;
          if (f > 1)
            f = 1;
          return parseInt(f * 65535);
        }
        ext.SetPictureTransform = function(pid, matrix) {
          var format2 = "CCSLLLLLLLLLL";
          if (matrix.length !== 9)
            throw "Render.SetPictureTransform: incorrect transform matrix. Must be array of 9 numbers";
          var params = [ext.majorOpcode, 28, 11, pid];
          for (var i = 0; i < 9; ++i) {
            if (typeof matrix[i] !== "number")
              throw "Render.SetPictureTransform: matrix element must be a number";
            params.push(floatToFix(matrix[i]));
          }
          X.pack_stream.pack(format2, params);
          X.pack_stream.flush();
          X.seq_num++;
        };
        ext.SetPictureFilter = function(pid, name, filterParams) {
          if (filterParams === 0)
            filterParams = [0];
          if (!filterParams)
            filterParams = [];
          if (!Array.isArray(filterParams))
            filterParams = [filterParams];
          var reqLen = 2;
          var format2 = "CCSLSxxp";
          var params = [ext.majorOpcode, 30, reqLen, pid, name.length, name];
          reqLen += xutil.padded_length(name.length + 3) / 4 + filterParams.length;
          if (name == "nearest" || name == "bilinear" || name == "fast" || name == "good" || name == "best") {
            if (filterParams.length !== 0) {
              throw 'Render.SetPictureFilter: "' + name + '" - unexpected parameters for filters';
            }
          } else if (name == "convolution") {
            if (filterParams.length < 2 || filterParams[0] * filterParams[1] + 2 !== filterParams.length) {
              throw 'Render.SetPictureFilter: "convolution" - incorrect matrix dimensions. Must be flat array [ w, h, elem1, elem2, ... ]';
            }
            for (var i = 0; i < filterParams.length; ++i) {
              format2 += "L";
              params.push(floatToFix(filterParams[i]));
            }
          } else if (name == "binomial" || name == "gaussian") {
            if (filterParams.length !== 1) {
              throw 'Render.SetPictureFilter: "' + name + '" - incorrect number of parameters, must be exactly 1 number, instead got: ' + filterParams;
            }
            format2 += "L";
            params.push(floatToFix(filterParams[0]));
          } else {
            throw 'Render.SetPictureFilter: unknown filter "' + name + '"';
          }
          params[2] = reqLen;
          X.pack_stream.pack(format2, params);
          X.pack_stream.flush();
          X.seq_num++;
        };
        ext.CreateSolidFill = function(pid, r, g, b, a) {
          X.pack_stream.pack("CCSLSSSS", [ext.majorOpcode, 33, 4, pid, colorToFix(r), colorToFix(g), colorToFix(b), colorToFix(a)]);
          X.pack_stream.flush();
          X.seq_num++;
        };
        ext.RadialGradient = function(pid, p1, p2, r1, r2, stops) {
          var reqLen = 9 + stops.length * 3;
          var format2 = "CCSLLLLLLLL";
          var params = [ext.majorOpcode, 35, reqLen, pid];
          params.push(floatToFix(p1[0]));
          params.push(floatToFix(p1[1]));
          params.push(floatToFix(p2[0]));
          params.push(floatToFix(p2[1]));
          params.push(floatToFix(r1));
          params.push(floatToFix(r2));
          params.push(stops.length);
          for (var i = 0; i < stops.length; ++i) {
            format2 += "L";
            params.push(floatToFix(stops[i][0]));
          }
          for (var i = 0; i < stops.length; ++i) {
            format2 += "SSSS";
            for (var j = 0; j < 4; ++j)
              params.push(colorToFix(stops[i][1][j]));
          }
          X.pack_stream.pack(format2, params);
          X.pack_stream.flush();
          X.seq_num++;
        };
        ext.LinearGradient = function(pid, p1, p2, stops) {
          var reqLen = 7 + stops.length * 3;
          var format2 = "CCSLLLLLL";
          var params = [ext.majorOpcode, 34, reqLen, pid];
          params.push(floatToFix(p1[0]));
          params.push(floatToFix(p1[1]));
          params.push(floatToFix(p2[0]));
          params.push(floatToFix(p2[1]));
          params.push(stops.length);
          for (var i = 0; i < stops.length; ++i) {
            format2 += "L";
            params.push(floatToFix(stops[i][0]));
          }
          for (var i = 0; i < stops.length; ++i) {
            format2 += "SSSS";
            for (var j = 0; j < 4; ++j)
              params.push(colorToFix(stops[i][1][j]));
          }
          X.pack_stream.pack(format2, params);
          X.pack_stream.flush();
          X.seq_num++;
        };
        ext.ConicalGradient = function(pid, center, angle, stops) {
          var reqLen = 6 + stops.length * 3;
          var format2 = "CCSLLLLL";
          var params = [ext.majorOpcode, 36, reqLen, pid];
          params.push(floatToFix(center[0]));
          params.push(floatToFix(center[1]));
          params.push(floatToFix(angle));
          params.push(stops.length);
          for (var i = 0; i < stops.length; ++i) {
            format2 += "L";
            params.push(floatToFix(stops[i][0]));
          }
          for (var i = 0; i < stops.length; ++i) {
            format2 += "SSSS";
            for (var j = 0; j < 4; ++j)
              params.push(colorToFix(stops[i][1][j]));
          }
          X.pack_stream.pack(format2, params);
          X.pack_stream.flush();
          X.seq_num++;
        };
        ext.FillRectangles = function(op, pid, color, rects) {
          var reqLen = 5 + rects.length / 2;
          var format2 = "CCSCxxxLSSSS";
          var params = [ext.majorOpcode, 26, reqLen, op, pid];
          for (var j = 0; j < 4; ++j)
            params.push(colorToFix(color[j]));
          for (var i = 0; i < rects.length; i += 4) {
            format2 += "ssSS";
            params.push(rects[i * 4]);
            params.push(rects[i * 4 + 1]);
            params.push(rects[i * 4 + 2]);
            params.push(rects[i * 4 + 3]);
          }
          X.pack_stream.pack(format2, params);
          X.pack_stream.flush();
          X.seq_num++;
        };
        ext.Composite = function(op, src2, mask, dst, srcX, srcY, maskX, maskY, dstX, dstY, width, height) {
          X.pack_stream.pack(
            "CCSCxxxLLLssssssSS",
            [ext.majorOpcode, 8, 9, op, src2, mask, dst, srcX, srcY, maskX, maskY, dstX, dstY, width, height]
          ).flush();
          X.seq_num++;
        };
        ext.Trapezoids = function(op, src2, srcX, srcY, dst, maskFormat, trapz) {
          var format2 = "CCSCxxxLLLss";
          var params = [ext.majorOpcode, 10, 6 + trapz.length, op, src2, dst, maskFormat, srcX, srcY];
          for (var i = 0; i < trapz.length; i++) {
            format2 += "llllllllll";
            for (var j = 0; j < 10; ++j)
              params.push(floatToFix(trapz[i * 10 + j]));
          }
          X.pack_stream.pack(format2, params);
          X.pack_stream.flush();
          X.seq_num++;
        };
        ext.AddTraps = function(pic, offX, offY, trapList) {
          var format2 = "CCSLss";
          var params = [ext.majorOpcode, 32, 3 + trapList.length, pic, offX, offY];
          for (var i = 0; i < trapList.length; i++) {
            format2 += "l";
            params.push(floatToFix(trapList[i]));
          }
          X.pack_stream.pack(format2, params);
          X.pack_stream.flush();
          X.seq_num++;
        };
        ext.Triangles = function(op, src2, srcX, srcY, dst, maskFormat, tris) {
          var format2 = "CCSCxxxLLLss";
          var params = [ext.majorOpcode, 11, 6 + tris.length, op, src2, dst, maskFormat, srcX, srcY];
          for (var i = 0; i < tris.length; i += 6) {
            format2 += "llllll";
            params.push(floatToFix(tris[i + 0]));
            params.push(floatToFix(tris[i + 1]));
            params.push(floatToFix(tris[i + 2]));
            params.push(floatToFix(tris[i + 3]));
            params.push(floatToFix(tris[i + 4]));
            params.push(floatToFix(tris[i + 5]));
          }
          X.pack_stream.pack(format2, params);
          X.pack_stream.flush();
          X.seq_num++;
        };
        ext.CreateGlyphSet = function(gsid, format2) {
          X.pack_stream.pack("CCSLL", [ext.majorOpcode, 17, 3, gsid, format2]);
          X.pack_stream.flush();
          X.seq_num++;
        };
        ext.ReferenceGlyphSet = function(gsid, existing) {
          X.pack_stream.pack("CCSLL", [ext.majorOpcode, 18, 3, gsid, existing]);
          X.pack_stream.flush();
          X.seq_num++;
        };
        ext.FreeGlyphSet = function(gsid) {
          X.pack_stream.pack("CCSL", [ext.majorOpcode, 19, 2, gsid]);
          X.pack_stream.flush();
          X.seq_num++;
        };
        ext.AddGlyphs = function(gsid, glyphs) {
          var numGlyphs = glyphs.length;
          var imageBytes = 0;
          var glyphPaddedLength;
          var glyphLength;
          var stride;
          var glyph;
          for (var i = 0; i < numGlyphs; i++) {
            glyph = glyphs[i];
            if (glyph.width % 4 !== 0) {
              var stride = glyph.width + 3 & ~3;
              var res = new Buffer(glyph.height * stride);
              res.fill(0);
              for (var y = 0; y < glyph.height; ++y) {
                glyph.image.copy(res, y * stride, y * glyph.width, y * glyph.width + glyph.width);
              }
              glyph.image = res;
              glyph.width = stride;
            }
            glyphLength = glyphs[i].image.length;
            imageBytes += glyphLength;
            glyph.offX = glyph.offX / 64;
            glyph.offY = glyph.offY / 64;
          }
          var len = numGlyphs * 4 + imageBytes / 4 + 3;
          X.pack_stream.pack("CCSLLL", [ext.majorOpcode, 20, 0, len + 1, gsid, glyphs.length]);
          for (i = 0; i < numGlyphs; i++) {
            X.pack_stream.pack("L", [glyphs[i].id]);
          }
          for (i = 0; i < numGlyphs; i++) {
            X.pack_stream.pack("SSssss", [glyphs[i].width, glyphs[i].height, -glyphs[i].x, glyphs[i].y, glyphs[i].offX, glyphs[i].offY]);
          }
          for (i = 0; i < numGlyphs; i++) {
            X.pack_stream.write_queue.push(glyphs[i].image);
          }
          X.pack_stream.flush();
          X.seq_num++;
        };
        var formatFromBits = [, , , , , , , , "C", , , , , , , , "S", , , , , , , , , , , , , , , , "L"];
        var bufferWriteBits = [, , , , , , , , "writeUInt8", , , , , , , , "writeUInt16LE", , , , , , , , , , , , , , , , "writeUInt32LE"];
        function wstring(bits, s) {
          var charLength = bits / 8;
          var dataLength = s.length * charLength;
          var res = new Buffer(xutil.padded_length(dataLength));
          debugger;
          var write = res[bufferWriteBits[bits]];
          res.fill(0);
          for (var i = 0; i < s.length; i++)
            write.call(res, s.charCodeAt(i), i * charLength);
          return res;
        }
        var compositeGlyphsOpcodeFromBits = [, , , , , , , , 23, , , , , , , , 24, , , , , , , , , , , , , , , , 25];
        ext.CompositeGlyphs = function(glyphBits, op, src2, dst, maskFormat, gsid, srcX, srcY, glyphs) {
          var opcode = compositeGlyphsOpcodeFromBits[glyphBits];
          var charFormat = formatFromBits[glyphBits];
          var charLength = glyphBits / 8;
          var length = 7;
          var glyphs_length_split = [];
          for (var i = 0; i < glyphs.length; ++i) {
            var g = glyphs[i];
            switch (typeof g) {
              case "string":
                length += xutil.padded_length(g.length * charLength) / 4 + 2;
                break;
              case "object":
                length += xutil.padded_length(g[2].length * charLength) / 4 + 2;
                break;
              case "number":
                length += 3;
                break;
            }
          }
          X.pack_stream.pack(
            "CCSCxxxLLLLss",
            [ext.majorOpcode, opcode, length, op, src2, dst, maskFormat, gsid, srcX, srcY]
          );
          for (var i = 0; i < glyphs.length; ++i) {
            var g = glyphs[i];
            switch (typeof g) {
              case "string":
                X.pack_stream.pack("Cxxxssa", [g.length, 0, 0, wstring(glyphBits, g)]);
                break;
              case "object":
                X.pack_stream.pack("Cxxxssa", [g[2].length, g[0], g[1], wstring(glyphBits, g[2])]);
                break;
              case "number":
                X.pack_stream.pack("CxxxSSL", [255, 0, 0, g]);
                break;
            }
          }
          X.pack_stream.flush();
          X.seq_num++;
        };
        ext.CompositeGlyphs8 = function(op, src2, dst, maskFormat, gsid, srcX, srcY, glyphs) {
          return ext.CompositeGlyphs(8, op, src2, dst, maskFormat, gsid, srcX, srcY, glyphs);
        };
        ext.CompositeGlyphs16 = function(op, src2, dst, maskFormat, gsid, srcX, srcY, glyphs) {
          return ext.CompositeGlyphs(16, op, src2, dst, maskFormat, gsid, srcX, srcY, glyphs);
        };
        ext.CompositeGlyphs32 = function(op, src2, dst, maskFormat, gsid, srcX, srcY, glyphs) {
          return ext.CompositeGlyphs(32, op, src2, dst, maskFormat, gsid, srcX, srcY, glyphs);
        };
        ext.QueryPictFormat(function(err2, formats) {
          if (err2)
            return callback2(err2);
          for (var i = 0; i < formats.formats.length; ++i) {
            var f = formats.formats[i];
            if (f[2] == 1 && f[10] == 1)
              ext.mono1 = f[0];
            if (f[2] == 24 && f[3] == 16 && f[5] == 8 && f[7] == 0)
              ext.rgb24 = f[0];
            if (f[2] == 32 && f[3] == 16 && f[4] == 255 && f[5] == 8 && f[6] == 255 && f[7] == 0 && f[9] == 24)
              ext.rgba32 = f[0];
            if (f[2] == 8 && f[10] == 255)
              ext.a8 = f[0];
          }
          callback2(null, ext);
        });
        [
          "PICTFORMAT argument does not name a defined PICTFORMAT",
          "PICTURE argument does not name a defined PICTURE",
          "PICTOP argument does not name a defined PICTOP",
          "GLYPHSET argument does not name a defined GLYPHSET",
          "GLYPH argument does not name a defined GLYPH in the glyphset"
        ].forEach(function(desc, code) {
          X.errorParsers[ext.firstError + code] = function(err2) {
            err2.message = "XRender: a value for a " + desc;
          };
        });
        ext.PictOp = {
          Minimum: 0,
          Clear: 0,
          Src: 1,
          Dst: 2,
          Over: 3,
          OverReverse: 4,
          In: 5,
          InReverse: 6,
          Out: 7,
          OutReverse: 8,
          Atop: 9,
          AtopReverse: 10,
          Xor: 11,
          Add: 12,
          Saturate: 13,
          Maximum: 13,
          /*,
           * Operators only available in version 0.2,
           */
          DisjointMinimum: 16,
          DisjointClear: 16,
          DisjointSrc: 17,
          DisjointDst: 18,
          DisjointOver: 19,
          DisjointOverReverse: 20,
          DisjointIn: 21,
          DisjointInReverse: 22,
          DisjointOut: 23,
          DisjointOutReverse: 24,
          DisjointAtop: 25,
          DisjointAtopReverse: 26,
          DisjointXor: 27,
          DisjointMaximum: 27,
          ConjointMinimum: 32,
          ConjointClear: 32,
          ConjointSrc: 33,
          ConjointDst: 34,
          ConjointOver: 35,
          ConjointOverReverse: 36,
          ConjointIn: 37,
          ConjointInReverse: 38,
          ConjointOut: 39,
          ConjointOutReverse: 40,
          ConjointAtop: 41,
          ConjointAtopReverse: 42,
          ConjointXor: 43,
          ConjointMaximum: 43,
          /*,
           * Operators only available in version 0.11,
           */
          BlendMinimum: 48,
          Multiply: 48,
          Screen: 49,
          Overlay: 50,
          Darken: 51,
          Lighten: 52,
          ColorDodge: 53,
          ColorBurn: 54,
          HardLight: 55,
          SoftLight: 56,
          Difference: 57,
          Exclusion: 58,
          HSLHue: 59,
          HSLSaturation: 60,
          HSLColor: 61,
          HSLLuminosity: 62,
          BlendMaximum: 62
        };
        ext.PolyEdge = {
          Sharp: 0,
          Smooth: 1
        };
        ext.PolyMode = {
          Precise: 0,
          Imprecise: 1
        };
        ext.Repeat = {
          None: 0,
          Normal: 1,
          Pad: 2,
          Reflect: 3
        };
        ext.Subpixel = {
          Unknown: 0,
          HorizontalRGB: 1,
          HorizontalBGR: 2,
          VerticalRGB: 3,
          VerticalBGR: 4,
          None: 5
        };
        ext.Filters = {
          Nearest: "nearest",
          Bilinear: "bilinear",
          Convolution: "convolution",
          Fast: "fast",
          Good: "good",
          Best: "best"
        };
      });
    };
  }
});

// node_modules/x11/lib/ext/screen-saver.js
var require_screen_saver = __commonJS({
  "node_modules/x11/lib/ext/screen-saver.js"(exports2) {
    var x11 = require_lib2();
    exports2.requireExt = function(display, callback2) {
      var X = display.client;
      X.QueryExtension("MIT-SCREEN-SAVER", function(err, ext) {
        if (!ext.present)
          return callback2(new Error("extension not available"));
        ext.QueryVersion = function(clientMaj, clientMin, cb) {
          X.seq_num++;
          X.pack_stream.pack("CCSCCxx", [ext.majorOpcode, 0, 2, clientMaj, clientMin]);
          X.replies[X.seq_num] = [
            function(buf, opt) {
              var res = buf.unpack("CC");
              return res;
            },
            cb
          ];
          X.pack_stream.flush();
        };
        ext.State = {
          Off: 0,
          On: 1,
          Disabled: 2
        };
        ext.Kind = {
          Blanked: 0,
          Internal: 1,
          External: 2
        };
        ext.QueryInfo = function(drawable, callback3) {
          X.seq_num++;
          X.pack_stream.pack("CCSL", [ext.majorOpcode, 1, 2, drawable]);
          X.replies[X.seq_num] = [
            function(buf, opt) {
              var info = {};
              info.state = opt;
              var res = buf.unpack("LLLLC");
              info.window = res[0];
              info.until = res[1];
              info.idle = res[2];
              info.eventMask = res[3];
              info.kind = res[4];
              return info;
            },
            callback3
          ];
          X.pack_stream.flush();
        };
        ext.eventMask = {
          Notify: 1,
          Cycle: 2
        };
        ext.SelectInput = function(drawable, eventMask) {
          X.seq_num++;
          console.log("CCSLL", [ext.majorOpcode, 2, 3, drawable, eventMask]);
          X.pack_stream.pack("CCSLL", [ext.majorOpcode, 2, 3, drawable, eventMask]);
          X.pack_stream.flush();
        };
        ext.QueryVersion(1, 1, function(err2, vers) {
          if (err2)
            return callback2(err2);
          ext.major = vers[0];
          ext.minor = vers[1];
          callback2(null, ext);
        });
        ext.events = {
          ScreenSaverNotify: 0
        };
        ext.NotifyState = {
          Off: 0,
          On: 1,
          Cycle: 2
        };
        X.eventParsers[ext.firstEvent + ext.events.ScreenSaverNotify] = function(type, seq, extra, code, raw) {
          var event = {};
          event.state = code;
          event.seq = seq;
          event.time = extra;
          var values = raw.unpack("LLCC");
          event.root = values[0];
          event.saverWindow = values[1];
          event.kind = values[2];
          event.forced = values[1];
          event.name = "ScreenSaverNotify";
          return event;
        };
      });
    };
  }
});

// node_modules/x11/lib/ext/shape.js
var require_shape = __commonJS({
  "node_modules/x11/lib/ext/shape.js"(exports2) {
    var x11 = require_lib2();
    exports2.requireExt = function(display, callback2) {
      function captureStack() {
        var err = new Error();
        Error.captureStackTrace(err, arguments.callee);
        display.client.seq2stack[display.client.seq_num] = err.stack;
      }
      var X = display.client;
      X.QueryExtension("SHAPE", function(err, ext) {
        if (!ext.present)
          return callback2(new Error("extension not available"));
        ext.Kind = {
          Bounding: 0,
          Clip: 1,
          Input: 2
        };
        ext.Op = {
          Set: 0,
          Union: 1,
          Intersect: 2,
          Subtract: 3,
          Invert: 4
        };
        ext.Ordering = {
          Unsorted: 0,
          YSorted: 1,
          YXSorted: 2,
          YXBanded: 3
        };
        ext.QueryVersion = function(cb) {
          X.seq_num++;
          X.pack_stream.pack("CCSLL", [ext.majorOpcode, 0, 1]);
          X.replies[X.seq_num] = [
            function(buf, opt) {
              var res = buf.unpack("SS");
              return res;
            },
            cb
          ];
          X.pack_stream.flush();
        };
        ext.Rectangles = function(op, kind, window, x, y, rectangles, ordering) {
          if (ordering === void 0)
            ordering = ext.Ordering.Unsorted;
          var length = 4 + rectangles.length * 2;
          X.seq_num++;
          X.pack_stream.pack("CCSCCCxLss", [ext.majorOpcode, 1, length, op, kind, ordering, window, x, y]);
          for (var i = 0; i < rectangles.length; ++i) {
            var r = rectangles[i];
            X.pack_stream.pack("ssSS", r);
          }
          X.pack_stream.flush();
        };
        ext.Mask = function(op, kind, window, x, y, bitmap) {
          X.seq_num++;
          X.pack_stream.pack("CCSCCxxLssL", [ext.majorOpcode, 2, 5, op, kind, window, x, y, bitmap]);
          X.pack_stream.flush();
        };
        ext.SelectInput = function(window, enable) {
          X.seq_num++;
          X.pack_stream.pack("CCSLCxxx", [ext.majorOpcode, 6, 3, window, enable]);
          X.pack_stream.flush();
        };
        ext.InputSelected = function(window, cb) {
          X.seq_num++;
          X.pack_stream.pack("CCSL", [ext.majorOpcode, 7, 2, window]);
          X.replies[X.seq_num] = [
            function(buf, opt) {
              return opt;
            },
            cb
          ];
          X.pack_stream.flush();
        };
        callback2(null, ext);
        ext.events = {
          ShapeNotify: 0
        };
        X.eventParsers[ext.firstEvent + ext.events.ShapeNotify] = function(type, seq, extra, code, raw) {
          var event = {};
          event.type = type;
          event.kind = code;
          event.seq = seq;
          event.window = extra;
          var values = raw.unpack("ssSSLC");
          event.x = values[0];
          event.y = values[1];
          event.width = values[2];
          event.height = values[3];
          event.time = values[4];
          event.shaped = values[5];
          event.name = "ShapeNotify";
          return event;
        };
      });
    };
  }
});

// node_modules/x11/lib/ext/xc-misc.js
var require_xc_misc = __commonJS({
  "node_modules/x11/lib/ext/xc-misc.js"(exports2) {
    var x11 = require_lib2();
    exports2.requireExt = function(display, callback2) {
      var X = display.client;
      X.QueryExtension("XC-MISC", function(err, ext) {
        if (!ext.present)
          return callback2(new Error("extension not available"));
        ext.QueryVersion = function(clientMaj, clientMin, cb) {
          X.seq_num++;
          X.pack_stream.pack("CCSSS", [ext.majorOpcode, 0, 2, clientMaj, clientMin]);
          X.replies[X.seq_num] = [
            function(buf, opt) {
              var res = buf.unpack("SS");
              return res;
            },
            cb
          ];
          X.pack_stream.flush();
        };
        ext.GetXIDRange = function(cb) {
          X.seq_num++;
          X.pack_stream.pack("CCS", [ext.majorOpcode, 1, 1]);
          X.replies[X.seq_num] = [
            function(buf, opt) {
              var res = buf.unpack("LL");
              return {
                startId: res[0],
                count: res[1]
              };
            },
            cb
          ];
          X.pack_stream.flush();
        };
        ext.GetXIDList = function(count, cb) {
          X.seq_num++;
          X.pack_stream.pack("CCSL", [ext.majorOpcode, 2, 2, count]);
          X.replies[X.seq_num] = [
            function(buf, opt) {
              var numIds = buf.unpack("L")[0];
              var res = [];
              for (var i = 0; i < numIds; ++i)
                res.push(buf.unpack("L", 24 + i * 4));
              return res;
            },
            cb
          ];
          X.pack_stream.flush();
        };
        ext.QueryVersion(1, 1, function(err2, vers) {
          if (err2)
            return callback2(err2);
          ext.major = vers[0];
          ext.minor = vers[1];
          callback2(null, ext);
        });
      });
    };
  }
});

// node_modules/x11/lib/ext/xtest.js
var require_xtest = __commonJS({
  "node_modules/x11/lib/ext/xtest.js"(exports2) {
    var x11 = require_lib2();
    exports2.requireExt = function(display, callback2) {
      var X = display.client;
      X.QueryExtension("XTEST", function(err, ext) {
        if (!ext.present)
          return callback2(new Error("extension not available"));
        ext.GetVersion = function(clientMaj, clientMin, callback3) {
          X.seq_num++;
          X.pack_stream.pack("CCSCxS", [ext.majorOpcode, 0, 2, clientMaj, clientMin]);
          X.replies[X.seq_num] = [
            function(buf, opt) {
              var res = buf.unpack("S");
              return [opt, res[0]];
            },
            callback3
          ];
          X.pack_stream.flush();
        };
        ext.KeyPress = 2;
        ext.KeyRelease = 3;
        ext.ButtonPress = 4;
        ext.ButtonRelease = 5;
        ext.MotionNotify = 6;
        ext.FakeInput = function(type, keycode, time, wid, x, y) {
          X.seq_num++;
          X.pack_stream.pack("CCSCCxxLLxxxxxxxxssxxxxxxxx", [ext.majorOpcode, 2, 9, type, keycode, time, wid, x, y]);
          X.pack_stream.flush();
        };
        callback2(null, ext);
      });
    };
  }
});

// require("./ext/**/*") in node_modules/x11/lib/xcore.js
var globRequire_ext;
var init_ = __esm({
  'require("./ext/**/*") in node_modules/x11/lib/xcore.js'() {
    globRequire_ext = __glob({
      "./ext/apple-wm.js": () => require_apple_wm(),
      "./ext/big-requests.js": () => require_big_requests(),
      "./ext/composite.js": () => require_composite(),
      "./ext/damage.js": () => require_damage(),
      "./ext/dpms.js": () => require_dpms(),
      "./ext/fixes.js": () => require_fixes(),
      "./ext/glx.js": () => require_glx(),
      "./ext/glxconstants.js": () => require_glxconstants(),
      "./ext/glxrender.js": () => require_glxrender(),
      "./ext/randr.js": () => require_randr(),
      "./ext/render.js": () => require_render(),
      "./ext/screen-saver.js": () => require_screen_saver(),
      "./ext/shape.js": () => require_shape(),
      "./ext/xc-misc.js": () => require_xc_misc(),
      "./ext/xtest.js": () => require_xtest()
    });
  }
});

// node_modules/x11/lib/unpackbuffer.js
var require_unpackbuffer = __commonJS({
  "node_modules/x11/lib/unpackbuffer.js"(exports2, module2) {
    var argument_length = {};
    argument_length.C = 1;
    argument_length.S = 2;
    argument_length.s = 2;
    argument_length.L = 4;
    argument_length.x = 1;
    module2.exports.addUnpack = function(Buffer2) {
      Buffer2.prototype.unpack = function(format2, offset) {
        if (!offset)
          offset = 0;
        var data = [];
        var current_arg = 0;
        while (current_arg < format2.length) {
          var arg = format2[current_arg];
          switch (arg) {
            case "C":
              data.push(this.readUInt8(offset++));
              break;
            case "c":
              data.push(this.readInt8(offset++));
              break;
            case "S":
              data.push(this.readUInt16LE(offset));
              offset += 2;
              break;
            case "s":
              data.push(this.readInt16LE(offset));
              offset += 2;
              break;
            case "n":
              data.push(this.readUInt16BE(offset));
              offset += 2;
              break;
            case "L":
              data.push(this.readUInt32LE(offset));
              offset += 4;
              break;
            case "l":
              data.push(this.readInt32LE(offset));
              offset += 4;
              break;
            case "x":
              offset++;
              break;
          }
          current_arg++;
        }
        return data;
      };
      Buffer2.prototype.unpackString = function(n, offset) {
        var res = "";
        var end = offset + n;
        while (offset < end)
          res += String.fromCharCode(this[offset++]);
        return res;
      };
    };
  }
});

// node_modules/os-homedir/index.js
var require_os_homedir = __commonJS({
  "node_modules/os-homedir/index.js"(exports2, module2) {
    "use strict";
    var os2 = require("os");
    function homedir() {
      var env = process.env;
      var home = env.HOME;
      var user = env.LOGNAME || env.USER || env.LNAME || env.USERNAME;
      if (process.platform === "win32") {
        return env.USERPROFILE || env.HOMEDRIVE + env.HOMEPATH || home || null;
      }
      if (process.platform === "darwin") {
        return home || (user ? "/Users/" + user : null);
      }
      if (process.platform === "linux") {
        return home || (process.getuid() === 0 ? "/root" : user ? "/home/" + user : null);
      }
      return home || null;
    }
    module2.exports = typeof os2.homedir === "function" ? os2.homedir : homedir;
  }
});

// node_modules/x11/lib/auth.js
var require_auth = __commonJS({
  "node_modules/x11/lib/auth.js"(exports2, module2) {
    var fs = require("fs");
    var Buffer2 = require("buffer").Buffer;
    require_unpackbuffer().addUnpack(Buffer2);
    var typeToName = {
      256: "Local",
      65535: "Wild",
      254: "Netname",
      253: "Krb5Principal",
      252: "LocalHost",
      0: "Internet",
      1: "DECnet",
      2: "Chaos",
      5: "ServerInterpreted",
      6: "Internet6"
    };
    function parseXauth(buf) {
      var offset = 0;
      var auth = [];
      var cookieProperties = ["address", "display", "authName", "authData"];
      while (offset < buf.length) {
        var cookie = {};
        cookie.type = buf.readUInt16BE(offset);
        if (!typeToName[cookie.type]) {
          console.warn("Unknown address type");
        }
        offset += 2;
        cookieProperties.forEach(function(property) {
          var length = buf.unpack("n", offset)[0];
          offset += 2;
          if (cookie.type === 0 && property == "address") {
            cookie.address = [buf[offset], buf[offset + 1], buf[offset + 2], buf[offset + 3]].map(function(octet) {
              return octet.toString(10);
            }).join(".");
          } else {
            cookie[property] = buf.unpackString(length, offset);
          }
          offset += length;
        });
        auth.push(cookie);
      }
      return auth;
    }
    var homedir = require_os_homedir();
    var path = require("path");
    function readXauthority(cb) {
      var filename = process.env.XAUTHORITY || path.join(homedir(), ".Xauthority");
      fs.readFile(filename, function(err, data) {
        if (!err)
          return cb(null, data);
        if (err.code == "ENOENT") {
          filename = process.env.XAUTHORITY || path.join(homedir(), "Xauthority");
          fs.readFile(filename, function(err2, data2) {
            if (err2.code == "ENOENT") {
              cb(null, null);
            } else {
              cb(err2);
            }
          });
        } else {
          cb(err);
        }
      });
    }
    module2.exports = function(display, host, socketFamily, cb) {
      var family;
      if (socketFamily === "IPv4") {
        family = 0;
      } else if (socketFamily === "IPv6") {
        family = 6;
      } else {
        family = 256;
      }
      readXauthority(function(err, data) {
        if (err)
          return cb(err);
        if (!data) {
          return cb(null, {
            authName: "",
            authData: ""
          });
        }
        var auth = parseXauth(data);
        for (var cookieNum in auth) {
          var cookie = auth[cookieNum];
          if ((typeToName[cookie.family] === "Wild" || cookie.type === family && cookie.address === host) && (cookie.display.length === 0 || cookie.display === display))
            return cb(null, cookie);
        }
        cb(null, {
          authName: "",
          authData: ""
        });
      });
    };
  }
});

// node_modules/x11/lib/handshake.js
var require_handshake2 = __commonJS({
  "node_modules/x11/lib/handshake.js"(exports2, module2) {
    var getAuthString = require_auth();
    var xutil = require_xutil();
    function readVisuals(bl, visuals, n_visuals, cb) {
      if (n_visuals == 0) {
        cb();
        return;
      }
      var visual = {};
      bl.unpackTo(
        visual,
        [
          "L vid",
          "C class",
          "C bits_per_rgb",
          "S map_ent",
          "L red_mask",
          "L green_mask",
          "L blue_mask",
          "xxxx"
        ],
        function() {
          var vid = visual.vid;
          visuals[visual.vid] = visual;
          if (Object.keys(visuals).length == n_visuals)
            cb();
          else
            readVisuals(bl, visuals, n_visuals, cb);
        }
      );
    }
    function readScreens(bl, display, cbDisplayReady) {
      var numParsedDepths = 0;
      var readDepths = function(bl2, display2, depths, n_depths, cb) {
        if (n_depths == 0) {
          cb();
          return;
        }
        bl2.unpack("CxSxxxx", function(res) {
          var dep = res[0];
          var n_visuals = res[1];
          var visuals = {};
          readVisuals(bl2, visuals, n_visuals, function() {
            if (dep in depths) {
              for (var visual in visuals) {
                depths[dep][visual] = visuals[visual];
              }
            } else {
              depths[dep] = visuals;
            }
            numParsedDepths++;
            if (numParsedDepths == n_depths)
              cb();
            else
              readDepths(bl2, display2, depths, n_depths, cb);
          });
        });
      };
      {
        var scr = {};
        bl.unpackTo(
          scr,
          [
            "L root",
            "L default_colormap",
            "L white_pixel",
            "L black_pixel",
            "L input_masks",
            "S pixel_width",
            "S pixel_height",
            "S mm_width",
            "S mm_height",
            "S min_installed_maps",
            "S max_installed_maps",
            "L root_visual",
            "C root_depth",
            "C backing_stores",
            "C root_depth",
            "C num_depths"
          ],
          function() {
            var depths = {};
            readDepths(bl, display, depths, scr.num_depths, function() {
              scr.depths = depths;
              delete scr.num_depths;
              display.screen.push(scr);
              if (display.screen.length == display.screen_num) {
                delete display.screen_num;
                cbDisplayReady(null, display);
                return;
              } else {
                readScreens(bl, display, cbDisplayReady);
              }
            });
          }
        );
      }
    }
    function readServerHello(bl, cb) {
      bl.unpack("C", function(res) {
        if (res[0] == 0) {
          bl.unpack("Cxxxxxx", function(rlen) {
            bl.get(rlen[0], function(reason) {
              var err = new Error();
              err.message = "X server connection failed: " + reason.toString();
              cb(err);
            });
          });
          return;
        }
        var display = {};
        bl.unpackTo(
          display,
          [
            "x",
            "S major",
            "S minor",
            "S xlen",
            "L release",
            "L resource_base",
            "L resource_mask",
            "L motion_buffer_size",
            "S vlen",
            "S max_request_length",
            "C screen_num",
            "C format_num",
            "C image_byte_order",
            "C bitmap_bit_order",
            "C bitmap_scanline_unit",
            "C bitmap_scanline_pad",
            "C min_keycode",
            "C max_keycode",
            "xxxx"
          ],
          function() {
            var pvlen = xutil.padded_length(display.vlen);
            var mask = display.resource_mask;
            display.rsrc_shift = 0;
            while (!(mask >> display.rsrc_shift & 1))
              display.rsrc_shift++;
            display.rsrc_id = 0;
            bl.get(pvlen, function(vendor) {
              display.vendor = vendor.toString().substr(0, display.vlen);
              display.format = {};
              for (var i = 0; i < display.format_num; ++i) {
                bl.unpack("CCCxxxxx", function(fmt) {
                  var depth = fmt[0];
                  display.format[depth] = {};
                  display.format[depth].bits_per_pixel = fmt[1];
                  display.format[depth].scanline_pad = fmt[2];
                  if (Object.keys(display.format).length == display.format_num) {
                    delete display.format_num;
                    display.screen = [];
                    readScreens(bl, display, cb);
                  }
                });
              }
            });
          }
        );
      });
    }
    function getByteOrder() {
      var isLittleEndian = new Uint32Array(new Uint8Array([1, 2, 3, 4]).buffer)[0] === 67305985;
      if (isLittleEndian) {
        return "l".charCodeAt(0);
      } else {
        return "B".charCodeAt(0);
      }
    }
    function writeClientHello(stream, displayNum, authHost, authFamily) {
      getAuthString(displayNum, authHost, authFamily, function(err, cookie) {
        if (err) {
          throw err;
        }
        var byte_order = getByteOrder();
        var protocol_major = 11;
        var protocol_minor = 0;
        stream.pack(
          "CxSSSSxxpp",
          [
            byte_order,
            protocol_major,
            protocol_minor,
            cookie.authName.length,
            cookie.authData.length,
            cookie.authName,
            cookie.authData
          ]
        );
        stream.flush();
      });
    }
    module2.exports.readServerHello = readServerHello;
    module2.exports.writeClientHello = writeClientHello;
  }
});

// node_modules/x11/lib/unpackstream.js
var require_unpackstream = __commonJS({
  "node_modules/x11/lib/unpackstream.js"(exports2, module2) {
    var Buffer2 = require("buffer").Buffer;
    var EventEmitter = require("events").EventEmitter;
    var util = require("util");
    var xutil = require_xutil();
    var argument_length = {};
    argument_length.C = 1;
    argument_length.S = 2;
    argument_length.s = 2;
    argument_length.L = 4;
    argument_length.l = 4;
    argument_length.x = 1;
    function ReadFormatRequest(format2, callback2) {
      this.format = format2;
      this.current_arg = 0;
      this.data = [];
      this.callback = callback2;
    }
    function ReadFixedRequest(length, callback2) {
      this.length = length;
      this.callback = callback2;
      this.data = new Buffer2(length);
      this.received_bytes = 0;
    }
    ReadFixedRequest.prototype.execute = function(bufferlist, aa, bb, cc, dd) {
      var to_receive = this.length - this.received_bytes;
      for (var i = 0; i < to_receive; ++i) {
        if (bufferlist.length == 0)
          return false;
        this.data[this.received_bytes++] = bufferlist.getbyte();
      }
      this.callback(this.data);
      return true;
    };
    ReadFormatRequest.prototype.execute = function(bufferlist, tag1, tag2) {
      while (this.current_arg < this.format.length) {
        var arg = this.format[this.current_arg];
        if (bufferlist.length < argument_length[arg])
          return false;
        switch (arg) {
          case "C":
            this.data.push(bufferlist.getbyte());
            break;
          case "S":
          case "s":
            var b1 = bufferlist.getbyte();
            var b2 = bufferlist.getbyte();
            this.data.push(b2 * 256 + b1);
            break;
          case "l":
          case "L":
            var b1 = bufferlist.getbyte();
            var b2 = bufferlist.getbyte();
            var b3 = bufferlist.getbyte();
            var b4 = bufferlist.getbyte();
            this.data.push(((b4 * 256 + b3) * 256 + b2) * 256 + b1);
            break;
          case "x":
            bufferlist.getbyte();
            break;
        }
        this.current_arg++;
      }
      this.callback(this.data);
      return true;
    };
    function UnpackStream() {
      EventEmitter.call(this);
      this.readlist = [];
      this.length = 0;
      this.offset = 0;
      this.read_queue = [];
      this.write_queue = [];
      this.write_length = 0;
    }
    util.inherits(UnpackStream, EventEmitter);
    UnpackStream.prototype.write = function(buf) {
      this.readlist.push(buf);
      this.length += buf.length;
      this.resume();
    };
    UnpackStream.prototype.pipe = function(stream) {
      this.on("data", function(data) {
        stream.write(data);
      });
    };
    UnpackStream.prototype.unpack = function(format2, callback2) {
      this.read_queue.push(new ReadFormatRequest(format2, callback2));
      this.resume();
    };
    UnpackStream.prototype.unpackTo = function(destination, names_formats, callback2) {
      var names = [];
      var format2 = "";
      for (var i = 0; i < names_formats.length; ++i) {
        var off = 0;
        while (off < names_formats[i].length && names_formats[i][off] == "x") {
          format2 += "x";
          off++;
        }
        if (off < names_formats[i].length) {
          format2 += names_formats[i][off];
          var name = names_formats[i].substr(off + 2);
          names.push(name);
        }
      }
      this.unpack(format2, function(data) {
        if (data.length != names.length)
          throw "Number of arguments mismatch, " + names.length + " fields and " + data.length + " arguments";
        for (var fld = 0; fld < data.length; ++fld) {
          destination[names[fld]] = data[fld];
        }
        callback2(destination);
      });
    };
    UnpackStream.prototype.get = function(length, callback2) {
      this.read_queue.push(new ReadFixedRequest(length, callback2));
      this.resume();
    };
    UnpackStream.prototype.resume = function() {
      if (this.resumed)
        return;
      this.resumed = true;
      while (this.read_queue[0].execute(this)) {
        this.read_queue.shift();
        if (this.read_queue.length == 0)
          return;
      }
      this.resumed = false;
    };
    UnpackStream.prototype.getbyte = function() {
      var res = 0;
      var b = this.readlist[0];
      if (this.offset + 1 < b.length) {
        res = b[this.offset];
        this.offset++;
        this.length--;
      } else {
        res = b[this.offset];
        this.readlist.shift();
        this.length--;
        this.offset = 0;
      }
      return res;
    };
    UnpackStream.prototype.pack = function(format2, args) {
      var packetlength = 0;
      var arg = 0;
      for (var i = 0; i < format2.length; ++i) {
        var f = format2[i];
        if (f == "x") {
          packetlength++;
        } else if (f == "p") {
          packetlength += xutil.padded_length(args[arg++].length);
        } else if (f == "a") {
          packetlength += args[arg].length;
          arg++;
        } else {
          packetlength += argument_length[f];
          arg++;
        }
      }
      var buf = new Buffer2(packetlength);
      var offset = 0;
      var arg = 0;
      for (var i = 0; i < format2.length; ++i) {
        switch (format2[i]) {
          case "x":
            buf[offset++] = 0;
            break;
          case "C":
            var n = args[arg++];
            buf[offset++] = n;
            break;
          case "s":
            var n = args[arg++];
            buf.writeInt16LE(n, offset);
            offset += 2;
            break;
          case "S":
            var n = args[arg++];
            buf[offset++] = n & 255;
            buf[offset++] = n >> 8 & 255;
            break;
          case "l":
            var n = args[arg++];
            buf.writeInt32LE(n, offset);
            offset += 4;
            break;
          case "L":
            var n = args[arg++];
            buf[offset++] = n & 255;
            buf[offset++] = n >> 8 & 255;
            buf[offset++] = n >> 16 & 255;
            buf[offset++] = n >> 24 & 255;
            break;
          case "a":
            var str = args[arg++];
            if (Buffer2.isBuffer(str)) {
              str.copy(buf, offset);
              offset += str.length;
            } else {
              for (var c = 0; c < str.length; ++c)
                buf[offset++] = str.charCodeAt(c);
            }
            break;
          case "p":
            var str = args[arg++];
            var len = xutil.padded_length(str.length);
            var c = 0;
            for (; c < str.length; ++c)
              buf[offset++] = str.charCodeAt(c);
            for (; c < len; ++c)
              buf[offset++] = 0;
            break;
        }
      }
      this.write_queue.push(buf);
      this.write_length += buf.length;
      return this;
    };
    UnpackStream.prototype.flush = function(stream) {
      for (var i = 0; i < this.write_queue.length; ++i) {
        this.emit("data", this.write_queue[i]);
      }
      this.write_queue = [];
      this.write_length = 0;
    };
    module2.exports = UnpackStream;
  }
});

// node_modules/x11/lib/hexy.js
var require_hexy = __commonJS({
  "node_modules/x11/lib/hexy.js"(exports2) {
    var hexy = function(buffer, config) {
      config = config || {};
      var h = new Hexy(buffer, config);
      return h.toString();
    };
    var Hexy = function(buffer, config) {
      var self = this;
      self.buffer = buffer;
      self.width = config.width || 16;
      self.numbering = config.numbering == "none" ? "none" : "hex_bytes";
      self.groupSpacing = config.groupSpacing || 0;
      switch (config.format) {
        case "none":
        case "twos":
          self.format = config.format;
          break;
        default:
          self.format = "fours";
      }
      self.caps = config.caps == "upper" ? "upper" : "lower";
      self.annotate = config.annotate == "none" ? "none" : "ascii";
      self.prefix = config.prefix || "";
      self.indent = config.indent || 0;
      for (var i = 0; i != self.indent; ++i) {
        self.prefix = " " + prefix;
      }
      var pos = 0;
      this.toString = function() {
        var str = "";
        var line_arr = lines();
        for (var i2 = 0; i2 != line_arr.length; ++i2) {
          var hex_raw = line_arr[i2], hex = hex_raw[0], raw = hex_raw[1];
          var howMany = hex.length;
          if (self.format === "fours") {
            howMany = 4;
          } else if (self.format === "twos") {
            howMany = 2;
          }
          var hex_formatted = "";
          var middle = Math.floor(self.width / 2) - 1;
          var groupSpaces = new Array(self.groupSpacing + 1).join(" ");
          for (var j = 0; j < hex.length; j += howMany) {
            var s = hex.substr(j, howMany);
            hex_formatted += s + (j / 2 === middle && self.groupSpacing > 0 ? groupSpaces : " ");
          }
          str += self.prefix;
          if (self.numbering === "hex_bytes") {
            str += pad(i2 * self.width, 8);
            str += ": ";
          }
          var padlen = 0;
          switch (self.format) {
            case "fours":
              padlen = self.width * 2 + self.width / 2;
              break;
            case "twos":
              padlen = self.width * 3 + 2;
              break;
            default:
              padlen = self * 2;
          }
          str += rpad(hex_formatted, padlen);
          if (self.annotate === "ascii") {
            str += " ";
            str += raw.replace(/[\000-\040\177-\377]/g, ".");
          }
          str += "\n";
        }
        return str;
      };
      var lines = function() {
        var hex_raw = [];
        for (var i2 = 0; i2 < self.buffer.length; i2 += self.width) {
          var begin = i2, end = i2 + self.width >= buffer.length ? buffer.length : i2 + self.width, slice = buffer.slice(begin, end), hex = self.caps === "upper" ? hexu(slice) : hexl(slice), raw = slice.toString("ascii");
          hex_raw.push([hex, raw]);
        }
        return hex_raw;
      };
      var hexl = function(buffer2) {
        var str = "";
        for (var i2 = 0; i2 != buffer2.length; ++i2) {
          str += pad(buffer2[i2], 2);
        }
        return str;
      };
      var hexu = function(buffer2) {
        return hexl(buffer2).toUpperCase();
      };
      var pad = function(b, len) {
        var s = b.toString(16);
        while (s.length < len) {
          s = "0" + s;
        }
        return s;
      };
      var rpad = function(s, len) {
        while (s.length < len) {
          s += " ";
        }
        return s;
      };
    };
    exports2.hexy = hexy;
  }
});

// node_modules/x11/lib/xerrors.js
var require_xerrors = __commonJS({
  "node_modules/x11/lib/xerrors.js"(exports2, module2) {
    module2.exports.errorText = {
      1: "Bad request",
      2: "Bad param value",
      3: "Bad window",
      4: "Bad pixmap",
      5: "Bad atom",
      6: "Bad cursor",
      7: "Bad font",
      8: "Bad match",
      9: "Bad drawable",
      10: "Bad access",
      11: "Bad alloc",
      12: "Bad colormap",
      13: "Bad GContext",
      14: "Bad ID choice",
      15: "Bad name",
      16: "Bad length",
      17: "Bad implementation"
    };
  }
});

// node_modules/x11/lib/corereqs.js
var require_corereqs = __commonJS({
  "node_modules/x11/lib/corereqs.js"(exports2, module2) {
    var xutil = require_xutil();
    var hexy = require_hexy().hexy;
    var valueMask = {
      CreateWindow: {
        backgroundPixmap: {
          mask: 1,
          format: "L"
        },
        backgroundPixel: {
          mask: 2,
          format: "L"
        },
        borderPixmap: {
          mask: 4,
          format: "L"
        },
        borderPixel: {
          mask: 8,
          format: "L"
        },
        bitGravity: {
          mask: 16,
          format: "Cxxx"
        },
        winGravity: {
          mask: 32,
          format: "Cxxx"
        },
        backingStore: {
          mask: 64,
          format: "Cxxx"
        },
        backingPlanes: {
          mask: 128,
          format: "L"
        },
        backingPixel: {
          mask: 256,
          format: "L"
        },
        overrideRedirect: {
          mask: 512,
          format: "Cxxx"
        },
        saveUnder: {
          mask: 1024,
          format: "Cxxx"
        },
        eventMask: {
          mask: 2048,
          format: "L"
        },
        doNotPropagateMask: {
          mask: 4096,
          format: "L"
        },
        colormap: {
          mask: 8192,
          format: "L"
        },
        cursor: {
          mask: 16384,
          format: "L"
        }
      },
      CreateGC: {
        "function": {
          // TODO: alias? _function?
          mask: 1,
          format: "Cxxx"
        },
        planeMask: {
          mask: 2,
          format: "L"
        },
        foreground: {
          mask: 4,
          format: "L"
        },
        background: {
          mask: 8,
          format: "L"
        },
        lineWidth: {
          mask: 16,
          format: "Sxx"
        },
        lineStyle: {
          mask: 32,
          format: "Cxxx"
        },
        capStyle: {
          mask: 64,
          format: "Cxxx"
        },
        joinStyle: {
          mask: 128,
          format: "Cxxx"
        },
        fillStyle: {
          mask: 256,
          format: "Cxxx"
        },
        fillRule: {
          mask: 512,
          format: "Cxxx"
        },
        tile: {
          mask: 1024,
          format: "L"
        },
        stipple: {
          mask: 2048,
          format: "L"
        },
        tileStippleXOrigin: {
          mask: 4096,
          format: "sxx"
        },
        tileStippleYOrigin: {
          mask: 8192,
          format: "sxx"
        },
        font: {
          mask: 16384,
          format: "L"
        },
        subwindowMode: {
          mask: 32768,
          format: "Cxxx"
        },
        graphicsExposures: {
          mask: 65536,
          format: "Cxxx"
        },
        clipXOrigin: {
          mask: 131072,
          format: "Sxx"
        },
        clipYOrigin: {
          mask: 262144,
          format: "Sxx"
        },
        clipMask: {
          mask: 524288,
          format: "L"
        },
        dashOffset: {
          mask: 1048576,
          format: "Sxx"
        },
        dashes: {
          mask: 2097152,
          format: "Cxxx"
        },
        arcMode: {
          mask: 4194304,
          format: "Cxxx"
        }
      },
      ConfigureWindow: {
        x: {
          mask: 1,
          format: "sxx"
        },
        y: {
          mask: 2,
          format: "sxx"
        },
        width: {
          mask: 4,
          format: "Sxx"
        },
        height: {
          mask: 8,
          format: "Sxx"
        },
        borderWidth: {
          mask: 16,
          format: "Sxx"
        },
        sibling: {
          mask: 32,
          format: "L"
        },
        stackMode: {
          mask: 64,
          format: "Cxxx"
        }
      }
    };
    var valueMaskName = {};
    for (req in valueMask) {
      masks = valueMask[req];
      names = valueMaskName[req] = {};
      for (m in masks)
        names[masks[m].mask] = m;
    }
    var masks;
    var names;
    var m;
    var req;
    function packValueMask(reqname, values) {
      var bitmask = 0;
      var masksList = [];
      var format2 = "";
      var reqValueMask = valueMask[reqname];
      var reqValueMaskName = valueMaskName[reqname];
      if (!reqValueMask)
        throw new Error(reqname + ": no value mask description");
      for (var value in values) {
        var v = reqValueMask[value];
        if (v) {
          var valueBit = v.mask;
          if (!valueBit)
            throw new Error(reqname + ": incorrect value param " + value);
          masksList.push(valueBit);
          bitmask |= valueBit;
        }
      }
      masksList.sort(function(a, b) {
        return a - b;
      });
      var args = [];
      for (m in masksList) {
        var valueName = reqValueMaskName[masksList[m]];
        format2 += reqValueMask[valueName].format;
        args.push(values[valueName]);
      }
      return [format2, bitmask, args];
    }
    var templates = {
      CreateWindow: [
        // create request packet - function OR format string
        function(id, parentId, x, y, width, height, borderWidth, depth, _class, visual, values) {
          if (borderWidth === void 0)
            borderWidth = 0;
          if (depth === void 0)
            depth = 0;
          if (_class === void 0)
            _class = 0;
          if (visual === void 0)
            visual = 0;
          if (values === void 0)
            values = {};
          var format2 = "CCSLLssSSSSLL";
          var vals = packValueMask("CreateWindow", values);
          var packetLength = 8 + (values ? vals[2].length : 0);
          var args = [1, depth, packetLength, id, parentId, x, y, width, height, borderWidth, _class, visual];
          format2 += vals[0];
          args.push(vals[1]);
          args = args.concat(vals[2]);
          return [format2, args];
        }
      ],
      ChangeWindowAttributes: [
        function(wid, values) {
          var format2 = "CxSLSxx";
          var vals = packValueMask("CreateWindow", values);
          var packetLength = 3 + (values ? vals[2].length : 0);
          var args = [2, packetLength, wid, vals[1]];
          var valArr = vals[2];
          format2 += vals[0];
          args = args.concat(valArr);
          return [format2, args];
        }
      ],
      GetWindowAttributes: [
        ["CxSL", [3, 2]],
        function(buf, backingStore) {
          var res = buf.unpack("LSCCLLCCCCLLLS");
          var ret = {
            backingStore
          };
          "visual klass bitGravity winGravity backingPlanes backingPixel saveUnder mapIsInstalled mapState overrideRedirect colormap allEventMasks myEventMasks doNotPropogateMask".split(" ").forEach(function(field, index) {
            ret[field] = res[index];
          });
          return ret;
        }
      ],
      DestroyWindow: [
        ["CxSL", [4, 2]]
      ],
      ChangeSaveSet: [
        function(isInsert, wid) {
          return ["CCSL", [6, isInsert ? 0 : 1, 2, wid]];
        }
      ],
      // wid, newParentId, x, y
      ReparentWindow: [
        ["CxSLLss", [7, 4]]
      ],
      MapWindow: [
        // 8 - opcode, 2 - length, wid added as parameter
        ["CxSL", [8, 2]]
      ],
      UnmapWindow: [
        ["CxSL", [10, 2]]
      ],
      ConfigureWindow: [
        /*
         * options : {
         *     x : x_value,
         *     y : y_value,
         *     width : width_value,
         *     height : height_value,
         *     borderWidth : borderWidth_value,
         *     sibling : sibling_value
         * }
         */
        function(win, options) {
          var vals = packValueMask("ConfigureWindow", options);
          var format2 = "CxSLSxx" + vals[0];
          var args = [12, vals[2].length + 3, win, vals[1]];
          args = args.concat(vals[2]);
          return [format2, args];
        }
      ],
      ResizeWindow: [
        function(win, width, height) {
          return module2.exports.ConfigureWindow[0](win, { width, height });
        }
      ],
      MoveWindow: [
        function(win, x, y) {
          return module2.exports.ConfigureWindow[0](win, { x, y });
        }
      ],
      MoveResizeWindow: [
        function(win, x, y, width, height) {
          return module2.exports.ConfigureWindow[0](win, { x, y, width, height });
        }
      ],
      RaiseWindow: [
        function(win) {
          return module2.exports.ConfigureWindow[0](win, { stackMode: 0 });
        }
      ],
      LowerWindow: [
        function(win) {
          return module2.exports.ConfigureWindow[0](win, { stackMode: 1 });
        }
      ],
      QueryTree: [
        ["CxSL", [15, 2]],
        function(buf) {
          var tree = {};
          var res = buf.unpack("LLS");
          tree.root = res[0];
          tree.parent = res[1];
          tree.children = [];
          for (var i = 0; i < res[2]; ++i)
            tree.children.push(buf.unpack("L", 24 + i * 4)[0]);
          return tree;
        }
      ],
      // opcode 16
      InternAtom: [
        function(returnOnlyIfExist, value) {
          var padded = xutil.padded_string(value);
          return ["CCSSxxa", [16, returnOnlyIfExist ? 1 : 0, 2 + padded.length / 4, value.length, padded]];
        },
        function(buf, seq_num) {
          var res = buf.unpack("L")[0];
          var pending_atom = this.pending_atoms[seq_num];
          if (!this.atoms[pending_atom]) {
            this.atoms[pending_atom] = res;
            this.atom_names[res] = pending_atom;
          }
          delete this.pending_atoms[seq_num];
          return res;
        }
      ],
      GetAtomName: [
        ["CxSL", [17, 2]],
        function(buf, seq_num) {
          var nameLen = buf.unpack("S")[0];
          var name = buf.unpackString(nameLen, 24);
          var pending_atom = this.pending_atoms[seq_num];
          if (!this.atoms[pending_atom]) {
            this.atom_names[pending_atom] = name;
            this.atoms[name] = pending_atom;
          }
          delete this.pending_atoms[seq_num];
          return name;
        }
      ],
      ChangeProperty: [
        // mode: 0 replace, 1 prepend, 2 append
        // format: 8/16/32
        function(mode, wid, name, type, units, data) {
          var padded4 = data.length + 3 >> 2;
          var pad = new Buffer((padded4 << 2) - data.length);
          var format2 = "CCSLLLCxxxLaa";
          var requestLength = 6 + padded4;
          var dataLenInFormatUnits = data.length / (units >> 3);
          return [format2, [18, mode, requestLength, wid, name, type, units, dataLenInFormatUnits, data, pad]];
        }
      ],
      // TODO: test
      DeleteProperty: [
        function(wid, prop) {
          return ["CxSLL", [19, 3, wid, prop]];
        }
      ],
      GetProperty: [
        function(del, wid, name, type, longOffset, longLength) {
          return ["CCSLLLLL", [20, del, 6, wid, name, type, longOffset, longLength]];
        },
        function(buf, format2) {
          var res = buf.unpack("LLL");
          var prop = {};
          prop.type = res[0];
          prop.bytesAfter = res[1];
          var len = res[2] * (format2 >> 3);
          prop.data = buf.slice(24, 24 + len);
          return prop;
        }
      ],
      ListProperties: [
        function(wid) {
          return ["CxSL", [21, 2, wid]];
        },
        function(buf) {
          var n = buf.unpack("S")[0];
          var i;
          var atoms = [];
          for (i = 0; i < n; ++i) {
            atoms.push(buf.unpack("L", 24 + 4 * i)[0]);
          }
          return atoms;
        }
      ],
      SetSelectionOwner: [
        function(owner, selection, time) {
          if (!time)
            time = 0;
          return ["CxSLLL", [22, 4, owner, selection, time]];
        }
      ],
      GetSelectionOwner: [
        function(selection) {
          return ["CxSL", [23, 2, selection]];
        },
        function(buf) {
          return buf.unpack("L")[0];
        }
      ],
      ConvertSelection: [
        function(requestor, selection, target, property, time) {
          if (!time)
            time = 0;
          return ["CxSLLLLL", [24, 6, requestor, selection, target, property, time]];
        }
      ],
      SendEvent: [
        function(destination, propagate, eventMask, eventRawData) {
          return ["CCSLLa", [25, propagate, 11, destination, eventMask, eventRawData]];
        }
      ],
      GrabPointer: [
        function(wid, ownerEvents, mask, pointerMode, keybMode, confineTo, cursor, time) {
          return ["CCSLSCCLLL", [
            26,
            ownerEvents,
            6,
            wid,
            mask,
            pointerMode,
            keybMode,
            confineTo,
            cursor,
            time
          ]];
        },
        function(buf, status) {
          return status;
        }
      ],
      UngrabPointer: [
        function(time) {
          return ["CxSL", [27, 2, time]];
        }
      ],
      GrabButton: [
        function(wid, ownerEvents, mask, pointerMode, keybMode, confineTo, cursor, button, modifiers) {
          return ["CCSLSCCLLCxS", [
            28,
            ownerEvents,
            6,
            wid,
            mask,
            pointerMode,
            keybMode,
            confineTo,
            cursor,
            button,
            modifiers
          ]];
        }
      ],
      UngrabButton: [
        function(wid, button, modifiers) {
          return ["CCSLSxx", [29, button, 3, wid, modifiers]];
        }
      ],
      ChangeActivePointerGrab: [
        function(cursor, time, mask) {
          return ["CxSLLSxx", [30, 4, cursor, time, mask]];
        }
      ],
      GrabKeyboard: [
        function(wid, ownerEvents, time, pointerMode, keybMode) {
          return ["CCSLLCCxx", [31, ownerEvents, 4, wid, time, pointerMode, keybMode]];
        },
        function(buf, status) {
          return status;
        }
      ],
      UngrabKeyboard: [
        function(time) {
          return ["CxSL", [32, 2, time]];
        }
      ],
      GrabKey: [
        function(wid, ownerEvents, modifiers, key, pointerMode, keybMode) {
          return ["CCSLSCCCxxx", [33, ownerEvents, 4, wid, modifiers, key, pointerMode, keybMode]];
        }
      ],
      UngrabKey: [
        function(wid, key, modifiers) {
          return ["CCSLSxx", [34, key, 3, wid, modifiers]];
        }
      ],
      AllowEvents: [
        function(mode, ts) {
          return ["CCSL", [35, mode, 2, ts]];
        }
      ],
      GrabServer: [
        ["CxS", [36, 1]]
      ],
      UngrabServer: [
        ["CxS", [37, 1]]
      ],
      QueryPointer: [
        ["CxSL", [38, 2]],
        function(buf, sameScreen) {
          var res = buf.unpack("LLssssS");
          return {
            root: res[0],
            child: res[1],
            rootX: res[2],
            rootY: res[3],
            childX: res[4],
            childY: res[5],
            keyMask: res[6],
            sameScreen
          };
        }
      ],
      TranslateCoordinates: [
        function(srcWid, dstWid, srcX, srcY) {
          return ["CxSLLSS", [40, 4, srcWid, dstWid, srcX, srcY]];
        },
        function(buf, sameScreen) {
          var res = buf.unpack("Lss");
          var ext = {};
          ext.child = res[0];
          ext.destX = res[1];
          ext.destY = res[2];
          ext.sameScreen = sameScreen;
          return ext;
        }
      ],
      SetInputFocus: [
        function(wid, revertTo) {
          return ["CCSLL", [42, revertTo, 3, wid, 0]];
        }
      ],
      GetInputFocus: [
        function() {
          return ["CxS", [43, 1]];
        },
        function(buf, revertTo) {
          return {
            focus: buf.unpack("L")[0],
            revertTo
          };
        }
      ],
      WarpPointer: [
        function(srcWin, dstWin, srcX, srcY, srcWidth, srcHeight, dstX, dstY) {
          return ["CxSLLssSSss", [41, 6, srcWin, dstWin, srcX, srcY, srcWidth, srcHeight, dstX, dstY]];
        }
      ],
      ListFonts: [
        function(pattern, max) {
          var req_len = 2 + xutil.padded_length(pattern.length) / 4;
          return ["CxSSSp", [49, req_len, max, pattern.length, pattern]];
        },
        function(buf) {
          console.log(buf);
          var res = [];
          var off = 24;
          while (off < buf.length) {
            var len = buf[off++];
            if (len == 0)
              break;
            if (off + len > buf.length) {
              len = buf.length - off;
              if (len <= 0)
                break;
            }
            res.push(buf.unpackString(len, off));
            off += len;
          }
          return res;
        }
      ],
      CreatePixmap: [
        function(pid, drawable, depth, width, height) {
          return ["CCSLLSS", [53, depth, 4, pid, drawable, width, height]];
        }
      ],
      FreePixmap: [
        function(pixmap) {
          return ["CxSL", [54, 2, pixmap]];
        }
      ],
      CreateCursor: [
        function(cid, source, mask, foreRGB, backRGB, x, y) {
          foreR = foreRGB.R;
          foreG = foreRGB.G;
          foreB = foreRGB.B;
          backR = backRGB.R;
          backG = backRGB.G;
          backB = backRGB.B;
          return ["CxSLLLSSSSSSSS", [93, 8, cid, source, mask, foreR, foreG, foreB, backR, backG, backB, x, y]];
        }
      ],
      // opcode 55
      CreateGC: [
        function(cid, drawable, values) {
          var format2 = "CxSLLL";
          var vals = packValueMask("CreateGC", values);
          var packetLength = 4 + (values ? vals[2].length : 0);
          var args = [55, packetLength, cid, drawable];
          format2 += vals[0];
          args.push(vals[1]);
          args = args.concat(vals[2]);
          return [format2, args];
        }
      ],
      ChangeGC: [
        function(cid, values) {
          var format2 = "CxSLL";
          var vals = packValueMask("CreateGC", values);
          var packetLength = 3 + (values ? vals[2].length : 0);
          var args = [56, packetLength, cid];
          format2 += vals[0];
          args.push(vals[1]);
          args = args.concat(vals[2]);
          return [format2, args];
        }
      ],
      ClearArea: [
        function(wid, x, y, width, height, exposures) {
          return ["CCSLssSS", [61, exposures, 4, wid, x, y, width, height]];
        }
      ],
      //
      CopyArea: [
        function(srcDrawable, dstDrawable, gc, srcX, srcY, dstX, dstY, width, height) {
          return ["CxSLLLssssSS", [62, 7, srcDrawable, dstDrawable, gc, srcX, srcY, dstX, dstY, width, height]];
        }
      ],
      PolyPoint: [
        function(coordMode, drawable, gc, points) {
          var format2 = "CCSLL";
          var args = [64, coordMode, 3 + points.length / 2, drawable, gc];
          for (var i = 0; i < points.length; ++i) {
            format2 += "S";
            args.push(points[i]);
          }
          return [format2, args];
        }
      ],
      PolyLine: [
        // TODO: remove copy-paste - exectly same as PolyPoint, only differ with opcode
        function(coordMode, drawable, gc, points) {
          var format2 = "CCSLL";
          var args = [65, coordMode, 3 + points.length / 2, drawable, gc];
          for (var i = 0; i < points.length; ++i) {
            format2 += "S";
            args.push(points[i]);
          }
          return [format2, args];
        }
      ],
      PolyFillRectangle: [
        function(drawable, gc, coords) {
          var format2 = "CxSLL";
          var numrects4bytes = coords.length / 2;
          var args = [70, 3 + numrects4bytes, drawable, gc];
          for (var i = 0; i < coords.length; ++i) {
            format2 += "S";
            args.push(coords[i]);
          }
          return [format2, args];
        }
      ],
      PolyFillArc: [
        function(drawable, gc, coords) {
          var format2 = "CxSLL";
          var numrects4bytes = coords.length / 2;
          var args = [71, 3 + numrects4bytes, drawable, gc];
          for (var i = 0; i < coords.length; ++i) {
            format2 += "S";
            args.push(coords[i]);
          }
          return [format2, args];
        }
      ],
      PutImage: [
        // format:  0 - Bitmap, 1 - XYPixmap, 2 - ZPixmap
        function(format2, drawable, gc, width, height, dstX, dstY, leftPad, depth, data) {
          var padded = xutil.padded_length(data.length);
          var reqLen = 6 + padded / 4;
          var padLength = padded - data.length;
          var pad = new Buffer(padLength);
          return ["CCSLLLSSssCCxxaa", [72, format2, 0, 1 + reqLen, drawable, gc, width, height, dstX, dstY, leftPad, depth, data, pad]];
        }
      ],
      GetImage: [
        function(format2, drawable, x, y, width, height, planeMask) {
          return ["CCSLssSSL", [73, format2, 5, drawable, x, y, width, height, planeMask]];
        },
        function(buf, depth) {
          var visualId = buf.unpack("L")[0];
          return {
            depth,
            visualId,
            data: buf.slice(24)
          };
        }
      ],
      PolyText8: [
        function(drawable, gc, x, y, items) {
          var format2 = "CxSLLss";
          var numItems = items.length;
          var reqLen = 16;
          var args = [74, 0, drawable, gc, x, y];
          for (var i = 0; i < numItems; ++i) {
            var it = items[i];
            if (typeof it == "string") {
              if (it.length > 254)
                throw "not supported yet";
              format2 += "CCa";
              args.push(it.length);
              args.push(0);
              args.push(it);
              reqLen += 2 + it.length;
            } else {
              throw "not supported yet";
            }
          }
          var len4 = xutil.padded_length(reqLen) / 4;
          var padLen = len4 * 4 - reqLen;
          args[1] = len4;
          var pad = "";
          for (var i = 0; i < padLen; ++i)
            pad += String.fromCharCode(0);
          format2 += "a";
          args.push(pad);
          return [format2, args];
        }
      ],
      CreateColormap: [
        function(cmid, wid, vid, alloc) {
          return ["CCSLLL", [78, alloc, 4, cmid, wid, vid]];
        }
      ],
      AllocColor: [
        ["CxSLSSSxx", [84, 4]],
        // params: colormap, red, green, blue
        function(buf) {
          var res = buf.unpack("SSSxL");
          var color = {};
          color.red = res[0];
          color.blue = res[1];
          color.green = res[2];
          color.pixel = res[3] >> 8;
          return color;
        }
      ],
      QueryExtension: [
        function(name) {
          var padded = xutil.padded_string(name);
          return ["CxSSxxa", [98, 2 + padded.length / 4, name.length, padded]];
        },
        function(buf) {
          var res = buf.unpack("CCCC");
          var ext = {};
          ext.present = res[0];
          ext.majorOpcode = res[1];
          ext.firstEvent = res[2];
          ext.firstError = res[3];
          return ext;
        }
      ],
      ListExtensions: [
        ["CxS", [99, 1]],
        function(buf) {
          var res = [];
          var off = 24;
          while (off < buf.length) {
            var len = buf[off++];
            if (len == 0)
              break;
            if (off + len > buf.length) {
              len = buf.length - off;
              if (len <= 0)
                break;
            }
            res.push(buf.unpackString(len, off));
            off += len;
          }
          return res;
        }
      ],
      GetKeyboardMapping: [
        function(startCode, num) {
          return ["CxSCCxx", [101, 2, startCode, num]];
        },
        function(buff, listLength) {
          var res = [];
          var format2 = "";
          for (var i = 0; i < listLength; ++i)
            format2 += "L";
          for (var offset = 24; offset < buff.length - 4 * listLength; offset += 4 * listLength)
            res.push(buff.unpack(format2, offset));
          return res;
        }
      ],
      // todo: move up to keep reque
      GetGeometry: [
        function(drawable) {
          return ["CxSL", [14, 2, drawable]];
        },
        function(buff, depth) {
          var res = buff.unpack("LssSSSx");
          var ext = {};
          ext.windowid = res[0];
          ext.xPos = res[1];
          ext.yPos = res[2];
          ext.width = res[3];
          ext.height = res[4];
          ext.borderWidth = res[5];
          ext.depth = depth;
          return ext;
        }
      ],
      KillClient: [
        function(resource) {
          return ["CxSL", [113, 2, resource]];
        }
      ],
      SetScreenSaver: [
        function(timeout, interval, preferBlanking, allowExposures) {
          return ["CxSssCCxx", [107, 3, timeout, interval, preferBlanking, allowExposures]];
        }
      ],
      ForceScreenSaver: [
        function(activate) {
          return ["CCS", [115, activate ? 1 : 0, 1]];
        }
      ]
    };
    templates.KillKlient = templates.KillClient;
    module2.exports = templates;
  }
});

// node_modules/x11/lib/stdatoms.js
var require_stdatoms = __commonJS({
  "node_modules/x11/lib/stdatoms.js"(exports2, module2) {
    module2.exports = {
      PRIMARY: 1,
      SECONDARY: 2,
      ARC: 3,
      ATOM: 4,
      BITMAP: 5,
      CARDINAL: 6,
      COLORMAP: 7,
      CURSOR: 8,
      CUT_BUFFER0: 9,
      CUT_BUFFER1: 10,
      CUT_BUFFER2: 11,
      CUT_BUFFER3: 12,
      CUT_BUFFER4: 13,
      CUT_BUFFER5: 14,
      CUT_BUFFER6: 15,
      CUT_BUFFER7: 16,
      DRAWABLE: 17,
      FONT: 18,
      INTEGER: 19,
      PIXMAP: 20,
      POINT: 21,
      RECTANGLE: 22,
      RESOURCE_MANAGER: 23,
      RGB_COLOR_MAP: 24,
      RGB_BEST_MAP: 25,
      RGB_BLUE_MAP: 26,
      RGB_DEFAULT_MAP: 27,
      RGB_GRAY_MAP: 28,
      RGB_GREEN_MAP: 29,
      RGB_RED_MAP: 30,
      STRING: 31,
      VISUALID: 32,
      WINDOW: 33,
      WM_COMMAND: 34,
      WM_HINTS: 35,
      WM_CLIENT_MACHINE: 36,
      WM_ICON_NAME: 37,
      WM_ICON_SIZE: 38,
      WM_NAME: 39,
      WM_NORMAL_HINTS: 40,
      WM_SIZE_HINTS: 41,
      WM_ZOOM_HINTS: 42,
      MIN_SPACE: 43,
      NORM_SPACE: 44,
      MAX_SPACE: 45,
      END_SPACE: 46,
      SUPERSCRIPT_X: 47,
      SUPERSCRIPT_Y: 48,
      SUBSCRIPT_X: 49,
      SUBSCRIPT_Y: 50,
      UNDERLINE_POSITION: 51,
      UNDERLINE_THICKNESS: 52,
      STRIKEOUT_ASCENT: 53,
      STRIKEOUT_DESCENT: 54,
      ITALIC_ANGLE: 55,
      X_HEIGHT: 56,
      QUAD_WIDTH: 57,
      WEIGHT: 58,
      POINT_SIZE: 59,
      RESOLUTION: 60,
      COPYRIGHT: 61,
      NOTICE: 62,
      FONT_NAME: 63,
      FAMILY_NAME: 64,
      FULL_NAME: 65,
      CAP_HEIGHT: 66,
      WM_CLASS: 67,
      WM_TRANSIENT_FOR: 68
    };
  }
});

// node_modules/x11/lib/eventmask.js
var require_eventmask = __commonJS({
  "node_modules/x11/lib/eventmask.js"(exports2, module2) {
    module2.exports.eventMask = {
      KeyPress: 1,
      KeyRelease: 2,
      ButtonPress: 4,
      ButtonRelease: 8,
      EnterWindow: 16,
      LeaveWindow: 32,
      PointerMotion: 64,
      PointerMotionHint: 128,
      Button1Motion: 256,
      Button2Motion: 512,
      Button3Motion: 1024,
      Button4Motion: 2048,
      Button5Motion: 4096,
      ButtonMotion: 8192,
      KeymapState: 16384,
      Exposure: 32768,
      VisibilityChange: 65536,
      StructureNotify: 131072,
      ResizeRedirect: 262144,
      SubstructureNotify: 524288,
      SubstructureRedirect: 1048576,
      FocusChange: 2097152,
      PropertyChange: 4194304,
      ColormapChange: 8388608,
      OwnerGrabButton: 16777216
      // TODO: add more names for common masks combinations
    };
  }
});

// node_modules/x11/lib/xcore.js
var require_xcore = __commonJS({
  "node_modules/x11/lib/xcore.js"(exports2, module2) {
    init_();
    var util = require("util");
    var net = require("net");
    var handshake = require_handshake2();
    var EventEmitter = require("events").EventEmitter;
    var PackStream = require_unpackstream();
    var hexy = require_hexy().hexy;
    var Buffer2 = require("buffer").Buffer;
    require_unpackbuffer().addUnpack(Buffer2);
    var os2 = require("os");
    var xerrors = require_xerrors();
    var coreRequests = require_corereqs();
    var stdatoms = require_stdatoms();
    var em = require_eventmask().eventMask;
    function XClient(displayNum, screenNum, options) {
      EventEmitter.call(this);
      this.options = options ? options : {};
      this.core_requests = {};
      this.ext_requests = {};
      this.displayNum = displayNum;
      this.screenNum = screenNum;
    }
    util.inherits(XClient, EventEmitter);
    XClient.prototype.init = function(stream) {
      this.stream = stream;
      this.authHost = stream.remoteAddress;
      this.authFamily = stream._getpeername ? stream._getpeername().family : stream.remoteFamily;
      if (!this.authHost || this.authHost === "127.0.0.1" || this.authHost === "::1") {
        this.authHost = os2.hostname();
        this.authFamily = null;
      }
      var pack_stream = new PackStream();
      var client = this;
      pack_stream.on("data", function(data) {
        stream.write(data);
      });
      stream.on("data", function(data) {
        pack_stream.write(data);
      });
      stream.on("end", function() {
        client.emit("end");
      });
      this.pack_stream = pack_stream;
      this.rsrc_id = 0;
      var cli = this;
      if (cli.options.debug) {
        this.seq_num_ = 0;
        this.seq2stack = {};
        Object.defineProperty(cli, "seq_num", {
          set: function(v) {
            cli.seq_num_ = v;
            var err = new Error();
            Error.captureStackTrace(err, arguments.callee);
            err.timestamp = Date.now();
            cli.seq2stack[client.seq_num] = err;
          },
          get: function() {
            return cli.seq_num_;
          }
        });
      } else {
        this.seq_num = 0;
      }
      this.replies = {};
      this.atoms = stdatoms;
      this.atom_names = function() {
        var names = {};
        Object.keys(stdatoms).forEach(function(key) {
          names[stdatoms[key]] = key;
        });
        return names;
      }();
      this.eventMask = em;
      this.event_consumers = {};
      this.eventParsers = {};
      this.errorParsers = {};
      this._extensions = {};
      this.importRequestsFromTemplates(this, coreRequests);
      this.startHandshake();
      this._closing = false;
      this._unusedIds = [];
    };
    XClient.prototype.terminate = function() {
      this.stream.end();
    };
    XClient.prototype.ping = function(cb) {
      var start2 = Date.now();
      this.GetAtomName(3, function(err, str) {
        if (err)
          return cb(err);
        return cb(null, Date.now() - start2);
      });
    };
    XClient.prototype.close = function(cb) {
      var cli = this;
      cli.ping(function(err) {
        if (err)
          return cb(err);
        cli.terminate();
        if (cb)
          cb();
      });
      cli._closing = true;
    };
    XClient.prototype.importRequestsFromTemplates = function(target, reqs) {
      var client = this;
      this.pending_atoms = {};
      for (var r in reqs) {
        target[r] = /* @__PURE__ */ function(reqName) {
          var reqFunc = function req_proxy() {
            if (client._closing)
              throw new Error("client is in closing state");
            if (client.seq_num == 65535)
              client.seq_num = 0;
            else
              client.seq_num++;
            var args = Array.prototype.slice.call(req_proxy.arguments);
            var callback2 = args.length > 0 ? args[args.length - 1] : null;
            if (callback2 && callback2.constructor.name != "Function")
              callback2 = null;
            var reqReplTemplate = reqs[reqName];
            var reqTemplate = reqReplTemplate[0];
            var templateType = typeof reqTemplate;
            if (templateType == "object")
              templateType = reqTemplate.constructor.name;
            if (templateType == "function") {
              if (reqName === "InternAtom") {
                var value = req_proxy.arguments[1];
                if (client.atoms[value]) {
                  --client.seq_num;
                  return setImmediate(function() {
                    callback2(void 0, client.atoms[value]);
                  });
                } else {
                  client.pending_atoms[client.seq_num] = value;
                }
              }
              var reqPack = reqTemplate.apply(this, req_proxy.arguments);
              var format2 = reqPack[0];
              var requestArguments = reqPack[1];
              if (callback2)
                this.replies[this.seq_num] = [reqReplTemplate[1], callback2];
              client.pack_stream.pack(format2, requestArguments);
              var b = client.pack_stream.write_queue[0];
              client.pack_stream.flush();
            } else if (templateType == "Array") {
              if (reqName === "GetAtomName") {
                var atom = req_proxy.arguments[0];
                if (client.atom_names[atom]) {
                  --client.seq_num;
                  return setImmediate(function() {
                    callback2(void 0, client.atom_names[atom]);
                  });
                } else {
                  client.pending_atoms[client.seq_num] = atom;
                }
              }
              var format2 = reqTemplate[0];
              var requestArguments = [];
              for (var a = 0; a < reqTemplate[1].length; ++a)
                requestArguments.push(reqTemplate[1][a]);
              for (var a in args)
                requestArguments.push(args[a]);
              if (callback2)
                this.replies[this.seq_num] = [reqReplTemplate[1], callback2];
              client.pack_stream.pack(format2, requestArguments);
              client.pack_stream.flush();
            } else {
              throw "unknown request format - " + templateType;
            }
          };
          return reqFunc;
        }(r);
      }
    };
    XClient.prototype.AllocID = function() {
      if (this._unusedIds.length > 0) {
        return this._unusedIds.pop();
      }
      this.display.rsrc_id++;
      return (this.display.rsrc_id << this.display.rsrc_shift) + this.display.resource_base;
    };
    XClient.prototype.ReleaseID = function(id) {
      this._unusedIds.push(id);
    };
    XClient.prototype.unpackEvent = function(type, seq, extra, code, raw, headerBuf) {
      var event = {};
      type = type & 127;
      event.type = type;
      event.seq = seq;
      var extUnpacker = this.eventParsers[type];
      if (extUnpacker) {
        return extUnpacker(type, seq, extra, code, raw);
      }
      if (type == 2 || type == 3 || type == 4 || type == 5 || type == 6) {
        var values = raw.unpack("LLLssssSC");
        event.name = [, , "KeyPress", "KeyRelease", "ButtonPress", "ButtonRelease", "MotionNotify"][type];
        event.time = extra;
        event.keycode = code;
        event.root = values[0];
        event.wid = values[1];
        event.child = values[2];
        event.rootx = values[3];
        event.rooty = values[4];
        event.x = values[5];
        event.y = values[6];
        event.buttons = values[7];
        event.sameScreen = values[8];
      } else if (type == 7 || type == 8) {
        event.name = type === 7 ? "EnterNotify" : "LeaveNotify";
        var values = raw.unpack("LLLssssSC");
        event.root = values[0];
        event.wid = values[1];
        event.child = values[2];
        event.rootx = values[3];
        event.rooty = values[4];
        event.x = values[5];
        event.y = values[6];
        event.values = values;
      } else if (type == 12) {
        var values = raw.unpack("SSSSS");
        event.name = "Expose";
        event.wid = extra;
        event.x = values[0];
        event.y = values[1];
        event.width = values[2];
        event.height = values[3];
        event.count = values[4];
      } else if (type == 16) {
        var values = raw.unpack("LssSSSc");
        event.name = "CreateNotify";
        event.parent = extra;
        event.wid = values[0];
        event.x = values[1];
        event.y = values[2];
        event.width = values[3];
        event.height = values[4];
        event.borderWidth = values[5];
        event.overrideRedirect = values[6] ? true : false;
      } else if (type == 17) {
        var values = raw.unpack("L");
        event.name = "DestroyNotify";
        event.event = extra;
        event.wid = values[0];
      } else if (type == 18) {
        var values = raw.unpack("LC");
        event.name = "UnmapNotify";
        event.event = extra;
        event.wid = values[0];
        event.fromConfigure = values[1] ? true : false;
      } else if (type == 19) {
        var values = raw.unpack("LC");
        event.name = "MapNotify";
        event.event = extra;
        event.wid = values[0];
        event.overrideRedirect = values[1] ? true : false;
      } else if (type == 20) {
        var values = raw.unpack("L");
        event.name = "MapRequest";
        event.parent = extra;
        event.wid = values[0];
      } else if (type == 22) {
        var values = raw.unpack("LLssSSSC");
        event.name = "ConfigureNotify";
        event.wid = extra;
        event.wid1 = values[0];
        event.aboveSibling = values[1];
        event.x = values[2];
        event.y = values[3];
        event.width = values[4];
        event.height = values[5];
        event.borderWidth = values[6];
        event.overrideRedirect = values[7];
      } else if (type == 23) {
        var values = raw.unpack("LLssSSSS");
        event.name = "ConfigureRequest";
        event.stackMode = code;
        event.parent = extra;
        event.wid = values[0];
        event.sibling = values[1];
        event.x = values[2];
        event.y = values[3];
        event.width = values[4];
        event.height = values[5];
        event.borderWidth = values[6];
        event.mask = values[6];
      } else if (type == 28) {
        event.name = "PropertyNotify";
        var values = raw.unpack("LLC");
        event.wid = extra;
        event.atom = values[0];
        event.time = values[1];
        event.state = values[2];
      } else if (type == 29) {
        event.name = "SelectionClear";
        event.time = extra;
        var values = raw.unpack("LL");
        event.owner = values[0];
        event.selection = values[1];
      } else if (type == 30) {
        event.name = "SelectionRequest";
        event.time = extra;
        var values = raw.unpack("LLLLL");
        event.owner = values[0];
        event.requestor = values[1];
        event.selection = values[2];
        event.target = values[3];
        event.property = values[4];
      } else if (type == 31) {
        event.name = "SelectionNotify";
        event.time = extra;
        var values = raw.unpack("LLLL");
        event.requestor = values[0];
        event.selection = values[1];
        event.target = values[2];
        event.property = values[3];
      } else if (type == 33) {
        event.name = "ClientMessage";
        event.format = code;
        event.wid = extra;
        event.message_type = raw.unpack("L")[0];
        var format2 = code === 32 ? "LLLLL" : code === 16 ? "SSSSSSSSSS" : "CCCCCCCCCCCCCCCCCCCC";
        event.data = raw.unpack(format2, 4);
      } else if (type == 34) {
        event.name = "MappingNotify";
        event.request = headerBuf[4];
        event.firstKeyCode = headerBuf[5];
        event.count = headerBuf[6];
      }
      return event;
    };
    XClient.prototype.expectReplyHeader = function() {
      var client = this;
      client.pack_stream.get(
        8,
        function(headerBuf) {
          var res = headerBuf.unpack("CCSL");
          var type = res[0];
          var seq_num = res[2];
          var bad_value = res[3];
          if (type == 0) {
            var error_code = res[1];
            var error = new Error();
            error.error = error_code;
            error.seq = seq_num;
            if (client.options.debug) {
              error.longstack = client.seq2stack[error.seq];
              console.log(client.seq2stack[error.seq].stack);
            }
            client.pack_stream.get(24, function(buf) {
              var res2 = buf.unpack("SC");
              error.message = xerrors.errorText[error_code];
              error.badParam = bad_value;
              error.minorOpcode = res2[0];
              error.majorOpcode = res2[1];
              var extUnpacker = client.errorParsers[error_code];
              if (extUnpacker) {
                extUnpacker(error, error_code, seq_num, bad_value, buf);
              }
              var handler = client.replies[seq_num];
              if (handler) {
                var callback2 = handler[1];
                var handled = callback2(error);
                if (!handled)
                  client.emit("error", error);
                if (client.options.debug)
                  delete client.seq2stack[seq_num];
                delete client.replies[seq_num];
              } else
                client.emit("error", error);
              client.expectReplyHeader();
            });
            return;
          } else if (type > 1) {
            client.pack_stream.get(24, function(buf) {
              var extra = res[3];
              var code = res[1];
              var ev = client.unpackEvent(type, seq_num, extra, code, buf, headerBuf);
              ev.rawData = new Buffer2(32);
              headerBuf.copy(ev.rawData);
              buf.copy(ev.rawData, 8);
              client.emit("event", ev);
              var ee = client.event_consumers[ev.wid];
              if (ee) {
                ee.emit("event", ev);
              }
              if (ev.parent) {
                ee = client.event_consumers[ev.parent];
                if (ee)
                  ee.emit("child-event", ev);
              }
              client.expectReplyHeader();
            });
            return;
          }
          var opt_data = res[1];
          var length_total = res[3];
          var bodylength = 24 + length_total * 4;
          client.pack_stream.get(bodylength, function(data) {
            var handler = client.replies[seq_num];
            if (handler) {
              var unpack = handler[0];
              if (client.pending_atoms[seq_num]) {
                opt_data = seq_num;
              }
              var result = unpack.call(client, data, opt_data);
              var callback2 = handler[1];
              callback2(null, result);
              delete client.replies[seq_num];
            }
            client.expectReplyHeader();
          });
        }
      );
    };
    XClient.prototype.startHandshake = function() {
      var client = this;
      handshake.writeClientHello(this.pack_stream, this.displayNum, this.authHost, this.authFamily);
      handshake.readServerHello(this.pack_stream, function(err, display) {
        if (err) {
          client.emit("error", err);
          return;
        }
        client.expectReplyHeader();
        client.display = display;
        display.client = client;
        client.emit("connect", display);
      });
    };
    XClient.prototype.require = function(extName, callback2) {
      var self = this;
      var ext = this._extensions[extName];
      if (ext) {
        return process.nextTick(function() {
          callback2(null, ext);
        });
      }
      ext = globRequire_ext("./ext/" + extName);
      ext.requireExt(this.display, function(err, _ext) {
        if (err) {
          return callback2(err);
        }
        self._extensions[extName] = _ext;
        callback2(null, _ext);
      });
    };
    module2.exports.createClient = function(options, initCb) {
      if (typeof options === "function") {
        initCb = options;
        options = {};
      }
      if (!options)
        options = {};
      var display = options.display;
      if (!display)
        display = process.env.DISPLAY ? process.env.DISPLAY : ":0";
      var displayMatch = display.match(/^(?:[^:]*?\/)?(.*):(\d+)(?:.(\d+))?$/);
      if (!displayMatch)
        throw new Error("Cannot parse display");
      var host = displayMatch[1];
      var displayNum = displayMatch[2];
      if (!displayNum)
        displayNum = 0;
      var screenNum = displayMatch[3];
      if (!screenNum)
        screenNum = 0;
      var stream;
      var connected = false;
      var cbCalled = false;
      var socketPath;
      if (["cygwin", "win32", "win64"].indexOf(process.platform) < 0) {
        if (process.platform == "darwin" || process.platform == "mac") {
          if (display[0] == "/") {
            socketPath = display;
          }
        } else if (!host)
          socketPath = "/tmp/.X11-unix/X" + displayNum;
      }
      var client = new XClient(displayNum, screenNum, options);
      var connectStream = function() {
        if (socketPath) {
          stream = net.createConnection(socketPath);
        } else {
          stream = net.createConnection(6e3 + parseInt(displayNum), host);
        }
        stream.on("connect", function() {
          connected = true;
          client.init(stream);
        });
        stream.on("error", function(err) {
          if (!connected && socketPath && err.code === "ENOENT") {
            socketPath = null;
            host = "localhost";
            connectStream();
          } else if (initCb && !cbCalled) {
            cbCalled = true;
            initCb(err);
          } else {
            client.emit("error", err);
          }
        });
      };
      connectStream();
      if (initCb) {
        client.on("connect", function(display2) {
          if (!options.disableBigRequests) {
            client.require("big-requests", function(err, BigReq) {
              if (err)
                return initCb(err);
              BigReq.Enable(function(err2, maxLen) {
                display2.max_request_length = maxLen;
                cbCalled = true;
                initCb(void 0, display2);
              });
            });
          } else {
            cbCalled = true;
            initCb(void 0, display2);
          }
        });
      }
      return client;
    };
  }
});

// node_modules/x11/lib/xserver.js
var require_xserver = __commonJS({
  "node_modules/x11/lib/xserver.js"(exports2, module2) {
    "use strict";
    var util = require("util");
    var net = require("net");
    var PackStream = require_unpackstream();
    var EventEmitter = require("events").EventEmitter;
    function XServer(servsock, params) {
      var server = this;
      EventEmitter.call(this);
      servsock.on("connection", function(stream) {
        var cli = new XServerClientConnection(stream, params);
        server.emit("connection", cli);
      });
    }
    util.inherits(XServer, EventEmitter);
    function XServerClientConnection(stream, params) {
      EventEmitter.call(this);
      this.params = params;
      var serv = this;
      serv.stream = stream;
      serv.pack_stream = new PackStream();
      serv.pack_stream.on("data", function(data) {
        serv.stream.write(data);
      });
      stream.on("data", function(data) {
        serv.pack_stream.write(data);
      });
      serv.sequence = 0;
      serv.readClientHandshake();
    }
    util.inherits(XServerClientConnection, EventEmitter);
    XServerClientConnection.prototype.readClientHandshake = function() {
      var serv = this;
      var hello = {};
      serv.pack_stream.unpackTo(
        hello,
        [
          "C byteOrder",
          "x",
          "S protocolMajor",
          "S protocolMinor",
          "S authTypeLength",
          "S authDataLength",
          "x",
          "x"
        ],
        function() {
          console.log(hello);
          serv.pack_stream.get(hello.authTypeLength, function(authType) {
            serv.pack_stream.get(hello.authDataLength, function(authData) {
              serv.byteOrder = hello.byteOrder;
              serv.protocolMajor = hello.protocolMajor;
              serv.protocolMinor = hello.protocolMinor;
              serv.checkAuth(authType.toString("ascii"), authData);
            });
          });
        }
      );
    };
    XServerClientConnection.prototype.checkAuth = function(authType, authData) {
      var serv = this;
      console.log("check auth");
      console.log([authType, authData.toString()]);
      var stream = serv.pack_stream;
      var hello = require("fs").readFileSync("hello1.bin");
      stream.pack("CxSSSa", [1, 11, 0, hello.length / 4, hello]);
      stream.flush();
      serv.expectMessage();
    };
    XServerClientConnection.prototype.expectMessage = function() {
      var serv = this;
      console.log("expecting messages");
      serv.pack_stream.unpack("CCS", function(header) {
        serv.sequence++;
        console.log("Request:", header[0]);
        console.log("Extra:", header[1]);
        console.log("length:", header[2]);
        serv.pack_stream.get((header[2] - 1) * 4, function(reqBody) {
          console.log("BODY:", reqBody, reqBody.toString());
          if (header[0] == 98) {
            serv.pack_stream.pack("CCSLCCCCLLLLL", [1, 0, serv.sequence, 0, 1, 134, 0, 0, 0, 0, 0, 0, 0, 0]);
            serv.pack_stream.flush();
          } else if (header[0] == 134) {
            console.log("ENABLE BIG REQ");
            serv.pack_stream.pack("CCSLLLLLLLL", [1, 0, serv.sequence, 0, 1e7, 0, 0, 0, 0, 0, 0]);
            serv.pack_stream.flush();
          }
          serv.expectMessage();
        });
      });
    };
    module2.exports.createServer = function(options, onconnect) {
      if (typeof options === "function") {
        onconnect = options;
        options = {};
      }
      var s = net.createServer();
      var serv = new XServer(s, options);
      serv.on("connect", onconnect);
      return s;
    };
  }
});

// node_modules/x11/lib/keysyms.js
var require_keysyms = __commonJS({
  "node_modules/x11/lib/keysyms.js"(exports2, module2) {
    module2.exports = {
      /***********************************************************
      Copyright 1987, 1994, 1998  The Open Group
      
      Permission to use, copy, modify, distribute, and sell this software and its
      documentation for any purpose is hereby granted without fee, provided that
      the above copyright notice appear in all copies and that both that
      copyright notice and this permission notice appear in supporting
      documentation.
      
      The above copyright notice and this permission notice shall be included
      in all copies or substantial portions of the Software.
      
      THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
      OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
      MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
      IN NO EVENT SHALL THE OPEN GROUP BE LIABLE FOR ANY CLAIM, DAMAGES OR
      OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
      ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
      OTHER DEALINGS IN THE SOFTWARE.
      
      Except as contained in this notice, the name of The Open Group shall
      not be used in advertising or otherwise to promote the sale, use or
      other dealings in this Software without prior written authorization
      from The Open Group.
      
      
      Copyright 1987 by Digital Equipment Corporation, Maynard, Massachusetts
      
                              All Rights Reserved
      
      Permission to use, copy, modify, and distribute this software and its
      documentation for any purpose and without fee is hereby granted,
      provided that the above copyright notice appear in all copies and that
      both that copyright notice and this permission notice appear in
      supporting documentation, and that the name of Digital not be
      used in advertising or publicity pertaining to distribution of the
      software without specific, written prior permission.
      
      DIGITAL DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE, INCLUDING
      ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS, IN NO EVENT SHALL
      DIGITAL BE LIABLE FOR ANY SPECIAL, INDIRECT OR CONSEQUENTIAL DAMAGES OR
      ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS,
      WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION,
      ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS
      SOFTWARE.
      
      ******************************************************************/
      /*
       * The "X11 Window System Protocol" standard defines in Appendix A the
       * keysym codes. These 29-bit integer values identify characters or
       * functions associated with each key (e.g., via the visible
       * engraving) of a keyboard layout. This file assigns mnemonic macro
       * names for these keysyms.
       *
       * This file is also compiled (by src/util/makekeys.c in libX11) into
       * hash tables that can be accessed with X11 library functions such as
       * XStringToKeysym() and XKeysymToString().
       *
       * Where a keysym corresponds one-to-one to an ISO 10646 / Unicode
       * character, this is noted in a comment that provides both the U+xxxx
       * Unicode position, as well as the official Unicode name of the
       * character.
       *
       * Where the correspondence is either not one-to-one or semantically
       * unclear, the Unicode position and name are enclosed in
       * parentheses. Such legacy keysyms should be considered deprecated
       * and are not recommended for use in future keyboard mappings.
       *
       * For any future extension of the keysyms with characters already
       * found in ISO 10646 / Unicode, the following algorithm shall be
       * used. The new keysym code position will simply be the character's
       * Unicode number plus 0x01000000. The keysym values in the range
       * 0x01000100 to 0x0110ffff are reserved to represent Unicode
       * characters in the range (\u0100) to U+10FFFF.
       * 
       * While most newer Unicode-based X11 clients do already accept
       * Unicode-mapped keysyms in the range 0x01000100 to 0x0110ffff, it
       * will remain necessary for clients -- in the interest of
       * compatibility with existing servers -- to also understand the
       * existing legacy keysym values in the range 0x0100 to 0x20ff.
       *
       * Where several mnemonic names are defined for the same keysym in this
       * file, all but the first one listed should be considered deprecated.
       *
       * Mnemonic names for keysyms are defined in this file with lines
       * that match one of these Perl regular expressions:
       *
       *    /^\  XK_([a-zA-Z_0-9]+)\s+0x([0-9a-f]+)\s*\/\*: { code: U+([0-9A-F]{4,6}), description: null }, (.*) \*\/\s*$/
       *    /^\  XK_([a-zA-Z_0-9]+)\s+0x([0-9a-f]+)\s*\/\*\(U+([0-9A-F]{4,6}): { code: (.*)\)\*\/\s*$/, description: null },
       *    /^\#define XK_([a-zA-Z_0-9]+)\s+0x([0-9a-f]+)\s*(\/\*\s*(.*)\s*\*\/)?\s*$/
       *
       * Before adding new keysyms, please do consider the following: In
       * addition to the keysym names defined in this file, the
       * XStringToKeysym() and XKeysymToString() functions will also handle
       * any keysym string of the form "U0020" to "U007E" and "U00A0" to
       * "U10FFFF" for all possible Unicode characters. In other words,
       * every possible Unicode character has already a keysym string
       * defined algorithmically, even if it is not listed here. Therefore,
       * defining an additional keysym macro is only necessary where a
       * non-hexadecimal mnemonic name is needed, or where the new keysym
       * does not represent any existing Unicode character.
       *
       * When adding new keysyms to this file, do not forget to also update the
       * following as needed:
       *
       *   - the mappings in src/KeyBind.c in the repo
       *     git://anongit.freedesktop.org/xorg/lib/libX11.git
       *
       *   - the protocol specification in specs/keysyms.xml
       *     in the repo git://anongit.freedesktop.org/xorg/proto/x11proto.git
       *
       */
      XK_VoidSymbol: { code: 16777215, description: "Void symbol" },
      // Group XK_MISCELLANY
      /*
       * TTY function keys, cleverly chosen to map to ASCII, for convenience of
       * programming, but could have been arbitrary (at the cost of lookup
       * tables in client code).
       */
      XK_BackSpace: { code: 65288, description: "Back space, back char" },
      XK_Tab: { code: 65289, description: null },
      XK_Linefeed: { code: 65290, description: "Linefeed, LF" },
      XK_Clear: { code: 65291, description: null },
      XK_Return: { code: 65293, description: "Return, enter" },
      XK_Pause: { code: 65299, description: "Pause, hold" },
      XK_Scroll_Lock: { code: 65300, description: null },
      XK_Sys_Req: { code: 65301, description: null },
      XK_Escape: { code: 65307, description: null },
      XK_Delete: { code: 65535, description: "Delete, rubout" },
      /* International & multi-key character composition */
      XK_Multi_key: { code: 65312, description: "Multi-key character compose" },
      XK_Codeinput: { code: 65335, description: null },
      XK_SingleCandidate: { code: 65340, description: null },
      XK_MultipleCandidate: { code: 65341, description: null },
      XK_PreviousCandidate: { code: 65342, description: null },
      /* Japanese keyboard support */
      XK_Kanji: { code: 65313, description: "Kanji, Kanji convert" },
      XK_Muhenkan: { code: 65314, description: "Cancel Conversion" },
      XK_Henkan_Mode: { code: 65315, description: "Start/Stop Conversion" },
      XK_Henkan: { code: 65315, description: "Alias for Henkan_Mode" },
      XK_Romaji: { code: 65316, description: "to Romaji" },
      XK_Hiragana: { code: 65317, description: "to Hiragana" },
      XK_Katakana: { code: 65318, description: "to Katakana" },
      XK_Hiragana_Katakana: { code: 65319, description: "Hiragana/Katakana toggle" },
      XK_Zenkaku: { code: 65320, description: "to Zenkaku" },
      XK_Hankaku: { code: 65321, description: "to Hankaku" },
      XK_Zenkaku_Hankaku: { code: 65322, description: "Zenkaku/Hankaku toggle" },
      XK_Touroku: { code: 65323, description: "Add to Dictionary" },
      XK_Massyo: { code: 65324, description: "Delete from Dictionary" },
      XK_Kana_Lock: { code: 65325, description: "Kana Lock" },
      XK_Kana_Shift: { code: 65326, description: "Kana Shift" },
      XK_Eisu_Shift: { code: 65327, description: "Alphanumeric Shift" },
      XK_Eisu_toggle: { code: 65328, description: "Alphanumeric toggle" },
      XK_Kanji_Bangou: { code: 65335, description: "Codeinput" },
      XK_Zen_Koho: { code: 65341, description: "Multiple/All Candidate(s)" },
      XK_Mae_Koho: { code: 65342, description: "Previous Candidate" },
      /* 0xff31 thru 0xff3f are under XK_KOREAN */
      /* Cursor control & motion */
      XK_Home: { code: 65360, description: null },
      XK_Left: { code: 65361, description: "Move left, left arrow" },
      XK_Up: { code: 65362, description: "Move up, up arrow" },
      XK_Right: { code: 65363, description: "Move right, right arrow" },
      XK_Down: { code: 65364, description: "Move down, down arrow" },
      XK_Prior: { code: 65365, description: "Prior, previous" },
      XK_Page_Up: { code: 65365, description: null },
      XK_Next: { code: 65366, description: "Next" },
      XK_Page_Down: { code: 65366, description: null },
      XK_End: { code: 65367, description: "EOL" },
      XK_Begin: { code: 65368, description: "BOL" },
      /* Misc functions */
      XK_Select: { code: 65376, description: "Select, mark" },
      XK_Print: { code: 65377, description: null },
      XK_Execute: { code: 65378, description: "Execute, run, do" },
      XK_Insert: { code: 65379, description: "Insert, insert here" },
      XK_Undo: { code: 65381, description: null },
      XK_Redo: { code: 65382, description: "Redo, again" },
      XK_Menu: { code: 65383, description: null },
      XK_Find: { code: 65384, description: "Find, search" },
      XK_Cancel: { code: 65385, description: "Cancel, stop, abort, exit" },
      XK_Help: { code: 65386, description: "Help" },
      XK_Break: { code: 65387, description: null },
      XK_Mode_switch: { code: 65406, description: "Character set switch" },
      XK_script_switch: { code: 65406, description: "Alias for mode_switch" },
      XK_Num_Lock: { code: 65407, description: null },
      /* Keypad functions, keypad numbers cleverly chosen to map to ASCII */
      XK_KP_Space: { code: 65408, description: "Space" },
      XK_KP_Tab: { code: 65417, description: null },
      XK_KP_Enter: { code: 65421, description: "Enter" },
      XK_KP_F1: { code: 65425, description: "PF1, KP_A, ..." },
      XK_KP_F2: { code: 65426, description: null },
      XK_KP_F3: { code: 65427, description: null },
      XK_KP_F4: { code: 65428, description: null },
      XK_KP_Home: { code: 65429, description: null },
      XK_KP_Left: { code: 65430, description: null },
      XK_KP_Up: { code: 65431, description: null },
      XK_KP_Right: { code: 65432, description: null },
      XK_KP_Down: { code: 65433, description: null },
      XK_KP_Prior: { code: 65434, description: null },
      XK_KP_Page_Up: { code: 65434, description: null },
      XK_KP_Next: { code: 65435, description: null },
      XK_KP_Page_Down: { code: 65435, description: null },
      XK_KP_End: { code: 65436, description: null },
      XK_KP_Begin: { code: 65437, description: null },
      XK_KP_Insert: { code: 65438, description: null },
      XK_KP_Delete: { code: 65439, description: null },
      XK_KP_Equal: { code: 65469, description: "Equals" },
      XK_KP_Multiply: { code: 65450, description: null },
      XK_KP_Add: { code: 65451, description: null },
      XK_KP_Separator: { code: 65452, description: "Separator, often comma" },
      XK_KP_Subtract: { code: 65453, description: null },
      XK_KP_Decimal: { code: 65454, description: null },
      XK_KP_Divide: { code: 65455, description: null },
      XK_KP_0: { code: 65456, description: null },
      XK_KP_1: { code: 65457, description: null },
      XK_KP_2: { code: 65458, description: null },
      XK_KP_3: { code: 65459, description: null },
      XK_KP_4: { code: 65460, description: null },
      XK_KP_5: { code: 65461, description: null },
      XK_KP_6: { code: 65462, description: null },
      XK_KP_7: { code: 65463, description: null },
      XK_KP_8: { code: 65464, description: null },
      XK_KP_9: { code: 65465, description: null },
      /*
       * Auxiliary functions; note the duplicate definitions for left and right
       * function keys;  Sun keyboards and a few other manufacturers have such
       * function key groups on the left and/or right sides of the keyboard.
       * We've not found a keyboard with more than 35 function keys total.
       */
      XK_F1: { code: 65470, description: null },
      XK_F2: { code: 65471, description: null },
      XK_F3: { code: 65472, description: null },
      XK_F4: { code: 65473, description: null },
      XK_F5: { code: 65474, description: null },
      XK_F6: { code: 65475, description: null },
      XK_F7: { code: 65476, description: null },
      XK_F8: { code: 65477, description: null },
      XK_F9: { code: 65478, description: null },
      XK_F10: { code: 65479, description: null },
      XK_F11: { code: 65480, description: null },
      XK_L1: { code: 65480, description: null },
      XK_F12: { code: 65481, description: null },
      XK_L2: { code: 65481, description: null },
      XK_F13: { code: 65482, description: null },
      XK_L3: { code: 65482, description: null },
      XK_F14: { code: 65483, description: null },
      XK_L4: { code: 65483, description: null },
      XK_F15: { code: 65484, description: null },
      XK_L5: { code: 65484, description: null },
      XK_F16: { code: 65485, description: null },
      XK_L6: { code: 65485, description: null },
      XK_F17: { code: 65486, description: null },
      XK_L7: { code: 65486, description: null },
      XK_F18: { code: 65487, description: null },
      XK_L8: { code: 65487, description: null },
      XK_F19: { code: 65488, description: null },
      XK_L9: { code: 65488, description: null },
      XK_F20: { code: 65489, description: null },
      XK_L10: { code: 65489, description: null },
      XK_F21: { code: 65490, description: null },
      XK_R1: { code: 65490, description: null },
      XK_F22: { code: 65491, description: null },
      XK_R2: { code: 65491, description: null },
      XK_F23: { code: 65492, description: null },
      XK_R3: { code: 65492, description: null },
      XK_F24: { code: 65493, description: null },
      XK_R4: { code: 65493, description: null },
      XK_F25: { code: 65494, description: null },
      XK_R5: { code: 65494, description: null },
      XK_F26: { code: 65495, description: null },
      XK_R6: { code: 65495, description: null },
      XK_F27: { code: 65496, description: null },
      XK_R7: { code: 65496, description: null },
      XK_F28: { code: 65497, description: null },
      XK_R8: { code: 65497, description: null },
      XK_F29: { code: 65498, description: null },
      XK_R9: { code: 65498, description: null },
      XK_F30: { code: 65499, description: null },
      XK_R10: { code: 65499, description: null },
      XK_F31: { code: 65500, description: null },
      XK_R11: { code: 65500, description: null },
      XK_F32: { code: 65501, description: null },
      XK_R12: { code: 65501, description: null },
      XK_F33: { code: 65502, description: null },
      XK_R13: { code: 65502, description: null },
      XK_F34: { code: 65503, description: null },
      XK_R14: { code: 65503, description: null },
      XK_F35: { code: 65504, description: null },
      XK_R15: { code: 65504, description: null },
      /* Modifiers */
      XK_Shift_L: { code: 65505, description: "Left shift" },
      XK_Shift_R: { code: 65506, description: "Right shift" },
      XK_Control_L: { code: 65507, description: "Left control" },
      XK_Control_R: { code: 65508, description: "Right control" },
      XK_Caps_Lock: { code: 65509, description: "Caps lock" },
      XK_Shift_Lock: { code: 65510, description: "Shift lock" },
      XK_Meta_L: { code: 65511, description: "Left meta" },
      XK_Meta_R: { code: 65512, description: "Right meta" },
      XK_Alt_L: { code: 65513, description: "Left alt" },
      XK_Alt_R: { code: 65514, description: "Right alt" },
      XK_Super_L: { code: 65515, description: "Left super" },
      XK_Super_R: { code: 65516, description: "Right super" },
      XK_Hyper_L: { code: 65517, description: "Left hyper" },
      XK_Hyper_R: { code: 65518, description: "Right hyper" },
      /*
       * Keyboard (XKB) Extension function and modifier keys
       * (from Appendix C of "The X Keyboard Extension: Protocol Specification")
       * Byte 3 = 0xfe
       */
      // Group XK_XKB_KEYS
      XK_ISO_Lock: { code: 65025, description: null },
      XK_ISO_Level2_Latch: { code: 65026, description: null },
      XK_ISO_Level3_Shift: { code: 65027, description: null },
      XK_ISO_Level3_Latch: { code: 65028, description: null },
      XK_ISO_Level3_Lock: { code: 65029, description: null },
      XK_ISO_Level5_Shift: { code: 65041, description: null },
      XK_ISO_Level5_Latch: { code: 65042, description: null },
      XK_ISO_Level5_Lock: { code: 65043, description: null },
      XK_ISO_Group_Shift: { code: 65406, description: "Alias for mode_switch" },
      XK_ISO_Group_Latch: { code: 65030, description: null },
      XK_ISO_Group_Lock: { code: 65031, description: null },
      XK_ISO_Next_Group: { code: 65032, description: null },
      XK_ISO_Next_Group_Lock: { code: 65033, description: null },
      XK_ISO_Prev_Group: { code: 65034, description: null },
      XK_ISO_Prev_Group_Lock: { code: 65035, description: null },
      XK_ISO_First_Group: { code: 65036, description: null },
      XK_ISO_First_Group_Lock: { code: 65037, description: null },
      XK_ISO_Last_Group: { code: 65038, description: null },
      XK_ISO_Last_Group_Lock: { code: 65039, description: null },
      XK_ISO_Left_Tab: { code: 65056, description: null },
      XK_ISO_Move_Line_Up: { code: 65057, description: null },
      XK_ISO_Move_Line_Down: { code: 65058, description: null },
      XK_ISO_Partial_Line_Up: { code: 65059, description: null },
      XK_ISO_Partial_Line_Down: { code: 65060, description: null },
      XK_ISO_Partial_Space_Left: { code: 65061, description: null },
      XK_ISO_Partial_Space_Right: { code: 65062, description: null },
      XK_ISO_Set_Margin_Left: { code: 65063, description: null },
      XK_ISO_Set_Margin_Right: { code: 65064, description: null },
      XK_ISO_Release_Margin_Left: { code: 65065, description: null },
      XK_ISO_Release_Margin_Right: { code: 65066, description: null },
      XK_ISO_Release_Both_Margins: { code: 65067, description: null },
      XK_ISO_Fast_Cursor_Left: { code: 65068, description: null },
      XK_ISO_Fast_Cursor_Right: { code: 65069, description: null },
      XK_ISO_Fast_Cursor_Up: { code: 65070, description: null },
      XK_ISO_Fast_Cursor_Down: { code: 65071, description: null },
      XK_ISO_Continuous_Underline: { code: 65072, description: null },
      XK_ISO_Discontinuous_Underline: { code: 65073, description: null },
      XK_ISO_Emphasize: { code: 65074, description: null },
      XK_ISO_Center_Object: { code: 65075, description: null },
      XK_ISO_Enter: { code: 65076, description: null },
      XK_dead_grave: { code: 65104, description: null },
      XK_dead_acute: { code: 65105, description: null },
      XK_dead_circumflex: { code: 65106, description: null },
      XK_dead_tilde: { code: 65107, description: null },
      XK_dead_perispomeni: { code: 65107, description: "alias for dead_tilde" },
      XK_dead_macron: { code: 65108, description: null },
      XK_dead_breve: { code: 65109, description: null },
      XK_dead_abovedot: { code: 65110, description: null },
      XK_dead_diaeresis: { code: 65111, description: null },
      XK_dead_abovering: { code: 65112, description: null },
      XK_dead_doubleacute: { code: 65113, description: null },
      XK_dead_caron: { code: 65114, description: null },
      XK_dead_cedilla: { code: 65115, description: null },
      XK_dead_ogonek: { code: 65116, description: null },
      XK_dead_iota: { code: 65117, description: null },
      XK_dead_voiced_sound: { code: 65118, description: null },
      XK_dead_semivoiced_sound: { code: 65119, description: null },
      XK_dead_belowdot: { code: 65120, description: null },
      XK_dead_hook: { code: 65121, description: null },
      XK_dead_horn: { code: 65122, description: null },
      XK_dead_stroke: { code: 65123, description: null },
      XK_dead_abovecomma: { code: 65124, description: null },
      XK_dead_psili: { code: 65124, description: "alias for dead_abovecomma" },
      XK_dead_abovereversedcomma: { code: 65125, description: null },
      XK_dead_dasia: { code: 65125, description: "alias for dead_abovereversedcomma" },
      XK_dead_doublegrave: { code: 65126, description: null },
      XK_dead_belowring: { code: 65127, description: null },
      XK_dead_belowmacron: { code: 65128, description: null },
      XK_dead_belowcircumflex: { code: 65129, description: null },
      XK_dead_belowtilde: { code: 65130, description: null },
      XK_dead_belowbreve: { code: 65131, description: null },
      XK_dead_belowdiaeresis: { code: 65132, description: null },
      XK_dead_invertedbreve: { code: 65133, description: null },
      XK_dead_belowcomma: { code: 65134, description: null },
      XK_dead_currency: { code: 65135, description: null },
      /* extra dead elements for German T3 layout */
      XK_dead_lowline: { code: 65168, description: null },
      XK_dead_aboveverticalline: { code: 65169, description: null },
      XK_dead_belowverticalline: { code: 65170, description: null },
      XK_dead_longsolidusoverlay: { code: 65171, description: null },
      /* dead vowels for universal syllable entry */
      XK_dead_a: { code: 65152, description: null },
      XK_dead_A: { code: 65153, description: null },
      XK_dead_e: { code: 65154, description: null },
      XK_dead_E: { code: 65155, description: null },
      XK_dead_i: { code: 65156, description: null },
      XK_dead_I: { code: 65157, description: null },
      XK_dead_o: { code: 65158, description: null },
      XK_dead_O: { code: 65159, description: null },
      XK_dead_u: { code: 65160, description: null },
      XK_dead_U: { code: 65161, description: null },
      XK_dead_small_schwa: { code: 65162, description: null },
      XK_dead_capital_schwa: { code: 65163, description: null },
      XK_dead_greek: { code: 65164, description: null },
      XK_First_Virtual_Screen: { code: 65232, description: null },
      XK_Prev_Virtual_Screen: { code: 65233, description: null },
      XK_Next_Virtual_Screen: { code: 65234, description: null },
      XK_Last_Virtual_Screen: { code: 65236, description: null },
      XK_Terminate_Server: { code: 65237, description: null },
      XK_AccessX_Enable: { code: 65136, description: null },
      XK_AccessX_Feedback_Enable: { code: 65137, description: null },
      XK_RepeatKeys_Enable: { code: 65138, description: null },
      XK_SlowKeys_Enable: { code: 65139, description: null },
      XK_BounceKeys_Enable: { code: 65140, description: null },
      XK_StickyKeys_Enable: { code: 65141, description: null },
      XK_MouseKeys_Enable: { code: 65142, description: null },
      XK_MouseKeys_Accel_Enable: { code: 65143, description: null },
      XK_Overlay1_Enable: { code: 65144, description: null },
      XK_Overlay2_Enable: { code: 65145, description: null },
      XK_AudibleBell_Enable: { code: 65146, description: null },
      XK_Pointer_Left: { code: 65248, description: null },
      XK_Pointer_Right: { code: 65249, description: null },
      XK_Pointer_Up: { code: 65250, description: null },
      XK_Pointer_Down: { code: 65251, description: null },
      XK_Pointer_UpLeft: { code: 65252, description: null },
      XK_Pointer_UpRight: { code: 65253, description: null },
      XK_Pointer_DownLeft: { code: 65254, description: null },
      XK_Pointer_DownRight: { code: 65255, description: null },
      XK_Pointer_Button_Dflt: { code: 65256, description: null },
      XK_Pointer_Button1: { code: 65257, description: null },
      XK_Pointer_Button2: { code: 65258, description: null },
      XK_Pointer_Button3: { code: 65259, description: null },
      XK_Pointer_Button4: { code: 65260, description: null },
      XK_Pointer_Button5: { code: 65261, description: null },
      XK_Pointer_DblClick_Dflt: { code: 65262, description: null },
      XK_Pointer_DblClick1: { code: 65263, description: null },
      XK_Pointer_DblClick2: { code: 65264, description: null },
      XK_Pointer_DblClick3: { code: 65265, description: null },
      XK_Pointer_DblClick4: { code: 65266, description: null },
      XK_Pointer_DblClick5: { code: 65267, description: null },
      XK_Pointer_Drag_Dflt: { code: 65268, description: null },
      XK_Pointer_Drag1: { code: 65269, description: null },
      XK_Pointer_Drag2: { code: 65270, description: null },
      XK_Pointer_Drag3: { code: 65271, description: null },
      XK_Pointer_Drag4: { code: 65272, description: null },
      XK_Pointer_Drag5: { code: 65277, description: null },
      XK_Pointer_EnableKeys: { code: 65273, description: null },
      XK_Pointer_Accelerate: { code: 65274, description: null },
      XK_Pointer_DfltBtnNext: { code: 65275, description: null },
      XK_Pointer_DfltBtnPrev: { code: 65276, description: null },
      /* Single-Stroke Multiple-Character N-Graph Keysyms For The X Input Method */
      XK_ch: { code: 65184, description: null },
      XK_Ch: { code: 65185, description: null },
      XK_CH: { code: 65186, description: null },
      XK_c_h: { code: 65187, description: null },
      XK_C_h: { code: 65188, description: null },
      XK_C_H: { code: 65189, description: null },
      /*
       * 3270 Terminal Keys
       * Byte 3 = 0xfd
       */
      // Group XK_3270
      XK_3270_Duplicate: { code: 64769, description: null },
      XK_3270_FieldMark: { code: 64770, description: null },
      XK_3270_Right2: { code: 64771, description: null },
      XK_3270_Left2: { code: 64772, description: null },
      XK_3270_BackTab: { code: 64773, description: null },
      XK_3270_EraseEOF: { code: 64774, description: null },
      XK_3270_EraseInput: { code: 64775, description: null },
      XK_3270_Reset: { code: 64776, description: null },
      XK_3270_Quit: { code: 64777, description: null },
      XK_3270_PA1: { code: 64778, description: null },
      XK_3270_PA2: { code: 64779, description: null },
      XK_3270_PA3: { code: 64780, description: null },
      XK_3270_Test: { code: 64781, description: null },
      XK_3270_Attn: { code: 64782, description: null },
      XK_3270_CursorBlink: { code: 64783, description: null },
      XK_3270_AltCursor: { code: 64784, description: null },
      XK_3270_KeyClick: { code: 64785, description: null },
      XK_3270_Jump: { code: 64786, description: null },
      XK_3270_Ident: { code: 64787, description: null },
      XK_3270_Rule: { code: 64788, description: null },
      XK_3270_Copy: { code: 64789, description: null },
      XK_3270_Play: { code: 64790, description: null },
      XK_3270_Setup: { code: 64791, description: null },
      XK_3270_Record: { code: 64792, description: null },
      XK_3270_ChangeScreen: { code: 64793, description: null },
      XK_3270_DeleteWord: { code: 64794, description: null },
      XK_3270_ExSelect: { code: 64795, description: null },
      XK_3270_CursorSelect: { code: 64796, description: null },
      XK_3270_PrintScreen: { code: 64797, description: null },
      XK_3270_Enter: { code: 64798, description: null },
      /*
       * Latin 1
       * (ISO/IEC 8859-1 = Unicode (\u0020)..U+00FF)
       * Byte 3 = 0
       */
      // Group XK_LATIN1
      XK_space: { code: 32, description: "( ) SPACE" },
      XK_exclam: { code: 33, description: "(!) EXCLAMATION MARK" },
      XK_quotedbl: { code: 34, description: '(") QUOTATION MARK' },
      XK_numbersign: { code: 35, description: "(#) NUMBER SIGN" },
      XK_dollar: { code: 36, description: "($) DOLLAR SIGN" },
      XK_percent: { code: 37, description: "(%) PERCENT SIGN" },
      XK_ampersand: { code: 38, description: "(&) AMPERSAND" },
      XK_apostrophe: { code: 39, description: "(') APOSTROPHE" },
      XK_quoteright: { code: 39, description: "deprecated" },
      XK_parenleft: { code: 40, description: "(() LEFT PARENTHESIS" },
      XK_parenright: { code: 41, description: "()) RIGHT PARENTHESIS" },
      XK_asterisk: { code: 42, description: "(*) ASTERISK" },
      XK_plus: { code: 43, description: "(+) PLUS SIGN" },
      XK_comma: { code: 44, description: "(,) COMMA" },
      XK_minus: { code: 45, description: "(-) HYPHEN-MINUS" },
      XK_period: { code: 46, description: "(.) FULL STOP" },
      XK_slash: { code: 47, description: "(/) SOLIDUS" },
      XK_0: { code: 48, description: "(0) DIGIT ZERO" },
      XK_1: { code: 49, description: "(1) DIGIT ONE" },
      XK_2: { code: 50, description: "(2) DIGIT TWO" },
      XK_3: { code: 51, description: "(3) DIGIT THREE" },
      XK_4: { code: 52, description: "(4) DIGIT FOUR" },
      XK_5: { code: 53, description: "(5) DIGIT FIVE" },
      XK_6: { code: 54, description: "(6) DIGIT SIX" },
      XK_7: { code: 55, description: "(7) DIGIT SEVEN" },
      XK_8: { code: 56, description: "(8) DIGIT EIGHT" },
      XK_9: { code: 57, description: "(9) DIGIT NINE" },
      XK_colon: { code: 58, description: "(:) COLON" },
      XK_semicolon: { code: 59, description: "(;) SEMICOLON" },
      XK_less: { code: 60, description: "(<) LESS-THAN SIGN" },
      XK_equal: { code: 61, description: "(=) EQUALS SIGN" },
      XK_greater: { code: 62, description: "(>) GREATER-THAN SIGN" },
      XK_question: { code: 63, description: "(?) QUESTION MARK" },
      XK_at: { code: 64, description: "(@) COMMERCIAL AT" },
      XK_A: { code: 65, description: "(A) LATIN CAPITAL LETTER A" },
      XK_B: { code: 66, description: "(B) LATIN CAPITAL LETTER B" },
      XK_C: { code: 67, description: "(C) LATIN CAPITAL LETTER C" },
      XK_D: { code: 68, description: "(D) LATIN CAPITAL LETTER D" },
      XK_E: { code: 69, description: "(E) LATIN CAPITAL LETTER E" },
      XK_F: { code: 70, description: "(F) LATIN CAPITAL LETTER F" },
      XK_G: { code: 71, description: "(G) LATIN CAPITAL LETTER G" },
      XK_H: { code: 72, description: "(H) LATIN CAPITAL LETTER H" },
      XK_I: { code: 73, description: "(I) LATIN CAPITAL LETTER I" },
      XK_J: { code: 74, description: "(J) LATIN CAPITAL LETTER J" },
      XK_K: { code: 75, description: "(K) LATIN CAPITAL LETTER K" },
      XK_L: { code: 76, description: "(L) LATIN CAPITAL LETTER L" },
      XK_M: { code: 77, description: "(M) LATIN CAPITAL LETTER M" },
      XK_N: { code: 78, description: "(N) LATIN CAPITAL LETTER N" },
      XK_O: { code: 79, description: "(O) LATIN CAPITAL LETTER O" },
      XK_P: { code: 80, description: "(P) LATIN CAPITAL LETTER P" },
      XK_Q: { code: 81, description: "(Q) LATIN CAPITAL LETTER Q" },
      XK_R: { code: 82, description: "(R) LATIN CAPITAL LETTER R" },
      XK_S: { code: 83, description: "(S) LATIN CAPITAL LETTER S" },
      XK_T: { code: 84, description: "(T) LATIN CAPITAL LETTER T" },
      XK_U: { code: 85, description: "(U) LATIN CAPITAL LETTER U" },
      XK_V: { code: 86, description: "(V) LATIN CAPITAL LETTER V" },
      XK_W: { code: 87, description: "(W) LATIN CAPITAL LETTER W" },
      XK_X: { code: 88, description: "(X) LATIN CAPITAL LETTER X" },
      XK_Y: { code: 89, description: "(Y) LATIN CAPITAL LETTER Y" },
      XK_Z: { code: 90, description: "(Z) LATIN CAPITAL LETTER Z" },
      XK_bracketleft: { code: 91, description: "([) LEFT SQUARE BRACKET" },
      XK_backslash: { code: 92, description: "(\\) REVERSE SOLIDUS" },
      XK_bracketright: { code: 93, description: "(]) RIGHT SQUARE BRACKET" },
      XK_asciicircum: { code: 94, description: "(^) CIRCUMFLEX ACCENT" },
      XK_underscore: { code: 95, description: "(_) LOW LINE" },
      XK_grave: { code: 96, description: "(`) GRAVE ACCENT" },
      XK_quoteleft: { code: 96, description: "deprecated" },
      XK_a: { code: 97, description: "(a) LATIN SMALL LETTER A" },
      XK_b: { code: 98, description: "(b) LATIN SMALL LETTER B" },
      XK_c: { code: 99, description: "(c) LATIN SMALL LETTER C" },
      XK_d: { code: 100, description: "(d) LATIN SMALL LETTER D" },
      XK_e: { code: 101, description: "(e) LATIN SMALL LETTER E" },
      XK_f: { code: 102, description: "(f) LATIN SMALL LETTER F" },
      XK_g: { code: 103, description: "(g) LATIN SMALL LETTER G" },
      XK_h: { code: 104, description: "(h) LATIN SMALL LETTER H" },
      XK_i: { code: 105, description: "(i) LATIN SMALL LETTER I" },
      XK_j: { code: 106, description: "(j) LATIN SMALL LETTER J" },
      XK_k: { code: 107, description: "(k) LATIN SMALL LETTER K" },
      XK_l: { code: 108, description: "(l) LATIN SMALL LETTER L" },
      XK_m: { code: 109, description: "(m) LATIN SMALL LETTER M" },
      XK_n: { code: 110, description: "(n) LATIN SMALL LETTER N" },
      XK_o: { code: 111, description: "(o) LATIN SMALL LETTER O" },
      XK_p: { code: 112, description: "(p) LATIN SMALL LETTER P" },
      XK_q: { code: 113, description: "(q) LATIN SMALL LETTER Q" },
      XK_r: { code: 114, description: "(r) LATIN SMALL LETTER R" },
      XK_s: { code: 115, description: "(s) LATIN SMALL LETTER S" },
      XK_t: { code: 116, description: "(t) LATIN SMALL LETTER T" },
      XK_u: { code: 117, description: "(u) LATIN SMALL LETTER U" },
      XK_v: { code: 118, description: "(v) LATIN SMALL LETTER V" },
      XK_w: { code: 119, description: "(w) LATIN SMALL LETTER W" },
      XK_x: { code: 120, description: "(x) LATIN SMALL LETTER X" },
      XK_y: { code: 121, description: "(y) LATIN SMALL LETTER Y" },
      XK_z: { code: 122, description: "(z) LATIN SMALL LETTER Z" },
      XK_braceleft: { code: 123, description: "({) LEFT CURLY BRACKET" },
      XK_bar: { code: 124, description: "(|) VERTICAL LINE" },
      XK_braceright: { code: 125, description: "(}) RIGHT CURLY BRACKET" },
      XK_asciitilde: { code: 126, description: "(~) TILDE" },
      XK_nobreakspace: { code: 160, description: "(\xA0) NO-BREAK SPACE" },
      XK_exclamdown: { code: 161, description: "(\xA1) INVERTED EXCLAMATION MARK" },
      XK_cent: { code: 162, description: "(\xA2) CENT SIGN" },
      XK_sterling: { code: 163, description: "(\xA3) POUND SIGN" },
      XK_currency: { code: 164, description: "(\xA4) CURRENCY SIGN" },
      XK_yen: { code: 165, description: "(\xA5) YEN SIGN" },
      XK_brokenbar: { code: 166, description: "(\xA6) BROKEN BAR" },
      XK_section: { code: 167, description: "(\xA7) SECTION SIGN" },
      XK_diaeresis: { code: 168, description: "(\xA8) DIAERESIS" },
      XK_copyright: { code: 169, description: "(\xA9) COPYRIGHT SIGN" },
      XK_ordfeminine: { code: 170, description: "(\xAA) FEMININE ORDINAL INDICATOR" },
      XK_guillemotleft: { code: 171, description: "(\xAB) LEFT-POINTING DOUBLE ANGLE QUOTATION MARK" },
      XK_notsign: { code: 172, description: "(\xAC) NOT SIGN" },
      XK_hyphen: { code: 173, description: "(\xAD) SOFT HYPHEN" },
      XK_registered: { code: 174, description: "(\xAE) REGISTERED SIGN" },
      XK_macron: { code: 175, description: "(\xAF) MACRON" },
      XK_degree: { code: 176, description: "(\xB0) DEGREE SIGN" },
      XK_plusminus: { code: 177, description: "(\xB1) PLUS-MINUS SIGN" },
      XK_twosuperior: { code: 178, description: "(\xB2) SUPERSCRIPT TWO" },
      XK_threesuperior: { code: 179, description: "(\xB3) SUPERSCRIPT THREE" },
      XK_acute: { code: 180, description: "(\xB4) ACUTE ACCENT" },
      XK_mu: { code: 181, description: "(\xB5) MICRO SIGN" },
      XK_paragraph: { code: 182, description: "(\xB6) PILCROW SIGN" },
      XK_periodcentered: { code: 183, description: "(\xB7) MIDDLE DOT" },
      XK_cedilla: { code: 184, description: "(\xB8) CEDILLA" },
      XK_onesuperior: { code: 185, description: "(\xB9) SUPERSCRIPT ONE" },
      XK_masculine: { code: 186, description: "(\xBA) MASCULINE ORDINAL INDICATOR" },
      XK_guillemotright: { code: 187, description: "(\xBB) RIGHT-POINTING DOUBLE ANGLE QUOTATION MARK" },
      XK_onequarter: { code: 188, description: "(\xBC) VULGAR FRACTION ONE QUARTER" },
      XK_onehalf: { code: 189, description: "(\xBD) VULGAR FRACTION ONE HALF" },
      XK_threequarters: { code: 190, description: "(\xBE) VULGAR FRACTION THREE QUARTERS" },
      XK_questiondown: { code: 191, description: "(\xBF) INVERTED QUESTION MARK" },
      XK_Agrave: { code: 192, description: "(\xC0) LATIN CAPITAL LETTER A WITH GRAVE" },
      XK_Aacute: { code: 193, description: "(\xC1) LATIN CAPITAL LETTER A WITH ACUTE" },
      XK_Acircumflex: { code: 194, description: "(\xC2) LATIN CAPITAL LETTER A WITH CIRCUMFLEX" },
      XK_Atilde: { code: 195, description: "(\xC3) LATIN CAPITAL LETTER A WITH TILDE" },
      XK_Adiaeresis: { code: 196, description: "(\xC4) LATIN CAPITAL LETTER A WITH DIAERESIS" },
      XK_Aring: { code: 197, description: "(\xC5) LATIN CAPITAL LETTER A WITH RING ABOVE" },
      XK_AE: { code: 198, description: "(\xC6) LATIN CAPITAL LETTER AE" },
      XK_Ccedilla: { code: 199, description: "(\xC7) LATIN CAPITAL LETTER C WITH CEDILLA" },
      XK_Egrave: { code: 200, description: "(\xC8) LATIN CAPITAL LETTER E WITH GRAVE" },
      XK_Eacute: { code: 201, description: "(\xC9) LATIN CAPITAL LETTER E WITH ACUTE" },
      XK_Ecircumflex: { code: 202, description: "(\xCA) LATIN CAPITAL LETTER E WITH CIRCUMFLEX" },
      XK_Ediaeresis: { code: 203, description: "(\xCB) LATIN CAPITAL LETTER E WITH DIAERESIS" },
      XK_Igrave: { code: 204, description: "(\xCC) LATIN CAPITAL LETTER I WITH GRAVE" },
      XK_Iacute: { code: 205, description: "(\xCD) LATIN CAPITAL LETTER I WITH ACUTE" },
      XK_Icircumflex: { code: 206, description: "(\xCE) LATIN CAPITAL LETTER I WITH CIRCUMFLEX" },
      XK_Idiaeresis: { code: 207, description: "(\xCF) LATIN CAPITAL LETTER I WITH DIAERESIS" },
      XK_ETH: { code: 208, description: "(\xD0) LATIN CAPITAL LETTER ETH" },
      XK_Eth: { code: 208, description: "deprecated" },
      XK_Ntilde: { code: 209, description: "(\xD1) LATIN CAPITAL LETTER N WITH TILDE" },
      XK_Ograve: { code: 210, description: "(\xD2) LATIN CAPITAL LETTER O WITH GRAVE" },
      XK_Oacute: { code: 211, description: "(\xD3) LATIN CAPITAL LETTER O WITH ACUTE" },
      XK_Ocircumflex: { code: 212, description: "(\xD4) LATIN CAPITAL LETTER O WITH CIRCUMFLEX" },
      XK_Otilde: { code: 213, description: "(\xD5) LATIN CAPITAL LETTER O WITH TILDE" },
      XK_Odiaeresis: { code: 214, description: "(\xD6) LATIN CAPITAL LETTER O WITH DIAERESIS" },
      XK_multiply: { code: 215, description: "(\xD7) MULTIPLICATION SIGN" },
      XK_Oslash: { code: 216, description: "(\xD8) LATIN CAPITAL LETTER O WITH STROKE" },
      XK_Ooblique: { code: 216, description: "(\xD8) LATIN CAPITAL LETTER O WITH STROKE" },
      XK_Ugrave: { code: 217, description: "(\xD9) LATIN CAPITAL LETTER U WITH GRAVE" },
      XK_Uacute: { code: 218, description: "(\xDA) LATIN CAPITAL LETTER U WITH ACUTE" },
      XK_Ucircumflex: { code: 219, description: "(\xDB) LATIN CAPITAL LETTER U WITH CIRCUMFLEX" },
      XK_Udiaeresis: { code: 220, description: "(\xDC) LATIN CAPITAL LETTER U WITH DIAERESIS" },
      XK_Yacute: { code: 221, description: "(\xDD) LATIN CAPITAL LETTER Y WITH ACUTE" },
      XK_THORN: { code: 222, description: "(\xDE) LATIN CAPITAL LETTER THORN" },
      XK_Thorn: { code: 222, description: "deprecated" },
      XK_ssharp: { code: 223, description: "(\xDF) LATIN SMALL LETTER SHARP S" },
      XK_agrave: { code: 224, description: "(\xE0) LATIN SMALL LETTER A WITH GRAVE" },
      XK_aacute: { code: 225, description: "(\xE1) LATIN SMALL LETTER A WITH ACUTE" },
      XK_acircumflex: { code: 226, description: "(\xE2) LATIN SMALL LETTER A WITH CIRCUMFLEX" },
      XK_atilde: { code: 227, description: "(\xE3) LATIN SMALL LETTER A WITH TILDE" },
      XK_adiaeresis: { code: 228, description: "(\xE4) LATIN SMALL LETTER A WITH DIAERESIS" },
      XK_aring: { code: 229, description: "(\xE5) LATIN SMALL LETTER A WITH RING ABOVE" },
      XK_ae: { code: 230, description: "(\xE6) LATIN SMALL LETTER AE" },
      XK_ccedilla: { code: 231, description: "(\xE7) LATIN SMALL LETTER C WITH CEDILLA" },
      XK_egrave: { code: 232, description: "(\xE8) LATIN SMALL LETTER E WITH GRAVE" },
      XK_eacute: { code: 233, description: "(\xE9) LATIN SMALL LETTER E WITH ACUTE" },
      XK_ecircumflex: { code: 234, description: "(\xEA) LATIN SMALL LETTER E WITH CIRCUMFLEX" },
      XK_ediaeresis: { code: 235, description: "(\xEB) LATIN SMALL LETTER E WITH DIAERESIS" },
      XK_igrave: { code: 236, description: "(\xEC) LATIN SMALL LETTER I WITH GRAVE" },
      XK_iacute: { code: 237, description: "(\xED) LATIN SMALL LETTER I WITH ACUTE" },
      XK_icircumflex: { code: 238, description: "(\xEE) LATIN SMALL LETTER I WITH CIRCUMFLEX" },
      XK_idiaeresis: { code: 239, description: "(\xEF) LATIN SMALL LETTER I WITH DIAERESIS" },
      XK_eth: { code: 240, description: "(\xF0) LATIN SMALL LETTER ETH" },
      XK_ntilde: { code: 241, description: "(\xF1) LATIN SMALL LETTER N WITH TILDE" },
      XK_ograve: { code: 242, description: "(\xF2) LATIN SMALL LETTER O WITH GRAVE" },
      XK_oacute: { code: 243, description: "(\xF3) LATIN SMALL LETTER O WITH ACUTE" },
      XK_ocircumflex: { code: 244, description: "(\xF4) LATIN SMALL LETTER O WITH CIRCUMFLEX" },
      XK_otilde: { code: 245, description: "(\xF5) LATIN SMALL LETTER O WITH TILDE" },
      XK_odiaeresis: { code: 246, description: "(\xF6) LATIN SMALL LETTER O WITH DIAERESIS" },
      XK_division: { code: 247, description: "(\xF7) DIVISION SIGN" },
      XK_oslash: { code: 248, description: "(\xF8) LATIN SMALL LETTER O WITH STROKE" },
      XK_ooblique: { code: 248, description: "(\xF8) LATIN SMALL LETTER O WITH STROKE" },
      XK_ugrave: { code: 249, description: "(\xF9) LATIN SMALL LETTER U WITH GRAVE" },
      XK_uacute: { code: 250, description: "(\xFA) LATIN SMALL LETTER U WITH ACUTE" },
      XK_ucircumflex: { code: 251, description: "(\xFB) LATIN SMALL LETTER U WITH CIRCUMFLEX" },
      XK_udiaeresis: { code: 252, description: "(\xFC) LATIN SMALL LETTER U WITH DIAERESIS" },
      XK_yacute: { code: 253, description: "(\xFD) LATIN SMALL LETTER Y WITH ACUTE" },
      XK_thorn: { code: 254, description: "(\xFE) LATIN SMALL LETTER THORN" },
      XK_ydiaeresis: { code: 255, description: "(\xFF) LATIN SMALL LETTER Y WITH DIAERESIS" },
      /*
       * Latin 2
       * Byte 3 = 1
       */
      // Group XK_LATIN2
      XK_Aogonek: { code: 417, description: "(\u0104) LATIN CAPITAL LETTER A WITH OGONEK" },
      XK_breve: { code: 418, description: "(\u02D8) BREVE" },
      XK_Lstroke: { code: 419, description: "(\u0141) LATIN CAPITAL LETTER L WITH STROKE" },
      XK_Lcaron: { code: 421, description: "(\u013D) LATIN CAPITAL LETTER L WITH CARON" },
      XK_Sacute: { code: 422, description: "(\u015A) LATIN CAPITAL LETTER S WITH ACUTE" },
      XK_Scaron: { code: 425, description: "(\u0160) LATIN CAPITAL LETTER S WITH CARON" },
      XK_Scedilla: { code: 426, description: "(\u015E) LATIN CAPITAL LETTER S WITH CEDILLA" },
      XK_Tcaron: { code: 427, description: "(\u0164) LATIN CAPITAL LETTER T WITH CARON" },
      XK_Zacute: { code: 428, description: "(\u0179) LATIN CAPITAL LETTER Z WITH ACUTE" },
      XK_Zcaron: { code: 430, description: "(\u017D) LATIN CAPITAL LETTER Z WITH CARON" },
      XK_Zabovedot: { code: 431, description: "(\u017B) LATIN CAPITAL LETTER Z WITH DOT ABOVE" },
      XK_aogonek: { code: 433, description: "(\u0105) LATIN SMALL LETTER A WITH OGONEK" },
      XK_ogonek: { code: 434, description: "(\u02DB) OGONEK" },
      XK_lstroke: { code: 435, description: "(\u0142) LATIN SMALL LETTER L WITH STROKE" },
      XK_lcaron: { code: 437, description: "(\u013E) LATIN SMALL LETTER L WITH CARON" },
      XK_sacute: { code: 438, description: "(\u015B) LATIN SMALL LETTER S WITH ACUTE" },
      XK_caron: { code: 439, description: "(\u02C7) CARON" },
      XK_scaron: { code: 441, description: "(\u0161) LATIN SMALL LETTER S WITH CARON" },
      XK_scedilla: { code: 442, description: "(\u015F) LATIN SMALL LETTER S WITH CEDILLA" },
      XK_tcaron: { code: 443, description: "(\u0165) LATIN SMALL LETTER T WITH CARON" },
      XK_zacute: { code: 444, description: "(\u017A) LATIN SMALL LETTER Z WITH ACUTE" },
      XK_doubleacute: { code: 445, description: "(\u02DD) DOUBLE ACUTE ACCENT" },
      XK_zcaron: { code: 446, description: "(\u017E) LATIN SMALL LETTER Z WITH CARON" },
      XK_zabovedot: { code: 447, description: "(\u017C) LATIN SMALL LETTER Z WITH DOT ABOVE" },
      XK_Racute: { code: 448, description: "(\u0154) LATIN CAPITAL LETTER R WITH ACUTE" },
      XK_Abreve: { code: 451, description: "(\u0102) LATIN CAPITAL LETTER A WITH BREVE" },
      XK_Lacute: { code: 453, description: "(\u0139) LATIN CAPITAL LETTER L WITH ACUTE" },
      XK_Cacute: { code: 454, description: "(\u0106) LATIN CAPITAL LETTER C WITH ACUTE" },
      XK_Ccaron: { code: 456, description: "(\u010C) LATIN CAPITAL LETTER C WITH CARON" },
      XK_Eogonek: { code: 458, description: "(\u0118) LATIN CAPITAL LETTER E WITH OGONEK" },
      XK_Ecaron: { code: 460, description: "(\u011A) LATIN CAPITAL LETTER E WITH CARON" },
      XK_Dcaron: { code: 463, description: "(\u010E) LATIN CAPITAL LETTER D WITH CARON" },
      XK_Dstroke: { code: 464, description: "(\u0110) LATIN CAPITAL LETTER D WITH STROKE" },
      XK_Nacute: { code: 465, description: "(\u0143) LATIN CAPITAL LETTER N WITH ACUTE" },
      XK_Ncaron: { code: 466, description: "(\u0147) LATIN CAPITAL LETTER N WITH CARON" },
      XK_Odoubleacute: { code: 469, description: "(\u0150) LATIN CAPITAL LETTER O WITH DOUBLE ACUTE" },
      XK_Rcaron: { code: 472, description: "(\u0158) LATIN CAPITAL LETTER R WITH CARON" },
      XK_Uring: { code: 473, description: "(\u016E) LATIN CAPITAL LETTER U WITH RING ABOVE" },
      XK_Udoubleacute: { code: 475, description: "(\u0170) LATIN CAPITAL LETTER U WITH DOUBLE ACUTE" },
      XK_Tcedilla: { code: 478, description: "(\u0162) LATIN CAPITAL LETTER T WITH CEDILLA" },
      XK_racute: { code: 480, description: "(\u0155) LATIN SMALL LETTER R WITH ACUTE" },
      XK_abreve: { code: 483, description: "(\u0103) LATIN SMALL LETTER A WITH BREVE" },
      XK_lacute: { code: 485, description: "(\u013A) LATIN SMALL LETTER L WITH ACUTE" },
      XK_cacute: { code: 486, description: "(\u0107) LATIN SMALL LETTER C WITH ACUTE" },
      XK_ccaron: { code: 488, description: "(\u010D) LATIN SMALL LETTER C WITH CARON" },
      XK_eogonek: { code: 490, description: "(\u0119) LATIN SMALL LETTER E WITH OGONEK" },
      XK_ecaron: { code: 492, description: "(\u011B) LATIN SMALL LETTER E WITH CARON" },
      XK_dcaron: { code: 495, description: "(\u010F) LATIN SMALL LETTER D WITH CARON" },
      XK_dstroke: { code: 496, description: "(\u0111) LATIN SMALL LETTER D WITH STROKE" },
      XK_nacute: { code: 497, description: "(\u0144) LATIN SMALL LETTER N WITH ACUTE" },
      XK_ncaron: { code: 498, description: "(\u0148) LATIN SMALL LETTER N WITH CARON" },
      XK_odoubleacute: { code: 501, description: "(\u0151) LATIN SMALL LETTER O WITH DOUBLE ACUTE" },
      XK_rcaron: { code: 504, description: "(\u0159) LATIN SMALL LETTER R WITH CARON" },
      XK_uring: { code: 505, description: "(\u016F) LATIN SMALL LETTER U WITH RING ABOVE" },
      XK_udoubleacute: { code: 507, description: "(\u0171) LATIN SMALL LETTER U WITH DOUBLE ACUTE" },
      XK_tcedilla: { code: 510, description: "(\u0163) LATIN SMALL LETTER T WITH CEDILLA" },
      XK_abovedot: { code: 511, description: "(\u02D9) DOT ABOVE" },
      /*
       * Latin 3
       * Byte 3 = 2
       */
      // Group XK_LATIN3
      XK_Hstroke: { code: 673, description: "(\u0126) LATIN CAPITAL LETTER H WITH STROKE" },
      XK_Hcircumflex: { code: 678, description: "(\u0124) LATIN CAPITAL LETTER H WITH CIRCUMFLEX" },
      XK_Iabovedot: { code: 681, description: "(\u0130) LATIN CAPITAL LETTER I WITH DOT ABOVE" },
      XK_Gbreve: { code: 683, description: "(\u011E) LATIN CAPITAL LETTER G WITH BREVE" },
      XK_Jcircumflex: { code: 684, description: "(\u0134) LATIN CAPITAL LETTER J WITH CIRCUMFLEX" },
      XK_hstroke: { code: 689, description: "(\u0127) LATIN SMALL LETTER H WITH STROKE" },
      XK_hcircumflex: { code: 694, description: "(\u0125) LATIN SMALL LETTER H WITH CIRCUMFLEX" },
      XK_idotless: { code: 697, description: "(\u0131) LATIN SMALL LETTER DOTLESS I" },
      XK_gbreve: { code: 699, description: "(\u011F) LATIN SMALL LETTER G WITH BREVE" },
      XK_jcircumflex: { code: 700, description: "(\u0135) LATIN SMALL LETTER J WITH CIRCUMFLEX" },
      XK_Cabovedot: { code: 709, description: "(\u010A) LATIN CAPITAL LETTER C WITH DOT ABOVE" },
      XK_Ccircumflex: { code: 710, description: "(\u0108) LATIN CAPITAL LETTER C WITH CIRCUMFLEX" },
      XK_Gabovedot: { code: 725, description: "(\u0120) LATIN CAPITAL LETTER G WITH DOT ABOVE" },
      XK_Gcircumflex: { code: 728, description: "(\u011C) LATIN CAPITAL LETTER G WITH CIRCUMFLEX" },
      XK_Ubreve: { code: 733, description: "(\u016C) LATIN CAPITAL LETTER U WITH BREVE" },
      XK_Scircumflex: { code: 734, description: "(\u015C) LATIN CAPITAL LETTER S WITH CIRCUMFLEX" },
      XK_cabovedot: { code: 741, description: "(\u010B) LATIN SMALL LETTER C WITH DOT ABOVE" },
      XK_ccircumflex: { code: 742, description: "(\u0109) LATIN SMALL LETTER C WITH CIRCUMFLEX" },
      XK_gabovedot: { code: 757, description: "(\u0121) LATIN SMALL LETTER G WITH DOT ABOVE" },
      XK_gcircumflex: { code: 760, description: "(\u011D) LATIN SMALL LETTER G WITH CIRCUMFLEX" },
      XK_ubreve: { code: 765, description: "(\u016D) LATIN SMALL LETTER U WITH BREVE" },
      XK_scircumflex: { code: 766, description: "(\u015D) LATIN SMALL LETTER S WITH CIRCUMFLEX" },
      /*
       * Latin 4
       * Byte 3 = 3
       */
      // Group XK_LATIN4
      XK_kra: { code: 930, description: "(\u0138) LATIN SMALL LETTER KRA" },
      XK_kappa: { code: 930, description: "deprecated" },
      XK_Rcedilla: { code: 931, description: "(\u0156) LATIN CAPITAL LETTER R WITH CEDILLA" },
      XK_Itilde: { code: 933, description: "(\u0128) LATIN CAPITAL LETTER I WITH TILDE" },
      XK_Lcedilla: { code: 934, description: "(\u013B) LATIN CAPITAL LETTER L WITH CEDILLA" },
      XK_Emacron: { code: 938, description: "(\u0112) LATIN CAPITAL LETTER E WITH MACRON" },
      XK_Gcedilla: { code: 939, description: "(\u0122) LATIN CAPITAL LETTER G WITH CEDILLA" },
      XK_Tslash: { code: 940, description: "(\u0166) LATIN CAPITAL LETTER T WITH STROKE" },
      XK_rcedilla: { code: 947, description: "(\u0157) LATIN SMALL LETTER R WITH CEDILLA" },
      XK_itilde: { code: 949, description: "(\u0129) LATIN SMALL LETTER I WITH TILDE" },
      XK_lcedilla: { code: 950, description: "(\u013C) LATIN SMALL LETTER L WITH CEDILLA" },
      XK_emacron: { code: 954, description: "(\u0113) LATIN SMALL LETTER E WITH MACRON" },
      XK_gcedilla: { code: 955, description: "(\u0123) LATIN SMALL LETTER G WITH CEDILLA" },
      XK_tslash: { code: 956, description: "(\u0167) LATIN SMALL LETTER T WITH STROKE" },
      XK_ENG: { code: 957, description: "(\u014A) LATIN CAPITAL LETTER ENG" },
      XK_eng: { code: 959, description: "(\u014B) LATIN SMALL LETTER ENG" },
      XK_Amacron: { code: 960, description: "(\u0100) LATIN CAPITAL LETTER A WITH MACRON" },
      XK_Iogonek: { code: 967, description: "(\u012E) LATIN CAPITAL LETTER I WITH OGONEK" },
      XK_Eabovedot: { code: 972, description: "(\u0116) LATIN CAPITAL LETTER E WITH DOT ABOVE" },
      XK_Imacron: { code: 975, description: "(\u012A) LATIN CAPITAL LETTER I WITH MACRON" },
      XK_Ncedilla: { code: 977, description: "(\u0145) LATIN CAPITAL LETTER N WITH CEDILLA" },
      XK_Omacron: { code: 978, description: "(\u014C) LATIN CAPITAL LETTER O WITH MACRON" },
      XK_Kcedilla: { code: 979, description: "(\u0136) LATIN CAPITAL LETTER K WITH CEDILLA" },
      XK_Uogonek: { code: 985, description: "(\u0172) LATIN CAPITAL LETTER U WITH OGONEK" },
      XK_Utilde: { code: 989, description: "(\u0168) LATIN CAPITAL LETTER U WITH TILDE" },
      XK_Umacron: { code: 990, description: "(\u016A) LATIN CAPITAL LETTER U WITH MACRON" },
      XK_amacron: { code: 992, description: "(\u0101) LATIN SMALL LETTER A WITH MACRON" },
      XK_iogonek: { code: 999, description: "(\u012F) LATIN SMALL LETTER I WITH OGONEK" },
      XK_eabovedot: { code: 1004, description: "(\u0117) LATIN SMALL LETTER E WITH DOT ABOVE" },
      XK_imacron: { code: 1007, description: "(\u012B) LATIN SMALL LETTER I WITH MACRON" },
      XK_ncedilla: { code: 1009, description: "(\u0146) LATIN SMALL LETTER N WITH CEDILLA" },
      XK_omacron: { code: 1010, description: "(\u014D) LATIN SMALL LETTER O WITH MACRON" },
      XK_kcedilla: { code: 1011, description: "(\u0137) LATIN SMALL LETTER K WITH CEDILLA" },
      XK_uogonek: { code: 1017, description: "(\u0173) LATIN SMALL LETTER U WITH OGONEK" },
      XK_utilde: { code: 1021, description: "(\u0169) LATIN SMALL LETTER U WITH TILDE" },
      XK_umacron: { code: 1022, description: "(\u016B) LATIN SMALL LETTER U WITH MACRON" },
      /*
       * Latin 8
       */
      // Group XK_LATIN8
      XK_Wcircumflex: { code: 16777588, description: "(\u0174) LATIN CAPITAL LETTER W WITH CIRCUMFLEX" },
      XK_wcircumflex: { code: 16777589, description: "(\u0175) LATIN SMALL LETTER W WITH CIRCUMFLEX" },
      XK_Ycircumflex: { code: 16777590, description: "(\u0176) LATIN CAPITAL LETTER Y WITH CIRCUMFLEX" },
      XK_ycircumflex: { code: 16777591, description: "(\u0177) LATIN SMALL LETTER Y WITH CIRCUMFLEX" },
      XK_Babovedot: { code: 16784898, description: "(\u1E02) LATIN CAPITAL LETTER B WITH DOT ABOVE" },
      XK_babovedot: { code: 16784899, description: "(\u1E03) LATIN SMALL LETTER B WITH DOT ABOVE" },
      XK_Dabovedot: { code: 16784906, description: "(\u1E0A) LATIN CAPITAL LETTER D WITH DOT ABOVE" },
      XK_dabovedot: { code: 16784907, description: "(\u1E0B) LATIN SMALL LETTER D WITH DOT ABOVE" },
      XK_Fabovedot: { code: 16784926, description: "(\u1E1E) LATIN CAPITAL LETTER F WITH DOT ABOVE" },
      XK_fabovedot: { code: 16784927, description: "(\u1E1F) LATIN SMALL LETTER F WITH DOT ABOVE" },
      XK_Mabovedot: { code: 16784960, description: "(\u1E40) LATIN CAPITAL LETTER M WITH DOT ABOVE" },
      XK_mabovedot: { code: 16784961, description: "(\u1E41) LATIN SMALL LETTER M WITH DOT ABOVE" },
      XK_Pabovedot: { code: 16784982, description: "(\u1E56) LATIN CAPITAL LETTER P WITH DOT ABOVE" },
      XK_pabovedot: { code: 16784983, description: "(\u1E57) LATIN SMALL LETTER P WITH DOT ABOVE" },
      XK_Sabovedot: { code: 16784992, description: "(\u1E60) LATIN CAPITAL LETTER S WITH DOT ABOVE" },
      XK_sabovedot: { code: 16784993, description: "(\u1E61) LATIN SMALL LETTER S WITH DOT ABOVE" },
      XK_Tabovedot: { code: 16785002, description: "(\u1E6A) LATIN CAPITAL LETTER T WITH DOT ABOVE" },
      XK_tabovedot: { code: 16785003, description: "(\u1E6B) LATIN SMALL LETTER T WITH DOT ABOVE" },
      XK_Wgrave: { code: 16785024, description: "(\u1E80) LATIN CAPITAL LETTER W WITH GRAVE" },
      XK_wgrave: { code: 16785025, description: "(\u1E81) LATIN SMALL LETTER W WITH GRAVE" },
      XK_Wacute: { code: 16785026, description: "(\u1E82) LATIN CAPITAL LETTER W WITH ACUTE" },
      XK_wacute: { code: 16785027, description: "(\u1E83) LATIN SMALL LETTER W WITH ACUTE" },
      XK_Wdiaeresis: { code: 16785028, description: "(\u1E84) LATIN CAPITAL LETTER W WITH DIAERESIS" },
      XK_wdiaeresis: { code: 16785029, description: "(\u1E85) LATIN SMALL LETTER W WITH DIAERESIS" },
      XK_Ygrave: { code: 16785138, description: "(\u1EF2) LATIN CAPITAL LETTER Y WITH GRAVE" },
      XK_ygrave: { code: 16785139, description: "(\u1EF3) LATIN SMALL LETTER Y WITH GRAVE" },
      /*
       * Latin 9
       * Byte 3 = 0x13
       */
      // Group XK_LATIN9
      XK_OE: { code: 5052, description: "(\u0152) LATIN CAPITAL LIGATURE OE" },
      XK_oe: { code: 5053, description: "(\u0153) LATIN SMALL LIGATURE OE" },
      XK_Ydiaeresis: { code: 5054, description: "(\u0178) LATIN CAPITAL LETTER Y WITH DIAERESIS" },
      /*
       * Katakana
       * Byte 3 = 4
       */
      // Group XK_KATAKANA
      XK_overline: { code: 1150, description: "(\u203E) OVERLINE" },
      XK_kana_fullstop: { code: 1185, description: "(\u3002) IDEOGRAPHIC FULL STOP" },
      XK_kana_openingbracket: { code: 1186, description: "(\u300C) LEFT CORNER BRACKET" },
      XK_kana_closingbracket: { code: 1187, description: "(\u300D) RIGHT CORNER BRACKET" },
      XK_kana_comma: { code: 1188, description: "(\u3001) IDEOGRAPHIC COMMA" },
      XK_kana_conjunctive: { code: 1189, description: "(\u30FB) KATAKANA MIDDLE DOT" },
      XK_kana_middledot: { code: 1189, description: "deprecated" },
      XK_kana_WO: { code: 1190, description: "(\u30F2) KATAKANA LETTER WO" },
      XK_kana_a: { code: 1191, description: "(\u30A1) KATAKANA LETTER SMALL A" },
      XK_kana_i: { code: 1192, description: "(\u30A3) KATAKANA LETTER SMALL I" },
      XK_kana_u: { code: 1193, description: "(\u30A5) KATAKANA LETTER SMALL U" },
      XK_kana_e: { code: 1194, description: "(\u30A7) KATAKANA LETTER SMALL E" },
      XK_kana_o: { code: 1195, description: "(\u30A9) KATAKANA LETTER SMALL O" },
      XK_kana_ya: { code: 1196, description: "(\u30E3) KATAKANA LETTER SMALL YA" },
      XK_kana_yu: { code: 1197, description: "(\u30E5) KATAKANA LETTER SMALL YU" },
      XK_kana_yo: { code: 1198, description: "(\u30E7) KATAKANA LETTER SMALL YO" },
      XK_kana_tsu: { code: 1199, description: "(\u30C3) KATAKANA LETTER SMALL TU" },
      XK_kana_tu: { code: 1199, description: "deprecated" },
      XK_prolongedsound: { code: 1200, description: "(\u30FC) KATAKANA-HIRAGANA PROLONGED SOUND MARK" },
      XK_kana_A: { code: 1201, description: "(\u30A2) KATAKANA LETTER A" },
      XK_kana_I: { code: 1202, description: "(\u30A4) KATAKANA LETTER I" },
      XK_kana_U: { code: 1203, description: "(\u30A6) KATAKANA LETTER U" },
      XK_kana_E: { code: 1204, description: "(\u30A8) KATAKANA LETTER E" },
      XK_kana_O: { code: 1205, description: "(\u30AA) KATAKANA LETTER O" },
      XK_kana_KA: { code: 1206, description: "(\u30AB) KATAKANA LETTER KA" },
      XK_kana_KI: { code: 1207, description: "(\u30AD) KATAKANA LETTER KI" },
      XK_kana_KU: { code: 1208, description: "(\u30AF) KATAKANA LETTER KU" },
      XK_kana_KE: { code: 1209, description: "(\u30B1) KATAKANA LETTER KE" },
      XK_kana_KO: { code: 1210, description: "(\u30B3) KATAKANA LETTER KO" },
      XK_kana_SA: { code: 1211, description: "(\u30B5) KATAKANA LETTER SA" },
      XK_kana_SHI: { code: 1212, description: "(\u30B7) KATAKANA LETTER SI" },
      XK_kana_SU: { code: 1213, description: "(\u30B9) KATAKANA LETTER SU" },
      XK_kana_SE: { code: 1214, description: "(\u30BB) KATAKANA LETTER SE" },
      XK_kana_SO: { code: 1215, description: "(\u30BD) KATAKANA LETTER SO" },
      XK_kana_TA: { code: 1216, description: "(\u30BF) KATAKANA LETTER TA" },
      XK_kana_CHI: { code: 1217, description: "(\u30C1) KATAKANA LETTER TI" },
      XK_kana_TI: { code: 1217, description: "deprecated" },
      XK_kana_TSU: { code: 1218, description: "(\u30C4) KATAKANA LETTER TU" },
      XK_kana_TU: { code: 1218, description: "deprecated" },
      XK_kana_TE: { code: 1219, description: "(\u30C6) KATAKANA LETTER TE" },
      XK_kana_TO: { code: 1220, description: "(\u30C8) KATAKANA LETTER TO" },
      XK_kana_NA: { code: 1221, description: "(\u30CA) KATAKANA LETTER NA" },
      XK_kana_NI: { code: 1222, description: "(\u30CB) KATAKANA LETTER NI" },
      XK_kana_NU: { code: 1223, description: "(\u30CC) KATAKANA LETTER NU" },
      XK_kana_NE: { code: 1224, description: "(\u30CD) KATAKANA LETTER NE" },
      XK_kana_NO: { code: 1225, description: "(\u30CE) KATAKANA LETTER NO" },
      XK_kana_HA: { code: 1226, description: "(\u30CF) KATAKANA LETTER HA" },
      XK_kana_HI: { code: 1227, description: "(\u30D2) KATAKANA LETTER HI" },
      XK_kana_FU: { code: 1228, description: "(\u30D5) KATAKANA LETTER HU" },
      XK_kana_HU: { code: 1228, description: "deprecated" },
      XK_kana_HE: { code: 1229, description: "(\u30D8) KATAKANA LETTER HE" },
      XK_kana_HO: { code: 1230, description: "(\u30DB) KATAKANA LETTER HO" },
      XK_kana_MA: { code: 1231, description: "(\u30DE) KATAKANA LETTER MA" },
      XK_kana_MI: { code: 1232, description: "(\u30DF) KATAKANA LETTER MI" },
      XK_kana_MU: { code: 1233, description: "(\u30E0) KATAKANA LETTER MU" },
      XK_kana_ME: { code: 1234, description: "(\u30E1) KATAKANA LETTER ME" },
      XK_kana_MO: { code: 1235, description: "(\u30E2) KATAKANA LETTER MO" },
      XK_kana_YA: { code: 1236, description: "(\u30E4) KATAKANA LETTER YA" },
      XK_kana_YU: { code: 1237, description: "(\u30E6) KATAKANA LETTER YU" },
      XK_kana_YO: { code: 1238, description: "(\u30E8) KATAKANA LETTER YO" },
      XK_kana_RA: { code: 1239, description: "(\u30E9) KATAKANA LETTER RA" },
      XK_kana_RI: { code: 1240, description: "(\u30EA) KATAKANA LETTER RI" },
      XK_kana_RU: { code: 1241, description: "(\u30EB) KATAKANA LETTER RU" },
      XK_kana_RE: { code: 1242, description: "(\u30EC) KATAKANA LETTER RE" },
      XK_kana_RO: { code: 1243, description: "(\u30ED) KATAKANA LETTER RO" },
      XK_kana_WA: { code: 1244, description: "(\u30EF) KATAKANA LETTER WA" },
      XK_kana_N: { code: 1245, description: "(\u30F3) KATAKANA LETTER N" },
      XK_voicedsound: { code: 1246, description: "(\u309B) KATAKANA-HIRAGANA VOICED SOUND MARK" },
      XK_semivoicedsound: { code: 1247, description: "(\u309C) KATAKANA-HIRAGANA SEMI-VOICED SOUND MARK" },
      XK_kana_switch: { code: 65406, description: "Alias for mode_switch" },
      /*
       * Arabic
       * Byte 3 = 5
       */
      // Group XK_ARABIC
      XK_Farsi_0: { code: 16778992, description: "(\u06F0) EXTENDED ARABIC-INDIC DIGIT ZERO" },
      XK_Farsi_1: { code: 16778993, description: "(\u06F1) EXTENDED ARABIC-INDIC DIGIT ONE" },
      XK_Farsi_2: { code: 16778994, description: "(\u06F2) EXTENDED ARABIC-INDIC DIGIT TWO" },
      XK_Farsi_3: { code: 16778995, description: "(\u06F3) EXTENDED ARABIC-INDIC DIGIT THREE" },
      XK_Farsi_4: { code: 16778996, description: "(\u06F4) EXTENDED ARABIC-INDIC DIGIT FOUR" },
      XK_Farsi_5: { code: 16778997, description: "(\u06F5) EXTENDED ARABIC-INDIC DIGIT FIVE" },
      XK_Farsi_6: { code: 16778998, description: "(\u06F6) EXTENDED ARABIC-INDIC DIGIT SIX" },
      XK_Farsi_7: { code: 16778999, description: "(\u06F7) EXTENDED ARABIC-INDIC DIGIT SEVEN" },
      XK_Farsi_8: { code: 16779e3, description: "(\u06F8) EXTENDED ARABIC-INDIC DIGIT EIGHT" },
      XK_Farsi_9: { code: 16779001, description: "(\u06F9) EXTENDED ARABIC-INDIC DIGIT NINE" },
      XK_Arabic_percent: { code: 16778858, description: "(\u066A) ARABIC PERCENT SIGN" },
      XK_Arabic_superscript_alef: { code: 16778864, description: "(\u0670) ARABIC LETTER SUPERSCRIPT ALEF" },
      XK_Arabic_tteh: { code: 16778873, description: "(\u0679) ARABIC LETTER TTEH" },
      XK_Arabic_peh: { code: 16778878, description: "(\u067E) ARABIC LETTER PEH" },
      XK_Arabic_tcheh: { code: 16778886, description: "(\u0686) ARABIC LETTER TCHEH" },
      XK_Arabic_ddal: { code: 16778888, description: "(\u0688) ARABIC LETTER DDAL" },
      XK_Arabic_rreh: { code: 16778897, description: "(\u0691) ARABIC LETTER RREH" },
      XK_Arabic_comma: { code: 1452, description: "(\u060C) ARABIC COMMA" },
      XK_Arabic_fullstop: { code: 16778964, description: "(\u06D4) ARABIC FULL STOP" },
      XK_Arabic_0: { code: 16778848, description: "(\u0660) ARABIC-INDIC DIGIT ZERO" },
      XK_Arabic_1: { code: 16778849, description: "(\u0661) ARABIC-INDIC DIGIT ONE" },
      XK_Arabic_2: { code: 16778850, description: "(\u0662) ARABIC-INDIC DIGIT TWO" },
      XK_Arabic_3: { code: 16778851, description: "(\u0663) ARABIC-INDIC DIGIT THREE" },
      XK_Arabic_4: { code: 16778852, description: "(\u0664) ARABIC-INDIC DIGIT FOUR" },
      XK_Arabic_5: { code: 16778853, description: "(\u0665) ARABIC-INDIC DIGIT FIVE" },
      XK_Arabic_6: { code: 16778854, description: "(\u0666) ARABIC-INDIC DIGIT SIX" },
      XK_Arabic_7: { code: 16778855, description: "(\u0667) ARABIC-INDIC DIGIT SEVEN" },
      XK_Arabic_8: { code: 16778856, description: "(\u0668) ARABIC-INDIC DIGIT EIGHT" },
      XK_Arabic_9: { code: 16778857, description: "(\u0669) ARABIC-INDIC DIGIT NINE" },
      XK_Arabic_semicolon: { code: 1467, description: "(\u061B) ARABIC SEMICOLON" },
      XK_Arabic_question_mark: { code: 1471, description: "(\u061F) ARABIC QUESTION MARK" },
      XK_Arabic_hamza: { code: 1473, description: "(\u0621) ARABIC LETTER HAMZA" },
      XK_Arabic_maddaonalef: { code: 1474, description: "(\u0622) ARABIC LETTER ALEF WITH MADDA ABOVE" },
      XK_Arabic_hamzaonalef: { code: 1475, description: "(\u0623) ARABIC LETTER ALEF WITH HAMZA ABOVE" },
      XK_Arabic_hamzaonwaw: { code: 1476, description: "(\u0624) ARABIC LETTER WAW WITH HAMZA ABOVE" },
      XK_Arabic_hamzaunderalef: { code: 1477, description: "(\u0625) ARABIC LETTER ALEF WITH HAMZA BELOW" },
      XK_Arabic_hamzaonyeh: { code: 1478, description: "(\u0626) ARABIC LETTER YEH WITH HAMZA ABOVE" },
      XK_Arabic_alef: { code: 1479, description: "(\u0627) ARABIC LETTER ALEF" },
      XK_Arabic_beh: { code: 1480, description: "(\u0628) ARABIC LETTER BEH" },
      XK_Arabic_tehmarbuta: { code: 1481, description: "(\u0629) ARABIC LETTER TEH MARBUTA" },
      XK_Arabic_teh: { code: 1482, description: "(\u062A) ARABIC LETTER TEH" },
      XK_Arabic_theh: { code: 1483, description: "(\u062B) ARABIC LETTER THEH" },
      XK_Arabic_jeem: { code: 1484, description: "(\u062C) ARABIC LETTER JEEM" },
      XK_Arabic_hah: { code: 1485, description: "(\u062D) ARABIC LETTER HAH" },
      XK_Arabic_khah: { code: 1486, description: "(\u062E) ARABIC LETTER KHAH" },
      XK_Arabic_dal: { code: 1487, description: "(\u062F) ARABIC LETTER DAL" },
      XK_Arabic_thal: { code: 1488, description: "(\u0630) ARABIC LETTER THAL" },
      XK_Arabic_ra: { code: 1489, description: "(\u0631) ARABIC LETTER REH" },
      XK_Arabic_zain: { code: 1490, description: "(\u0632) ARABIC LETTER ZAIN" },
      XK_Arabic_seen: { code: 1491, description: "(\u0633) ARABIC LETTER SEEN" },
      XK_Arabic_sheen: { code: 1492, description: "(\u0634) ARABIC LETTER SHEEN" },
      XK_Arabic_sad: { code: 1493, description: "(\u0635) ARABIC LETTER SAD" },
      XK_Arabic_dad: { code: 1494, description: "(\u0636) ARABIC LETTER DAD" },
      XK_Arabic_tah: { code: 1495, description: "(\u0637) ARABIC LETTER TAH" },
      XK_Arabic_zah: { code: 1496, description: "(\u0638) ARABIC LETTER ZAH" },
      XK_Arabic_ain: { code: 1497, description: "(\u0639) ARABIC LETTER AIN" },
      XK_Arabic_ghain: { code: 1498, description: "(\u063A) ARABIC LETTER GHAIN" },
      XK_Arabic_tatweel: { code: 1504, description: "(\u0640) ARABIC TATWEEL" },
      XK_Arabic_feh: { code: 1505, description: "(\u0641) ARABIC LETTER FEH" },
      XK_Arabic_qaf: { code: 1506, description: "(\u0642) ARABIC LETTER QAF" },
      XK_Arabic_kaf: { code: 1507, description: "(\u0643) ARABIC LETTER KAF" },
      XK_Arabic_lam: { code: 1508, description: "(\u0644) ARABIC LETTER LAM" },
      XK_Arabic_meem: { code: 1509, description: "(\u0645) ARABIC LETTER MEEM" },
      XK_Arabic_noon: { code: 1510, description: "(\u0646) ARABIC LETTER NOON" },
      XK_Arabic_ha: { code: 1511, description: "(\u0647) ARABIC LETTER HEH" },
      XK_Arabic_heh: { code: 1511, description: "deprecated" },
      XK_Arabic_waw: { code: 1512, description: "(\u0648) ARABIC LETTER WAW" },
      XK_Arabic_alefmaksura: { code: 1513, description: "(\u0649) ARABIC LETTER ALEF MAKSURA" },
      XK_Arabic_yeh: { code: 1514, description: "(\u064A) ARABIC LETTER YEH" },
      XK_Arabic_fathatan: { code: 1515, description: "(\u064B) ARABIC FATHATAN" },
      XK_Arabic_dammatan: { code: 1516, description: "(\u064C) ARABIC DAMMATAN" },
      XK_Arabic_kasratan: { code: 1517, description: "(\u064D) ARABIC KASRATAN" },
      XK_Arabic_fatha: { code: 1518, description: "(\u064E) ARABIC FATHA" },
      XK_Arabic_damma: { code: 1519, description: "(\u064F) ARABIC DAMMA" },
      XK_Arabic_kasra: { code: 1520, description: "(\u0650) ARABIC KASRA" },
      XK_Arabic_shadda: { code: 1521, description: "(\u0651) ARABIC SHADDA" },
      XK_Arabic_sukun: { code: 1522, description: "(\u0652) ARABIC SUKUN" },
      XK_Arabic_madda_above: { code: 16778835, description: "(\u0653) ARABIC MADDAH ABOVE" },
      XK_Arabic_hamza_above: { code: 16778836, description: "(\u0654) ARABIC HAMZA ABOVE" },
      XK_Arabic_hamza_below: { code: 16778837, description: "(\u0655) ARABIC HAMZA BELOW" },
      XK_Arabic_jeh: { code: 16778904, description: "(\u0698) ARABIC LETTER JEH" },
      XK_Arabic_veh: { code: 16778916, description: "(\u06A4) ARABIC LETTER VEH" },
      XK_Arabic_keheh: { code: 16778921, description: "(\u06A9) ARABIC LETTER KEHEH" },
      XK_Arabic_gaf: { code: 16778927, description: "(\u06AF) ARABIC LETTER GAF" },
      XK_Arabic_noon_ghunna: { code: 16778938, description: "(\u06BA) ARABIC LETTER NOON GHUNNA" },
      XK_Arabic_heh_doachashmee: { code: 16778942, description: "(\u06BE) ARABIC LETTER HEH DOACHASHMEE" },
      XK_Farsi_yeh: { code: 16778956, description: "(\u06CC) ARABIC LETTER FARSI YEH" },
      XK_Arabic_farsi_yeh: { code: 16778956, description: "(\u06CC) ARABIC LETTER FARSI YEH" },
      XK_Arabic_yeh_baree: { code: 16778962, description: "(\u06D2) ARABIC LETTER YEH BARREE" },
      XK_Arabic_heh_goal: { code: 16778945, description: "(\u06C1) ARABIC LETTER HEH GOAL" },
      XK_Arabic_switch: { code: 65406, description: "Alias for mode_switch" },
      /*
       * Cyrillic
       * Byte 3 = 6
       */
      // Group XK_CYRILLIC
      XK_Cyrillic_GHE_bar: { code: 16778386, description: "(\u0492) CYRILLIC CAPITAL LETTER GHE WITH STROKE" },
      XK_Cyrillic_ghe_bar: { code: 16778387, description: "(\u0493) CYRILLIC SMALL LETTER GHE WITH STROKE" },
      XK_Cyrillic_ZHE_descender: { code: 16778390, description: "(\u0496) CYRILLIC CAPITAL LETTER ZHE WITH DESCENDER" },
      XK_Cyrillic_zhe_descender: { code: 16778391, description: "(\u0497) CYRILLIC SMALL LETTER ZHE WITH DESCENDER" },
      XK_Cyrillic_KA_descender: { code: 16778394, description: "(\u049A) CYRILLIC CAPITAL LETTER KA WITH DESCENDER" },
      XK_Cyrillic_ka_descender: { code: 16778395, description: "(\u049B) CYRILLIC SMALL LETTER KA WITH DESCENDER" },
      XK_Cyrillic_KA_vertstroke: { code: 16778396, description: "(\u049C) CYRILLIC CAPITAL LETTER KA WITH VERTICAL STROKE" },
      XK_Cyrillic_ka_vertstroke: { code: 16778397, description: "(\u049D) CYRILLIC SMALL LETTER KA WITH VERTICAL STROKE" },
      XK_Cyrillic_EN_descender: { code: 16778402, description: "(\u04A2) CYRILLIC CAPITAL LETTER EN WITH DESCENDER" },
      XK_Cyrillic_en_descender: { code: 16778403, description: "(\u04A3) CYRILLIC SMALL LETTER EN WITH DESCENDER" },
      XK_Cyrillic_U_straight: { code: 16778414, description: "(\u04AE) CYRILLIC CAPITAL LETTER STRAIGHT U" },
      XK_Cyrillic_u_straight: { code: 16778415, description: "(\u04AF) CYRILLIC SMALL LETTER STRAIGHT U" },
      XK_Cyrillic_U_straight_bar: { code: 16778416, description: "(\u04B0) CYRILLIC CAPITAL LETTER STRAIGHT U WITH STROKE" },
      XK_Cyrillic_u_straight_bar: { code: 16778417, description: "(\u04B1) CYRILLIC SMALL LETTER STRAIGHT U WITH STROKE" },
      XK_Cyrillic_HA_descender: { code: 16778418, description: "(\u04B2) CYRILLIC CAPITAL LETTER HA WITH DESCENDER" },
      XK_Cyrillic_ha_descender: { code: 16778419, description: "(\u04B3) CYRILLIC SMALL LETTER HA WITH DESCENDER" },
      XK_Cyrillic_CHE_descender: { code: 16778422, description: "(\u04B6) CYRILLIC CAPITAL LETTER CHE WITH DESCENDER" },
      XK_Cyrillic_che_descender: { code: 16778423, description: "(\u04B7) CYRILLIC SMALL LETTER CHE WITH DESCENDER" },
      XK_Cyrillic_CHE_vertstroke: { code: 16778424, description: "(\u04B8) CYRILLIC CAPITAL LETTER CHE WITH VERTICAL STROKE" },
      XK_Cyrillic_che_vertstroke: { code: 16778425, description: "(\u04B9) CYRILLIC SMALL LETTER CHE WITH VERTICAL STROKE" },
      XK_Cyrillic_SHHA: { code: 16778426, description: "(\u04BA) CYRILLIC CAPITAL LETTER SHHA" },
      XK_Cyrillic_shha: { code: 16778427, description: "(\u04BB) CYRILLIC SMALL LETTER SHHA" },
      XK_Cyrillic_SCHWA: { code: 16778456, description: "(\u04D8) CYRILLIC CAPITAL LETTER SCHWA" },
      XK_Cyrillic_schwa: { code: 16778457, description: "(\u04D9) CYRILLIC SMALL LETTER SCHWA" },
      XK_Cyrillic_I_macron: { code: 16778466, description: "(\u04E2) CYRILLIC CAPITAL LETTER I WITH MACRON" },
      XK_Cyrillic_i_macron: { code: 16778467, description: "(\u04E3) CYRILLIC SMALL LETTER I WITH MACRON" },
      XK_Cyrillic_O_bar: { code: 16778472, description: "(\u04E8) CYRILLIC CAPITAL LETTER BARRED O" },
      XK_Cyrillic_o_bar: { code: 16778473, description: "(\u04E9) CYRILLIC SMALL LETTER BARRED O" },
      XK_Cyrillic_U_macron: { code: 16778478, description: "(\u04EE) CYRILLIC CAPITAL LETTER U WITH MACRON" },
      XK_Cyrillic_u_macron: { code: 16778479, description: "(\u04EF) CYRILLIC SMALL LETTER U WITH MACRON" },
      XK_Serbian_dje: { code: 1697, description: "(\u0452) CYRILLIC SMALL LETTER DJE" },
      XK_Macedonia_gje: { code: 1698, description: "(\u0453) CYRILLIC SMALL LETTER GJE" },
      XK_Cyrillic_io: { code: 1699, description: "(\u0451) CYRILLIC SMALL LETTER IO" },
      XK_Ukrainian_ie: { code: 1700, description: "(\u0454) CYRILLIC SMALL LETTER UKRAINIAN IE" },
      XK_Ukranian_je: { code: 1700, description: "deprecated" },
      XK_Macedonia_dse: { code: 1701, description: "(\u0455) CYRILLIC SMALL LETTER DZE" },
      XK_Ukrainian_i: { code: 1702, description: "(\u0456) CYRILLIC SMALL LETTER BYELORUSSIAN-UKRAINIAN I" },
      XK_Ukranian_i: { code: 1702, description: "deprecated" },
      XK_Ukrainian_yi: { code: 1703, description: "(\u0457) CYRILLIC SMALL LETTER YI" },
      XK_Ukranian_yi: { code: 1703, description: "deprecated" },
      XK_Cyrillic_je: { code: 1704, description: "(\u0458) CYRILLIC SMALL LETTER JE" },
      XK_Serbian_je: { code: 1704, description: "deprecated" },
      XK_Cyrillic_lje: { code: 1705, description: "(\u0459) CYRILLIC SMALL LETTER LJE" },
      XK_Serbian_lje: { code: 1705, description: "deprecated" },
      XK_Cyrillic_nje: { code: 1706, description: "(\u045A) CYRILLIC SMALL LETTER NJE" },
      XK_Serbian_nje: { code: 1706, description: "deprecated" },
      XK_Serbian_tshe: { code: 1707, description: "(\u045B) CYRILLIC SMALL LETTER TSHE" },
      XK_Macedonia_kje: { code: 1708, description: "(\u045C) CYRILLIC SMALL LETTER KJE" },
      XK_Ukrainian_ghe_with_upturn: { code: 1709, description: "(\u0491) CYRILLIC SMALL LETTER GHE WITH UPTURN" },
      XK_Byelorussian_shortu: { code: 1710, description: "(\u045E) CYRILLIC SMALL LETTER SHORT U" },
      XK_Cyrillic_dzhe: { code: 1711, description: "(\u045F) CYRILLIC SMALL LETTER DZHE" },
      XK_Serbian_dze: { code: 1711, description: "deprecated" },
      XK_numerosign: { code: 1712, description: "(\u2116) NUMERO SIGN" },
      XK_Serbian_DJE: { code: 1713, description: "(\u0402) CYRILLIC CAPITAL LETTER DJE" },
      XK_Macedonia_GJE: { code: 1714, description: "(\u0403) CYRILLIC CAPITAL LETTER GJE" },
      XK_Cyrillic_IO: { code: 1715, description: "(\u0401) CYRILLIC CAPITAL LETTER IO" },
      XK_Ukrainian_IE: { code: 1716, description: "(\u0404) CYRILLIC CAPITAL LETTER UKRAINIAN IE" },
      XK_Ukranian_JE: { code: 1716, description: "deprecated" },
      XK_Macedonia_DSE: { code: 1717, description: "(\u0405) CYRILLIC CAPITAL LETTER DZE" },
      XK_Ukrainian_I: { code: 1718, description: "(\u0406) CYRILLIC CAPITAL LETTER BYELORUSSIAN-UKRAINIAN I" },
      XK_Ukranian_I: { code: 1718, description: "deprecated" },
      XK_Ukrainian_YI: { code: 1719, description: "(\u0407) CYRILLIC CAPITAL LETTER YI" },
      XK_Ukranian_YI: { code: 1719, description: "deprecated" },
      XK_Cyrillic_JE: { code: 1720, description: "(\u0408) CYRILLIC CAPITAL LETTER JE" },
      XK_Serbian_JE: { code: 1720, description: "deprecated" },
      XK_Cyrillic_LJE: { code: 1721, description: "(\u0409) CYRILLIC CAPITAL LETTER LJE" },
      XK_Serbian_LJE: { code: 1721, description: "deprecated" },
      XK_Cyrillic_NJE: { code: 1722, description: "(\u040A) CYRILLIC CAPITAL LETTER NJE" },
      XK_Serbian_NJE: { code: 1722, description: "deprecated" },
      XK_Serbian_TSHE: { code: 1723, description: "(\u040B) CYRILLIC CAPITAL LETTER TSHE" },
      XK_Macedonia_KJE: { code: 1724, description: "(\u040C) CYRILLIC CAPITAL LETTER KJE" },
      XK_Ukrainian_GHE_WITH_UPTURN: { code: 1725, description: "(\u0490) CYRILLIC CAPITAL LETTER GHE WITH UPTURN" },
      XK_Byelorussian_SHORTU: { code: 1726, description: "(\u040E) CYRILLIC CAPITAL LETTER SHORT U" },
      XK_Cyrillic_DZHE: { code: 1727, description: "(\u040F) CYRILLIC CAPITAL LETTER DZHE" },
      XK_Serbian_DZE: { code: 1727, description: "deprecated" },
      XK_Cyrillic_yu: { code: 1728, description: "(\u044E) CYRILLIC SMALL LETTER YU" },
      XK_Cyrillic_a: { code: 1729, description: "(\u0430) CYRILLIC SMALL LETTER A" },
      XK_Cyrillic_be: { code: 1730, description: "(\u0431) CYRILLIC SMALL LETTER BE" },
      XK_Cyrillic_tse: { code: 1731, description: "(\u0446) CYRILLIC SMALL LETTER TSE" },
      XK_Cyrillic_de: { code: 1732, description: "(\u0434) CYRILLIC SMALL LETTER DE" },
      XK_Cyrillic_ie: { code: 1733, description: "(\u0435) CYRILLIC SMALL LETTER IE" },
      XK_Cyrillic_ef: { code: 1734, description: "(\u0444) CYRILLIC SMALL LETTER EF" },
      XK_Cyrillic_ghe: { code: 1735, description: "(\u0433) CYRILLIC SMALL LETTER GHE" },
      XK_Cyrillic_ha: { code: 1736, description: "(\u0445) CYRILLIC SMALL LETTER HA" },
      XK_Cyrillic_i: { code: 1737, description: "(\u0438) CYRILLIC SMALL LETTER I" },
      XK_Cyrillic_shorti: { code: 1738, description: "(\u0439) CYRILLIC SMALL LETTER SHORT I" },
      XK_Cyrillic_ka: { code: 1739, description: "(\u043A) CYRILLIC SMALL LETTER KA" },
      XK_Cyrillic_el: { code: 1740, description: "(\u043B) CYRILLIC SMALL LETTER EL" },
      XK_Cyrillic_em: { code: 1741, description: "(\u043C) CYRILLIC SMALL LETTER EM" },
      XK_Cyrillic_en: { code: 1742, description: "(\u043D) CYRILLIC SMALL LETTER EN" },
      XK_Cyrillic_o: { code: 1743, description: "(\u043E) CYRILLIC SMALL LETTER O" },
      XK_Cyrillic_pe: { code: 1744, description: "(\u043F) CYRILLIC SMALL LETTER PE" },
      XK_Cyrillic_ya: { code: 1745, description: "(\u044F) CYRILLIC SMALL LETTER YA" },
      XK_Cyrillic_er: { code: 1746, description: "(\u0440) CYRILLIC SMALL LETTER ER" },
      XK_Cyrillic_es: { code: 1747, description: "(\u0441) CYRILLIC SMALL LETTER ES" },
      XK_Cyrillic_te: { code: 1748, description: "(\u0442) CYRILLIC SMALL LETTER TE" },
      XK_Cyrillic_u: { code: 1749, description: "(\u0443) CYRILLIC SMALL LETTER U" },
      XK_Cyrillic_zhe: { code: 1750, description: "(\u0436) CYRILLIC SMALL LETTER ZHE" },
      XK_Cyrillic_ve: { code: 1751, description: "(\u0432) CYRILLIC SMALL LETTER VE" },
      XK_Cyrillic_softsign: { code: 1752, description: "(\u044C) CYRILLIC SMALL LETTER SOFT SIGN" },
      XK_Cyrillic_yeru: { code: 1753, description: "(\u044B) CYRILLIC SMALL LETTER YERU" },
      XK_Cyrillic_ze: { code: 1754, description: "(\u0437) CYRILLIC SMALL LETTER ZE" },
      XK_Cyrillic_sha: { code: 1755, description: "(\u0448) CYRILLIC SMALL LETTER SHA" },
      XK_Cyrillic_e: { code: 1756, description: "(\u044D) CYRILLIC SMALL LETTER E" },
      XK_Cyrillic_shcha: { code: 1757, description: "(\u0449) CYRILLIC SMALL LETTER SHCHA" },
      XK_Cyrillic_che: { code: 1758, description: "(\u0447) CYRILLIC SMALL LETTER CHE" },
      XK_Cyrillic_hardsign: { code: 1759, description: "(\u044A) CYRILLIC SMALL LETTER HARD SIGN" },
      XK_Cyrillic_YU: { code: 1760, description: "(\u042E) CYRILLIC CAPITAL LETTER YU" },
      XK_Cyrillic_A: { code: 1761, description: "(\u0410) CYRILLIC CAPITAL LETTER A" },
      XK_Cyrillic_BE: { code: 1762, description: "(\u0411) CYRILLIC CAPITAL LETTER BE" },
      XK_Cyrillic_TSE: { code: 1763, description: "(\u0426) CYRILLIC CAPITAL LETTER TSE" },
      XK_Cyrillic_DE: { code: 1764, description: "(\u0414) CYRILLIC CAPITAL LETTER DE" },
      XK_Cyrillic_IE: { code: 1765, description: "(\u0415) CYRILLIC CAPITAL LETTER IE" },
      XK_Cyrillic_EF: { code: 1766, description: "(\u0424) CYRILLIC CAPITAL LETTER EF" },
      XK_Cyrillic_GHE: { code: 1767, description: "(\u0413) CYRILLIC CAPITAL LETTER GHE" },
      XK_Cyrillic_HA: { code: 1768, description: "(\u0425) CYRILLIC CAPITAL LETTER HA" },
      XK_Cyrillic_I: { code: 1769, description: "(\u0418) CYRILLIC CAPITAL LETTER I" },
      XK_Cyrillic_SHORTI: { code: 1770, description: "(\u0419) CYRILLIC CAPITAL LETTER SHORT I" },
      XK_Cyrillic_KA: { code: 1771, description: "(\u041A) CYRILLIC CAPITAL LETTER KA" },
      XK_Cyrillic_EL: { code: 1772, description: "(\u041B) CYRILLIC CAPITAL LETTER EL" },
      XK_Cyrillic_EM: { code: 1773, description: "(\u041C) CYRILLIC CAPITAL LETTER EM" },
      XK_Cyrillic_EN: { code: 1774, description: "(\u041D) CYRILLIC CAPITAL LETTER EN" },
      XK_Cyrillic_O: { code: 1775, description: "(\u041E) CYRILLIC CAPITAL LETTER O" },
      XK_Cyrillic_PE: { code: 1776, description: "(\u041F) CYRILLIC CAPITAL LETTER PE" },
      XK_Cyrillic_YA: { code: 1777, description: "(\u042F) CYRILLIC CAPITAL LETTER YA" },
      XK_Cyrillic_ER: { code: 1778, description: "(\u0420) CYRILLIC CAPITAL LETTER ER" },
      XK_Cyrillic_ES: { code: 1779, description: "(\u0421) CYRILLIC CAPITAL LETTER ES" },
      XK_Cyrillic_TE: { code: 1780, description: "(\u0422) CYRILLIC CAPITAL LETTER TE" },
      XK_Cyrillic_U: { code: 1781, description: "(\u0423) CYRILLIC CAPITAL LETTER U" },
      XK_Cyrillic_ZHE: { code: 1782, description: "(\u0416) CYRILLIC CAPITAL LETTER ZHE" },
      XK_Cyrillic_VE: { code: 1783, description: "(\u0412) CYRILLIC CAPITAL LETTER VE" },
      XK_Cyrillic_SOFTSIGN: { code: 1784, description: "(\u042C) CYRILLIC CAPITAL LETTER SOFT SIGN" },
      XK_Cyrillic_YERU: { code: 1785, description: "(\u042B) CYRILLIC CAPITAL LETTER YERU" },
      XK_Cyrillic_ZE: { code: 1786, description: "(\u0417) CYRILLIC CAPITAL LETTER ZE" },
      XK_Cyrillic_SHA: { code: 1787, description: "(\u0428) CYRILLIC CAPITAL LETTER SHA" },
      XK_Cyrillic_E: { code: 1788, description: "(\u042D) CYRILLIC CAPITAL LETTER E" },
      XK_Cyrillic_SHCHA: { code: 1789, description: "(\u0429) CYRILLIC CAPITAL LETTER SHCHA" },
      XK_Cyrillic_CHE: { code: 1790, description: "(\u0427) CYRILLIC CAPITAL LETTER CHE" },
      XK_Cyrillic_HARDSIGN: { code: 1791, description: "(\u042A) CYRILLIC CAPITAL LETTER HARD SIGN" },
      /*
       * Greek
       * (based on an early draft of, and not quite identical to, ISO/IEC 8859-7)
       * Byte 3 = 7
       */
      // Group XK_GREEK
      XK_Greek_ALPHAaccent: { code: 1953, description: "(\u0386) GREEK CAPITAL LETTER ALPHA WITH TONOS" },
      XK_Greek_EPSILONaccent: { code: 1954, description: "(\u0388) GREEK CAPITAL LETTER EPSILON WITH TONOS" },
      XK_Greek_ETAaccent: { code: 1955, description: "(\u0389) GREEK CAPITAL LETTER ETA WITH TONOS" },
      XK_Greek_IOTAaccent: { code: 1956, description: "(\u038A) GREEK CAPITAL LETTER IOTA WITH TONOS" },
      XK_Greek_IOTAdieresis: { code: 1957, description: "(\u03AA) GREEK CAPITAL LETTER IOTA WITH DIALYTIKA" },
      XK_Greek_IOTAdiaeresis: { code: 1957, description: "old typo" },
      XK_Greek_OMICRONaccent: { code: 1959, description: "(\u038C) GREEK CAPITAL LETTER OMICRON WITH TONOS" },
      XK_Greek_UPSILONaccent: { code: 1960, description: "(\u038E) GREEK CAPITAL LETTER UPSILON WITH TONOS" },
      XK_Greek_UPSILONdieresis: { code: 1961, description: "(\u03AB) GREEK CAPITAL LETTER UPSILON WITH DIALYTIKA" },
      XK_Greek_OMEGAaccent: { code: 1963, description: "(\u038F) GREEK CAPITAL LETTER OMEGA WITH TONOS" },
      XK_Greek_accentdieresis: { code: 1966, description: "(\u0385) GREEK DIALYTIKA TONOS" },
      XK_Greek_horizbar: { code: 1967, description: "(\u2015) HORIZONTAL BAR" },
      XK_Greek_alphaaccent: { code: 1969, description: "(\u03AC) GREEK SMALL LETTER ALPHA WITH TONOS" },
      XK_Greek_epsilonaccent: { code: 1970, description: "(\u03AD) GREEK SMALL LETTER EPSILON WITH TONOS" },
      XK_Greek_etaaccent: { code: 1971, description: "(\u03AE) GREEK SMALL LETTER ETA WITH TONOS" },
      XK_Greek_iotaaccent: { code: 1972, description: "(\u03AF) GREEK SMALL LETTER IOTA WITH TONOS" },
      XK_Greek_iotadieresis: { code: 1973, description: "(\u03CA) GREEK SMALL LETTER IOTA WITH DIALYTIKA" },
      XK_Greek_iotaaccentdieresis: { code: 1974, description: "(\u0390) GREEK SMALL LETTER IOTA WITH DIALYTIKA AND TONOS" },
      XK_Greek_omicronaccent: { code: 1975, description: "(\u03CC) GREEK SMALL LETTER OMICRON WITH TONOS" },
      XK_Greek_upsilonaccent: { code: 1976, description: "(\u03CD) GREEK SMALL LETTER UPSILON WITH TONOS" },
      XK_Greek_upsilondieresis: { code: 1977, description: "(\u03CB) GREEK SMALL LETTER UPSILON WITH DIALYTIKA" },
      XK_Greek_upsilonaccentdieresis: { code: 1978, description: "(\u03B0) GREEK SMALL LETTER UPSILON WITH DIALYTIKA AND TONOS" },
      XK_Greek_omegaaccent: { code: 1979, description: "(\u03CE) GREEK SMALL LETTER OMEGA WITH TONOS" },
      XK_Greek_ALPHA: { code: 1985, description: "(\u0391) GREEK CAPITAL LETTER ALPHA" },
      XK_Greek_BETA: { code: 1986, description: "(\u0392) GREEK CAPITAL LETTER BETA" },
      XK_Greek_GAMMA: { code: 1987, description: "(\u0393) GREEK CAPITAL LETTER GAMMA" },
      XK_Greek_DELTA: { code: 1988, description: "(\u0394) GREEK CAPITAL LETTER DELTA" },
      XK_Greek_EPSILON: { code: 1989, description: "(\u0395) GREEK CAPITAL LETTER EPSILON" },
      XK_Greek_ZETA: { code: 1990, description: "(\u0396) GREEK CAPITAL LETTER ZETA" },
      XK_Greek_ETA: { code: 1991, description: "(\u0397) GREEK CAPITAL LETTER ETA" },
      XK_Greek_THETA: { code: 1992, description: "(\u0398) GREEK CAPITAL LETTER THETA" },
      XK_Greek_IOTA: { code: 1993, description: "(\u0399) GREEK CAPITAL LETTER IOTA" },
      XK_Greek_KAPPA: { code: 1994, description: "(\u039A) GREEK CAPITAL LETTER KAPPA" },
      XK_Greek_LAMDA: { code: 1995, description: "(\u039B) GREEK CAPITAL LETTER LAMDA" },
      XK_Greek_LAMBDA: { code: 1995, description: "(\u039B) GREEK CAPITAL LETTER LAMDA" },
      XK_Greek_MU: { code: 1996, description: "(\u039C) GREEK CAPITAL LETTER MU" },
      XK_Greek_NU: { code: 1997, description: "(\u039D) GREEK CAPITAL LETTER NU" },
      XK_Greek_XI: { code: 1998, description: "(\u039E) GREEK CAPITAL LETTER XI" },
      XK_Greek_OMICRON: { code: 1999, description: "(\u039F) GREEK CAPITAL LETTER OMICRON" },
      XK_Greek_PI: { code: 2e3, description: "(\u03A0) GREEK CAPITAL LETTER PI" },
      XK_Greek_RHO: { code: 2001, description: "(\u03A1) GREEK CAPITAL LETTER RHO" },
      XK_Greek_SIGMA: { code: 2002, description: "(\u03A3) GREEK CAPITAL LETTER SIGMA" },
      XK_Greek_TAU: { code: 2004, description: "(\u03A4) GREEK CAPITAL LETTER TAU" },
      XK_Greek_UPSILON: { code: 2005, description: "(\u03A5) GREEK CAPITAL LETTER UPSILON" },
      XK_Greek_PHI: { code: 2006, description: "(\u03A6) GREEK CAPITAL LETTER PHI" },
      XK_Greek_CHI: { code: 2007, description: "(\u03A7) GREEK CAPITAL LETTER CHI" },
      XK_Greek_PSI: { code: 2008, description: "(\u03A8) GREEK CAPITAL LETTER PSI" },
      XK_Greek_OMEGA: { code: 2009, description: "(\u03A9) GREEK CAPITAL LETTER OMEGA" },
      XK_Greek_alpha: { code: 2017, description: "(\u03B1) GREEK SMALL LETTER ALPHA" },
      XK_Greek_beta: { code: 2018, description: "(\u03B2) GREEK SMALL LETTER BETA" },
      XK_Greek_gamma: { code: 2019, description: "(\u03B3) GREEK SMALL LETTER GAMMA" },
      XK_Greek_delta: { code: 2020, description: "(\u03B4) GREEK SMALL LETTER DELTA" },
      XK_Greek_epsilon: { code: 2021, description: "(\u03B5) GREEK SMALL LETTER EPSILON" },
      XK_Greek_zeta: { code: 2022, description: "(\u03B6) GREEK SMALL LETTER ZETA" },
      XK_Greek_eta: { code: 2023, description: "(\u03B7) GREEK SMALL LETTER ETA" },
      XK_Greek_theta: { code: 2024, description: "(\u03B8) GREEK SMALL LETTER THETA" },
      XK_Greek_iota: { code: 2025, description: "(\u03B9) GREEK SMALL LETTER IOTA" },
      XK_Greek_kappa: { code: 2026, description: "(\u03BA) GREEK SMALL LETTER KAPPA" },
      XK_Greek_lamda: { code: 2027, description: "(\u03BB) GREEK SMALL LETTER LAMDA" },
      XK_Greek_lambda: { code: 2027, description: "(\u03BB) GREEK SMALL LETTER LAMDA" },
      XK_Greek_mu: { code: 2028, description: "(\u03BC) GREEK SMALL LETTER MU" },
      XK_Greek_nu: { code: 2029, description: "(\u03BD) GREEK SMALL LETTER NU" },
      XK_Greek_xi: { code: 2030, description: "(\u03BE) GREEK SMALL LETTER XI" },
      XK_Greek_omicron: { code: 2031, description: "(\u03BF) GREEK SMALL LETTER OMICRON" },
      XK_Greek_pi: { code: 2032, description: "(\u03C0) GREEK SMALL LETTER PI" },
      XK_Greek_rho: { code: 2033, description: "(\u03C1) GREEK SMALL LETTER RHO" },
      XK_Greek_sigma: { code: 2034, description: "(\u03C3) GREEK SMALL LETTER SIGMA" },
      XK_Greek_finalsmallsigma: { code: 2035, description: "(\u03C2) GREEK SMALL LETTER FINAL SIGMA" },
      XK_Greek_tau: { code: 2036, description: "(\u03C4) GREEK SMALL LETTER TAU" },
      XK_Greek_upsilon: { code: 2037, description: "(\u03C5) GREEK SMALL LETTER UPSILON" },
      XK_Greek_phi: { code: 2038, description: "(\u03C6) GREEK SMALL LETTER PHI" },
      XK_Greek_chi: { code: 2039, description: "(\u03C7) GREEK SMALL LETTER CHI" },
      XK_Greek_psi: { code: 2040, description: "(\u03C8) GREEK SMALL LETTER PSI" },
      XK_Greek_omega: { code: 2041, description: "(\u03C9) GREEK SMALL LETTER OMEGA" },
      XK_Greek_switch: { code: 65406, description: "Alias for mode_switch" },
      /*
       * Technical
       * (from the DEC VT330/VT420 Technical Character Set, http://vt100.net/charsets/technical.html)
       * Byte 3 = 8
       */
      // Group XK_TECHNICAL
      XK_leftradical: { code: 2209, description: "(\u23B7) RADICAL SYMBOL BOTTOM" },
      XK_topleftradical: { code: 2210, description: "((\u250C) BOX DRAWINGS LIGHT DOWN AND RIGHT)" },
      XK_horizconnector: { code: 2211, description: "((\u2500) BOX DRAWINGS LIGHT HORIZONTAL)" },
      XK_topintegral: { code: 2212, description: "(\u2320) TOP HALF INTEGRAL" },
      XK_botintegral: { code: 2213, description: "(\u2321) BOTTOM HALF INTEGRAL" },
      XK_vertconnector: { code: 2214, description: "((\u2502) BOX DRAWINGS LIGHT VERTICAL)" },
      XK_topleftsqbracket: { code: 2215, description: "(\u23A1) LEFT SQUARE BRACKET UPPER CORNER" },
      XK_botleftsqbracket: { code: 2216, description: "(\u23A3) LEFT SQUARE BRACKET LOWER CORNER" },
      XK_toprightsqbracket: { code: 2217, description: "(\u23A4) RIGHT SQUARE BRACKET UPPER CORNER" },
      XK_botrightsqbracket: { code: 2218, description: "(\u23A6) RIGHT SQUARE BRACKET LOWER CORNER" },
      XK_topleftparens: { code: 2219, description: "(\u239B) LEFT PARENTHESIS UPPER HOOK" },
      XK_botleftparens: { code: 2220, description: "(\u239D) LEFT PARENTHESIS LOWER HOOK" },
      XK_toprightparens: { code: 2221, description: "(\u239E) RIGHT PARENTHESIS UPPER HOOK" },
      XK_botrightparens: { code: 2222, description: "(\u23A0) RIGHT PARENTHESIS LOWER HOOK" },
      XK_leftmiddlecurlybrace: { code: 2223, description: "(\u23A8) LEFT CURLY BRACKET MIDDLE PIECE" },
      XK_rightmiddlecurlybrace: { code: 2224, description: "(\u23AC) RIGHT CURLY BRACKET MIDDLE PIECE" },
      XK_topleftsummation: { code: 2225, description: null },
      XK_botleftsummation: { code: 2226, description: null },
      XK_topvertsummationconnector: { code: 2227, description: null },
      XK_botvertsummationconnector: { code: 2228, description: null },
      XK_toprightsummation: { code: 2229, description: null },
      XK_botrightsummation: { code: 2230, description: null },
      XK_rightmiddlesummation: { code: 2231, description: null },
      XK_lessthanequal: { code: 2236, description: "(\u2264) LESS-THAN OR EQUAL TO" },
      XK_notequal: { code: 2237, description: "(\u2260) NOT EQUAL TO" },
      XK_greaterthanequal: { code: 2238, description: "(\u2265) GREATER-THAN OR EQUAL TO" },
      XK_integral: { code: 2239, description: "(\u222B) INTEGRAL" },
      XK_therefore: { code: 2240, description: "(\u2234) THEREFORE" },
      XK_variation: { code: 2241, description: "(\u221D) PROPORTIONAL TO" },
      XK_infinity: { code: 2242, description: "(\u221E) INFINITY" },
      XK_nabla: { code: 2245, description: "(\u2207) NABLA" },
      XK_approximate: { code: 2248, description: "(\u223C) TILDE OPERATOR" },
      XK_similarequal: { code: 2249, description: "(\u2243) ASYMPTOTICALLY EQUAL TO" },
      XK_ifonlyif: { code: 2253, description: "(\u21D4) LEFT RIGHT DOUBLE ARROW" },
      XK_implies: { code: 2254, description: "(\u21D2) RIGHTWARDS DOUBLE ARROW" },
      XK_identical: { code: 2255, description: "(\u2261) IDENTICAL TO" },
      XK_radical: { code: 2262, description: "(\u221A) SQUARE ROOT" },
      XK_includedin: { code: 2266, description: "(\u2282) SUBSET OF" },
      XK_includes: { code: 2267, description: "(\u2283) SUPERSET OF" },
      XK_intersection: { code: 2268, description: "(\u2229) INTERSECTION" },
      XK_union: { code: 2269, description: "(\u222A) UNION" },
      XK_logicaland: { code: 2270, description: "(\u2227) LOGICAL AND" },
      XK_logicalor: { code: 2271, description: "(\u2228) LOGICAL OR" },
      XK_partialderivative: { code: 2287, description: "(\u2202) PARTIAL DIFFERENTIAL" },
      XK_function: { code: 2294, description: "(\u0192) LATIN SMALL LETTER F WITH HOOK" },
      XK_leftarrow: { code: 2299, description: "(\u2190) LEFTWARDS ARROW" },
      XK_uparrow: { code: 2300, description: "(\u2191) UPWARDS ARROW" },
      XK_rightarrow: { code: 2301, description: "(\u2192) RIGHTWARDS ARROW" },
      XK_downarrow: { code: 2302, description: "(\u2193) DOWNWARDS ARROW" },
      /*
       * Special
       * (from the DEC VT100 Special Graphics Character Set)
       * Byte 3 = 9
       */
      // Group XK_SPECIAL
      XK_blank: { code: 2527, description: null },
      XK_soliddiamond: { code: 2528, description: "(\u25C6) BLACK DIAMOND" },
      XK_checkerboard: { code: 2529, description: "(\u2592) MEDIUM SHADE" },
      XK_ht: { code: 2530, description: "(\u2409) SYMBOL FOR HORIZONTAL TABULATION" },
      XK_ff: { code: 2531, description: "(\u240C) SYMBOL FOR FORM FEED" },
      XK_cr: { code: 2532, description: "(\u240D) SYMBOL FOR CARRIAGE RETURN" },
      XK_lf: { code: 2533, description: "(\u240A) SYMBOL FOR LINE FEED" },
      XK_nl: { code: 2536, description: "(\u2424) SYMBOL FOR NEWLINE" },
      XK_vt: { code: 2537, description: "(\u240B) SYMBOL FOR VERTICAL TABULATION" },
      XK_lowrightcorner: { code: 2538, description: "(\u2518) BOX DRAWINGS LIGHT UP AND LEFT" },
      XK_uprightcorner: { code: 2539, description: "(\u2510) BOX DRAWINGS LIGHT DOWN AND LEFT" },
      XK_upleftcorner: { code: 2540, description: "(\u250C) BOX DRAWINGS LIGHT DOWN AND RIGHT" },
      XK_lowleftcorner: { code: 2541, description: "(\u2514) BOX DRAWINGS LIGHT UP AND RIGHT" },
      XK_crossinglines: { code: 2542, description: "(\u253C) BOX DRAWINGS LIGHT VERTICAL AND HORIZONTAL" },
      XK_horizlinescan1: { code: 2543, description: "(\u23BA) HORIZONTAL SCAN LINE-1" },
      XK_horizlinescan3: { code: 2544, description: "(\u23BB) HORIZONTAL SCAN LINE-3" },
      XK_horizlinescan5: { code: 2545, description: "(\u2500) BOX DRAWINGS LIGHT HORIZONTAL" },
      XK_horizlinescan7: { code: 2546, description: "(\u23BC) HORIZONTAL SCAN LINE-7" },
      XK_horizlinescan9: { code: 2547, description: "(\u23BD) HORIZONTAL SCAN LINE-9" },
      XK_leftt: { code: 2548, description: "(\u251C) BOX DRAWINGS LIGHT VERTICAL AND RIGHT" },
      XK_rightt: { code: 2549, description: "(\u2524) BOX DRAWINGS LIGHT VERTICAL AND LEFT" },
      XK_bott: { code: 2550, description: "(\u2534) BOX DRAWINGS LIGHT UP AND HORIZONTAL" },
      XK_topt: { code: 2551, description: "(\u252C) BOX DRAWINGS LIGHT DOWN AND HORIZONTAL" },
      XK_vertbar: { code: 2552, description: "(\u2502) BOX DRAWINGS LIGHT VERTICAL" },
      /*
       * Publishing
       * (these are probably from a long forgotten DEC Publishing
       * font that once shipped with DECwrite)
       * Byte 3 = 0x0a
       */
      // Group XK_PUBLISHING
      XK_emspace: { code: 2721, description: "(\u2003) EM SPACE" },
      XK_enspace: { code: 2722, description: "(\u2002) EN SPACE" },
      XK_em3space: { code: 2723, description: "(\u2004) THREE-PER-EM SPACE" },
      XK_em4space: { code: 2724, description: "(\u2005) FOUR-PER-EM SPACE" },
      XK_digitspace: { code: 2725, description: "(\u2007) FIGURE SPACE" },
      XK_punctspace: { code: 2726, description: "(\u2008) PUNCTUATION SPACE" },
      XK_thinspace: { code: 2727, description: "(\u2009) THIN SPACE" },
      XK_hairspace: { code: 2728, description: "(\u200A) HAIR SPACE" },
      XK_emdash: { code: 2729, description: "(\u2014) EM DASH" },
      XK_endash: { code: 2730, description: "(\u2013) EN DASH" },
      XK_signifblank: { code: 2732, description: "((\u2423) OPEN BOX)" },
      XK_ellipsis: { code: 2734, description: "(\u2026) HORIZONTAL ELLIPSIS" },
      XK_doubbaselinedot: { code: 2735, description: "(\u2025) TWO DOT LEADER" },
      XK_onethird: { code: 2736, description: "(\u2153) VULGAR FRACTION ONE THIRD" },
      XK_twothirds: { code: 2737, description: "(\u2154) VULGAR FRACTION TWO THIRDS" },
      XK_onefifth: { code: 2738, description: "(\u2155) VULGAR FRACTION ONE FIFTH" },
      XK_twofifths: { code: 2739, description: "(\u2156) VULGAR FRACTION TWO FIFTHS" },
      XK_threefifths: { code: 2740, description: "(\u2157) VULGAR FRACTION THREE FIFTHS" },
      XK_fourfifths: { code: 2741, description: "(\u2158) VULGAR FRACTION FOUR FIFTHS" },
      XK_onesixth: { code: 2742, description: "(\u2159) VULGAR FRACTION ONE SIXTH" },
      XK_fivesixths: { code: 2743, description: "(\u215A) VULGAR FRACTION FIVE SIXTHS" },
      XK_careof: { code: 2744, description: "(\u2105) CARE OF" },
      XK_figdash: { code: 2747, description: "(\u2012) FIGURE DASH" },
      XK_leftanglebracket: { code: 2748, description: "((\u27E8) MATHEMATICAL LEFT ANGLE BRACKET)" },
      XK_decimalpoint: { code: 2749, description: "((.) FULL STOP)" },
      XK_rightanglebracket: { code: 2750, description: "((\u27E9) MATHEMATICAL RIGHT ANGLE BRACKET)" },
      XK_marker: { code: 2751, description: null },
      XK_oneeighth: { code: 2755, description: "(\u215B) VULGAR FRACTION ONE EIGHTH" },
      XK_threeeighths: { code: 2756, description: "(\u215C) VULGAR FRACTION THREE EIGHTHS" },
      XK_fiveeighths: { code: 2757, description: "(\u215D) VULGAR FRACTION FIVE EIGHTHS" },
      XK_seveneighths: { code: 2758, description: "(\u215E) VULGAR FRACTION SEVEN EIGHTHS" },
      XK_trademark: { code: 2761, description: "(\u2122) TRADE MARK SIGN" },
      XK_signaturemark: { code: 2762, description: "((\u2613) SALTIRE)" },
      XK_trademarkincircle: { code: 2763, description: null },
      XK_leftopentriangle: { code: 2764, description: "((\u25C1) WHITE LEFT-POINTING TRIANGLE)" },
      XK_rightopentriangle: { code: 2765, description: "((\u25B7) WHITE RIGHT-POINTING TRIANGLE)" },
      XK_emopencircle: { code: 2766, description: "((\u25CB) WHITE CIRCLE)" },
      XK_emopenrectangle: { code: 2767, description: "((\u25AF) WHITE VERTICAL RECTANGLE)" },
      XK_leftsinglequotemark: { code: 2768, description: "(\u2018) LEFT SINGLE QUOTATION MARK" },
      XK_rightsinglequotemark: { code: 2769, description: "(\u2019) RIGHT SINGLE QUOTATION MARK" },
      XK_leftdoublequotemark: { code: 2770, description: "(\u201C) LEFT DOUBLE QUOTATION MARK" },
      XK_rightdoublequotemark: { code: 2771, description: "(\u201D) RIGHT DOUBLE QUOTATION MARK" },
      XK_prescription: { code: 2772, description: "(\u211E) PRESCRIPTION TAKE" },
      XK_permille: { code: 2773, description: "(\u2030) PER MILLE SIGN" },
      XK_minutes: { code: 2774, description: "(\u2032) PRIME" },
      XK_seconds: { code: 2775, description: "(\u2033) DOUBLE PRIME" },
      XK_latincross: { code: 2777, description: "(\u271D) LATIN CROSS" },
      XK_hexagram: { code: 2778, description: null },
      XK_filledrectbullet: { code: 2779, description: "((\u25AC) BLACK RECTANGLE)" },
      XK_filledlefttribullet: { code: 2780, description: "((\u25C0) BLACK LEFT-POINTING TRIANGLE)" },
      XK_filledrighttribullet: { code: 2781, description: "((\u25B6) BLACK RIGHT-POINTING TRIANGLE)" },
      XK_emfilledcircle: { code: 2782, description: "((\u25CF) BLACK CIRCLE)" },
      XK_emfilledrect: { code: 2783, description: "((\u25AE) BLACK VERTICAL RECTANGLE)" },
      XK_enopencircbullet: { code: 2784, description: "((\u25E6) WHITE BULLET)" },
      XK_enopensquarebullet: { code: 2785, description: "((\u25AB) WHITE SMALL SQUARE)" },
      XK_openrectbullet: { code: 2786, description: "((\u25AD) WHITE RECTANGLE)" },
      XK_opentribulletup: { code: 2787, description: "((\u25B3) WHITE UP-POINTING TRIANGLE)" },
      XK_opentribulletdown: { code: 2788, description: "((\u25BD) WHITE DOWN-POINTING TRIANGLE)" },
      XK_openstar: { code: 2789, description: "((\u2606) WHITE STAR)" },
      XK_enfilledcircbullet: { code: 2790, description: "((\u2022) BULLET)" },
      XK_enfilledsqbullet: { code: 2791, description: "((\u25AA) BLACK SMALL SQUARE)" },
      XK_filledtribulletup: { code: 2792, description: "((\u25B2) BLACK UP-POINTING TRIANGLE)" },
      XK_filledtribulletdown: { code: 2793, description: "((\u25BC) BLACK DOWN-POINTING TRIANGLE)" },
      XK_leftpointer: { code: 2794, description: "((\u261C) WHITE LEFT POINTING INDEX)" },
      XK_rightpointer: { code: 2795, description: "((\u261E) WHITE RIGHT POINTING INDEX)" },
      XK_club: { code: 2796, description: "(\u2663) BLACK CLUB SUIT" },
      XK_diamond: { code: 2797, description: "(\u2666) BLACK DIAMOND SUIT" },
      XK_heart: { code: 2798, description: "(\u2665) BLACK HEART SUIT" },
      XK_maltesecross: { code: 2800, description: "(\u2720) MALTESE CROSS" },
      XK_dagger: { code: 2801, description: "(\u2020) DAGGER" },
      XK_doubledagger: { code: 2802, description: "(\u2021) DOUBLE DAGGER" },
      XK_checkmark: { code: 2803, description: "(\u2713) CHECK MARK" },
      XK_ballotcross: { code: 2804, description: "(\u2717) BALLOT X" },
      XK_musicalsharp: { code: 2805, description: "(\u266F) MUSIC SHARP SIGN" },
      XK_musicalflat: { code: 2806, description: "(\u266D) MUSIC FLAT SIGN" },
      XK_malesymbol: { code: 2807, description: "(\u2642) MALE SIGN" },
      XK_femalesymbol: { code: 2808, description: "(\u2640) FEMALE SIGN" },
      XK_telephone: { code: 2809, description: "(\u260E) BLACK TELEPHONE" },
      XK_telephonerecorder: { code: 2810, description: "(\u2315) TELEPHONE RECORDER" },
      XK_phonographcopyright: { code: 2811, description: "(\u2117) SOUND RECORDING COPYRIGHT" },
      XK_caret: { code: 2812, description: "(\u2038) CARET" },
      XK_singlelowquotemark: { code: 2813, description: "(\u201A) SINGLE LOW-9 QUOTATION MARK" },
      XK_doublelowquotemark: { code: 2814, description: "(\u201E) DOUBLE LOW-9 QUOTATION MARK" },
      XK_cursor: { code: 2815, description: null },
      /*
       * APL
       * Byte 3 = 0x0b
       */
      // Group XK_APL
      XK_leftcaret: { code: 2979, description: "((<) LESS-THAN SIGN)" },
      XK_rightcaret: { code: 2982, description: "((>) GREATER-THAN SIGN)" },
      XK_downcaret: { code: 2984, description: "((\u2228) LOGICAL OR)" },
      XK_upcaret: { code: 2985, description: "((\u2227) LOGICAL AND)" },
      XK_overbar: { code: 3008, description: "((\xAF) MACRON)" },
      XK_downtack: { code: 3010, description: "(\u22A4) DOWN TACK" },
      XK_upshoe: { code: 3011, description: "((\u2229) INTERSECTION)" },
      XK_downstile: { code: 3012, description: "(\u230A) LEFT FLOOR" },
      XK_underbar: { code: 3014, description: "((_) LOW LINE)" },
      XK_jot: { code: 3018, description: "(\u2218) RING OPERATOR" },
      XK_quad: { code: 3020, description: "(\u2395) APL FUNCTIONAL SYMBOL QUAD" },
      XK_uptack: { code: 3022, description: "(\u22A5) UP TACK" },
      XK_circle: { code: 3023, description: "(\u25CB) WHITE CIRCLE" },
      XK_upstile: { code: 3027, description: "(\u2308) LEFT CEILING" },
      XK_downshoe: { code: 3030, description: "((\u222A) UNION)" },
      XK_rightshoe: { code: 3032, description: "((\u2283) SUPERSET OF)" },
      XK_leftshoe: { code: 3034, description: "((\u2282) SUBSET OF)" },
      XK_lefttack: { code: 3036, description: "(\u22A3) LEFT TACK" },
      XK_righttack: { code: 3068, description: "(\u22A2) RIGHT TACK" },
      /*
       * Hebrew
       * Byte 3 = 0x0c
       */
      // Group XK_HEBREW
      XK_hebrew_doublelowline: { code: 3295, description: "(\u2017) DOUBLE LOW LINE" },
      XK_hebrew_aleph: { code: 3296, description: "(\u05D0) HEBREW LETTER ALEF" },
      XK_hebrew_bet: { code: 3297, description: "(\u05D1) HEBREW LETTER BET" },
      XK_hebrew_beth: { code: 3297, description: "deprecated" },
      XK_hebrew_gimel: { code: 3298, description: "(\u05D2) HEBREW LETTER GIMEL" },
      XK_hebrew_gimmel: { code: 3298, description: "deprecated" },
      XK_hebrew_dalet: { code: 3299, description: "(\u05D3) HEBREW LETTER DALET" },
      XK_hebrew_daleth: { code: 3299, description: "deprecated" },
      XK_hebrew_he: { code: 3300, description: "(\u05D4) HEBREW LETTER HE" },
      XK_hebrew_waw: { code: 3301, description: "(\u05D5) HEBREW LETTER VAV" },
      XK_hebrew_zain: { code: 3302, description: "(\u05D6) HEBREW LETTER ZAYIN" },
      XK_hebrew_zayin: { code: 3302, description: "deprecated" },
      XK_hebrew_chet: { code: 3303, description: "(\u05D7) HEBREW LETTER HET" },
      XK_hebrew_het: { code: 3303, description: "deprecated" },
      XK_hebrew_tet: { code: 3304, description: "(\u05D8) HEBREW LETTER TET" },
      XK_hebrew_teth: { code: 3304, description: "deprecated" },
      XK_hebrew_yod: { code: 3305, description: "(\u05D9) HEBREW LETTER YOD" },
      XK_hebrew_finalkaph: { code: 3306, description: "(\u05DA) HEBREW LETTER FINAL KAF" },
      XK_hebrew_kaph: { code: 3307, description: "(\u05DB) HEBREW LETTER KAF" },
      XK_hebrew_lamed: { code: 3308, description: "(\u05DC) HEBREW LETTER LAMED" },
      XK_hebrew_finalmem: { code: 3309, description: "(\u05DD) HEBREW LETTER FINAL MEM" },
      XK_hebrew_mem: { code: 3310, description: "(\u05DE) HEBREW LETTER MEM" },
      XK_hebrew_finalnun: { code: 3311, description: "(\u05DF) HEBREW LETTER FINAL NUN" },
      XK_hebrew_nun: { code: 3312, description: "(\u05E0) HEBREW LETTER NUN" },
      XK_hebrew_samech: { code: 3313, description: "(\u05E1) HEBREW LETTER SAMEKH" },
      XK_hebrew_samekh: { code: 3313, description: "deprecated" },
      XK_hebrew_ayin: { code: 3314, description: "(\u05E2) HEBREW LETTER AYIN" },
      XK_hebrew_finalpe: { code: 3315, description: "(\u05E3) HEBREW LETTER FINAL PE" },
      XK_hebrew_pe: { code: 3316, description: "(\u05E4) HEBREW LETTER PE" },
      XK_hebrew_finalzade: { code: 3317, description: "(\u05E5) HEBREW LETTER FINAL TSADI" },
      XK_hebrew_finalzadi: { code: 3317, description: "deprecated" },
      XK_hebrew_zade: { code: 3318, description: "(\u05E6) HEBREW LETTER TSADI" },
      XK_hebrew_zadi: { code: 3318, description: "deprecated" },
      XK_hebrew_qoph: { code: 3319, description: "(\u05E7) HEBREW LETTER QOF" },
      XK_hebrew_kuf: { code: 3319, description: "deprecated" },
      XK_hebrew_resh: { code: 3320, description: "(\u05E8) HEBREW LETTER RESH" },
      XK_hebrew_shin: { code: 3321, description: "(\u05E9) HEBREW LETTER SHIN" },
      XK_hebrew_taw: { code: 3322, description: "(\u05EA) HEBREW LETTER TAV" },
      XK_hebrew_taf: { code: 3322, description: "deprecated" },
      XK_Hebrew_switch: { code: 65406, description: "Alias for mode_switch" },
      /*
       * Thai
       * Byte 3 = 0x0d
       */
      // Group XK_THAI
      XK_Thai_kokai: { code: 3489, description: "(\u0E01) THAI CHARACTER KO KAI" },
      XK_Thai_khokhai: { code: 3490, description: "(\u0E02) THAI CHARACTER KHO KHAI" },
      XK_Thai_khokhuat: { code: 3491, description: "(\u0E03) THAI CHARACTER KHO KHUAT" },
      XK_Thai_khokhwai: { code: 3492, description: "(\u0E04) THAI CHARACTER KHO KHWAI" },
      XK_Thai_khokhon: { code: 3493, description: "(\u0E05) THAI CHARACTER KHO KHON" },
      XK_Thai_khorakhang: { code: 3494, description: "(\u0E06) THAI CHARACTER KHO RAKHANG" },
      XK_Thai_ngongu: { code: 3495, description: "(\u0E07) THAI CHARACTER NGO NGU" },
      XK_Thai_chochan: { code: 3496, description: "(\u0E08) THAI CHARACTER CHO CHAN" },
      XK_Thai_choching: { code: 3497, description: "(\u0E09) THAI CHARACTER CHO CHING" },
      XK_Thai_chochang: { code: 3498, description: "(\u0E0A) THAI CHARACTER CHO CHANG" },
      XK_Thai_soso: { code: 3499, description: "(\u0E0B) THAI CHARACTER SO SO" },
      XK_Thai_chochoe: { code: 3500, description: "(\u0E0C) THAI CHARACTER CHO CHOE" },
      XK_Thai_yoying: { code: 3501, description: "(\u0E0D) THAI CHARACTER YO YING" },
      XK_Thai_dochada: { code: 3502, description: "(\u0E0E) THAI CHARACTER DO CHADA" },
      XK_Thai_topatak: { code: 3503, description: "(\u0E0F) THAI CHARACTER TO PATAK" },
      XK_Thai_thothan: { code: 3504, description: "(\u0E10) THAI CHARACTER THO THAN" },
      XK_Thai_thonangmontho: { code: 3505, description: "(\u0E11) THAI CHARACTER THO NANGMONTHO" },
      XK_Thai_thophuthao: { code: 3506, description: "(\u0E12) THAI CHARACTER THO PHUTHAO" },
      XK_Thai_nonen: { code: 3507, description: "(\u0E13) THAI CHARACTER NO NEN" },
      XK_Thai_dodek: { code: 3508, description: "(\u0E14) THAI CHARACTER DO DEK" },
      XK_Thai_totao: { code: 3509, description: "(\u0E15) THAI CHARACTER TO TAO" },
      XK_Thai_thothung: { code: 3510, description: "(\u0E16) THAI CHARACTER THO THUNG" },
      XK_Thai_thothahan: { code: 3511, description: "(\u0E17) THAI CHARACTER THO THAHAN" },
      XK_Thai_thothong: { code: 3512, description: "(\u0E18) THAI CHARACTER THO THONG" },
      XK_Thai_nonu: { code: 3513, description: "(\u0E19) THAI CHARACTER NO NU" },
      XK_Thai_bobaimai: { code: 3514, description: "(\u0E1A) THAI CHARACTER BO BAIMAI" },
      XK_Thai_popla: { code: 3515, description: "(\u0E1B) THAI CHARACTER PO PLA" },
      XK_Thai_phophung: { code: 3516, description: "(\u0E1C) THAI CHARACTER PHO PHUNG" },
      XK_Thai_fofa: { code: 3517, description: "(\u0E1D) THAI CHARACTER FO FA" },
      XK_Thai_phophan: { code: 3518, description: "(\u0E1E) THAI CHARACTER PHO PHAN" },
      XK_Thai_fofan: { code: 3519, description: "(\u0E1F) THAI CHARACTER FO FAN" },
      XK_Thai_phosamphao: { code: 3520, description: "(\u0E20) THAI CHARACTER PHO SAMPHAO" },
      XK_Thai_moma: { code: 3521, description: "(\u0E21) THAI CHARACTER MO MA" },
      XK_Thai_yoyak: { code: 3522, description: "(\u0E22) THAI CHARACTER YO YAK" },
      XK_Thai_rorua: { code: 3523, description: "(\u0E23) THAI CHARACTER RO RUA" },
      XK_Thai_ru: { code: 3524, description: "(\u0E24) THAI CHARACTER RU" },
      XK_Thai_loling: { code: 3525, description: "(\u0E25) THAI CHARACTER LO LING" },
      XK_Thai_lu: { code: 3526, description: "(\u0E26) THAI CHARACTER LU" },
      XK_Thai_wowaen: { code: 3527, description: "(\u0E27) THAI CHARACTER WO WAEN" },
      XK_Thai_sosala: { code: 3528, description: "(\u0E28) THAI CHARACTER SO SALA" },
      XK_Thai_sorusi: { code: 3529, description: "(\u0E29) THAI CHARACTER SO RUSI" },
      XK_Thai_sosua: { code: 3530, description: "(\u0E2A) THAI CHARACTER SO SUA" },
      XK_Thai_hohip: { code: 3531, description: "(\u0E2B) THAI CHARACTER HO HIP" },
      XK_Thai_lochula: { code: 3532, description: "(\u0E2C) THAI CHARACTER LO CHULA" },
      XK_Thai_oang: { code: 3533, description: "(\u0E2D) THAI CHARACTER O ANG" },
      XK_Thai_honokhuk: { code: 3534, description: "(\u0E2E) THAI CHARACTER HO NOKHUK" },
      XK_Thai_paiyannoi: { code: 3535, description: "(\u0E2F) THAI CHARACTER PAIYANNOI" },
      XK_Thai_saraa: { code: 3536, description: "(\u0E30) THAI CHARACTER SARA A" },
      XK_Thai_maihanakat: { code: 3537, description: "(\u0E31) THAI CHARACTER MAI HAN-AKAT" },
      XK_Thai_saraaa: { code: 3538, description: "(\u0E32) THAI CHARACTER SARA AA" },
      XK_Thai_saraam: { code: 3539, description: "(\u0E33) THAI CHARACTER SARA AM" },
      XK_Thai_sarai: { code: 3540, description: "(\u0E34) THAI CHARACTER SARA I" },
      XK_Thai_saraii: { code: 3541, description: "(\u0E35) THAI CHARACTER SARA II" },
      XK_Thai_saraue: { code: 3542, description: "(\u0E36) THAI CHARACTER SARA UE" },
      XK_Thai_sarauee: { code: 3543, description: "(\u0E37) THAI CHARACTER SARA UEE" },
      XK_Thai_sarau: { code: 3544, description: "(\u0E38) THAI CHARACTER SARA U" },
      XK_Thai_sarauu: { code: 3545, description: "(\u0E39) THAI CHARACTER SARA UU" },
      XK_Thai_phinthu: { code: 3546, description: "(\u0E3A) THAI CHARACTER PHINTHU" },
      XK_Thai_maihanakat_maitho: { code: 3550, description: null },
      XK_Thai_baht: { code: 3551, description: "(\u0E3F) THAI CURRENCY SYMBOL BAHT" },
      XK_Thai_sarae: { code: 3552, description: "(\u0E40) THAI CHARACTER SARA E" },
      XK_Thai_saraae: { code: 3553, description: "(\u0E41) THAI CHARACTER SARA AE" },
      XK_Thai_sarao: { code: 3554, description: "(\u0E42) THAI CHARACTER SARA O" },
      XK_Thai_saraaimaimuan: { code: 3555, description: "(\u0E43) THAI CHARACTER SARA AI MAIMUAN" },
      XK_Thai_saraaimaimalai: { code: 3556, description: "(\u0E44) THAI CHARACTER SARA AI MAIMALAI" },
      XK_Thai_lakkhangyao: { code: 3557, description: "(\u0E45) THAI CHARACTER LAKKHANGYAO" },
      XK_Thai_maiyamok: { code: 3558, description: "(\u0E46) THAI CHARACTER MAIYAMOK" },
      XK_Thai_maitaikhu: { code: 3559, description: "(\u0E47) THAI CHARACTER MAITAIKHU" },
      XK_Thai_maiek: { code: 3560, description: "(\u0E48) THAI CHARACTER MAI EK" },
      XK_Thai_maitho: { code: 3561, description: "(\u0E49) THAI CHARACTER MAI THO" },
      XK_Thai_maitri: { code: 3562, description: "(\u0E4A) THAI CHARACTER MAI TRI" },
      XK_Thai_maichattawa: { code: 3563, description: "(\u0E4B) THAI CHARACTER MAI CHATTAWA" },
      XK_Thai_thanthakhat: { code: 3564, description: "(\u0E4C) THAI CHARACTER THANTHAKHAT" },
      XK_Thai_nikhahit: { code: 3565, description: "(\u0E4D) THAI CHARACTER NIKHAHIT" },
      XK_Thai_leksun: { code: 3568, description: "(\u0E50) THAI DIGIT ZERO" },
      XK_Thai_leknung: { code: 3569, description: "(\u0E51) THAI DIGIT ONE" },
      XK_Thai_leksong: { code: 3570, description: "(\u0E52) THAI DIGIT TWO" },
      XK_Thai_leksam: { code: 3571, description: "(\u0E53) THAI DIGIT THREE" },
      XK_Thai_leksi: { code: 3572, description: "(\u0E54) THAI DIGIT FOUR" },
      XK_Thai_lekha: { code: 3573, description: "(\u0E55) THAI DIGIT FIVE" },
      XK_Thai_lekhok: { code: 3574, description: "(\u0E56) THAI DIGIT SIX" },
      XK_Thai_lekchet: { code: 3575, description: "(\u0E57) THAI DIGIT SEVEN" },
      XK_Thai_lekpaet: { code: 3576, description: "(\u0E58) THAI DIGIT EIGHT" },
      XK_Thai_lekkao: { code: 3577, description: "(\u0E59) THAI DIGIT NINE" },
      /*
       * Korean
       * Byte 3 = 0x0e
       */
      // Group XK_KOREAN
      XK_Hangul: { code: 65329, description: "Hangul start/stop(toggle)" },
      XK_Hangul_Start: { code: 65330, description: "Hangul start" },
      XK_Hangul_End: { code: 65331, description: "Hangul end, English start" },
      XK_Hangul_Hanja: { code: 65332, description: "Start Hangul->Hanja Conversion" },
      XK_Hangul_Jamo: { code: 65333, description: "Hangul Jamo mode" },
      XK_Hangul_Romaja: { code: 65334, description: "Hangul Romaja mode" },
      XK_Hangul_Codeinput: { code: 65335, description: "Hangul code input mode" },
      XK_Hangul_Jeonja: { code: 65336, description: "Jeonja mode" },
      XK_Hangul_Banja: { code: 65337, description: "Banja mode" },
      XK_Hangul_PreHanja: { code: 65338, description: "Pre Hanja conversion" },
      XK_Hangul_PostHanja: { code: 65339, description: "Post Hanja conversion" },
      XK_Hangul_SingleCandidate: { code: 65340, description: "Single candidate" },
      XK_Hangul_MultipleCandidate: { code: 65341, description: "Multiple candidate" },
      XK_Hangul_PreviousCandidate: { code: 65342, description: "Previous candidate" },
      XK_Hangul_Special: { code: 65343, description: "Special symbols" },
      XK_Hangul_switch: { code: 65406, description: "Alias for mode_switch" },
      /* Hangul Consonant Characters */
      XK_Hangul_Kiyeog: { code: 3745, description: null },
      XK_Hangul_SsangKiyeog: { code: 3746, description: null },
      XK_Hangul_KiyeogSios: { code: 3747, description: null },
      XK_Hangul_Nieun: { code: 3748, description: null },
      XK_Hangul_NieunJieuj: { code: 3749, description: null },
      XK_Hangul_NieunHieuh: { code: 3750, description: null },
      XK_Hangul_Dikeud: { code: 3751, description: null },
      XK_Hangul_SsangDikeud: { code: 3752, description: null },
      XK_Hangul_Rieul: { code: 3753, description: null },
      XK_Hangul_RieulKiyeog: { code: 3754, description: null },
      XK_Hangul_RieulMieum: { code: 3755, description: null },
      XK_Hangul_RieulPieub: { code: 3756, description: null },
      XK_Hangul_RieulSios: { code: 3757, description: null },
      XK_Hangul_RieulTieut: { code: 3758, description: null },
      XK_Hangul_RieulPhieuf: { code: 3759, description: null },
      XK_Hangul_RieulHieuh: { code: 3760, description: null },
      XK_Hangul_Mieum: { code: 3761, description: null },
      XK_Hangul_Pieub: { code: 3762, description: null },
      XK_Hangul_SsangPieub: { code: 3763, description: null },
      XK_Hangul_PieubSios: { code: 3764, description: null },
      XK_Hangul_Sios: { code: 3765, description: null },
      XK_Hangul_SsangSios: { code: 3766, description: null },
      XK_Hangul_Ieung: { code: 3767, description: null },
      XK_Hangul_Jieuj: { code: 3768, description: null },
      XK_Hangul_SsangJieuj: { code: 3769, description: null },
      XK_Hangul_Cieuc: { code: 3770, description: null },
      XK_Hangul_Khieuq: { code: 3771, description: null },
      XK_Hangul_Tieut: { code: 3772, description: null },
      XK_Hangul_Phieuf: { code: 3773, description: null },
      XK_Hangul_Hieuh: { code: 3774, description: null },
      /* Hangul Vowel Characters */
      XK_Hangul_A: { code: 3775, description: null },
      XK_Hangul_AE: { code: 3776, description: null },
      XK_Hangul_YA: { code: 3777, description: null },
      XK_Hangul_YAE: { code: 3778, description: null },
      XK_Hangul_EO: { code: 3779, description: null },
      XK_Hangul_E: { code: 3780, description: null },
      XK_Hangul_YEO: { code: 3781, description: null },
      XK_Hangul_YE: { code: 3782, description: null },
      XK_Hangul_O: { code: 3783, description: null },
      XK_Hangul_WA: { code: 3784, description: null },
      XK_Hangul_WAE: { code: 3785, description: null },
      XK_Hangul_OE: { code: 3786, description: null },
      XK_Hangul_YO: { code: 3787, description: null },
      XK_Hangul_U: { code: 3788, description: null },
      XK_Hangul_WEO: { code: 3789, description: null },
      XK_Hangul_WE: { code: 3790, description: null },
      XK_Hangul_WI: { code: 3791, description: null },
      XK_Hangul_YU: { code: 3792, description: null },
      XK_Hangul_EU: { code: 3793, description: null },
      XK_Hangul_YI: { code: 3794, description: null },
      XK_Hangul_I: { code: 3795, description: null },
      /* Hangul syllable-final (JongSeong) Characters */
      XK_Hangul_J_Kiyeog: { code: 3796, description: null },
      XK_Hangul_J_SsangKiyeog: { code: 3797, description: null },
      XK_Hangul_J_KiyeogSios: { code: 3798, description: null },
      XK_Hangul_J_Nieun: { code: 3799, description: null },
      XK_Hangul_J_NieunJieuj: { code: 3800, description: null },
      XK_Hangul_J_NieunHieuh: { code: 3801, description: null },
      XK_Hangul_J_Dikeud: { code: 3802, description: null },
      XK_Hangul_J_Rieul: { code: 3803, description: null },
      XK_Hangul_J_RieulKiyeog: { code: 3804, description: null },
      XK_Hangul_J_RieulMieum: { code: 3805, description: null },
      XK_Hangul_J_RieulPieub: { code: 3806, description: null },
      XK_Hangul_J_RieulSios: { code: 3807, description: null },
      XK_Hangul_J_RieulTieut: { code: 3808, description: null },
      XK_Hangul_J_RieulPhieuf: { code: 3809, description: null },
      XK_Hangul_J_RieulHieuh: { code: 3810, description: null },
      XK_Hangul_J_Mieum: { code: 3811, description: null },
      XK_Hangul_J_Pieub: { code: 3812, description: null },
      XK_Hangul_J_PieubSios: { code: 3813, description: null },
      XK_Hangul_J_Sios: { code: 3814, description: null },
      XK_Hangul_J_SsangSios: { code: 3815, description: null },
      XK_Hangul_J_Ieung: { code: 3816, description: null },
      XK_Hangul_J_Jieuj: { code: 3817, description: null },
      XK_Hangul_J_Cieuc: { code: 3818, description: null },
      XK_Hangul_J_Khieuq: { code: 3819, description: null },
      XK_Hangul_J_Tieut: { code: 3820, description: null },
      XK_Hangul_J_Phieuf: { code: 3821, description: null },
      XK_Hangul_J_Hieuh: { code: 3822, description: null },
      /* Ancient Hangul Consonant Characters */
      XK_Hangul_RieulYeorinHieuh: { code: 3823, description: null },
      XK_Hangul_SunkyeongeumMieum: { code: 3824, description: null },
      XK_Hangul_SunkyeongeumPieub: { code: 3825, description: null },
      XK_Hangul_PanSios: { code: 3826, description: null },
      XK_Hangul_KkogjiDalrinIeung: { code: 3827, description: null },
      XK_Hangul_SunkyeongeumPhieuf: { code: 3828, description: null },
      XK_Hangul_YeorinHieuh: { code: 3829, description: null },
      /* Ancient Hangul Vowel Characters */
      XK_Hangul_AraeA: { code: 3830, description: null },
      XK_Hangul_AraeAE: { code: 3831, description: null },
      /* Ancient Hangul syllable-final (JongSeong) Characters */
      XK_Hangul_J_PanSios: { code: 3832, description: null },
      XK_Hangul_J_KkogjiDalrinIeung: { code: 3833, description: null },
      XK_Hangul_J_YeorinHieuh: { code: 3834, description: null },
      /* Korean currency symbol */
      XK_Korean_Won: { code: 3839, description: "((\u20A9) WON SIGN)" },
      /*
       * Armenian
       */
      // Group XK_ARMENIAN
      XK_Armenian_ligature_ew: { code: 16778631, description: "(\u0587) ARMENIAN SMALL LIGATURE ECH YIWN" },
      XK_Armenian_full_stop: { code: 16778633, description: "(\u0589) ARMENIAN FULL STOP" },
      XK_Armenian_verjaket: { code: 16778633, description: "(\u0589) ARMENIAN FULL STOP" },
      XK_Armenian_separation_mark: { code: 16778589, description: "(\u055D) ARMENIAN COMMA" },
      XK_Armenian_but: { code: 16778589, description: "(\u055D) ARMENIAN COMMA" },
      XK_Armenian_hyphen: { code: 16778634, description: "(\u058A) ARMENIAN HYPHEN" },
      XK_Armenian_yentamna: { code: 16778634, description: "(\u058A) ARMENIAN HYPHEN" },
      XK_Armenian_exclam: { code: 16778588, description: "(\u055C) ARMENIAN EXCLAMATION MARK" },
      XK_Armenian_amanak: { code: 16778588, description: "(\u055C) ARMENIAN EXCLAMATION MARK" },
      XK_Armenian_accent: { code: 16778587, description: "(\u055B) ARMENIAN EMPHASIS MARK" },
      XK_Armenian_shesht: { code: 16778587, description: "(\u055B) ARMENIAN EMPHASIS MARK" },
      XK_Armenian_question: { code: 16778590, description: "(\u055E) ARMENIAN QUESTION MARK" },
      XK_Armenian_paruyk: { code: 16778590, description: "(\u055E) ARMENIAN QUESTION MARK" },
      XK_Armenian_AYB: { code: 16778545, description: "(\u0531) ARMENIAN CAPITAL LETTER AYB" },
      XK_Armenian_ayb: { code: 16778593, description: "(\u0561) ARMENIAN SMALL LETTER AYB" },
      XK_Armenian_BEN: { code: 16778546, description: "(\u0532) ARMENIAN CAPITAL LETTER BEN" },
      XK_Armenian_ben: { code: 16778594, description: "(\u0562) ARMENIAN SMALL LETTER BEN" },
      XK_Armenian_GIM: { code: 16778547, description: "(\u0533) ARMENIAN CAPITAL LETTER GIM" },
      XK_Armenian_gim: { code: 16778595, description: "(\u0563) ARMENIAN SMALL LETTER GIM" },
      XK_Armenian_DA: { code: 16778548, description: "(\u0534) ARMENIAN CAPITAL LETTER DA" },
      XK_Armenian_da: { code: 16778596, description: "(\u0564) ARMENIAN SMALL LETTER DA" },
      XK_Armenian_YECH: { code: 16778549, description: "(\u0535) ARMENIAN CAPITAL LETTER ECH" },
      XK_Armenian_yech: { code: 16778597, description: "(\u0565) ARMENIAN SMALL LETTER ECH" },
      XK_Armenian_ZA: { code: 16778550, description: "(\u0536) ARMENIAN CAPITAL LETTER ZA" },
      XK_Armenian_za: { code: 16778598, description: "(\u0566) ARMENIAN SMALL LETTER ZA" },
      XK_Armenian_E: { code: 16778551, description: "(\u0537) ARMENIAN CAPITAL LETTER EH" },
      XK_Armenian_e: { code: 16778599, description: "(\u0567) ARMENIAN SMALL LETTER EH" },
      XK_Armenian_AT: { code: 16778552, description: "(\u0538) ARMENIAN CAPITAL LETTER ET" },
      XK_Armenian_at: { code: 16778600, description: "(\u0568) ARMENIAN SMALL LETTER ET" },
      XK_Armenian_TO: { code: 16778553, description: "(\u0539) ARMENIAN CAPITAL LETTER TO" },
      XK_Armenian_to: { code: 16778601, description: "(\u0569) ARMENIAN SMALL LETTER TO" },
      XK_Armenian_ZHE: { code: 16778554, description: "(\u053A) ARMENIAN CAPITAL LETTER ZHE" },
      XK_Armenian_zhe: { code: 16778602, description: "(\u056A) ARMENIAN SMALL LETTER ZHE" },
      XK_Armenian_INI: { code: 16778555, description: "(\u053B) ARMENIAN CAPITAL LETTER INI" },
      XK_Armenian_ini: { code: 16778603, description: "(\u056B) ARMENIAN SMALL LETTER INI" },
      XK_Armenian_LYUN: { code: 16778556, description: "(\u053C) ARMENIAN CAPITAL LETTER LIWN" },
      XK_Armenian_lyun: { code: 16778604, description: "(\u056C) ARMENIAN SMALL LETTER LIWN" },
      XK_Armenian_KHE: { code: 16778557, description: "(\u053D) ARMENIAN CAPITAL LETTER XEH" },
      XK_Armenian_khe: { code: 16778605, description: "(\u056D) ARMENIAN SMALL LETTER XEH" },
      XK_Armenian_TSA: { code: 16778558, description: "(\u053E) ARMENIAN CAPITAL LETTER CA" },
      XK_Armenian_tsa: { code: 16778606, description: "(\u056E) ARMENIAN SMALL LETTER CA" },
      XK_Armenian_KEN: { code: 16778559, description: "(\u053F) ARMENIAN CAPITAL LETTER KEN" },
      XK_Armenian_ken: { code: 16778607, description: "(\u056F) ARMENIAN SMALL LETTER KEN" },
      XK_Armenian_HO: { code: 16778560, description: "(\u0540) ARMENIAN CAPITAL LETTER HO" },
      XK_Armenian_ho: { code: 16778608, description: "(\u0570) ARMENIAN SMALL LETTER HO" },
      XK_Armenian_DZA: { code: 16778561, description: "(\u0541) ARMENIAN CAPITAL LETTER JA" },
      XK_Armenian_dza: { code: 16778609, description: "(\u0571) ARMENIAN SMALL LETTER JA" },
      XK_Armenian_GHAT: { code: 16778562, description: "(\u0542) ARMENIAN CAPITAL LETTER GHAD" },
      XK_Armenian_ghat: { code: 16778610, description: "(\u0572) ARMENIAN SMALL LETTER GHAD" },
      XK_Armenian_TCHE: { code: 16778563, description: "(\u0543) ARMENIAN CAPITAL LETTER CHEH" },
      XK_Armenian_tche: { code: 16778611, description: "(\u0573) ARMENIAN SMALL LETTER CHEH" },
      XK_Armenian_MEN: { code: 16778564, description: "(\u0544) ARMENIAN CAPITAL LETTER MEN" },
      XK_Armenian_men: { code: 16778612, description: "(\u0574) ARMENIAN SMALL LETTER MEN" },
      XK_Armenian_HI: { code: 16778565, description: "(\u0545) ARMENIAN CAPITAL LETTER YI" },
      XK_Armenian_hi: { code: 16778613, description: "(\u0575) ARMENIAN SMALL LETTER YI" },
      XK_Armenian_NU: { code: 16778566, description: "(\u0546) ARMENIAN CAPITAL LETTER NOW" },
      XK_Armenian_nu: { code: 16778614, description: "(\u0576) ARMENIAN SMALL LETTER NOW" },
      XK_Armenian_SHA: { code: 16778567, description: "(\u0547) ARMENIAN CAPITAL LETTER SHA" },
      XK_Armenian_sha: { code: 16778615, description: "(\u0577) ARMENIAN SMALL LETTER SHA" },
      XK_Armenian_VO: { code: 16778568, description: "(\u0548) ARMENIAN CAPITAL LETTER VO" },
      XK_Armenian_vo: { code: 16778616, description: "(\u0578) ARMENIAN SMALL LETTER VO" },
      XK_Armenian_CHA: { code: 16778569, description: "(\u0549) ARMENIAN CAPITAL LETTER CHA" },
      XK_Armenian_cha: { code: 16778617, description: "(\u0579) ARMENIAN SMALL LETTER CHA" },
      XK_Armenian_PE: { code: 16778570, description: "(\u054A) ARMENIAN CAPITAL LETTER PEH" },
      XK_Armenian_pe: { code: 16778618, description: "(\u057A) ARMENIAN SMALL LETTER PEH" },
      XK_Armenian_JE: { code: 16778571, description: "(\u054B) ARMENIAN CAPITAL LETTER JHEH" },
      XK_Armenian_je: { code: 16778619, description: "(\u057B) ARMENIAN SMALL LETTER JHEH" },
      XK_Armenian_RA: { code: 16778572, description: "(\u054C) ARMENIAN CAPITAL LETTER RA" },
      XK_Armenian_ra: { code: 16778620, description: "(\u057C) ARMENIAN SMALL LETTER RA" },
      XK_Armenian_SE: { code: 16778573, description: "(\u054D) ARMENIAN CAPITAL LETTER SEH" },
      XK_Armenian_se: { code: 16778621, description: "(\u057D) ARMENIAN SMALL LETTER SEH" },
      XK_Armenian_VEV: { code: 16778574, description: "(\u054E) ARMENIAN CAPITAL LETTER VEW" },
      XK_Armenian_vev: { code: 16778622, description: "(\u057E) ARMENIAN SMALL LETTER VEW" },
      XK_Armenian_TYUN: { code: 16778575, description: "(\u054F) ARMENIAN CAPITAL LETTER TIWN" },
      XK_Armenian_tyun: { code: 16778623, description: "(\u057F) ARMENIAN SMALL LETTER TIWN" },
      XK_Armenian_RE: { code: 16778576, description: "(\u0550) ARMENIAN CAPITAL LETTER REH" },
      XK_Armenian_re: { code: 16778624, description: "(\u0580) ARMENIAN SMALL LETTER REH" },
      XK_Armenian_TSO: { code: 16778577, description: "(\u0551) ARMENIAN CAPITAL LETTER CO" },
      XK_Armenian_tso: { code: 16778625, description: "(\u0581) ARMENIAN SMALL LETTER CO" },
      XK_Armenian_VYUN: { code: 16778578, description: "(\u0552) ARMENIAN CAPITAL LETTER YIWN" },
      XK_Armenian_vyun: { code: 16778626, description: "(\u0582) ARMENIAN SMALL LETTER YIWN" },
      XK_Armenian_PYUR: { code: 16778579, description: "(\u0553) ARMENIAN CAPITAL LETTER PIWR" },
      XK_Armenian_pyur: { code: 16778627, description: "(\u0583) ARMENIAN SMALL LETTER PIWR" },
      XK_Armenian_KE: { code: 16778580, description: "(\u0554) ARMENIAN CAPITAL LETTER KEH" },
      XK_Armenian_ke: { code: 16778628, description: "(\u0584) ARMENIAN SMALL LETTER KEH" },
      XK_Armenian_O: { code: 16778581, description: "(\u0555) ARMENIAN CAPITAL LETTER OH" },
      XK_Armenian_o: { code: 16778629, description: "(\u0585) ARMENIAN SMALL LETTER OH" },
      XK_Armenian_FE: { code: 16778582, description: "(\u0556) ARMENIAN CAPITAL LETTER FEH" },
      XK_Armenian_fe: { code: 16778630, description: "(\u0586) ARMENIAN SMALL LETTER FEH" },
      XK_Armenian_apostrophe: { code: 16778586, description: "(\u055A) ARMENIAN APOSTROPHE" },
      /*
       * Georgian
       */
      // Group XK_GEORGIAN
      XK_Georgian_an: { code: 16781520, description: "(\u10D0) GEORGIAN LETTER AN" },
      XK_Georgian_ban: { code: 16781521, description: "(\u10D1) GEORGIAN LETTER BAN" },
      XK_Georgian_gan: { code: 16781522, description: "(\u10D2) GEORGIAN LETTER GAN" },
      XK_Georgian_don: { code: 16781523, description: "(\u10D3) GEORGIAN LETTER DON" },
      XK_Georgian_en: { code: 16781524, description: "(\u10D4) GEORGIAN LETTER EN" },
      XK_Georgian_vin: { code: 16781525, description: "(\u10D5) GEORGIAN LETTER VIN" },
      XK_Georgian_zen: { code: 16781526, description: "(\u10D6) GEORGIAN LETTER ZEN" },
      XK_Georgian_tan: { code: 16781527, description: "(\u10D7) GEORGIAN LETTER TAN" },
      XK_Georgian_in: { code: 16781528, description: "(\u10D8) GEORGIAN LETTER IN" },
      XK_Georgian_kan: { code: 16781529, description: "(\u10D9) GEORGIAN LETTER KAN" },
      XK_Georgian_las: { code: 16781530, description: "(\u10DA) GEORGIAN LETTER LAS" },
      XK_Georgian_man: { code: 16781531, description: "(\u10DB) GEORGIAN LETTER MAN" },
      XK_Georgian_nar: { code: 16781532, description: "(\u10DC) GEORGIAN LETTER NAR" },
      XK_Georgian_on: { code: 16781533, description: "(\u10DD) GEORGIAN LETTER ON" },
      XK_Georgian_par: { code: 16781534, description: "(\u10DE) GEORGIAN LETTER PAR" },
      XK_Georgian_zhar: { code: 16781535, description: "(\u10DF) GEORGIAN LETTER ZHAR" },
      XK_Georgian_rae: { code: 16781536, description: "(\u10E0) GEORGIAN LETTER RAE" },
      XK_Georgian_san: { code: 16781537, description: "(\u10E1) GEORGIAN LETTER SAN" },
      XK_Georgian_tar: { code: 16781538, description: "(\u10E2) GEORGIAN LETTER TAR" },
      XK_Georgian_un: { code: 16781539, description: "(\u10E3) GEORGIAN LETTER UN" },
      XK_Georgian_phar: { code: 16781540, description: "(\u10E4) GEORGIAN LETTER PHAR" },
      XK_Georgian_khar: { code: 16781541, description: "(\u10E5) GEORGIAN LETTER KHAR" },
      XK_Georgian_ghan: { code: 16781542, description: "(\u10E6) GEORGIAN LETTER GHAN" },
      XK_Georgian_qar: { code: 16781543, description: "(\u10E7) GEORGIAN LETTER QAR" },
      XK_Georgian_shin: { code: 16781544, description: "(\u10E8) GEORGIAN LETTER SHIN" },
      XK_Georgian_chin: { code: 16781545, description: "(\u10E9) GEORGIAN LETTER CHIN" },
      XK_Georgian_can: { code: 16781546, description: "(\u10EA) GEORGIAN LETTER CAN" },
      XK_Georgian_jil: { code: 16781547, description: "(\u10EB) GEORGIAN LETTER JIL" },
      XK_Georgian_cil: { code: 16781548, description: "(\u10EC) GEORGIAN LETTER CIL" },
      XK_Georgian_char: { code: 16781549, description: "(\u10ED) GEORGIAN LETTER CHAR" },
      XK_Georgian_xan: { code: 16781550, description: "(\u10EE) GEORGIAN LETTER XAN" },
      XK_Georgian_jhan: { code: 16781551, description: "(\u10EF) GEORGIAN LETTER JHAN" },
      XK_Georgian_hae: { code: 16781552, description: "(\u10F0) GEORGIAN LETTER HAE" },
      XK_Georgian_he: { code: 16781553, description: "(\u10F1) GEORGIAN LETTER HE" },
      XK_Georgian_hie: { code: 16781554, description: "(\u10F2) GEORGIAN LETTER HIE" },
      XK_Georgian_we: { code: 16781555, description: "(\u10F3) GEORGIAN LETTER WE" },
      XK_Georgian_har: { code: 16781556, description: "(\u10F4) GEORGIAN LETTER HAR" },
      XK_Georgian_hoe: { code: 16781557, description: "(\u10F5) GEORGIAN LETTER HOE" },
      XK_Georgian_fi: { code: 16781558, description: "(\u10F6) GEORGIAN LETTER FI" },
      /*
       * Azeri (and other Turkic or Caucasian languages)
       */
      // Group XK_CAUCASUS
      /* latin */
      XK_Xabovedot: { code: 16785034, description: "(\u1E8A) LATIN CAPITAL LETTER X WITH DOT ABOVE" },
      XK_Ibreve: { code: 16777516, description: "(\u012C) LATIN CAPITAL LETTER I WITH BREVE" },
      XK_Zstroke: { code: 16777653, description: "(\u01B5) LATIN CAPITAL LETTER Z WITH STROKE" },
      XK_Gcaron: { code: 16777702, description: "(\u01E6) LATIN CAPITAL LETTER G WITH CARON" },
      XK_Ocaron: { code: 16777681, description: "(\u01D2) LATIN CAPITAL LETTER O WITH CARON" },
      XK_Obarred: { code: 16777631, description: "(\u019F) LATIN CAPITAL LETTER O WITH MIDDLE TILDE" },
      XK_xabovedot: { code: 16785035, description: "(\u1E8B) LATIN SMALL LETTER X WITH DOT ABOVE" },
      XK_ibreve: { code: 16777517, description: "(\u012D) LATIN SMALL LETTER I WITH BREVE" },
      XK_zstroke: { code: 16777654, description: "(\u01B6) LATIN SMALL LETTER Z WITH STROKE" },
      XK_gcaron: { code: 16777703, description: "(\u01E7) LATIN SMALL LETTER G WITH CARON" },
      XK_ocaron: { code: 16777682, description: "(\u01D2) LATIN SMALL LETTER O WITH CARON" },
      XK_obarred: { code: 16777845, description: "(\u0275) LATIN SMALL LETTER BARRED O" },
      XK_SCHWA: { code: 16777615, description: "(\u018F) LATIN CAPITAL LETTER SCHWA" },
      XK_schwa: { code: 16777817, description: "(\u0259) LATIN SMALL LETTER SCHWA" },
      XK_EZH: { code: 16777655, description: "(\u01B7) LATIN CAPITAL LETTER EZH" },
      XK_ezh: { code: 16777874, description: "(\u0292) LATIN SMALL LETTER EZH" },
      /* those are not really Caucasus */
      /* For Inupiak */
      XK_Lbelowdot: { code: 16784950, description: "(\u1E36) LATIN CAPITAL LETTER L WITH DOT BELOW" },
      XK_lbelowdot: { code: 16784951, description: "(\u1E37) LATIN SMALL LETTER L WITH DOT BELOW" },
      /*
       * Vietnamese
       */
      // Group XK_VIETNAMESE
      XK_Abelowdot: { code: 16785056, description: "(\u1EA0) LATIN CAPITAL LETTER A WITH DOT BELOW" },
      XK_abelowdot: { code: 16785057, description: "(\u1EA1) LATIN SMALL LETTER A WITH DOT BELOW" },
      XK_Ahook: { code: 16785058, description: "(\u1EA2) LATIN CAPITAL LETTER A WITH HOOK ABOVE" },
      XK_ahook: { code: 16785059, description: "(\u1EA3) LATIN SMALL LETTER A WITH HOOK ABOVE" },
      XK_Acircumflexacute: { code: 16785060, description: "(\u1EA4) LATIN CAPITAL LETTER A WITH CIRCUMFLEX AND ACUTE" },
      XK_acircumflexacute: { code: 16785061, description: "(\u1EA5) LATIN SMALL LETTER A WITH CIRCUMFLEX AND ACUTE" },
      XK_Acircumflexgrave: { code: 16785062, description: "(\u1EA6) LATIN CAPITAL LETTER A WITH CIRCUMFLEX AND GRAVE" },
      XK_acircumflexgrave: { code: 16785063, description: "(\u1EA7) LATIN SMALL LETTER A WITH CIRCUMFLEX AND GRAVE" },
      XK_Acircumflexhook: { code: 16785064, description: "(\u1EA8) LATIN CAPITAL LETTER A WITH CIRCUMFLEX AND HOOK ABOVE" },
      XK_acircumflexhook: { code: 16785065, description: "(\u1EA9) LATIN SMALL LETTER A WITH CIRCUMFLEX AND HOOK ABOVE" },
      XK_Acircumflextilde: { code: 16785066, description: "(\u1EAA) LATIN CAPITAL LETTER A WITH CIRCUMFLEX AND TILDE" },
      XK_acircumflextilde: { code: 16785067, description: "(\u1EAB) LATIN SMALL LETTER A WITH CIRCUMFLEX AND TILDE" },
      XK_Acircumflexbelowdot: { code: 16785068, description: "(\u1EAC) LATIN CAPITAL LETTER A WITH CIRCUMFLEX AND DOT BELOW" },
      XK_acircumflexbelowdot: { code: 16785069, description: "(\u1EAD) LATIN SMALL LETTER A WITH CIRCUMFLEX AND DOT BELOW" },
      XK_Abreveacute: { code: 16785070, description: "(\u1EAE) LATIN CAPITAL LETTER A WITH BREVE AND ACUTE" },
      XK_abreveacute: { code: 16785071, description: "(\u1EAF) LATIN SMALL LETTER A WITH BREVE AND ACUTE" },
      XK_Abrevegrave: { code: 16785072, description: "(\u1EB0) LATIN CAPITAL LETTER A WITH BREVE AND GRAVE" },
      XK_abrevegrave: { code: 16785073, description: "(\u1EB1) LATIN SMALL LETTER A WITH BREVE AND GRAVE" },
      XK_Abrevehook: { code: 16785074, description: "(\u1EB2) LATIN CAPITAL LETTER A WITH BREVE AND HOOK ABOVE" },
      XK_abrevehook: { code: 16785075, description: "(\u1EB3) LATIN SMALL LETTER A WITH BREVE AND HOOK ABOVE" },
      XK_Abrevetilde: { code: 16785076, description: "(\u1EB4) LATIN CAPITAL LETTER A WITH BREVE AND TILDE" },
      XK_abrevetilde: { code: 16785077, description: "(\u1EB5) LATIN SMALL LETTER A WITH BREVE AND TILDE" },
      XK_Abrevebelowdot: { code: 16785078, description: "(\u1EB6) LATIN CAPITAL LETTER A WITH BREVE AND DOT BELOW" },
      XK_abrevebelowdot: { code: 16785079, description: "(\u1EB7) LATIN SMALL LETTER A WITH BREVE AND DOT BELOW" },
      XK_Ebelowdot: { code: 16785080, description: "(\u1EB8) LATIN CAPITAL LETTER E WITH DOT BELOW" },
      XK_ebelowdot: { code: 16785081, description: "(\u1EB9) LATIN SMALL LETTER E WITH DOT BELOW" },
      XK_Ehook: { code: 16785082, description: "(\u1EBA) LATIN CAPITAL LETTER E WITH HOOK ABOVE" },
      XK_ehook: { code: 16785083, description: "(\u1EBB) LATIN SMALL LETTER E WITH HOOK ABOVE" },
      XK_Etilde: { code: 16785084, description: "(\u1EBC) LATIN CAPITAL LETTER E WITH TILDE" },
      XK_etilde: { code: 16785085, description: "(\u1EBD) LATIN SMALL LETTER E WITH TILDE" },
      XK_Ecircumflexacute: { code: 16785086, description: "(\u1EBE) LATIN CAPITAL LETTER E WITH CIRCUMFLEX AND ACUTE" },
      XK_ecircumflexacute: { code: 16785087, description: "(\u1EBF) LATIN SMALL LETTER E WITH CIRCUMFLEX AND ACUTE" },
      XK_Ecircumflexgrave: { code: 16785088, description: "(\u1EC0) LATIN CAPITAL LETTER E WITH CIRCUMFLEX AND GRAVE" },
      XK_ecircumflexgrave: { code: 16785089, description: "(\u1EC1) LATIN SMALL LETTER E WITH CIRCUMFLEX AND GRAVE" },
      XK_Ecircumflexhook: { code: 16785090, description: "(\u1EC2) LATIN CAPITAL LETTER E WITH CIRCUMFLEX AND HOOK ABOVE" },
      XK_ecircumflexhook: { code: 16785091, description: "(\u1EC3) LATIN SMALL LETTER E WITH CIRCUMFLEX AND HOOK ABOVE" },
      XK_Ecircumflextilde: { code: 16785092, description: "(\u1EC4) LATIN CAPITAL LETTER E WITH CIRCUMFLEX AND TILDE" },
      XK_ecircumflextilde: { code: 16785093, description: "(\u1EC5) LATIN SMALL LETTER E WITH CIRCUMFLEX AND TILDE" },
      XK_Ecircumflexbelowdot: { code: 16785094, description: "(\u1EC6) LATIN CAPITAL LETTER E WITH CIRCUMFLEX AND DOT BELOW" },
      XK_ecircumflexbelowdot: { code: 16785095, description: "(\u1EC7) LATIN SMALL LETTER E WITH CIRCUMFLEX AND DOT BELOW" },
      XK_Ihook: { code: 16785096, description: "(\u1EC8) LATIN CAPITAL LETTER I WITH HOOK ABOVE" },
      XK_ihook: { code: 16785097, description: "(\u1EC9) LATIN SMALL LETTER I WITH HOOK ABOVE" },
      XK_Ibelowdot: { code: 16785098, description: "(\u1ECA) LATIN CAPITAL LETTER I WITH DOT BELOW" },
      XK_ibelowdot: { code: 16785099, description: "(\u1ECB) LATIN SMALL LETTER I WITH DOT BELOW" },
      XK_Obelowdot: { code: 16785100, description: "(\u1ECC) LATIN CAPITAL LETTER O WITH DOT BELOW" },
      XK_obelowdot: { code: 16785101, description: "(\u1ECD) LATIN SMALL LETTER O WITH DOT BELOW" },
      XK_Ohook: { code: 16785102, description: "(\u1ECE) LATIN CAPITAL LETTER O WITH HOOK ABOVE" },
      XK_ohook: { code: 16785103, description: "(\u1ECF) LATIN SMALL LETTER O WITH HOOK ABOVE" },
      XK_Ocircumflexacute: { code: 16785104, description: "(\u1ED0) LATIN CAPITAL LETTER O WITH CIRCUMFLEX AND ACUTE" },
      XK_ocircumflexacute: { code: 16785105, description: "(\u1ED1) LATIN SMALL LETTER O WITH CIRCUMFLEX AND ACUTE" },
      XK_Ocircumflexgrave: { code: 16785106, description: "(\u1ED2) LATIN CAPITAL LETTER O WITH CIRCUMFLEX AND GRAVE" },
      XK_ocircumflexgrave: { code: 16785107, description: "(\u1ED3) LATIN SMALL LETTER O WITH CIRCUMFLEX AND GRAVE" },
      XK_Ocircumflexhook: { code: 16785108, description: "(\u1ED4) LATIN CAPITAL LETTER O WITH CIRCUMFLEX AND HOOK ABOVE" },
      XK_ocircumflexhook: { code: 16785109, description: "(\u1ED5) LATIN SMALL LETTER O WITH CIRCUMFLEX AND HOOK ABOVE" },
      XK_Ocircumflextilde: { code: 16785110, description: "(\u1ED6) LATIN CAPITAL LETTER O WITH CIRCUMFLEX AND TILDE" },
      XK_ocircumflextilde: { code: 16785111, description: "(\u1ED7) LATIN SMALL LETTER O WITH CIRCUMFLEX AND TILDE" },
      XK_Ocircumflexbelowdot: { code: 16785112, description: "(\u1ED8) LATIN CAPITAL LETTER O WITH CIRCUMFLEX AND DOT BELOW" },
      XK_ocircumflexbelowdot: { code: 16785113, description: "(\u1ED9) LATIN SMALL LETTER O WITH CIRCUMFLEX AND DOT BELOW" },
      XK_Ohornacute: { code: 16785114, description: "(\u1EDA) LATIN CAPITAL LETTER O WITH HORN AND ACUTE" },
      XK_ohornacute: { code: 16785115, description: "(\u1EDB) LATIN SMALL LETTER O WITH HORN AND ACUTE" },
      XK_Ohorngrave: { code: 16785116, description: "(\u1EDC) LATIN CAPITAL LETTER O WITH HORN AND GRAVE" },
      XK_ohorngrave: { code: 16785117, description: "(\u1EDD) LATIN SMALL LETTER O WITH HORN AND GRAVE" },
      XK_Ohornhook: { code: 16785118, description: "(\u1EDE) LATIN CAPITAL LETTER O WITH HORN AND HOOK ABOVE" },
      XK_ohornhook: { code: 16785119, description: "(\u1EDF) LATIN SMALL LETTER O WITH HORN AND HOOK ABOVE" },
      XK_Ohorntilde: { code: 16785120, description: "(\u1EE0) LATIN CAPITAL LETTER O WITH HORN AND TILDE" },
      XK_ohorntilde: { code: 16785121, description: "(\u1EE1) LATIN SMALL LETTER O WITH HORN AND TILDE" },
      XK_Ohornbelowdot: { code: 16785122, description: "(\u1EE2) LATIN CAPITAL LETTER O WITH HORN AND DOT BELOW" },
      XK_ohornbelowdot: { code: 16785123, description: "(\u1EE3) LATIN SMALL LETTER O WITH HORN AND DOT BELOW" },
      XK_Ubelowdot: { code: 16785124, description: "(\u1EE4) LATIN CAPITAL LETTER U WITH DOT BELOW" },
      XK_ubelowdot: { code: 16785125, description: "(\u1EE5) LATIN SMALL LETTER U WITH DOT BELOW" },
      XK_Uhook: { code: 16785126, description: "(\u1EE6) LATIN CAPITAL LETTER U WITH HOOK ABOVE" },
      XK_uhook: { code: 16785127, description: "(\u1EE7) LATIN SMALL LETTER U WITH HOOK ABOVE" },
      XK_Uhornacute: { code: 16785128, description: "(\u1EE8) LATIN CAPITAL LETTER U WITH HORN AND ACUTE" },
      XK_uhornacute: { code: 16785129, description: "(\u1EE9) LATIN SMALL LETTER U WITH HORN AND ACUTE" },
      XK_Uhorngrave: { code: 16785130, description: "(\u1EEA) LATIN CAPITAL LETTER U WITH HORN AND GRAVE" },
      XK_uhorngrave: { code: 16785131, description: "(\u1EEB) LATIN SMALL LETTER U WITH HORN AND GRAVE" },
      XK_Uhornhook: { code: 16785132, description: "(\u1EEC) LATIN CAPITAL LETTER U WITH HORN AND HOOK ABOVE" },
      XK_uhornhook: { code: 16785133, description: "(\u1EED) LATIN SMALL LETTER U WITH HORN AND HOOK ABOVE" },
      XK_Uhorntilde: { code: 16785134, description: "(\u1EEE) LATIN CAPITAL LETTER U WITH HORN AND TILDE" },
      XK_uhorntilde: { code: 16785135, description: "(\u1EEF) LATIN SMALL LETTER U WITH HORN AND TILDE" },
      XK_Uhornbelowdot: { code: 16785136, description: "(\u1EF0) LATIN CAPITAL LETTER U WITH HORN AND DOT BELOW" },
      XK_uhornbelowdot: { code: 16785137, description: "(\u1EF1) LATIN SMALL LETTER U WITH HORN AND DOT BELOW" },
      XK_Ybelowdot: { code: 16785140, description: "(\u1EF4) LATIN CAPITAL LETTER Y WITH DOT BELOW" },
      XK_ybelowdot: { code: 16785141, description: "(\u1EF5) LATIN SMALL LETTER Y WITH DOT BELOW" },
      XK_Yhook: { code: 16785142, description: "(\u1EF6) LATIN CAPITAL LETTER Y WITH HOOK ABOVE" },
      XK_yhook: { code: 16785143, description: "(\u1EF7) LATIN SMALL LETTER Y WITH HOOK ABOVE" },
      XK_Ytilde: { code: 16785144, description: "(\u1EF8) LATIN CAPITAL LETTER Y WITH TILDE" },
      XK_ytilde: { code: 16785145, description: "(\u1EF9) LATIN SMALL LETTER Y WITH TILDE" },
      XK_Ohorn: { code: 16777632, description: "(\u01A0) LATIN CAPITAL LETTER O WITH HORN" },
      XK_ohorn: { code: 16777633, description: "(\u01A1) LATIN SMALL LETTER O WITH HORN" },
      XK_Uhorn: { code: 16777647, description: "(\u01AF) LATIN CAPITAL LETTER U WITH HORN" },
      XK_uhorn: { code: 16777648, description: "(\u01B0) LATIN SMALL LETTER U WITH HORN" },
      // Group XK_CURRENCY
      XK_EcuSign: { code: 16785568, description: "(\u20A0) EURO-CURRENCY SIGN" },
      XK_ColonSign: { code: 16785569, description: "(\u20A1) COLON SIGN" },
      XK_CruzeiroSign: { code: 16785570, description: "(\u20A2) CRUZEIRO SIGN" },
      XK_FFrancSign: { code: 16785571, description: "(\u20A3) FRENCH FRANC SIGN" },
      XK_LiraSign: { code: 16785572, description: "(\u20A4) LIRA SIGN" },
      XK_MillSign: { code: 16785573, description: "(\u20A5) MILL SIGN" },
      XK_NairaSign: { code: 16785574, description: "(\u20A6) NAIRA SIGN" },
      XK_PesetaSign: { code: 16785575, description: "(\u20A7) PESETA SIGN" },
      XK_RupeeSign: { code: 16785576, description: "(\u20A8) RUPEE SIGN" },
      XK_WonSign: { code: 16785577, description: "(\u20A9) WON SIGN" },
      XK_NewSheqelSign: { code: 16785578, description: "(\u20AA) NEW SHEQEL SIGN" },
      XK_DongSign: { code: 16785579, description: "(\u20AB) DONG SIGN" },
      XK_EuroSign: { code: 8364, description: "(\u20AC) EURO SIGN" },
      // Group XK_MATHEMATICAL
      /* one, two and three are defined above. */
      XK_zerosuperior: { code: 16785520, description: "(\u2070) SUPERSCRIPT ZERO" },
      XK_foursuperior: { code: 16785524, description: "(\u2074) SUPERSCRIPT FOUR" },
      XK_fivesuperior: { code: 16785525, description: "(\u2075) SUPERSCRIPT FIVE" },
      XK_sixsuperior: { code: 16785526, description: "(\u2076) SUPERSCRIPT SIX" },
      XK_sevensuperior: { code: 16785527, description: "(\u2077) SUPERSCRIPT SEVEN" },
      XK_eightsuperior: { code: 16785528, description: "(\u2078) SUPERSCRIPT EIGHT" },
      XK_ninesuperior: { code: 16785529, description: "(\u2079) SUPERSCRIPT NINE" },
      XK_zerosubscript: { code: 16785536, description: "(\u2080) SUBSCRIPT ZERO" },
      XK_onesubscript: { code: 16785537, description: "(\u2081) SUBSCRIPT ONE" },
      XK_twosubscript: { code: 16785538, description: "(\u2082) SUBSCRIPT TWO" },
      XK_threesubscript: { code: 16785539, description: "(\u2083) SUBSCRIPT THREE" },
      XK_foursubscript: { code: 16785540, description: "(\u2084) SUBSCRIPT FOUR" },
      XK_fivesubscript: { code: 16785541, description: "(\u2085) SUBSCRIPT FIVE" },
      XK_sixsubscript: { code: 16785542, description: "(\u2086) SUBSCRIPT SIX" },
      XK_sevensubscript: { code: 16785543, description: "(\u2087) SUBSCRIPT SEVEN" },
      XK_eightsubscript: { code: 16785544, description: "(\u2088) SUBSCRIPT EIGHT" },
      XK_ninesubscript: { code: 16785545, description: "(\u2089) SUBSCRIPT NINE" },
      XK_partdifferential: { code: 16785922, description: "(\u2202) PARTIAL DIFFERENTIAL" },
      XK_emptyset: { code: 16785925, description: "(\u2205) NULL SET" },
      XK_elementof: { code: 16785928, description: "(\u2208) ELEMENT OF" },
      XK_notelementof: { code: 16785929, description: "(\u2209) NOT AN ELEMENT OF" },
      XK_containsas: { code: 16785931, description: "(\u220B) CONTAINS AS MEMBER" },
      XK_squareroot: { code: 16785946, description: "(\u221A) SQUARE ROOT" },
      XK_cuberoot: { code: 16785947, description: "(\u221B) CUBE ROOT" },
      XK_fourthroot: { code: 16785948, description: "(\u221C) FOURTH ROOT" },
      XK_dintegral: { code: 16785964, description: "(\u222C) DOUBLE INTEGRAL" },
      XK_tintegral: { code: 16785965, description: "(\u222D) TRIPLE INTEGRAL" },
      XK_because: { code: 16785973, description: "(\u2235) BECAUSE" },
      XK_approxeq: { code: 16785992, description: "(\u2245) ALMOST EQUAL TO" },
      XK_notapproxeq: { code: 16785991, description: "(\u2247) NOT ALMOST EQUAL TO" },
      XK_notidentical: { code: 16786018, description: "(\u2262) NOT IDENTICAL TO" },
      XK_stricteq: { code: 16786019, description: "(\u2263) STRICTLY EQUIVALENT TO" },
      // Group XK_BRAILLE
      XK_braille_dot_1: { code: 65521, description: null },
      XK_braille_dot_2: { code: 65522, description: null },
      XK_braille_dot_3: { code: 65523, description: null },
      XK_braille_dot_4: { code: 65524, description: null },
      XK_braille_dot_5: { code: 65525, description: null },
      XK_braille_dot_6: { code: 65526, description: null },
      XK_braille_dot_7: { code: 65527, description: null },
      XK_braille_dot_8: { code: 65528, description: null },
      XK_braille_dot_9: { code: 65529, description: null },
      XK_braille_dot_10: { code: 65530, description: null },
      XK_braille_blank: { code: 16787456, description: "(\u2800) BRAILLE PATTERN BLANK" },
      XK_braille_dots_1: { code: 16787457, description: "(\u2801) BRAILLE PATTERN DOTS-1" },
      XK_braille_dots_2: { code: 16787458, description: "(\u2802) BRAILLE PATTERN DOTS-2" },
      XK_braille_dots_12: { code: 16787459, description: "(\u2803) BRAILLE PATTERN DOTS-12" },
      XK_braille_dots_3: { code: 16787460, description: "(\u2804) BRAILLE PATTERN DOTS-3" },
      XK_braille_dots_13: { code: 16787461, description: "(\u2805) BRAILLE PATTERN DOTS-13" },
      XK_braille_dots_23: { code: 16787462, description: "(\u2806) BRAILLE PATTERN DOTS-23" },
      XK_braille_dots_123: { code: 16787463, description: "(\u2807) BRAILLE PATTERN DOTS-123" },
      XK_braille_dots_4: { code: 16787464, description: "(\u2808) BRAILLE PATTERN DOTS-4" },
      XK_braille_dots_14: { code: 16787465, description: "(\u2809) BRAILLE PATTERN DOTS-14" },
      XK_braille_dots_24: { code: 16787466, description: "(\u280A) BRAILLE PATTERN DOTS-24" },
      XK_braille_dots_124: { code: 16787467, description: "(\u280B) BRAILLE PATTERN DOTS-124" },
      XK_braille_dots_34: { code: 16787468, description: "(\u280C) BRAILLE PATTERN DOTS-34" },
      XK_braille_dots_134: { code: 16787469, description: "(\u280D) BRAILLE PATTERN DOTS-134" },
      XK_braille_dots_234: { code: 16787470, description: "(\u280E) BRAILLE PATTERN DOTS-234" },
      XK_braille_dots_1234: { code: 16787471, description: "(\u280F) BRAILLE PATTERN DOTS-1234" },
      XK_braille_dots_5: { code: 16787472, description: "(\u2810) BRAILLE PATTERN DOTS-5" },
      XK_braille_dots_15: { code: 16787473, description: "(\u2811) BRAILLE PATTERN DOTS-15" },
      XK_braille_dots_25: { code: 16787474, description: "(\u2812) BRAILLE PATTERN DOTS-25" },
      XK_braille_dots_125: { code: 16787475, description: "(\u2813) BRAILLE PATTERN DOTS-125" },
      XK_braille_dots_35: { code: 16787476, description: "(\u2814) BRAILLE PATTERN DOTS-35" },
      XK_braille_dots_135: { code: 16787477, description: "(\u2815) BRAILLE PATTERN DOTS-135" },
      XK_braille_dots_235: { code: 16787478, description: "(\u2816) BRAILLE PATTERN DOTS-235" },
      XK_braille_dots_1235: { code: 16787479, description: "(\u2817) BRAILLE PATTERN DOTS-1235" },
      XK_braille_dots_45: { code: 16787480, description: "(\u2818) BRAILLE PATTERN DOTS-45" },
      XK_braille_dots_145: { code: 16787481, description: "(\u2819) BRAILLE PATTERN DOTS-145" },
      XK_braille_dots_245: { code: 16787482, description: "(\u281A) BRAILLE PATTERN DOTS-245" },
      XK_braille_dots_1245: { code: 16787483, description: "(\u281B) BRAILLE PATTERN DOTS-1245" },
      XK_braille_dots_345: { code: 16787484, description: "(\u281C) BRAILLE PATTERN DOTS-345" },
      XK_braille_dots_1345: { code: 16787485, description: "(\u281D) BRAILLE PATTERN DOTS-1345" },
      XK_braille_dots_2345: { code: 16787486, description: "(\u281E) BRAILLE PATTERN DOTS-2345" },
      XK_braille_dots_12345: { code: 16787487, description: "(\u281F) BRAILLE PATTERN DOTS-12345" },
      XK_braille_dots_6: { code: 16787488, description: "(\u2820) BRAILLE PATTERN DOTS-6" },
      XK_braille_dots_16: { code: 16787489, description: "(\u2821) BRAILLE PATTERN DOTS-16" },
      XK_braille_dots_26: { code: 16787490, description: "(\u2822) BRAILLE PATTERN DOTS-26" },
      XK_braille_dots_126: { code: 16787491, description: "(\u2823) BRAILLE PATTERN DOTS-126" },
      XK_braille_dots_36: { code: 16787492, description: "(\u2824) BRAILLE PATTERN DOTS-36" },
      XK_braille_dots_136: { code: 16787493, description: "(\u2825) BRAILLE PATTERN DOTS-136" },
      XK_braille_dots_236: { code: 16787494, description: "(\u2826) BRAILLE PATTERN DOTS-236" },
      XK_braille_dots_1236: { code: 16787495, description: "(\u2827) BRAILLE PATTERN DOTS-1236" },
      XK_braille_dots_46: { code: 16787496, description: "(\u2828) BRAILLE PATTERN DOTS-46" },
      XK_braille_dots_146: { code: 16787497, description: "(\u2829) BRAILLE PATTERN DOTS-146" },
      XK_braille_dots_246: { code: 16787498, description: "(\u282A) BRAILLE PATTERN DOTS-246" },
      XK_braille_dots_1246: { code: 16787499, description: "(\u282B) BRAILLE PATTERN DOTS-1246" },
      XK_braille_dots_346: { code: 16787500, description: "(\u282C) BRAILLE PATTERN DOTS-346" },
      XK_braille_dots_1346: { code: 16787501, description: "(\u282D) BRAILLE PATTERN DOTS-1346" },
      XK_braille_dots_2346: { code: 16787502, description: "(\u282E) BRAILLE PATTERN DOTS-2346" },
      XK_braille_dots_12346: { code: 16787503, description: "(\u282F) BRAILLE PATTERN DOTS-12346" },
      XK_braille_dots_56: { code: 16787504, description: "(\u2830) BRAILLE PATTERN DOTS-56" },
      XK_braille_dots_156: { code: 16787505, description: "(\u2831) BRAILLE PATTERN DOTS-156" },
      XK_braille_dots_256: { code: 16787506, description: "(\u2832) BRAILLE PATTERN DOTS-256" },
      XK_braille_dots_1256: { code: 16787507, description: "(\u2833) BRAILLE PATTERN DOTS-1256" },
      XK_braille_dots_356: { code: 16787508, description: "(\u2834) BRAILLE PATTERN DOTS-356" },
      XK_braille_dots_1356: { code: 16787509, description: "(\u2835) BRAILLE PATTERN DOTS-1356" },
      XK_braille_dots_2356: { code: 16787510, description: "(\u2836) BRAILLE PATTERN DOTS-2356" },
      XK_braille_dots_12356: { code: 16787511, description: "(\u2837) BRAILLE PATTERN DOTS-12356" },
      XK_braille_dots_456: { code: 16787512, description: "(\u2838) BRAILLE PATTERN DOTS-456" },
      XK_braille_dots_1456: { code: 16787513, description: "(\u2839) BRAILLE PATTERN DOTS-1456" },
      XK_braille_dots_2456: { code: 16787514, description: "(\u283A) BRAILLE PATTERN DOTS-2456" },
      XK_braille_dots_12456: { code: 16787515, description: "(\u283B) BRAILLE PATTERN DOTS-12456" },
      XK_braille_dots_3456: { code: 16787516, description: "(\u283C) BRAILLE PATTERN DOTS-3456" },
      XK_braille_dots_13456: { code: 16787517, description: "(\u283D) BRAILLE PATTERN DOTS-13456" },
      XK_braille_dots_23456: { code: 16787518, description: "(\u283E) BRAILLE PATTERN DOTS-23456" },
      XK_braille_dots_123456: { code: 16787519, description: "(\u283F) BRAILLE PATTERN DOTS-123456" },
      XK_braille_dots_7: { code: 16787520, description: "(\u2840) BRAILLE PATTERN DOTS-7" },
      XK_braille_dots_17: { code: 16787521, description: "(\u2841) BRAILLE PATTERN DOTS-17" },
      XK_braille_dots_27: { code: 16787522, description: "(\u2842) BRAILLE PATTERN DOTS-27" },
      XK_braille_dots_127: { code: 16787523, description: "(\u2843) BRAILLE PATTERN DOTS-127" },
      XK_braille_dots_37: { code: 16787524, description: "(\u2844) BRAILLE PATTERN DOTS-37" },
      XK_braille_dots_137: { code: 16787525, description: "(\u2845) BRAILLE PATTERN DOTS-137" },
      XK_braille_dots_237: { code: 16787526, description: "(\u2846) BRAILLE PATTERN DOTS-237" },
      XK_braille_dots_1237: { code: 16787527, description: "(\u2847) BRAILLE PATTERN DOTS-1237" },
      XK_braille_dots_47: { code: 16787528, description: "(\u2848) BRAILLE PATTERN DOTS-47" },
      XK_braille_dots_147: { code: 16787529, description: "(\u2849) BRAILLE PATTERN DOTS-147" },
      XK_braille_dots_247: { code: 16787530, description: "(\u284A) BRAILLE PATTERN DOTS-247" },
      XK_braille_dots_1247: { code: 16787531, description: "(\u284B) BRAILLE PATTERN DOTS-1247" },
      XK_braille_dots_347: { code: 16787532, description: "(\u284C) BRAILLE PATTERN DOTS-347" },
      XK_braille_dots_1347: { code: 16787533, description: "(\u284D) BRAILLE PATTERN DOTS-1347" },
      XK_braille_dots_2347: { code: 16787534, description: "(\u284E) BRAILLE PATTERN DOTS-2347" },
      XK_braille_dots_12347: { code: 16787535, description: "(\u284F) BRAILLE PATTERN DOTS-12347" },
      XK_braille_dots_57: { code: 16787536, description: "(\u2850) BRAILLE PATTERN DOTS-57" },
      XK_braille_dots_157: { code: 16787537, description: "(\u2851) BRAILLE PATTERN DOTS-157" },
      XK_braille_dots_257: { code: 16787538, description: "(\u2852) BRAILLE PATTERN DOTS-257" },
      XK_braille_dots_1257: { code: 16787539, description: "(\u2853) BRAILLE PATTERN DOTS-1257" },
      XK_braille_dots_357: { code: 16787540, description: "(\u2854) BRAILLE PATTERN DOTS-357" },
      XK_braille_dots_1357: { code: 16787541, description: "(\u2855) BRAILLE PATTERN DOTS-1357" },
      XK_braille_dots_2357: { code: 16787542, description: "(\u2856) BRAILLE PATTERN DOTS-2357" },
      XK_braille_dots_12357: { code: 16787543, description: "(\u2857) BRAILLE PATTERN DOTS-12357" },
      XK_braille_dots_457: { code: 16787544, description: "(\u2858) BRAILLE PATTERN DOTS-457" },
      XK_braille_dots_1457: { code: 16787545, description: "(\u2859) BRAILLE PATTERN DOTS-1457" },
      XK_braille_dots_2457: { code: 16787546, description: "(\u285A) BRAILLE PATTERN DOTS-2457" },
      XK_braille_dots_12457: { code: 16787547, description: "(\u285B) BRAILLE PATTERN DOTS-12457" },
      XK_braille_dots_3457: { code: 16787548, description: "(\u285C) BRAILLE PATTERN DOTS-3457" },
      XK_braille_dots_13457: { code: 16787549, description: "(\u285D) BRAILLE PATTERN DOTS-13457" },
      XK_braille_dots_23457: { code: 16787550, description: "(\u285E) BRAILLE PATTERN DOTS-23457" },
      XK_braille_dots_123457: { code: 16787551, description: "(\u285F) BRAILLE PATTERN DOTS-123457" },
      XK_braille_dots_67: { code: 16787552, description: "(\u2860) BRAILLE PATTERN DOTS-67" },
      XK_braille_dots_167: { code: 16787553, description: "(\u2861) BRAILLE PATTERN DOTS-167" },
      XK_braille_dots_267: { code: 16787554, description: "(\u2862) BRAILLE PATTERN DOTS-267" },
      XK_braille_dots_1267: { code: 16787555, description: "(\u2863) BRAILLE PATTERN DOTS-1267" },
      XK_braille_dots_367: { code: 16787556, description: "(\u2864) BRAILLE PATTERN DOTS-367" },
      XK_braille_dots_1367: { code: 16787557, description: "(\u2865) BRAILLE PATTERN DOTS-1367" },
      XK_braille_dots_2367: { code: 16787558, description: "(\u2866) BRAILLE PATTERN DOTS-2367" },
      XK_braille_dots_12367: { code: 16787559, description: "(\u2867) BRAILLE PATTERN DOTS-12367" },
      XK_braille_dots_467: { code: 16787560, description: "(\u2868) BRAILLE PATTERN DOTS-467" },
      XK_braille_dots_1467: { code: 16787561, description: "(\u2869) BRAILLE PATTERN DOTS-1467" },
      XK_braille_dots_2467: { code: 16787562, description: "(\u286A) BRAILLE PATTERN DOTS-2467" },
      XK_braille_dots_12467: { code: 16787563, description: "(\u286B) BRAILLE PATTERN DOTS-12467" },
      XK_braille_dots_3467: { code: 16787564, description: "(\u286C) BRAILLE PATTERN DOTS-3467" },
      XK_braille_dots_13467: { code: 16787565, description: "(\u286D) BRAILLE PATTERN DOTS-13467" },
      XK_braille_dots_23467: { code: 16787566, description: "(\u286E) BRAILLE PATTERN DOTS-23467" },
      XK_braille_dots_123467: { code: 16787567, description: "(\u286F) BRAILLE PATTERN DOTS-123467" },
      XK_braille_dots_567: { code: 16787568, description: "(\u2870) BRAILLE PATTERN DOTS-567" },
      XK_braille_dots_1567: { code: 16787569, description: "(\u2871) BRAILLE PATTERN DOTS-1567" },
      XK_braille_dots_2567: { code: 16787570, description: "(\u2872) BRAILLE PATTERN DOTS-2567" },
      XK_braille_dots_12567: { code: 16787571, description: "(\u2873) BRAILLE PATTERN DOTS-12567" },
      XK_braille_dots_3567: { code: 16787572, description: "(\u2874) BRAILLE PATTERN DOTS-3567" },
      XK_braille_dots_13567: { code: 16787573, description: "(\u2875) BRAILLE PATTERN DOTS-13567" },
      XK_braille_dots_23567: { code: 16787574, description: "(\u2876) BRAILLE PATTERN DOTS-23567" },
      XK_braille_dots_123567: { code: 16787575, description: "(\u2877) BRAILLE PATTERN DOTS-123567" },
      XK_braille_dots_4567: { code: 16787576, description: "(\u2878) BRAILLE PATTERN DOTS-4567" },
      XK_braille_dots_14567: { code: 16787577, description: "(\u2879) BRAILLE PATTERN DOTS-14567" },
      XK_braille_dots_24567: { code: 16787578, description: "(\u287A) BRAILLE PATTERN DOTS-24567" },
      XK_braille_dots_124567: { code: 16787579, description: "(\u287B) BRAILLE PATTERN DOTS-124567" },
      XK_braille_dots_34567: { code: 16787580, description: "(\u287C) BRAILLE PATTERN DOTS-34567" },
      XK_braille_dots_134567: { code: 16787581, description: "(\u287D) BRAILLE PATTERN DOTS-134567" },
      XK_braille_dots_234567: { code: 16787582, description: "(\u287E) BRAILLE PATTERN DOTS-234567" },
      XK_braille_dots_1234567: { code: 16787583, description: "(\u287F) BRAILLE PATTERN DOTS-1234567" },
      XK_braille_dots_8: { code: 16787584, description: "(\u2880) BRAILLE PATTERN DOTS-8" },
      XK_braille_dots_18: { code: 16787585, description: "(\u2881) BRAILLE PATTERN DOTS-18" },
      XK_braille_dots_28: { code: 16787586, description: "(\u2882) BRAILLE PATTERN DOTS-28" },
      XK_braille_dots_128: { code: 16787587, description: "(\u2883) BRAILLE PATTERN DOTS-128" },
      XK_braille_dots_38: { code: 16787588, description: "(\u2884) BRAILLE PATTERN DOTS-38" },
      XK_braille_dots_138: { code: 16787589, description: "(\u2885) BRAILLE PATTERN DOTS-138" },
      XK_braille_dots_238: { code: 16787590, description: "(\u2886) BRAILLE PATTERN DOTS-238" },
      XK_braille_dots_1238: { code: 16787591, description: "(\u2887) BRAILLE PATTERN DOTS-1238" },
      XK_braille_dots_48: { code: 16787592, description: "(\u2888) BRAILLE PATTERN DOTS-48" },
      XK_braille_dots_148: { code: 16787593, description: "(\u2889) BRAILLE PATTERN DOTS-148" },
      XK_braille_dots_248: { code: 16787594, description: "(\u288A) BRAILLE PATTERN DOTS-248" },
      XK_braille_dots_1248: { code: 16787595, description: "(\u288B) BRAILLE PATTERN DOTS-1248" },
      XK_braille_dots_348: { code: 16787596, description: "(\u288C) BRAILLE PATTERN DOTS-348" },
      XK_braille_dots_1348: { code: 16787597, description: "(\u288D) BRAILLE PATTERN DOTS-1348" },
      XK_braille_dots_2348: { code: 16787598, description: "(\u288E) BRAILLE PATTERN DOTS-2348" },
      XK_braille_dots_12348: { code: 16787599, description: "(\u288F) BRAILLE PATTERN DOTS-12348" },
      XK_braille_dots_58: { code: 16787600, description: "(\u2890) BRAILLE PATTERN DOTS-58" },
      XK_braille_dots_158: { code: 16787601, description: "(\u2891) BRAILLE PATTERN DOTS-158" },
      XK_braille_dots_258: { code: 16787602, description: "(\u2892) BRAILLE PATTERN DOTS-258" },
      XK_braille_dots_1258: { code: 16787603, description: "(\u2893) BRAILLE PATTERN DOTS-1258" },
      XK_braille_dots_358: { code: 16787604, description: "(\u2894) BRAILLE PATTERN DOTS-358" },
      XK_braille_dots_1358: { code: 16787605, description: "(\u2895) BRAILLE PATTERN DOTS-1358" },
      XK_braille_dots_2358: { code: 16787606, description: "(\u2896) BRAILLE PATTERN DOTS-2358" },
      XK_braille_dots_12358: { code: 16787607, description: "(\u2897) BRAILLE PATTERN DOTS-12358" },
      XK_braille_dots_458: { code: 16787608, description: "(\u2898) BRAILLE PATTERN DOTS-458" },
      XK_braille_dots_1458: { code: 16787609, description: "(\u2899) BRAILLE PATTERN DOTS-1458" },
      XK_braille_dots_2458: { code: 16787610, description: "(\u289A) BRAILLE PATTERN DOTS-2458" },
      XK_braille_dots_12458: { code: 16787611, description: "(\u289B) BRAILLE PATTERN DOTS-12458" },
      XK_braille_dots_3458: { code: 16787612, description: "(\u289C) BRAILLE PATTERN DOTS-3458" },
      XK_braille_dots_13458: { code: 16787613, description: "(\u289D) BRAILLE PATTERN DOTS-13458" },
      XK_braille_dots_23458: { code: 16787614, description: "(\u289E) BRAILLE PATTERN DOTS-23458" },
      XK_braille_dots_123458: { code: 16787615, description: "(\u289F) BRAILLE PATTERN DOTS-123458" },
      XK_braille_dots_68: { code: 16787616, description: "(\u28A0) BRAILLE PATTERN DOTS-68" },
      XK_braille_dots_168: { code: 16787617, description: "(\u28A1) BRAILLE PATTERN DOTS-168" },
      XK_braille_dots_268: { code: 16787618, description: "(\u28A2) BRAILLE PATTERN DOTS-268" },
      XK_braille_dots_1268: { code: 16787619, description: "(\u28A3) BRAILLE PATTERN DOTS-1268" },
      XK_braille_dots_368: { code: 16787620, description: "(\u28A4) BRAILLE PATTERN DOTS-368" },
      XK_braille_dots_1368: { code: 16787621, description: "(\u28A5) BRAILLE PATTERN DOTS-1368" },
      XK_braille_dots_2368: { code: 16787622, description: "(\u28A6) BRAILLE PATTERN DOTS-2368" },
      XK_braille_dots_12368: { code: 16787623, description: "(\u28A7) BRAILLE PATTERN DOTS-12368" },
      XK_braille_dots_468: { code: 16787624, description: "(\u28A8) BRAILLE PATTERN DOTS-468" },
      XK_braille_dots_1468: { code: 16787625, description: "(\u28A9) BRAILLE PATTERN DOTS-1468" },
      XK_braille_dots_2468: { code: 16787626, description: "(\u28AA) BRAILLE PATTERN DOTS-2468" },
      XK_braille_dots_12468: { code: 16787627, description: "(\u28AB) BRAILLE PATTERN DOTS-12468" },
      XK_braille_dots_3468: { code: 16787628, description: "(\u28AC) BRAILLE PATTERN DOTS-3468" },
      XK_braille_dots_13468: { code: 16787629, description: "(\u28AD) BRAILLE PATTERN DOTS-13468" },
      XK_braille_dots_23468: { code: 16787630, description: "(\u28AE) BRAILLE PATTERN DOTS-23468" },
      XK_braille_dots_123468: { code: 16787631, description: "(\u28AF) BRAILLE PATTERN DOTS-123468" },
      XK_braille_dots_568: { code: 16787632, description: "(\u28B0) BRAILLE PATTERN DOTS-568" },
      XK_braille_dots_1568: { code: 16787633, description: "(\u28B1) BRAILLE PATTERN DOTS-1568" },
      XK_braille_dots_2568: { code: 16787634, description: "(\u28B2) BRAILLE PATTERN DOTS-2568" },
      XK_braille_dots_12568: { code: 16787635, description: "(\u28B3) BRAILLE PATTERN DOTS-12568" },
      XK_braille_dots_3568: { code: 16787636, description: "(\u28B4) BRAILLE PATTERN DOTS-3568" },
      XK_braille_dots_13568: { code: 16787637, description: "(\u28B5) BRAILLE PATTERN DOTS-13568" },
      XK_braille_dots_23568: { code: 16787638, description: "(\u28B6) BRAILLE PATTERN DOTS-23568" },
      XK_braille_dots_123568: { code: 16787639, description: "(\u28B7) BRAILLE PATTERN DOTS-123568" },
      XK_braille_dots_4568: { code: 16787640, description: "(\u28B8) BRAILLE PATTERN DOTS-4568" },
      XK_braille_dots_14568: { code: 16787641, description: "(\u28B9) BRAILLE PATTERN DOTS-14568" },
      XK_braille_dots_24568: { code: 16787642, description: "(\u28BA) BRAILLE PATTERN DOTS-24568" },
      XK_braille_dots_124568: { code: 16787643, description: "(\u28BB) BRAILLE PATTERN DOTS-124568" },
      XK_braille_dots_34568: { code: 16787644, description: "(\u28BC) BRAILLE PATTERN DOTS-34568" },
      XK_braille_dots_134568: { code: 16787645, description: "(\u28BD) BRAILLE PATTERN DOTS-134568" },
      XK_braille_dots_234568: { code: 16787646, description: "(\u28BE) BRAILLE PATTERN DOTS-234568" },
      XK_braille_dots_1234568: { code: 16787647, description: "(\u28BF) BRAILLE PATTERN DOTS-1234568" },
      XK_braille_dots_78: { code: 16787648, description: "(\u28C0) BRAILLE PATTERN DOTS-78" },
      XK_braille_dots_178: { code: 16787649, description: "(\u28C1) BRAILLE PATTERN DOTS-178" },
      XK_braille_dots_278: { code: 16787650, description: "(\u28C2) BRAILLE PATTERN DOTS-278" },
      XK_braille_dots_1278: { code: 16787651, description: "(\u28C3) BRAILLE PATTERN DOTS-1278" },
      XK_braille_dots_378: { code: 16787652, description: "(\u28C4) BRAILLE PATTERN DOTS-378" },
      XK_braille_dots_1378: { code: 16787653, description: "(\u28C5) BRAILLE PATTERN DOTS-1378" },
      XK_braille_dots_2378: { code: 16787654, description: "(\u28C6) BRAILLE PATTERN DOTS-2378" },
      XK_braille_dots_12378: { code: 16787655, description: "(\u28C7) BRAILLE PATTERN DOTS-12378" },
      XK_braille_dots_478: { code: 16787656, description: "(\u28C8) BRAILLE PATTERN DOTS-478" },
      XK_braille_dots_1478: { code: 16787657, description: "(\u28C9) BRAILLE PATTERN DOTS-1478" },
      XK_braille_dots_2478: { code: 16787658, description: "(\u28CA) BRAILLE PATTERN DOTS-2478" },
      XK_braille_dots_12478: { code: 16787659, description: "(\u28CB) BRAILLE PATTERN DOTS-12478" },
      XK_braille_dots_3478: { code: 16787660, description: "(\u28CC) BRAILLE PATTERN DOTS-3478" },
      XK_braille_dots_13478: { code: 16787661, description: "(\u28CD) BRAILLE PATTERN DOTS-13478" },
      XK_braille_dots_23478: { code: 16787662, description: "(\u28CE) BRAILLE PATTERN DOTS-23478" },
      XK_braille_dots_123478: { code: 16787663, description: "(\u28CF) BRAILLE PATTERN DOTS-123478" },
      XK_braille_dots_578: { code: 16787664, description: "(\u28D0) BRAILLE PATTERN DOTS-578" },
      XK_braille_dots_1578: { code: 16787665, description: "(\u28D1) BRAILLE PATTERN DOTS-1578" },
      XK_braille_dots_2578: { code: 16787666, description: "(\u28D2) BRAILLE PATTERN DOTS-2578" },
      XK_braille_dots_12578: { code: 16787667, description: "(\u28D3) BRAILLE PATTERN DOTS-12578" },
      XK_braille_dots_3578: { code: 16787668, description: "(\u28D4) BRAILLE PATTERN DOTS-3578" },
      XK_braille_dots_13578: { code: 16787669, description: "(\u28D5) BRAILLE PATTERN DOTS-13578" },
      XK_braille_dots_23578: { code: 16787670, description: "(\u28D6) BRAILLE PATTERN DOTS-23578" },
      XK_braille_dots_123578: { code: 16787671, description: "(\u28D7) BRAILLE PATTERN DOTS-123578" },
      XK_braille_dots_4578: { code: 16787672, description: "(\u28D8) BRAILLE PATTERN DOTS-4578" },
      XK_braille_dots_14578: { code: 16787673, description: "(\u28D9) BRAILLE PATTERN DOTS-14578" },
      XK_braille_dots_24578: { code: 16787674, description: "(\u28DA) BRAILLE PATTERN DOTS-24578" },
      XK_braille_dots_124578: { code: 16787675, description: "(\u28DB) BRAILLE PATTERN DOTS-124578" },
      XK_braille_dots_34578: { code: 16787676, description: "(\u28DC) BRAILLE PATTERN DOTS-34578" },
      XK_braille_dots_134578: { code: 16787677, description: "(\u28DD) BRAILLE PATTERN DOTS-134578" },
      XK_braille_dots_234578: { code: 16787678, description: "(\u28DE) BRAILLE PATTERN DOTS-234578" },
      XK_braille_dots_1234578: { code: 16787679, description: "(\u28DF) BRAILLE PATTERN DOTS-1234578" },
      XK_braille_dots_678: { code: 16787680, description: "(\u28E0) BRAILLE PATTERN DOTS-678" },
      XK_braille_dots_1678: { code: 16787681, description: "(\u28E1) BRAILLE PATTERN DOTS-1678" },
      XK_braille_dots_2678: { code: 16787682, description: "(\u28E2) BRAILLE PATTERN DOTS-2678" },
      XK_braille_dots_12678: { code: 16787683, description: "(\u28E3) BRAILLE PATTERN DOTS-12678" },
      XK_braille_dots_3678: { code: 16787684, description: "(\u28E4) BRAILLE PATTERN DOTS-3678" },
      XK_braille_dots_13678: { code: 16787685, description: "(\u28E5) BRAILLE PATTERN DOTS-13678" },
      XK_braille_dots_23678: { code: 16787686, description: "(\u28E6) BRAILLE PATTERN DOTS-23678" },
      XK_braille_dots_123678: { code: 16787687, description: "(\u28E7) BRAILLE PATTERN DOTS-123678" },
      XK_braille_dots_4678: { code: 16787688, description: "(\u28E8) BRAILLE PATTERN DOTS-4678" },
      XK_braille_dots_14678: { code: 16787689, description: "(\u28E9) BRAILLE PATTERN DOTS-14678" },
      XK_braille_dots_24678: { code: 16787690, description: "(\u28EA) BRAILLE PATTERN DOTS-24678" },
      XK_braille_dots_124678: { code: 16787691, description: "(\u28EB) BRAILLE PATTERN DOTS-124678" },
      XK_braille_dots_34678: { code: 16787692, description: "(\u28EC) BRAILLE PATTERN DOTS-34678" },
      XK_braille_dots_134678: { code: 16787693, description: "(\u28ED) BRAILLE PATTERN DOTS-134678" },
      XK_braille_dots_234678: { code: 16787694, description: "(\u28EE) BRAILLE PATTERN DOTS-234678" },
      XK_braille_dots_1234678: { code: 16787695, description: "(\u28EF) BRAILLE PATTERN DOTS-1234678" },
      XK_braille_dots_5678: { code: 16787696, description: "(\u28F0) BRAILLE PATTERN DOTS-5678" },
      XK_braille_dots_15678: { code: 16787697, description: "(\u28F1) BRAILLE PATTERN DOTS-15678" },
      XK_braille_dots_25678: { code: 16787698, description: "(\u28F2) BRAILLE PATTERN DOTS-25678" },
      XK_braille_dots_125678: { code: 16787699, description: "(\u28F3) BRAILLE PATTERN DOTS-125678" },
      XK_braille_dots_35678: { code: 16787700, description: "(\u28F4) BRAILLE PATTERN DOTS-35678" },
      XK_braille_dots_135678: { code: 16787701, description: "(\u28F5) BRAILLE PATTERN DOTS-135678" },
      XK_braille_dots_235678: { code: 16787702, description: "(\u28F6) BRAILLE PATTERN DOTS-235678" },
      XK_braille_dots_1235678: { code: 16787703, description: "(\u28F7) BRAILLE PATTERN DOTS-1235678" },
      XK_braille_dots_45678: { code: 16787704, description: "(\u28F8) BRAILLE PATTERN DOTS-45678" },
      XK_braille_dots_145678: { code: 16787705, description: "(\u28F9) BRAILLE PATTERN DOTS-145678" },
      XK_braille_dots_245678: { code: 16787706, description: "(\u28FA) BRAILLE PATTERN DOTS-245678" },
      XK_braille_dots_1245678: { code: 16787707, description: "(\u28FB) BRAILLE PATTERN DOTS-1245678" },
      XK_braille_dots_345678: { code: 16787708, description: "(\u28FC) BRAILLE PATTERN DOTS-345678" },
      XK_braille_dots_1345678: { code: 16787709, description: "(\u28FD) BRAILLE PATTERN DOTS-1345678" },
      XK_braille_dots_2345678: { code: 16787710, description: "(\u28FE) BRAILLE PATTERN DOTS-2345678" },
      XK_braille_dots_12345678: { code: 16787711, description: "(\u28FF) BRAILLE PATTERN DOTS-12345678" },
      /*
       * Sinhala (http://unicode.org/charts/PDF/U0D80.pdf)
       * http://www.nongnu.org/sinhala/doc/transliteration/sinhala-transliteration_6.html
       */
      // Group XK_SINHALA
      XK_Sinh_ng: { code: 16780674, description: "(\u0D82) SINHALA ANUSVARAYA" },
      XK_Sinh_h2: { code: 16780675, description: "(\u0D83) SINHALA VISARGAYA" },
      XK_Sinh_a: { code: 16780677, description: "(\u0D85) SINHALA AYANNA" },
      XK_Sinh_aa: { code: 16780678, description: "(\u0D86) SINHALA AAYANNA" },
      XK_Sinh_ae: { code: 16780679, description: "(\u0D87) SINHALA AEYANNA" },
      XK_Sinh_aee: { code: 16780680, description: "(\u0D88) SINHALA AEEYANNA" },
      XK_Sinh_i: { code: 16780681, description: "(\u0D89) SINHALA IYANNA" },
      XK_Sinh_ii: { code: 16780682, description: "(\u0D8A) SINHALA IIYANNA" },
      XK_Sinh_u: { code: 16780683, description: "(\u0D8B) SINHALA UYANNA" },
      XK_Sinh_uu: { code: 16780684, description: "(\u0D8C) SINHALA UUYANNA" },
      XK_Sinh_ri: { code: 16780685, description: "(\u0D8D) SINHALA IRUYANNA" },
      XK_Sinh_rii: { code: 16780686, description: "(\u0D8E) SINHALA IRUUYANNA" },
      XK_Sinh_lu: { code: 16780687, description: "(\u0D8F) SINHALA ILUYANNA" },
      XK_Sinh_luu: { code: 16780688, description: "(\u0D90) SINHALA ILUUYANNA" },
      XK_Sinh_e: { code: 16780689, description: "(\u0D91) SINHALA EYANNA" },
      XK_Sinh_ee: { code: 16780690, description: "(\u0D92) SINHALA EEYANNA" },
      XK_Sinh_ai: { code: 16780691, description: "(\u0D93) SINHALA AIYANNA" },
      XK_Sinh_o: { code: 16780692, description: "(\u0D94) SINHALA OYANNA" },
      XK_Sinh_oo: { code: 16780693, description: "(\u0D95) SINHALA OOYANNA" },
      XK_Sinh_au: { code: 16780694, description: "(\u0D96) SINHALA AUYANNA" },
      XK_Sinh_ka: { code: 16780698, description: "(\u0D9A) SINHALA KAYANNA" },
      XK_Sinh_kha: { code: 16780699, description: "(\u0D9B) SINHALA MAHA. KAYANNA" },
      XK_Sinh_ga: { code: 16780700, description: "(\u0D9C) SINHALA GAYANNA" },
      XK_Sinh_gha: { code: 16780701, description: "(\u0D9D) SINHALA MAHA. GAYANNA" },
      XK_Sinh_ng2: { code: 16780702, description: "(\u0D9E) SINHALA KANTAJA NAASIKYAYA" },
      XK_Sinh_nga: { code: 16780703, description: "(\u0D9F) SINHALA SANYAKA GAYANNA" },
      XK_Sinh_ca: { code: 16780704, description: "(\u0DA0) SINHALA CAYANNA" },
      XK_Sinh_cha: { code: 16780705, description: "(\u0DA1) SINHALA MAHA. CAYANNA" },
      XK_Sinh_ja: { code: 16780706, description: "(\u0DA2) SINHALA JAYANNA" },
      XK_Sinh_jha: { code: 16780707, description: "(\u0DA3) SINHALA MAHA. JAYANNA" },
      XK_Sinh_nya: { code: 16780708, description: "(\u0DA4) SINHALA TAALUJA NAASIKYAYA" },
      XK_Sinh_jnya: { code: 16780709, description: "(\u0DA5) SINHALA TAALUJA SANYOOGA NAASIKYAYA" },
      XK_Sinh_nja: { code: 16780710, description: "(\u0DA6) SINHALA SANYAKA JAYANNA" },
      XK_Sinh_tta: { code: 16780711, description: "(\u0DA7) SINHALA TTAYANNA" },
      XK_Sinh_ttha: { code: 16780712, description: "(\u0DA8) SINHALA MAHA. TTAYANNA" },
      XK_Sinh_dda: { code: 16780713, description: "(\u0DA9) SINHALA DDAYANNA" },
      XK_Sinh_ddha: { code: 16780714, description: "(\u0DAA) SINHALA MAHA. DDAYANNA" },
      XK_Sinh_nna: { code: 16780715, description: "(\u0DAB) SINHALA MUURDHAJA NAYANNA" },
      XK_Sinh_ndda: { code: 16780716, description: "(\u0DAC) SINHALA SANYAKA DDAYANNA" },
      XK_Sinh_tha: { code: 16780717, description: "(\u0DAD) SINHALA TAYANNA" },
      XK_Sinh_thha: { code: 16780718, description: "(\u0DAE) SINHALA MAHA. TAYANNA" },
      XK_Sinh_dha: { code: 16780719, description: "(\u0DAF) SINHALA DAYANNA" },
      XK_Sinh_dhha: { code: 16780720, description: "(\u0DB0) SINHALA MAHA. DAYANNA" },
      XK_Sinh_na: { code: 16780721, description: "(\u0DB1) SINHALA DANTAJA NAYANNA" },
      XK_Sinh_ndha: { code: 16780723, description: "(\u0DB3) SINHALA SANYAKA DAYANNA" },
      XK_Sinh_pa: { code: 16780724, description: "(\u0DB4) SINHALA PAYANNA" },
      XK_Sinh_pha: { code: 16780725, description: "(\u0DB5) SINHALA MAHA. PAYANNA" },
      XK_Sinh_ba: { code: 16780726, description: "(\u0DB6) SINHALA BAYANNA" },
      XK_Sinh_bha: { code: 16780727, description: "(\u0DB7) SINHALA MAHA. BAYANNA" },
      XK_Sinh_ma: { code: 16780728, description: "(\u0DB8) SINHALA MAYANNA" },
      XK_Sinh_mba: { code: 16780729, description: "(\u0DB9) SINHALA AMBA BAYANNA" },
      XK_Sinh_ya: { code: 16780730, description: "(\u0DBA) SINHALA YAYANNA" },
      XK_Sinh_ra: { code: 16780731, description: "(\u0DBB) SINHALA RAYANNA" },
      XK_Sinh_la: { code: 16780733, description: "(\u0DBD) SINHALA DANTAJA LAYANNA" },
      XK_Sinh_va: { code: 16780736, description: "(\u0DC0) SINHALA VAYANNA" },
      XK_Sinh_sha: { code: 16780737, description: "(\u0DC1) SINHALA TAALUJA SAYANNA" },
      XK_Sinh_ssha: { code: 16780738, description: "(\u0DC2) SINHALA MUURDHAJA SAYANNA" },
      XK_Sinh_sa: { code: 16780739, description: "(\u0DC3) SINHALA DANTAJA SAYANNA" },
      XK_Sinh_ha: { code: 16780740, description: "(\u0DC4) SINHALA HAYANNA" },
      XK_Sinh_lla: { code: 16780741, description: "(\u0DC5) SINHALA MUURDHAJA LAYANNA" },
      XK_Sinh_fa: { code: 16780742, description: "(\u0DC6) SINHALA FAYANNA" },
      XK_Sinh_al: { code: 16780746, description: "(\u0DCA) SINHALA AL-LAKUNA" },
      XK_Sinh_aa2: { code: 16780751, description: "(\u0DCF) SINHALA AELA-PILLA" },
      XK_Sinh_ae2: { code: 16780752, description: "(\u0DD0) SINHALA AEDA-PILLA" },
      XK_Sinh_aee2: { code: 16780753, description: "(\u0DD1) SINHALA DIGA AEDA-PILLA" },
      XK_Sinh_i2: { code: 16780754, description: "(\u0DD2) SINHALA IS-PILLA" },
      XK_Sinh_ii2: { code: 16780755, description: "(\u0DD3) SINHALA DIGA IS-PILLA" },
      XK_Sinh_u2: { code: 16780756, description: "(\u0DD4) SINHALA PAA-PILLA" },
      XK_Sinh_uu2: { code: 16780758, description: "(\u0DD6) SINHALA DIGA PAA-PILLA" },
      XK_Sinh_ru2: { code: 16780760, description: "(\u0DD8) SINHALA GAETTA-PILLA" },
      XK_Sinh_e2: { code: 16780761, description: "(\u0DD9) SINHALA KOMBUVA" },
      XK_Sinh_ee2: { code: 16780762, description: "(\u0DDA) SINHALA DIGA KOMBUVA" },
      XK_Sinh_ai2: { code: 16780763, description: "(\u0DDB) SINHALA KOMBU DEKA" },
      XK_Sinh_o2: { code: 16780764, description: "(\u0DDC) SINHALA KOMBUVA HAA AELA-PILLA" },
      XK_Sinh_oo2: { code: 16780765, description: "(\u0DDD) SINHALA KOMBUVA HAA DIGA AELA-PILLA" },
      XK_Sinh_au2: { code: 16780766, description: "(\u0DDE) SINHALA KOMBUVA HAA GAYANUKITTA" },
      XK_Sinh_lu2: { code: 16780767, description: "(\u0DDF) SINHALA GAYANUKITTA" },
      XK_Sinh_ruu2: { code: 16780786, description: "(\u0DF2) SINHALA DIGA GAETTA-PILLA" },
      XK_Sinh_luu2: { code: 16780787, description: "(\u0DF3) SINHALA DIGA GAYANUKITTA" },
      XK_Sinh_kunddaliya: { code: 16780788, description: "(\u0DF4) SINHALA KUNDDALIYA" },
      NoSymbol: 0
    };
  }
});

// node_modules/x11/lib/gcfunction.js
var require_gcfunction = __commonJS({
  "node_modules/x11/lib/gcfunction.js"(exports2, module2) {
    module2.exports = {
      GXclear: 0,
      GXand: 1,
      GXandReverse: 2,
      GXcopy: 3,
      GXandInverted: 4,
      GXnoop: 5,
      GXxor: 6,
      GXor: 7,
      GXnor: 8,
      GXequiv: 9,
      GXinvert: 10,
      GXorReverse: 11,
      GXcopyInverted: 12,
      GXorInverted: 13,
      GXnand: 14,
      GXset: 15
    };
  }
});

// node_modules/x11/lib/index.js
var require_lib2 = __commonJS({
  "node_modules/x11/lib/index.js"(exports2, module2) {
    var core = require_xcore();
    var em = require_eventmask().eventMask;
    var server = require_xserver();
    module2.exports.createClient = core.createClient;
    module2.exports.createServer = server.createServer;
    module2.exports.eventMask = em;
    Object.defineProperty(module2.exports, "keySyms", {
      enumerable: true,
      get: function() {
        return require_keysyms();
      }
    });
    Object.defineProperty(module2.exports, "gcFunction", {
      enumerable: true,
      get: function() {
        return require_gcfunction();
      }
    });
    module2.exports.CopyFromParent = 0;
    module2.exports.InputOutput = 1;
    module2.exports.InputOnly = 2;
    module2.exports.PointerWindow = 0;
    module2.exports.InputFocus = 1;
    module2.exports.bitGravity = {};
    module2.exports.winGravity = {};
  }
});

// node_modules/dbus-next/lib/address-x11.js
var require_address_x11 = __commonJS({
  "node_modules/dbus-next/lib/address-x11.js"(exports2, module2) {
    var fs = require("fs");
    var os2 = require("os");
    function getDbusAddressFromWindowSelection(callback2) {
      const x11 = require_lib2();
      if (x11 === null) {
        throw new Error("cannot get session bus address from window selection: dbus-next was installed without x11 support");
      }
      fs.readFile("/var/lib/dbus/machine-id", "ascii", function(err, uuid) {
        if (err)
          return callback2(err);
        const hostname = os2.hostname().split("-")[0];
        x11.createClient(function(err2, display) {
          if (err2)
            return callback2(err2);
          const X = display.client;
          const selectionName = `_DBUS_SESSION_BUS_SELECTION_${hostname}_${uuid.trim()}`;
          X.InternAtom(false, selectionName, function(err3, id) {
            if (err3)
              return callback2(err3);
            X.GetSelectionOwner(id, function(err4, win) {
              if (err4)
                return callback2(err4);
              X.InternAtom(false, "_DBUS_SESSION_BUS_ADDRESS", function(err5, propId) {
                if (err5)
                  return callback2(err5);
                win = display.screen[0].root;
                X.GetProperty(0, win, propId, 0, 0, 1e7, function(err6, val) {
                  if (err6)
                    return callback2(err6);
                  callback2(null, val.data.toString());
                });
              });
            });
          });
        });
      });
    }
    function getDbusAddressFromFs() {
      const home = process.env.HOME;
      const display = process.env.DISPLAY;
      if (!display) {
        throw new Error("could not get DISPLAY environment variable to get dbus address");
      }
      const reg = /.*:([0-9]+)\.?.*/;
      const match = display.match(reg);
      if (!match || !match[1]) {
        throw new Error("could not parse DISPLAY environment variable to get dbus address");
      }
      const displayNum = match[1];
      const machineId = fs.readFileSync("/var/lib/dbus/machine-id").toString().trim();
      const dbusInfo = fs.readFileSync(`${home}/.dbus/session-bus/${machineId}-${displayNum}`).toString().trim();
      for (let line of dbusInfo.split("\n")) {
        line = line.trim();
        if (line.startsWith("DBUS_SESSION_BUS_ADDRESS=")) {
          let address = line.split("DBUS_SESSION_BUS_ADDRESS=")[1];
          if (!address) {
            throw new Error("DBUS_SESSION_BUS_ADDRESS variable is set incorrectly in dbus info file");
          }
          const removeQuotes = /^['"]?(.*?)['"]?$/;
          address = address.match(removeQuotes)[1];
          return address;
        }
      }
      throw new Error("DBUS_SESSION_BUS_ADDRESS was not set in dbus info file");
    }
    module2.exports = {
      getDbusAddressFromFs,
      getDbusAddressFromWindowSelection
    };
  }
});

// node_modules/dbus-next/lib/marshall-compat.js
var require_marshall_compat = __commonJS({
  "node_modules/dbus-next/lib/marshall-compat.js"(exports2, module2) {
    var { parseSignature, collapseSignature } = require_signature();
    var { Variant } = require_variant();
    var message = require_message();
    function valueIsMarshallVariant(value) {
      return Array.isArray(value) && value.length === 2 && Array.isArray(value[0]) && value[0].length > 0 && value[0][0].type;
    }
    function marshallVariantToJs(variant) {
      const type = variant[0][0];
      const value = variant[1][0];
      if (!type.child.length) {
        if (valueIsMarshallVariant(value)) {
          return new Variant(collapseSignature(value[0][0]), marshallVariantToJs(value));
        } else {
          return value;
        }
      }
      if (type.type === "a") {
        if (type.child[0].type === "y") {
          return value;
        } else if (type.child[0].type === "{") {
          const result = {};
          for (let i = 0; i < value.length; ++i) {
            result[value[i][0]] = marshallVariantToJs([[type.child[0].child[1]], [value[i][1]]]);
          }
          return result;
        } else {
          const result = [];
          for (let i = 0; i < value.length; ++i) {
            result[i] = marshallVariantToJs([[type.child[0]], [value[i]]]);
          }
          return result;
        }
      } else if (type.type === "(") {
        const result = [];
        for (let i = 0; i < value.length; ++i) {
          result[i] = marshallVariantToJs([[type.child[i]], [value[i]]]);
        }
        return result;
      }
    }
    function messageToJsFmt(message2) {
      const { signature = "", body = [] } = message2;
      const bodyJs = [];
      const signatureTree = parseSignature(signature);
      for (let i = 0; i < signatureTree.length; ++i) {
        const tree = signatureTree[i];
        bodyJs.push(marshallVariantToJs([[tree], [body[i]]]));
      }
      message2.body = bodyJs;
      message2.signature = signature;
      return message2;
    }
    function jsToMarshalFmt(signature, value) {
      if (value === void 0) {
        throw new Error(`expected value for signature: ${signature}`);
      }
      if (signature === void 0) {
        throw new Error(`expected signature for value: ${value}`);
      }
      let signatureStr = null;
      if (typeof signature === "string") {
        signatureStr = signature;
        signature = parseSignature(signature)[0];
      } else {
        signatureStr = collapseSignature(signature);
      }
      if (signature.child.length === 0) {
        if (signature.type === "v") {
          if (value.constructor !== Variant) {
            throw new Error(`expected a Variant for value (got ${typeof value})`);
          }
          return [signature.type, jsToMarshalFmt(value.signature, value.value)];
        } else {
          return [signature.type, value];
        }
      }
      if (signature.type === "a" && signature.child[0].type === "y" && value.constructor === Buffer) {
        return [signatureStr, value];
      } else if (signature.type === "a") {
        let result = [];
        if (signature.child[0].type === "y") {
          result = value;
        } else if (signature.child[0].type === "{") {
          if (value.constructor !== Object) {
            throw new Error(`expecting an object for signature '${signatureStr}' (got ${typeof value})`);
          }
          for (const k of Object.keys(value)) {
            const v = value[k];
            if (v.constructor === Variant) {
              result.push([k, jsToMarshalFmt(v.signature, v.value)]);
            } else {
              result.push([k, jsToMarshalFmt(signature.child[0].child[1], v)[1]]);
            }
          }
        } else {
          if (!Array.isArray(value)) {
            throw new Error(`expecting an array for signature '${signatureStr}' (got ${typeof value})`);
          }
          for (const v of value) {
            if (v.constructor === Variant) {
              result.push(jsToMarshalFmt(v.signature, v.value));
            } else {
              result.push(jsToMarshalFmt(signature.child[0], v)[1]);
            }
          }
        }
        return [signatureStr, result];
      } else if (signature.type === "(") {
        if (!Array.isArray(value)) {
          throw new Error(`expecting an array for signature '${signatureStr}' (got ${typeof value})`);
        }
        if (value.length !== signature.child.length) {
          throw new Error(`expecting struct to have ${signature.child.length} members (got ${value.length} members)`);
        }
        const result = [];
        for (let i = 0; i < value.length; ++i) {
          const v = value[i];
          if (signature.child[i] === "v") {
            if (v.constructor !== Variant) {
              throw new Error(`expected a Variant for struct member ${i + 1} (got ${v})`);
            }
            result.push(jsToMarshalFmt(v.signature, v.value));
          } else {
            result.push(jsToMarshalFmt(signature.child[i], v)[1]);
          }
        }
        return [signatureStr, result];
      } else {
        throw new Error(`got unknown complex type: ${signature.type}`);
      }
    }
    function marshallMessage(msg) {
      const { signature = "", body = [] } = msg;
      const signatureTree = parseSignature(signature);
      if (signatureTree.length !== body.length) {
        throw new Error(`Expected ${signatureTree.length} body elements for signature '${signature}' (got ${body.length})`);
      }
      const marshallerBody = [];
      for (let i = 0; i < body.length; ++i) {
        if (signatureTree[i].type === "v") {
          if (body[i].constructor !== Variant) {
            throw new Error(`Expected a Variant() argument for position ${i + 1} (value='${body[i]}')`);
          }
          marshallerBody.push(jsToMarshalFmt(body[i].signature, body[i].value));
        } else {
          marshallerBody.push(jsToMarshalFmt(signatureTree[i], body[i])[1]);
        }
      }
      msg.signature = signature;
      msg.body = marshallerBody;
      return message.marshall(msg);
    }
    module2.exports = {
      messageToJsFmt,
      marshallMessage
    };
  }
});

// node_modules/through/index.js
var require_through = __commonJS({
  "node_modules/through/index.js"(exports2, module2) {
    var Stream = require("stream");
    exports2 = module2.exports = through;
    through.through = through;
    function through(write, end, opts) {
      write = write || function(data) {
        this.queue(data);
      };
      end = end || function() {
        this.queue(null);
      };
      var ended = false, destroyed = false, buffer = [], _ended = false;
      var stream = new Stream();
      stream.readable = stream.writable = true;
      stream.paused = false;
      stream.autoDestroy = !(opts && opts.autoDestroy === false);
      stream.write = function(data) {
        write.call(this, data);
        return !stream.paused;
      };
      function drain() {
        while (buffer.length && !stream.paused) {
          var data = buffer.shift();
          if (null === data)
            return stream.emit("end");
          else
            stream.emit("data", data);
        }
      }
      stream.queue = stream.push = function(data) {
        if (_ended)
          return stream;
        if (data === null)
          _ended = true;
        buffer.push(data);
        drain();
        return stream;
      };
      stream.on("end", function() {
        stream.readable = false;
        if (!stream.writable && stream.autoDestroy)
          process.nextTick(function() {
            stream.destroy();
          });
      });
      function _end() {
        stream.writable = false;
        end.call(stream);
        if (!stream.readable && stream.autoDestroy)
          stream.destroy();
      }
      stream.end = function(data) {
        if (ended)
          return;
        ended = true;
        if (arguments.length)
          stream.write(data);
        _end();
        return stream;
      };
      stream.destroy = function() {
        if (destroyed)
          return;
        destroyed = true;
        ended = true;
        buffer.length = 0;
        stream.writable = stream.readable = false;
        stream.emit("close");
        return stream;
      };
      stream.pause = function() {
        if (stream.paused)
          return;
        stream.paused = true;
        return stream;
      };
      stream.resume = function() {
        if (stream.paused) {
          stream.paused = false;
          stream.emit("resume");
        }
        drain();
        if (!stream.paused)
          stream.emit("drain");
        return stream;
      };
      return stream;
    }
  }
});

// node_modules/from/index.js
var require_from = __commonJS({
  "node_modules/from/index.js"(exports2, module2) {
    "use strict";
    var Stream = require("stream");
    module2.exports = function from(source) {
      if (Array.isArray(source)) {
        var source_index = 0, source_len = source.length;
        return from(function(i2) {
          if (source_index < source_len)
            this.emit("data", source[source_index++]);
          else
            this.emit("end");
          return true;
        });
      }
      var s = new Stream(), i = 0;
      s.ended = false;
      s.started = false;
      s.readable = true;
      s.writable = false;
      s.paused = false;
      s.ended = false;
      s.pause = function() {
        s.started = true;
        s.paused = true;
      };
      function next() {
        s.started = true;
        if (s.ended)
          return;
        while (!s.ended && !s.paused && source.call(s, i++, function() {
          if (!s.ended && !s.paused)
            process.nextTick(next);
        }))
          ;
      }
      s.resume = function() {
        s.started = true;
        s.paused = false;
        next();
      };
      s.on("end", function() {
        s.ended = true;
        s.readable = false;
        process.nextTick(s.destroy);
      });
      s.destroy = function() {
        s.ended = true;
        s.emit("close");
      };
      process.nextTick(function() {
        if (!s.started)
          s.resume();
      });
      return s;
    };
  }
});

// node_modules/duplexer/index.js
var require_duplexer = __commonJS({
  "node_modules/duplexer/index.js"(exports2, module2) {
    var Stream = require("stream");
    var writeMethods = ["write", "end", "destroy"];
    var readMethods = ["resume", "pause"];
    var readEvents = ["data", "close"];
    var slice = Array.prototype.slice;
    module2.exports = duplex;
    function forEach(arr, fn) {
      if (arr.forEach) {
        return arr.forEach(fn);
      }
      for (var i = 0; i < arr.length; i++) {
        fn(arr[i], i);
      }
    }
    function duplex(writer, reader) {
      var stream = new Stream();
      var ended = false;
      forEach(writeMethods, proxyWriter);
      forEach(readMethods, proxyReader);
      forEach(readEvents, proxyStream);
      reader.on("end", handleEnd);
      writer.on("drain", function() {
        stream.emit("drain");
      });
      writer.on("error", reemit);
      reader.on("error", reemit);
      stream.writable = writer.writable;
      stream.readable = reader.readable;
      return stream;
      function proxyWriter(methodName) {
        stream[methodName] = method;
        function method() {
          return writer[methodName].apply(writer, arguments);
        }
      }
      function proxyReader(methodName) {
        stream[methodName] = method;
        function method() {
          stream.emit(methodName);
          var func = reader[methodName];
          if (func) {
            return func.apply(reader, arguments);
          }
          reader.emit(methodName);
        }
      }
      function proxyStream(methodName) {
        reader.on(methodName, reemit2);
        function reemit2() {
          var args = slice.call(arguments);
          args.unshift(methodName);
          stream.emit.apply(stream, args);
        }
      }
      function handleEnd() {
        if (ended) {
          return;
        }
        ended = true;
        var args = slice.call(arguments);
        args.unshift("end");
        stream.emit.apply(stream, args);
      }
      function reemit(err) {
        stream.emit("error", err);
      }
    }
  }
});

// node_modules/dbus-next/node_modules/map-stream/index.js
var require_map_stream = __commonJS({
  "node_modules/dbus-next/node_modules/map-stream/index.js"(exports2, module2) {
    var Stream = require("stream").Stream;
    module2.exports = function(mapper, opts) {
      var stream = new Stream(), self = this, inputs = 0, outputs = 0, ended = false, paused = false, destroyed = false, lastWritten = 0, inNext = false;
      this.opts = opts || {};
      var errorEventName = this.opts.failures ? "failure" : "error";
      var writeQueue = {};
      stream.writable = true;
      stream.readable = true;
      function queueData(data, number) {
        var nextToWrite = lastWritten + 1;
        if (number === nextToWrite) {
          if (data !== void 0) {
            stream.emit.apply(stream, ["data", data]);
          }
          lastWritten++;
          nextToWrite++;
        } else {
          writeQueue[number] = data;
        }
        if (writeQueue.hasOwnProperty(nextToWrite)) {
          var dataToWrite = writeQueue[nextToWrite];
          delete writeQueue[nextToWrite];
          return queueData(dataToWrite, nextToWrite);
        }
        outputs++;
        if (inputs === outputs) {
          if (paused)
            paused = false, stream.emit("drain");
          if (ended)
            end();
        }
      }
      function next(err, data, number) {
        if (destroyed)
          return;
        inNext = true;
        if (!err || self.opts.failures) {
          queueData(data, number);
        }
        if (err) {
          stream.emit.apply(stream, [errorEventName, err]);
        }
        inNext = false;
      }
      function wrappedMapper(input, number, callback2) {
        return mapper.call(null, input, function(err, data) {
          callback2(err, data, number);
        });
      }
      stream.write = function(data) {
        if (ended)
          throw new Error("map stream is not writable");
        inNext = false;
        inputs++;
        try {
          var written = wrappedMapper(data, inputs, next);
          paused = written === false;
          return !paused;
        } catch (err) {
          if (inNext)
            throw err;
          next(err);
          return !paused;
        }
      };
      function end(data) {
        ended = true;
        stream.writable = false;
        if (data !== void 0) {
          return queueData(data, inputs);
        } else if (inputs == outputs) {
          stream.readable = false, stream.emit("end"), stream.destroy();
        }
      }
      stream.end = function(data) {
        if (ended)
          return;
        end();
      };
      stream.destroy = function() {
        ended = destroyed = true;
        stream.writable = stream.readable = paused = false;
        process.nextTick(function() {
          stream.emit("close");
        });
      };
      stream.pause = function() {
        paused = true;
      };
      stream.resume = function() {
        paused = false;
      };
      return stream;
    };
  }
});

// node_modules/pause-stream/index.js
var require_pause_stream = __commonJS({
  "node_modules/pause-stream/index.js"(exports2, module2) {
    module2.exports = require_through();
  }
});

// node_modules/dbus-next/node_modules/split/index.js
var require_split = __commonJS({
  "node_modules/dbus-next/node_modules/split/index.js"(exports2, module2) {
    var through = require_through();
    var Decoder = require("string_decoder").StringDecoder;
    module2.exports = split;
    function split(matcher, mapper, options) {
      var decoder = new Decoder();
      var soFar = "";
      var maxLength = options && options.maxLength;
      if ("function" === typeof matcher)
        mapper = matcher, matcher = null;
      if (!matcher)
        matcher = /\r?\n/;
      function emit(stream, piece) {
        if (mapper) {
          try {
            piece = mapper(piece);
          } catch (err) {
            return stream.emit("error", err);
          }
          if ("undefined" !== typeof piece)
            stream.queue(piece);
        } else
          stream.queue(piece);
      }
      function next(stream, buffer) {
        var pieces = ((soFar != null ? soFar : "") + buffer).split(matcher);
        soFar = pieces.pop();
        if (maxLength && soFar.length > maxLength)
          stream.emit("error", new Error("maximum buffer reached"));
        for (var i = 0; i < pieces.length; i++) {
          var piece = pieces[i];
          emit(stream, piece);
        }
      }
      return through(
        function(b) {
          next(this, decoder.write(b));
        },
        function() {
          if (decoder.end)
            next(this, decoder.end());
          if (soFar != null)
            emit(this, soFar);
          this.queue(null);
        }
      );
    }
  }
});

// node_modules/dbus-next/node_modules/stream-combiner/index.js
var require_stream_combiner = __commonJS({
  "node_modules/dbus-next/node_modules/stream-combiner/index.js"(exports2, module2) {
    var duplexer = require_duplexer();
    module2.exports = function() {
      var streams = [].slice.call(arguments), first = streams[0], last = streams[streams.length - 1], thepipe = duplexer(first, last);
      if (streams.length == 1)
        return streams[0];
      else if (!streams.length)
        throw new Error("connect called with empty args");
      function recurse(streams2) {
        if (streams2.length < 2)
          return;
        streams2[0].pipe(streams2[1]);
        recurse(streams2.slice(1));
      }
      recurse(streams);
      function onerror() {
        var args = [].slice.call(arguments);
        args.unshift("error");
        thepipe.emit.apply(thepipe, args);
      }
      for (var i = 1; i < streams.length - 1; i++)
        streams[i].on("error", onerror);
      return thepipe;
    };
  }
});

// node_modules/dbus-next/node_modules/event-stream/index.js
var require_event_stream = __commonJS({
  "node_modules/dbus-next/node_modules/event-stream/index.js"(exports2) {
    var Stream = require("stream").Stream;
    var es = exports2;
    var through = require_through();
    var from = require_from();
    var duplex = require_duplexer();
    var map = require_map_stream();
    var pause = require_pause_stream();
    var split = require_split();
    var pipeline = require_stream_combiner();
    var immediately = global.setImmediate || process.nextTick;
    es.Stream = Stream;
    es.through = through;
    es.from = from;
    es.duplex = duplex;
    es.map = map;
    es.pause = pause;
    es.split = split;
    es.pipeline = es.connect = es.pipe = pipeline;
    es.concat = //actually this should be called concat
    es.merge = function() {
      var toMerge = [].slice.call(arguments);
      if (toMerge.length === 1 && toMerge[0] instanceof Array) {
        toMerge = toMerge[0];
      }
      var stream = new Stream();
      stream.setMaxListeners(0);
      var endCount = 0;
      stream.writable = stream.readable = true;
      if (toMerge.length) {
        toMerge.forEach(function(e) {
          e.pipe(stream, { end: false });
          var ended = false;
          e.on("end", function() {
            if (ended)
              return;
            ended = true;
            endCount++;
            if (endCount == toMerge.length)
              stream.emit("end");
          });
        });
      } else {
        process.nextTick(function() {
          stream.emit("end");
        });
      }
      stream.write = function(data) {
        this.emit("data", data);
      };
      stream.destroy = function() {
        toMerge.forEach(function(e) {
          if (e.destroy)
            e.destroy();
        });
      };
      return stream;
    };
    es.writeArray = function(done) {
      if ("function" !== typeof done)
        throw new Error("function writeArray (done): done must be function");
      var a = new Stream(), array = [], isDone = false;
      a.write = function(l) {
        array.push(l);
      };
      a.end = function() {
        isDone = true;
        done(null, array);
      };
      a.writable = true;
      a.readable = false;
      a.destroy = function() {
        a.writable = a.readable = false;
        if (isDone)
          return;
        done(new Error("destroyed before end"), array);
      };
      return a;
    };
    es.readArray = function(array) {
      var stream = new Stream(), i = 0, paused = false, ended = false;
      stream.readable = true;
      stream.writable = false;
      if (!Array.isArray(array))
        throw new Error("event-stream.read expects an array");
      stream.resume = function() {
        if (ended)
          return;
        paused = false;
        var l = array.length;
        while (i < l && !paused && !ended) {
          stream.emit("data", array[i++]);
        }
        if (i == l && !ended)
          ended = true, stream.readable = false, stream.emit("end");
      };
      process.nextTick(stream.resume);
      stream.pause = function() {
        paused = true;
      };
      stream.destroy = function() {
        ended = true;
        stream.emit("close");
      };
      return stream;
    };
    es.readable = function(func, continueOnError) {
      var stream = new Stream(), i = 0, paused = false, ended = false, reading = false;
      stream.readable = true;
      stream.writable = false;
      if ("function" !== typeof func)
        throw new Error("event-stream.readable expects async function");
      stream.on("end", function() {
        ended = true;
      });
      function get(err, data) {
        if (err) {
          stream.emit("error", err);
          if (!continueOnError)
            stream.emit("end");
        } else if (arguments.length > 1)
          stream.emit("data", data);
        immediately(function() {
          if (ended || paused || reading)
            return;
          try {
            reading = true;
            func.call(stream, i++, function() {
              reading = false;
              get.apply(null, arguments);
            });
          } catch (err2) {
            stream.emit("error", err2);
          }
        });
      }
      stream.resume = function() {
        paused = false;
        get();
      };
      process.nextTick(get);
      stream.pause = function() {
        paused = true;
      };
      stream.destroy = function() {
        stream.emit("end");
        stream.emit("close");
        ended = true;
      };
      return stream;
    };
    es.mapSync = function(sync) {
      return es.through(function write(data) {
        var mappedData;
        try {
          mappedData = sync(data);
        } catch (err) {
          return this.emit("error", err);
        }
        if (mappedData !== void 0)
          this.emit("data", mappedData);
      });
    };
    es.log = function(name) {
      return es.through(function(data) {
        var args = [].slice.call(arguments);
        if (name)
          console.error(name, data);
        else
          console.error(data);
        this.emit("data", data);
      });
    };
    es.child = function(child) {
      return es.duplex(child.stdin, child.stdout);
    };
    es.parse = function(options) {
      var emitError = !!(options ? options.error : false);
      return es.through(function(data) {
        var obj;
        try {
          if (data)
            obj = JSON.parse(data.toString());
        } catch (err) {
          if (emitError)
            return this.emit("error", err);
          return console.error(err, "attempting to parse:", data);
        }
        if (obj !== void 0)
          this.emit("data", obj);
      });
    };
    es.stringify = function() {
      var Buffer2 = require("buffer").Buffer;
      return es.mapSync(function(e) {
        return JSON.stringify(Buffer2.isBuffer(e) ? e.toString() : e) + "\n";
      });
    };
    es.replace = function(from2, to) {
      return es.pipeline(es.split(from2), es.join(to));
    };
    es.join = function(str) {
      if ("function" === typeof str)
        return es.wait(str);
      var first = true;
      return es.through(function(data) {
        if (!first)
          this.emit("data", str);
        first = false;
        this.emit("data", data);
        return true;
      });
    };
    es.wait = function(callback2) {
      var arr = [];
      return es.through(
        function(data) {
          arr.push(data);
        },
        function() {
          var body = Buffer.isBuffer(arr[0]) ? Buffer.concat(arr) : arr.join("");
          this.emit("data", body);
          this.emit("end");
          if (callback2)
            callback2(null, body);
        }
      );
    };
    es.pipeable = function() {
      throw new Error("[EVENT-STREAM] es.pipeable is deprecated");
    };
  }
});

// node_modules/dbus-next/lib/connection.js
var require_connection = __commonJS({
  "node_modules/dbus-next/lib/connection.js"(exports2, module2) {
    var EventEmitter = require("events").EventEmitter;
    var net = require("net");
    var message = require_message();
    var clientHandshake = require_handshake();
    var { getDbusAddressFromFs } = require_address_x11();
    var { Message } = require_message_type();
    var { messageToJsFmt, marshallMessage } = require_marshall_compat();
    function createStream(opts) {
      let { busAddress, negotiateUnixFd } = opts;
      if (negotiateUnixFd === void 0) {
        negotiateUnixFd = false;
      }
      if (!busAddress) {
        busAddress = process.env.DBUS_SESSION_BUS_ADDRESS;
      }
      if (!busAddress) {
        busAddress = getDbusAddressFromFs();
      }
      const addresses = busAddress.split(";");
      for (let i = 0; i < addresses.length; ++i) {
        const address = addresses[i];
        const familyParams = address.split(":");
        const family = familyParams[0];
        const params = {};
        familyParams[1].split(",").forEach(function(p) {
          const keyVal = p.split("=");
          params[keyVal[0]] = keyVal[1];
        });
        try {
          switch (family.toLowerCase()) {
            case "tcp": {
              const host = params.host || "localhost";
              const port = params.port;
              return net.createConnection(port, host);
            }
            case "unix": {
              if (params.socket) {
                return net.createConnection(params.socket);
              }
              if (params.abstract) {
                const usocket = require("usocket");
                const sock = new usocket.USocket({ path: "\0" + params.abstract });
                sock.supportsUnixFd = negotiateUnixFd;
                return sock;
              }
              if (params.path) {
                try {
                  const usocket = require("usocket");
                  const sock = new usocket.USocket({ path: params.path });
                  sock.supportsUnixFd = negotiateUnixFd;
                  return sock;
                } catch (err) {
                  return net.createConnection(params.path);
                }
              }
              throw new Error(
                "not enough parameters for 'unix' connection - you need to specify 'socket' or 'abstract' or 'path' parameter"
              );
            }
            case "unixexec": {
              const eventStream = require_event_stream();
              const spawn = require("child_process").spawn;
              const args = [];
              for (let n = 1; params["arg" + n]; n++)
                args.push(params["arg" + n]);
              const child = spawn(params.path, args);
              setTimeout(() => eventStream.emit("connected"), 0);
              return eventStream.duplex(child.stdin, child.stdout);
            }
            default: {
              throw new Error("unknown address type:" + family);
            }
          }
        } catch (e) {
          if (i < addresses.length - 1) {
            console.warn(e.message);
            continue;
          } else {
            throw e;
          }
        }
      }
    }
    function createConnection(opts) {
      const self = new EventEmitter();
      opts = opts || {};
      const stream = self.stream = createStream(opts);
      stream.setNoDelay && stream.setNoDelay();
      stream.on("error", function(err) {
        self.emit("error", err);
      });
      stream.on("end", function() {
        self.emit("end");
        self.message = function() {
          self.emit("error", new Error("Tried to write a message to a closed stream"));
        };
      });
      self.end = function() {
        stream.end();
        return self;
      };
      function afterHandshake(error, guid) {
        if (error) {
          return self.emit("error", error);
        }
        self.guid = guid;
        self.emit("connect");
        message.unmarshalMessages(
          stream,
          function(message2) {
            try {
              message2 = new Message(messageToJsFmt(message2));
            } catch (err) {
              self.emit("error", err, `There was an error receiving a message (this is probably a bug in dbus-next): ${message2}`);
              return;
            }
            self.emit("message", message2);
          },
          opts
        );
      }
      stream.once("connect", () => clientHandshake(stream, opts, afterHandshake));
      stream.once("connected", () => clientHandshake(stream, opts, afterHandshake));
      self._messages = [];
      self.message = function(msg) {
        self._messages.push(msg);
      };
      self.once("connect", function() {
        self.state = "connected";
        for (let i = 0; i < self._messages.length; ++i) {
          const [data, fds] = marshallMessage(self._messages[i]);
          if (stream.supportsUnixFd) {
            stream.write({ data, fds });
          } else {
            stream.write(data);
          }
        }
        self._messages.length = 0;
        self.message = function(msg) {
          if (!stream.writable) {
            throw new Error("Cannot send message, stream is closed");
          }
          const [data, fds] = marshallMessage(msg);
          if (stream.supportsUnixFd) {
            stream.write({ data, fds });
          } else {
            if (fds.length > 0) {
              console.warn("Sending file descriptors is not supported in current bus connection");
            }
            stream.write(data);
          }
        };
      });
      return self;
    }
    module2.exports = createConnection;
  }
});

// node_modules/dbus-next/index.js
var require_dbus_next = __commonJS({
  "node_modules/dbus-next/index.js"(exports2, module2) {
    var constants = require_constants();
    var MessageBus = require_bus();
    var errors = require_errors();
    var { Variant } = require_variant();
    var { Message } = require_message_type();
    var iface = require_interface();
    var createConnection = require_connection();
    var createClient = function(params) {
      let connection = createConnection(params || {});
      return new MessageBus(connection);
    };
    module2.exports.systemBus = function(opts) {
      if (!opts)
        opts = {};
      return createClient({
        negotiateUnixFd: opts.negotiateUnixFd,
        busAddress: process.env.DBUS_SYSTEM_BUS_ADDRESS || "unix:path=/var/run/dbus/system_bus_socket"
      });
    };
    module2.exports.sessionBus = function(opts) {
      return createClient(opts);
    };
    module2.exports.setBigIntCompat = require_library_options().setBigIntCompat;
    module2.exports.NameFlag = constants.NameFlag;
    module2.exports.RequestNameReply = constants.RequestNameReply;
    module2.exports.ReleaseNameReply = constants.ReleaseNameReply;
    module2.exports.MessageType = constants.MessageType;
    module2.exports.MessageFlag = constants.MessageFlag;
    module2.exports.interface = iface;
    module2.exports.Variant = Variant;
    module2.exports.Message = Message;
    module2.exports.validators = require_validators();
    module2.exports.DBusError = errors.DBusError;
  }
});

// node_modules/dbus-native/lib/constants.js
var require_constants2 = __commonJS({
  "node_modules/dbus-native/lib/constants.js"(exports2, module2) {
    module2.exports = {
      messageType: {
        invalid: 0,
        methodCall: 1,
        methodReturn: 2,
        error: 3,
        signal: 4
      },
      headerTypeName: [
        null,
        "path",
        "interface",
        "member",
        "errorName",
        "replySerial",
        "destination",
        "sender",
        "signature"
      ],
      // TODO: merge to single hash? e.g path -> [1, 'o']
      fieldSignature: {
        path: "o",
        interface: "s",
        member: "s",
        errorName: "s",
        replySerial: "u",
        destination: "s",
        sender: "s",
        signature: "g"
      },
      headerTypeId: {
        path: 1,
        interface: 2,
        member: 3,
        errorName: 4,
        replySerial: 5,
        destination: 6,
        sender: 7,
        signature: 8
      },
      protocolVersion: 1,
      flags: {
        noReplyExpected: 1,
        noAutoStart: 2
      },
      endianness: {
        le: 108,
        be: 66
      },
      messageSignature: "yyyyuua(yv)",
      defaultAuthMethods: ["EXTERNAL", "DBUS_COOKIE_SHA1", "ANONYMOUS"]
    };
  }
});

// node_modules/dbus-native/lib/signature.js
var require_signature2 = __commonJS({
  "node_modules/dbus-native/lib/signature.js"(exports2, module2) {
    var match = {
      "{": "}",
      "(": ")"
    };
    var knownTypes = {};
    "(){}ybnqiuxtdsogarvehm*?@&^".split("").forEach(function(c) {
      knownTypes[c] = true;
    });
    module2.exports = function parseSignature(signature) {
      var index = 0;
      function next() {
        if (index < signature.length) {
          var c2 = signature[index];
          ++index;
          return c2;
        }
        return null;
      }
      function parseOne(c2) {
        function checkNotEnd(c3) {
          if (!c3)
            throw new Error("Bad signature: unexpected end");
          return c3;
        }
        if (!knownTypes[c2])
          throw new Error(`Unknown type: "${c2}" in signature "${signature}"`);
        var ele;
        var res = { type: c2, child: [] };
        switch (c2) {
          case "a":
            ele = next();
            checkNotEnd(ele);
            res.child.push(parseOne(ele));
            return res;
          case "{":
          case "(":
            while ((ele = next()) !== null && ele !== match[c2])
              res.child.push(parseOne(ele));
            checkNotEnd(ele);
            return res;
        }
        return res;
      }
      var ret = [];
      var c;
      while ((c = next()) !== null)
        ret.push(parseOne(c));
      return ret;
    };
  }
});

// node_modules/put/index.js
var require_put2 = __commonJS({
  "node_modules/put/index.js"(exports2, module2) {
    module2.exports = Put;
    function Put() {
      if (!(this instanceof Put))
        return new Put();
      var words = [];
      var len = 0;
      this.put = function(buf) {
        words.push({ buffer: buf });
        len += buf.length;
        return this;
      };
      this.word8 = function(x) {
        words.push({ bytes: 1, value: x });
        len += 1;
        return this;
      };
      this.floatle = function(x) {
        words.push({ bytes: "float", endian: "little", value: x });
        len += 4;
        return this;
      };
      [8, 16, 24, 32, 64].forEach(function(bits) {
        this["word" + bits + "be"] = function(x) {
          words.push({ endian: "big", bytes: bits / 8, value: x });
          len += bits / 8;
          return this;
        };
        this["word" + bits + "le"] = function(x) {
          words.push({ endian: "little", bytes: bits / 8, value: x });
          len += bits / 8;
          return this;
        };
      }.bind(this));
      this.pad = function(bytes) {
        words.push({ endian: "big", bytes, value: 0 });
        len += bytes;
        return this;
      };
      this.length = function() {
        return len;
      };
      this.buffer = function() {
        var buf = new Buffer(len);
        var offset = 0;
        words.forEach(function(word) {
          if (word.buffer) {
            word.buffer.copy(buf, offset, 0);
            offset += word.buffer.length;
          } else if (word.bytes == "float") {
            var v = Math.abs(word.value);
            var s = (word.value >= 0) * 1;
            var e = Math.ceil(Math.log(v) / Math.LN2);
            var f = v / (1 << e);
            console.dir([s, e, f]);
            console.log(word.value);
            buf[offset++] = s << 7 & ~~(e / 2);
            buf[offset++] = (e & 1) << 7 & ~~(f / (1 << 16));
            buf[offset++] = 0;
            buf[offset++] = 0;
            offset += 4;
          } else {
            var big = word.endian === "big";
            var ix = big ? [(word.bytes - 1) * 8, -8] : [0, 8];
            for (var i = ix[0]; big ? i >= 0 : i < word.bytes * 8; i += ix[1]) {
              if (i >= 32) {
                buf[offset++] = Math.floor(word.value / Math.pow(2, i)) & 255;
              } else {
                buf[offset++] = word.value >> i & 255;
              }
            }
          }
        });
        return buf;
      };
      this.write = function(stream) {
        stream.write(this.buffer());
      };
    }
  }
});

// node_modules/dbus-native/lib/align.js
var require_align2 = __commonJS({
  "node_modules/dbus-native/lib/align.js"(exports2) {
    var Buffer2 = require_safe_buffer().Buffer;
    function align(ps, n) {
      var pad = n - ps._offset % n;
      if (pad === 0 || pad === n)
        return;
      var padBuff = Buffer2.alloc(pad);
      ps.put(Buffer2.from(padBuff));
      ps._offset += pad;
    }
    exports2.align = align;
  }
});

// node_modules/dbus-native/lib/marshallers.js
var require_marshallers2 = __commonJS({
  "node_modules/dbus-native/lib/marshallers.js"(exports2) {
    var Buffer2 = require_safe_buffer().Buffer;
    var align = require_align2().align;
    var parseSignature = require_signature2();
    var Long = require_long();
    var MakeSimpleMarshaller = function(signature) {
      var marshaller = {};
      function checkValidString(data) {
        if (typeof data !== "string") {
          throw new Error(`Data: ${data} was not of type string`);
        } else if (data.indexOf("\0") !== -1) {
          throw new Error("String contains null byte");
        }
      }
      function checkValidSignature(data) {
        if (data.length > 255) {
          throw new Error(
            `Data: ${data} is too long for signature type (${data.length} > 255)`
          );
        }
        var parenCount = 0;
        for (var ii = 0; ii < data.length; ++ii) {
          if (parenCount > 32) {
            throw new Error(
              `Maximum container type nesting exceeded in signature type:${data}`
            );
          }
          switch (data[ii]) {
            case "(":
              ++parenCount;
              break;
            case ")":
              --parenCount;
              break;
            default:
              break;
          }
        }
        parseSignature(data);
      }
      switch (signature) {
        case "o":
        case "s":
          marshaller.check = function(data) {
            checkValidString(data);
          };
          marshaller.marshall = function(ps, data) {
            this.check(data);
            align(ps, 4);
            const buff = Buffer2.from(data, "utf8");
            ps.word32le(buff.length).put(buff).word8(0);
            ps._offset += 5 + buff.length;
          };
          break;
        case "g":
          marshaller.check = function(data) {
            checkValidString(data);
            checkValidSignature(data);
          };
          marshaller.marshall = function(ps, data) {
            this.check(data);
            const buff = Buffer2.from(data, "ascii");
            ps.word8(data.length).put(buff).word8(0);
            ps._offset += 2 + buff.length;
          };
          break;
        case "y":
          marshaller.check = function(data) {
            checkInteger(data);
            checkRange(0, 255, data);
          };
          marshaller.marshall = function(ps, data) {
            this.check(data);
            ps.word8(data);
            ps._offset++;
          };
          break;
        case "b":
          marshaller.check = function(data) {
            checkBoolean(data);
          };
          marshaller.marshall = function(ps, data) {
            this.check(data);
            data = data ? 1 : 0;
            align(ps, 4);
            ps.word32le(data);
            ps._offset += 4;
          };
          break;
        case "n":
          marshaller.check = function(data) {
            checkInteger(data);
            checkRange(-32767 - 1, 32767, data);
          };
          marshaller.marshall = function(ps, data) {
            this.check(data);
            align(ps, 2);
            const buff = Buffer2.alloc(2);
            buff.writeInt16LE(parseInt(data), 0);
            ps.put(buff);
            ps._offset += 2;
          };
          break;
        case "q":
          marshaller.check = function(data) {
            checkInteger(data);
            checkRange(0, 65535, data);
          };
          marshaller.marshall = function(ps, data) {
            this.check(data);
            align(ps, 2);
            ps.word16le(data);
            ps._offset += 2;
          };
          break;
        case "i":
          marshaller.check = function(data) {
            checkInteger(data);
            checkRange(-2147483647 - 1, 2147483647, data);
          };
          marshaller.marshall = function(ps, data) {
            this.check(data);
            align(ps, 4);
            const buff = Buffer2.alloc(4);
            buff.writeInt32LE(parseInt(data), 0);
            ps.put(buff);
            ps._offset += 4;
          };
          break;
        case "u":
          marshaller.check = function(data) {
            checkInteger(data);
            checkRange(0, 4294967295, data);
          };
          marshaller.marshall = function(ps, data) {
            this.check(data);
            align(ps, 4);
            ps.word32le(data);
            ps._offset += 4;
          };
          break;
        case "t":
          marshaller.check = function(data) {
            return checkLong(data, false);
          };
          marshaller.marshall = function(ps, data) {
            data = this.check(data);
            align(ps, 8);
            ps.word32le(data.low);
            ps.word32le(data.high);
            ps._offset += 8;
          };
          break;
        case "x":
          marshaller.check = function(data) {
            return checkLong(data, true);
          };
          marshaller.marshall = function(ps, data) {
            data = this.check(data);
            align(ps, 8);
            ps.word32le(data.low);
            ps.word32le(data.high);
            ps._offset += 8;
          };
          break;
        case "d":
          marshaller.check = function(data) {
            if (typeof data !== "number") {
              throw new Error(`Data: ${data} was not of type number`);
            } else if (Number.isNaN(data)) {
              throw new Error(`Data: ${data} was not a number`);
            } else if (!Number.isFinite(data)) {
              throw new Error("Number outside range");
            }
          };
          marshaller.marshall = function(ps, data) {
            this.check(data);
            align(ps, 8);
            const buff = Buffer2.alloc(8);
            buff.writeDoubleLE(parseFloat(data), 0);
            ps.put(buff);
            ps._offset += 8;
          };
          break;
        default:
          throw new Error(`Unknown data type format: ${signature}`);
      }
      return marshaller;
    };
    exports2.MakeSimpleMarshaller = MakeSimpleMarshaller;
    var checkRange = function(minValue, maxValue, data) {
      if (data > maxValue || data < minValue) {
        throw new Error("Number outside range");
      }
    };
    var checkInteger = function(data) {
      if (typeof data !== "number") {
        throw new Error(`Data: ${data} was not of type number`);
      }
      if (Math.floor(data) !== data) {
        throw new Error(`Data: ${data} was not an integer`);
      }
    };
    var checkBoolean = function(data) {
      if (!(typeof data === "boolean" || data === 0 || data === 1))
        throw new Error(`Data: ${data} was not of type boolean`);
    };
    var makeLong = function(val, signed) {
      if (val instanceof Long)
        return val;
      if (val instanceof Number)
        val = val.valueOf();
      if (typeof val === "number") {
        try {
          checkInteger(val);
          if (signed) {
            checkRange(-9007199254740991, 9007199254740991, val);
          } else {
            checkRange(0, 9007199254740991, val);
          }
        } catch (e) {
          e.message += " (Number type can only carry 53 bit integer)";
          throw e;
        }
        try {
          return Long.fromNumber(val, !signed);
        } catch (e) {
          e.message = `Error converting number to 64bit integer "${e.message}"`;
          throw e;
        }
      }
      if (typeof val === "string" || val instanceof String) {
        var radix = 10;
        val = val.trim().toUpperCase();
        if (val.substring(0, 2) === "0X") {
          radix = 16;
          val = val.substring(2);
        } else if (val.substring(0, 3) === "-0X") {
          radix = 16;
          val = `-${val.substring(3)}`;
        }
        val = val.replace(/^0+(?=\d)/, "");
        var data;
        try {
          data = Long.fromString(val, !signed, radix);
        } catch (e) {
          e.message = `Error converting string to 64bit integer '${e.message}'`;
          throw e;
        }
        if (data.toString(radix).toUpperCase() !== val)
          throw new Error(
            `Data: '${val}' did not convert correctly to ${signed ? "signed" : "unsigned"} 64 bit`
          );
        return data;
      }
      try {
        return Long.fromBits(val.low, val.high, val.unsigned);
      } catch (e) {
        e.message = `Error converting object to 64bit integer '${e.message}'`;
        throw e;
      }
    };
    var checkLong = function(data, signed) {
      if (!Long.isLong(data)) {
        data = makeLong(data, signed);
      }
      if (signed) {
        if (data.unsigned)
          throw new Error(
            "Longjs object is unsigned, but marshalling into signed 64 bit field"
          );
        if (data.gt(Long.MAX_VALUE) || data.lt(Long.MIN_VALUE)) {
          throw new Error(`Data: ${data} was out of range (64-bit signed)`);
        }
      } else {
        if (!data.unsigned)
          throw new Error(
            "Longjs object is signed, but marshalling into unsigned 64 bit field"
          );
        if (data.gt(Long.MAX_UNSIGNED_VALUE) || data.lt(0)) {
          throw new Error(`Data: ${data} was out of range (64-bit unsigned)`);
        }
      }
      return data;
    };
  }
});

// node_modules/dbus-native/lib/marshall.js
var require_marshall2 = __commonJS({
  "node_modules/dbus-native/lib/marshall.js"(exports2, module2) {
    var assert = require("assert");
    var parseSignature = require_signature2();
    var put = require_put2();
    var Marshallers = require_marshallers2();
    var align = require_align2().align;
    module2.exports = function marshall(signature, data, offset) {
      if (typeof offset === "undefined")
        offset = 0;
      var tree = parseSignature(signature);
      if (!Array.isArray(data) || data.length !== tree.length) {
        throw new Error(
          `message body does not match message signature. Body:${JSON.stringify(
            data
          )}, signature:${signature}`
        );
      }
      var putstream = put();
      putstream._offset = offset;
      var buf = writeStruct(putstream, tree, data).buffer();
      return buf;
    };
    function writeStruct(ps, tree, data) {
      if (tree.length !== data.length) {
        throw new Error("Invalid struct data");
      }
      for (var i = 0; i < tree.length; ++i) {
        write(ps, tree[i], data[i]);
      }
      return ps;
    }
    function write(ps, ele, data) {
      switch (ele.type) {
        case "(":
        case "{":
          align(ps, 8);
          writeStruct(ps, ele.child, data);
          break;
        case "a":
          var arrPut = put();
          arrPut._offset = ps._offset;
          var _offset = arrPut._offset;
          writeSimple(arrPut, "u", 0);
          var lengthOffset = arrPut._offset - 4 - _offset;
          if (["x", "t", "d", "{", "("].indexOf(ele.child[0].type) !== -1)
            align(arrPut, 8);
          var startOffset = arrPut._offset;
          for (var i = 0; i < data.length; ++i)
            write(arrPut, ele.child[0], data[i]);
          var arrBuff = arrPut.buffer();
          var length = arrPut._offset - startOffset;
          arrBuff.writeUInt32LE(length, lengthOffset);
          ps.put(arrBuff);
          ps._offset += arrBuff.length;
          break;
        case "v":
          assert.equal(data.length, 2, "variant data should be [signature, data]");
          var signatureEle = {
            type: "g",
            child: []
          };
          write(ps, signatureEle, data[0]);
          var tree = parseSignature(data[0]);
          assert(tree.length === 1);
          write(ps, tree[0], data[1]);
          break;
        default:
          return writeSimple(ps, ele.type, data);
      }
    }
    var stringTypes = ["g", "o", "s"];
    function writeSimple(ps, type, data) {
      if (typeof data === "undefined")
        throw new Error(
          "Serialisation of JS 'undefined' type is not supported by d-bus"
        );
      if (data === null)
        throw new Error("Serialisation of null value is not supported by d-bus");
      if (Buffer.isBuffer(data))
        data = data.toString();
      if (stringTypes.indexOf(type) !== -1 && typeof data !== "string") {
        throw new Error(
          `Expected string or buffer argument, got ${JSON.stringify(
            data
          )} of type '${type}'`
        );
      }
      var simpleMarshaller = Marshallers.MakeSimpleMarshaller(type);
      simpleMarshaller.marshall(ps, data);
      return ps;
    }
  }
});

// node_modules/dbus-native/lib/dbus-buffer.js
var require_dbus_buffer2 = __commonJS({
  "node_modules/dbus-native/lib/dbus-buffer.js"(exports2, module2) {
    var Long = require_long();
    var parseSignature = require_signature2();
    function DBusBuffer(buffer, startPos, options) {
      if (typeof options !== "object") {
        options = { ayBuffer: true, ReturnLongjs: false };
      } else if (options.ayBuffer === void 0) {
        options.ayBuffer = true;
      }
      this.options = options;
      this.buffer = buffer;
      this.startPos = startPos ? startPos : 0, this.pos = 0;
    }
    DBusBuffer.prototype.align = function(power) {
      var allbits = (1 << power) - 1;
      var paddedOffset = this.pos + this.startPos + allbits >> power << power;
      this.pos = paddedOffset - this.startPos;
    };
    DBusBuffer.prototype.readInt8 = function() {
      this.pos++;
      return this.buffer[this.pos - 1];
    };
    DBusBuffer.prototype.readSInt16 = function() {
      this.align(1);
      var res = this.buffer.readInt16LE(this.pos);
      this.pos += 2;
      return res;
    };
    DBusBuffer.prototype.readInt16 = function() {
      this.align(1);
      var res = this.buffer.readUInt16LE(this.pos);
      this.pos += 2;
      return res;
    };
    DBusBuffer.prototype.readSInt32 = function() {
      this.align(2);
      var res = this.buffer.readInt32LE(this.pos);
      this.pos += 4;
      return res;
    };
    DBusBuffer.prototype.readInt32 = function() {
      this.align(2);
      var res = this.buffer.readUInt32LE(this.pos);
      this.pos += 4;
      return res;
    };
    DBusBuffer.prototype.readDouble = function() {
      this.align(3);
      var res = this.buffer.readDoubleLE(this.pos);
      this.pos += 8;
      return res;
    };
    DBusBuffer.prototype.readString = function(len) {
      if (len === 0) {
        this.pos++;
        return "";
      }
      var res = this.buffer.toString("utf8", this.pos, this.pos + len);
      this.pos += len + 1;
      return res;
    };
    DBusBuffer.prototype.readTree = function readTree(tree) {
      switch (tree.type) {
        case "(":
        case "{":
        case "r":
          this.align(3);
          return this.readStruct(tree.child);
        case "a":
          if (!tree.child || tree.child.length !== 1)
            throw new Error("Incorrect array element signature");
          var arrayBlobLength = this.readInt32();
          return this.readArray(tree.child[0], arrayBlobLength);
        case "v":
          return this.readVariant();
        default:
          return this.readSimpleType(tree.type);
      }
    };
    DBusBuffer.prototype.read = function read(signature) {
      var tree = parseSignature(signature);
      return this.readStruct(tree);
    };
    DBusBuffer.prototype.readVariant = function readVariant() {
      var signature = this.readSimpleType("g");
      var tree = parseSignature(signature);
      return [tree, this.readStruct(tree)];
    };
    DBusBuffer.prototype.readStruct = function readStruct(struct) {
      var result = [];
      for (var i = 0; i < struct.length; ++i) {
        result.push(this.readTree(struct[i]));
      }
      return result;
    };
    DBusBuffer.prototype.readArray = function readArray(eleType, arrayBlobSize) {
      var result;
      var start2 = this.pos;
      if (eleType.type === "y" && this.options.ayBuffer) {
        this.pos += arrayBlobSize;
        return this.buffer.slice(start2, this.pos);
      }
      if (["x", "t", "d", "{", "(", "r"].indexOf(eleType.type) !== -1)
        this.align(3);
      var end = this.pos + arrayBlobSize;
      result = [];
      while (this.pos < end)
        result.push(this.readTree(eleType));
      return result;
    };
    DBusBuffer.prototype.readSimpleType = function readSimpleType(t) {
      var data, len, word0, word1;
      switch (t) {
        case "y":
          return this.readInt8();
        case "b":
          return this.readInt32() ? true : false;
        case "n":
          return this.readSInt16();
        case "q":
          return this.readInt16();
        case "u":
          return this.readInt32();
        case "i":
          return this.readSInt32();
        case "g":
          len = this.readInt8();
          return this.readString(len);
        case "s":
        case "o":
          len = this.readInt32();
          return this.readString(len);
        case "x":
          this.align(3);
          word0 = this.readInt32();
          word1 = this.readInt32();
          data = Long.fromBits(word0, word1, false);
          if (this.options.ReturnLongjs)
            return data;
          return data.toNumber();
        case "t":
          this.align(3);
          word0 = this.readInt32();
          word1 = this.readInt32();
          data = Long.fromBits(word0, word1, true);
          if (this.options.ReturnLongjs)
            return data;
          return data.toNumber();
        case "d":
          return this.readDouble();
        default:
          throw new Error(`Unsupported type: ${t}`);
      }
    };
    module2.exports = DBusBuffer;
  }
});

// node_modules/dbus-native/lib/header-signature.json
var require_header_signature2 = __commonJS({
  "node_modules/dbus-native/lib/header-signature.json"(exports2, module2) {
    module2.exports = [
      {
        type: "a",
        child: [
          {
            type: "(",
            child: [
              {
                type: "y",
                child: []
              },
              {
                type: "v",
                child: []
              }
            ]
          }
        ]
      }
    ];
  }
});

// node_modules/dbus-native/lib/message.js
var require_message2 = __commonJS({
  "node_modules/dbus-native/lib/message.js"(exports2, module2) {
    var Buffer2 = require_safe_buffer().Buffer;
    var marshall = require_marshall2();
    var constants = require_constants2();
    var DBusBuffer = require_dbus_buffer2();
    var headerSignature = require_header_signature2();
    module2.exports.unmarshalMessages = function messageParser(stream, onMessage, opts) {
      var state = 0;
      var header, fieldsAndBody;
      var fieldsLength, fieldsLengthPadded;
      var fieldsAndBodyLength = 0;
      var bodyLength = 0;
      stream.on("readable", function() {
        while (1) {
          if (state === 0) {
            header = stream.read(16);
            if (!header)
              break;
            state = 1;
            fieldsLength = header.readUInt32LE(12);
            fieldsLengthPadded = fieldsLength + 7 >> 3 << 3;
            bodyLength = header.readUInt32LE(4);
            fieldsAndBodyLength = fieldsLengthPadded + bodyLength;
          } else {
            fieldsAndBody = stream.read(fieldsAndBodyLength);
            if (!fieldsAndBody)
              break;
            state = 0;
            var messageBuffer = new DBusBuffer(fieldsAndBody, void 0, opts);
            var unmarshalledHeader = messageBuffer.readArray(
              headerSignature[0].child[0],
              fieldsLength
            );
            messageBuffer.align(3);
            var headerName;
            var message = {};
            message.serial = header.readUInt32LE(8);
            for (var i = 0; i < unmarshalledHeader.length; ++i) {
              headerName = constants.headerTypeName[unmarshalledHeader[i][0]];
              message[headerName] = unmarshalledHeader[i][1][1][0];
            }
            message.type = header[1];
            message.flags = header[2];
            if (bodyLength > 0 && message.signature) {
              message.body = messageBuffer.read(message.signature);
            }
            onMessage(message);
          }
        }
      });
    };
    module2.exports.unmarshall = function unmarshall(buff, opts) {
      var msgBuf = new DBusBuffer(buff, void 0, opts);
      var headers = msgBuf.read("yyyyuua(yv)");
      var message = {};
      for (var i = 0; i < headers[6].length; ++i) {
        var headerName = constants.headerTypeName[headers[6][i][0]];
        message[headerName] = headers[6][i][1][1][0];
      }
      message.type = headers[1];
      message.flags = headers[2];
      message.serial = headers[5];
      msgBuf.align(3);
      message.body = msgBuf.read(message.signature);
      return message;
    };
    module2.exports.marshall = function marshallMessage(message) {
      if (!message.serial)
        throw new Error("Missing or invalid serial");
      var flags = message.flags || 0;
      var type = message.type || constants.messageType.methodCall;
      var bodyLength = 0;
      var bodyBuff;
      if (message.signature && message.body) {
        bodyBuff = marshall(message.signature, message.body);
        bodyLength = bodyBuff.length;
      }
      var header = [
        constants.endianness.le,
        type,
        flags,
        constants.protocolVersion,
        bodyLength,
        message.serial
      ];
      var headerBuff = marshall("yyyyuu", header);
      var fields = [];
      constants.headerTypeName.forEach(function(fieldName) {
        var fieldVal = message[fieldName];
        if (fieldVal) {
          fields.push([
            constants.headerTypeId[fieldName],
            [constants.fieldSignature[fieldName], fieldVal]
          ]);
        }
      });
      var fieldsBuff = marshall("a(yv)", [fields], 12);
      var headerLenAligned = headerBuff.length + fieldsBuff.length + 7 >> 3 << 3;
      var messageLen = headerLenAligned + bodyLength;
      var messageBuff = Buffer2.alloc(messageLen);
      headerBuff.copy(messageBuff);
      fieldsBuff.copy(messageBuff, headerBuff.length);
      if (bodyLength > 0)
        bodyBuff.copy(messageBuff, headerLenAligned);
      return messageBuff;
    };
  }
});

// node_modules/dbus-native/lib/readline.js
var require_readline2 = __commonJS({
  "node_modules/dbus-native/lib/readline.js"(exports2, module2) {
    var Buffer2 = require_safe_buffer().Buffer;
    module2.exports = function readOneLine(stream, cb) {
      var bytes = [];
      function readable() {
        while (1) {
          var buf = stream.read(1);
          if (!buf)
            return;
          var b = buf[0];
          if (b === 10) {
            try {
              cb(Buffer2.from(bytes));
            } catch (error) {
              stream.emit("error", error);
            }
            stream.removeListener("readable", readable);
            return;
          }
          bytes.push(b);
        }
      }
      stream.on("readable", readable);
    };
  }
});

// node_modules/dbus-native/lib/handshake.js
var require_handshake3 = __commonJS({
  "node_modules/dbus-native/lib/handshake.js"(exports2, module2) {
    var Buffer2 = require_safe_buffer().Buffer;
    var crypto = require("crypto");
    var fs = require("fs");
    var path = require("path");
    var constants = require_constants2();
    var readLine = require_readline2();
    function sha1(input) {
      var shasum = crypto.createHash("sha1");
      shasum.update(input);
      return shasum.digest("hex");
    }
    function getUserHome() {
      return process.env[process.platform.match(/$win/) ? "USERPROFILE" : "HOME"];
    }
    function getCookie(context, id, cb) {
      var dirname = path.join(getUserHome(), ".dbus-keyrings");
      if (context.length === 0)
        context = "org_freedesktop_general";
      var filename = path.join(dirname, context);
      fs.stat(dirname, function(err, stat) {
        if (err)
          return cb(err);
        if (stat.mode & 18)
          return cb(
            new Error(
              "User keyrings directory is writeable by other users. Aborting authentication"
            )
          );
        if (process.hasOwnProperty("getuid") && stat.uid !== process.getuid())
          return cb(
            new Error(
              "Keyrings directory is not owned by the current user. Aborting authentication!"
            )
          );
        fs.readFile(filename, "ascii", function(err2, keyrings) {
          if (err2)
            return cb(err2);
          var lines = keyrings.split("\n");
          for (var l = 0; l < lines.length; ++l) {
            var data = lines[l].split(" ");
            if (id === data[0])
              return cb(null, data[2]);
          }
          return cb(new Error("cookie not found"));
        });
      });
    }
    function hexlify(input) {
      return Buffer2.from(input.toString(), "ascii").toString("hex");
    }
    module2.exports = function auth(stream, opts, cb) {
      var authMethods;
      if (opts.authMethods) {
        authMethods = opts.authMethods;
      } else {
        authMethods = constants.defaultAuthMethods;
      }
      stream.write("\0");
      tryAuth(stream, authMethods.slice(), cb);
    };
    function tryAuth(stream, methods, cb) {
      if (methods.length === 0) {
        return cb(new Error("No authentication methods left to try"));
      }
      var authMethod = methods.shift();
      var uid = process.hasOwnProperty("getuid") ? process.getuid() : 0;
      var id = hexlify(uid);
      function beginOrNextAuth() {
        readLine(stream, function(line) {
          var ok = line.toString("ascii").match(/^([A-Za-z]+) (.*)/);
          if (ok && ok[1] === "OK") {
            stream.write("BEGIN\r\n");
            return cb(null, ok[2]);
          } else {
            if (!methods.empty) {
              tryAuth(stream, methods, cb);
            } else {
              return cb(line);
            }
          }
        });
      }
      switch (authMethod) {
        case "EXTERNAL":
          stream.write(`AUTH ${authMethod} ${id}\r
`);
          beginOrNextAuth();
          break;
        case "DBUS_COOKIE_SHA1":
          stream.write(`AUTH ${authMethod} ${id}\r
`);
          readLine(stream, function(line) {
            var data = Buffer2.from(
              line.toString().split(" ")[1].trim(),
              "hex"
            ).toString().split(" ");
            var cookieContext = data[0];
            var cookieId = data[1];
            var serverChallenge = data[2];
            var clientChallenge = crypto.randomBytes(16).toString("hex");
            getCookie(cookieContext, cookieId, function(err, cookie) {
              if (err)
                return cb(err);
              var response = sha1(
                [serverChallenge, clientChallenge, cookie].join(":")
              );
              var reply = hexlify(clientChallenge + response);
              stream.write(`DATA ${reply}\r
`);
              beginOrNextAuth();
            });
          });
          break;
        case "ANONYMOUS":
          stream.write("AUTH ANONYMOUS \r\n");
          beginOrNextAuth();
          break;
        default:
          console.error(`Unsupported auth method: ${authMethod}`);
          beginOrNextAuth();
          break;
      }
    }
  }
});

// node_modules/dbus-native/lib/server-handshake.js
var require_server_handshake = __commonJS({
  "node_modules/dbus-native/lib/server-handshake.js"(exports2, module2) {
    var Buffer2 = require_safe_buffer().Buffer;
    var readLine = require_readline2();
    module2.exports = function serverHandshake(stream, opts, cb) {
      stream.name = "SERVER SERVER";
      readLine(stream, function(hello) {
        console.log(["hello string: ", hello.toString(), hello]);
        stream.write("REJECTED EXTERNAL DBUS_COOKIE_SHA1 ANONYMOUS\r\n");
        readLine(stream, function() {
          stream.write(
            `DATA ${Buffer2.from(
              "org_freedesktop_general 642038150 b9ce247a275f427c8586e4c9de9bb951"
            ).toString("hex")}\r
`
          );
          readLine(stream, function() {
            stream.write(
              "OK 6f72675f667265656465736b746f705f67656e6572616c20353631303331333937206239636532343761323735663432376338353836653463396465396262393531\r\n"
            );
            readLine(stream, function(begin) {
              console.log(["AFTER begin: ", begin.toString()]);
              cb(null);
            });
          });
        });
      });
    };
  }
});

// node_modules/dbus-native/lib/stdifaces.js
var require_stdifaces = __commonJS({
  "node_modules/dbus-native/lib/stdifaces.js"(exports2, module2) {
    var constants = require_constants2();
    var parseSignature = require_signature2();
    var xmlHeader = '<!DOCTYPE node PUBLIC "-//freedesktop//DTD D-BUS Object Introspection 1.0//EN"\n    "http://www.freedesktop.org/standards/dbus/1.0/introspect.dtd">';
    var stdIfaces;
    module2.exports = function(msg, bus) {
      if (msg["interface"] === "org.freedesktop.DBus.Introspectable" && msg.member === "Introspect") {
        if (msg.path === "/")
          msg.path = "";
        var resultXml = [xmlHeader];
        var nodes = {};
        for (var path in bus.exportedObjects) {
          if (path.indexOf(msg.path) === 0) {
            var introspectableObj = bus.exportedObjects[msg.path];
            if (introspectableObj) {
              nodes[msg.path] = introspectableObj;
            } else {
              if (path[msg.path.length] !== "/")
                continue;
              var localPath = path.substr(msg.path.length);
              var pathParts = localPath.split("/");
              var localName = pathParts[1];
              nodes[localName] = null;
            }
          }
        }
        var length = Object.keys(nodes).length;
        if (length === 0) {
          resultXml.push("<node/>");
        } else if (length === 1) {
          var obj = nodes[Object.keys(nodes)[0]];
          if (obj) {
            resultXml.push("<node>");
            for (var ifaceNode in obj) {
              resultXml.push(interfaceToXML(obj[ifaceNode][0]));
            }
            resultXml.push(stdIfaces);
            resultXml.push("</node>");
          } else {
            resultXml.push(
              `<node>
  <node name="${Object.keys(nodes)[0]}"/>
  </node>`
            );
          }
        } else {
          resultXml.push("<node>");
          for (var name in nodes) {
            if (nodes[name] === null) {
              resultXml.push(`  <node name="${name}" />`);
            } else {
              obj = nodes[name];
              resultXml.push(`  <node name="${name}" >`);
              for (var ifaceName in obj) {
                resultXml.push(interfaceToXML(obj[ifaceName][0]));
              }
              resultXml.push(stdIfaces);
              resultXml.push("  </node>");
            }
          }
          resultXml.push("</node>");
        }
        const introspectableReply = {
          type: constants.messageType.methodReturn,
          serial: bus.serial++,
          replySerial: msg.serial,
          destination: msg.sender,
          signature: "s",
          body: [resultXml.join("\n")]
        };
        bus.connection.message(introspectableReply);
        return 1;
      } else if (msg["interface"] === "org.freedesktop.DBus.Properties") {
        var interfaceName = msg.body[0];
        var propertiesObj = bus.exportedObjects[msg.path];
        if (!propertiesObj || !propertiesObj[interfaceName]) {
          bus.sendError(
            msg,
            "org.freedesktop.DBus.Error.UnknownMethod",
            "Uh oh oh"
          );
          return 1;
        }
        var impl = propertiesObj[interfaceName][1];
        const propertiesReply = {
          type: constants.messageType.methodReturn,
          serial: bus.serial++,
          replySerial: msg.serial,
          destination: msg.sender
        };
        if (msg.member === "Get" || msg.member === "Set") {
          var propertyName = msg.body[1];
          var propType = propertiesObj[interfaceName][0].properties[propertyName];
          if (msg.member === "Get") {
            var propValue = impl[propertyName];
            propertiesReply.signature = "v";
            propertiesReply.body = [[propType, propValue]];
          } else {
            impl[propertyName] = 1234;
          }
        } else if (msg.member === "GetAll") {
          propertiesReply.signature = "a{sv}";
          var props = [];
          for (var p in propertiesObj[interfaceName][0].properties) {
            var propertySignature = propertiesObj[interfaceName][0].properties[p];
            props.push([p, [propertySignature, impl[p]]]);
          }
          propertiesReply.body = [props];
        }
        bus.connection.message(propertiesReply);
        return 1;
      } else if (msg["interface"] === "org.freedesktop.DBus.Peer") {
        const peerReply = {
          type: constants.messageType.methodReturn,
          serial: bus.serial++,
          replySerial: msg.serial,
          destination: msg.sender
        };
        if (msg.member === "Ping") {
        } else if (msg.member === "GetMachineId") {
          peerReply.signature = "s";
          peerReply.body = ["This is a machine id. TODO: implement"];
        }
        bus.connection.message(peerReply);
        return 1;
      }
      return 0;
    };
    function interfaceToXML(iface) {
      var result = [];
      var dumpArgs = function(argsSignature, argsNames, direction) {
        if (!argsSignature)
          return;
        var args = parseSignature(argsSignature);
        args.forEach(function(arg, num) {
          var argName = argsNames ? argsNames[num] : direction + num;
          var dirStr = direction === "signal" ? "" : `" direction="${direction}`;
          result.push(
            `      <arg type="${dumpSignature([arg])}" name="${argName}${dirStr}" />`
          );
        });
      };
      result.push(`  <interface name="${iface.name}">`);
      if (iface.methods) {
        for (var methodName in iface.methods) {
          var method = iface.methods[methodName];
          result.push(`    <method name="${methodName}">`);
          dumpArgs(method[0], method[2], "in");
          dumpArgs(method[1], method[3], "out");
          result.push("    </method>");
        }
      }
      if (iface.signals) {
        for (var signalName in iface.signals) {
          var signal = iface.signals[signalName];
          result.push(`    <signal name="${signalName}">`);
          dumpArgs(signal[0], signal.slice(1), "signal");
          result.push("    </signal>");
        }
      }
      if (iface.properties) {
        for (const propertyName in iface.properties) {
          result.push(
            `    <property name="${propertyName}" type="${iface.properties[propertyName]}" access="readwrite"/>`
          );
        }
      }
      result.push("  </interface>");
      return result.join("\n");
    }
    function dumpSignature(s) {
      var result = [];
      s.forEach(function(sig) {
        result.push(sig.type + dumpSignature(sig.child));
        if (sig.type === "{")
          result.push("}");
        if (sig.type === "(")
          result.push(")");
      });
      return result.join("");
    }
    stdIfaces = '  <interface name="org.freedesktop.DBus.Properties">\n    <method name="Get">\n      <arg type="s" name="interface_name" direction="in"/>\n      <arg type="s" name="property_name" direction="in"/>\n      <arg type="v" name="value" direction="out"/>\n    </method>\n    <method name="GetAll">\n      <arg type="s" name="interface_name" direction="in"/>\n      <arg type="a{sv}" name="properties" direction="out"/>\n    </method>\n    <method name="Set">\n      <arg type="s" name="interface_name" direction="in"/>\n      <arg type="s" name="property_name" direction="in"/>\n      <arg type="v" name="value" direction="in"/>\n    </method>\n    <signal name="PropertiesChanged">\n      <arg type="s" name="interface_name"/>\n      <arg type="a{sv}" name="changed_properties"/>\n      <arg type="as" name="invalidated_properties"/>\n    </signal>\n  </interface>\n  <interface name="org.freedesktop.DBus.Introspectable">\n    <method name="Introspect">\n      <arg type="s" name="xml_data" direction="out"/>\n    </method>\n  </interface>\n  <interface name="org.freedesktop.DBus.Peer">\n    <method name="Ping"/>\n    <method name="GetMachineId">\n      <arg type="s" name="machine_uuid" direction="out"/>\n    </method>\n  </interface>';
  }
});

// node_modules/dbus-native/lib/introspect.js
var require_introspect = __commonJS({
  "node_modules/dbus-native/lib/introspect.js"(exports2, module2) {
    var xml2js = require_xml2js();
    module2.exports.introspectBus = function(obj, callback2) {
      var bus = obj.service.bus;
      bus.invoke(
        {
          destination: obj.service.name,
          path: obj.name,
          interface: "org.freedesktop.DBus.Introspectable",
          member: "Introspect"
        },
        function(err, xml) {
          module2.exports.processXML(err, xml, obj, callback2);
        }
      );
    };
    module2.exports.processXML = function(err, xml, obj, callback2) {
      if (err)
        return callback2(err);
      var parser = new xml2js.Parser();
      parser.parseString(xml, function(err2, result) {
        if (err2)
          return callback2(err2);
        if (!result.node)
          throw new Error("No root XML node");
        result = result.node;
        if (!result.interface) {
          if (result.node && result.node.length > 0 && result.node[0]["$"]) {
            var subObj = Object.assign(obj, {});
            if (subObj.name.slice(-1) !== "/")
              subObj.name += "/";
            subObj.name += result.node[0]["$"].name;
            return module2.exports.introspectBus(subObj, callback2);
          }
          return callback2(new Error("No such interface found"));
        }
        var proxy = {};
        var nodes = [];
        var ifaceName, method, property, iface, arg, signature, currentIface;
        var ifaces = result["interface"];
        var xmlnodes = result["node"] || [];
        for (var n = 1; n < xmlnodes.length; ++n) {
          nodes.push(xmlnodes[n]["$"]["name"]);
        }
        for (var i = 0; i < ifaces.length; ++i) {
          iface = ifaces[i];
          ifaceName = iface["$"].name;
          currentIface = proxy[ifaceName] = new DBusInterface(obj, ifaceName);
          for (var m = 0; iface.method && m < iface.method.length; ++m) {
            method = iface.method[m];
            signature = "";
            var methodName = method["$"].name;
            for (var a = 0; method.arg && a < method.arg.length; ++a) {
              arg = method.arg[a]["$"];
              if (arg.direction === "in")
                signature += arg.type;
            }
            currentIface.$createMethod(methodName, signature);
          }
          for (var p = 0; iface.property && p < iface.property.length; ++p) {
            property = iface.property[p];
            currentIface.$createProp(property["$"].name, property["$"].type, property["$"].access);
          }
        }
        callback2(null, proxy, nodes);
      });
    };
    function DBusInterface(parent_obj, ifname) {
      this.$parent = parent_obj;
      this.$name = ifname;
      this.$methods = {};
      this.$properties = {};
      this.$callbacks = [];
      this.$sigHandlers = [];
    }
    DBusInterface.prototype.$getSigHandler = function(callback2) {
      var index;
      if ((index = this.$callbacks.indexOf(callback2)) === -1) {
        index = this.$callbacks.push(callback2) - 1;
        this.$sigHandlers[index] = function(messageBody) {
          callback2.apply(null, messageBody);
        };
      }
      return this.$sigHandlers[index];
    };
    DBusInterface.prototype.addListener = DBusInterface.prototype.on = function(signame, callback2) {
      var bus = this.$parent.service.bus;
      var signalFullName = bus.mangle(this.$parent.name, this.$name, signame);
      if (!bus.signals.listeners(signalFullName).length) {
        var match = getMatchRule(this.$parent.name, this.$name, signame);
        bus.addMatch(match, function(err) {
          if (err)
            throw new Error(err);
          bus.signals.on(signalFullName, this.$getSigHandler(callback2));
        }.bind(this));
      } else {
        bus.signals.on(signalFullName, this.$getSigHandler(callback2));
      }
    };
    DBusInterface.prototype.removeListener = DBusInterface.prototype.off = function(signame, callback2) {
      var bus = this.$parent.service.bus;
      var signalFullName = bus.mangle(this.$parent.name, this.$name, signame);
      bus.signals.removeListener(signalFullName, this.$getSigHandler(callback2));
      if (!bus.signals.listeners(signalFullName).length) {
        var match = getMatchRule(this.$parent.name, this.$name, signame);
        bus.removeMatch(match, function(err) {
          if (err)
            throw new Error(err);
          this.$callbacks.length = 0;
          this.$sigHandlers.length = 0;
        }.bind(this));
      }
    };
    DBusInterface.prototype.$createMethod = function(mName, signature) {
      this.$methods[mName] = signature;
      this[mName] = function() {
        this.$callMethod(mName, arguments);
      };
    };
    DBusInterface.prototype.$callMethod = function(mName, args) {
      var bus = this.$parent.service.bus;
      if (!Array.isArray(args))
        args = Array.from(args);
      var callback2 = typeof args[args.length - 1] === "function" ? args.pop() : function() {
      };
      var msg = {
        destination: this.$parent.service.name,
        path: this.$parent.name,
        interface: this.$name,
        member: mName
      };
      if (this.$methods[mName] !== "") {
        msg.signature = this.$methods[mName];
        msg.body = args;
      }
      bus.invoke(msg, callback2);
    };
    DBusInterface.prototype.$createProp = function(propName, propType, propAccess) {
      this.$properties[propName] = { type: propType, access: propAccess };
      Object.defineProperty(this, propName, {
        enumerable: true,
        get: function(callback2) {
          this.$readProp(propName, callback2);
        },
        set: function(val) {
          this.$writeProp(propName, val);
        }
      });
    };
    DBusInterface.prototype.$readProp = function(propName, callback2) {
      var bus = this.$parent.service.bus;
      bus.invoke(
        {
          destination: this.$parent.service.name,
          path: this.$parent.name,
          interface: "org.freedesktop.DBus.Properties",
          member: "Get",
          signature: "ss",
          body: [this.$name, propName]
        },
        function(err, val) {
          if (err) {
            callback2(err);
          } else {
            var signature = val[0];
            if (signature.length === 1) {
              callback2(err, val[1][0]);
            } else {
              callback2(err, val[1]);
            }
          }
        }
      );
    };
    DBusInterface.prototype.$writeProp = function(propName, val) {
      var bus = this.$parent.service.bus;
      bus.invoke({
        destination: this.$parent.service.name,
        path: this.$parent.name,
        interface: "org.freedesktop.DBus.Properties",
        member: "Set",
        signature: "ssv",
        body: [this.$name, propName, [this.$properties[propName].type, val]]
      });
    };
    function getMatchRule(objName, ifName, signame) {
      return `type='signal',path='${objName}',interface='${ifName}',member='${signame}'`;
    }
  }
});

// node_modules/dbus-native/lib/bus.js
var require_bus2 = __commonJS({
  "node_modules/dbus-native/lib/bus.js"(exports2, module2) {
    var EventEmitter = require("events").EventEmitter;
    var constants = require_constants2();
    var stdDbusIfaces = require_stdifaces();
    var introspect = require_introspect().introspectBus;
    module2.exports = function bus(conn, opts) {
      if (!(this instanceof bus)) {
        return new bus(conn);
      }
      if (!opts)
        opts = {};
      var self = this;
      this.connection = conn;
      this.serial = 1;
      this.cookies = {};
      this.methodCallHandlers = {};
      this.signals = new EventEmitter();
      this.exportedObjects = {};
      this.invoke = function(msg, callback2) {
        if (!msg.type)
          msg.type = constants.messageType.methodCall;
        msg.serial = self.serial++;
        this.cookies[msg.serial] = callback2;
        self.connection.message(msg);
      };
      this.invokeDbus = function(msg, callback2) {
        if (!msg.path)
          msg.path = "/org/freedesktop/DBus";
        if (!msg.destination)
          msg.destination = "org.freedesktop.DBus";
        if (!msg["interface"])
          msg["interface"] = "org.freedesktop.DBus";
        self.invoke(msg, callback2);
      };
      this.mangle = function(path, iface, member) {
        var obj = {};
        if (typeof path === "object") {
          obj.path = path.path;
          obj["interface"] = path["interface"];
          obj.member = path.member;
        } else {
          obj.path = path;
          obj["interface"] = iface;
          obj.member = member;
        }
        return JSON.stringify(obj);
      };
      this.sendSignal = function(path, iface, name, signature, args) {
        var signalMsg = {
          type: constants.messageType.signal,
          serial: self.serial++,
          interface: iface,
          path,
          member: name
        };
        if (signature) {
          signalMsg.signature = signature;
          signalMsg.body = args;
        }
        self.connection.message(signalMsg);
      };
      this.sendError = function(msg, errorName, errorText) {
        var reply = {
          type: constants.messageType.error,
          serial: self.serial++,
          replySerial: msg.serial,
          destination: msg.sender,
          errorName,
          signature: "s",
          body: [errorText]
        };
        this.connection.message(reply);
      };
      this.sendReply = function(msg, signature, body) {
        var reply = {
          type: constants.messageType.methodReturn,
          serial: self.serial++,
          replySerial: msg.serial,
          destination: msg.sender,
          signature,
          body
        };
        this.connection.message(reply);
      };
      this.connection.on("message", function(msg) {
        function invoke(impl2, func2, resultSignature2) {
          Promise.resolve().then(function() {
            return func2.apply(impl2, (msg.body || []).concat(msg));
          }).then(
            function(methodReturnResult) {
              var methodReturnReply = {
                type: constants.messageType.methodReturn,
                serial: self.serial++,
                destination: msg.sender,
                replySerial: msg.serial
              };
              if (methodReturnResult !== null) {
                methodReturnReply.signature = resultSignature2;
                methodReturnReply.body = [methodReturnResult];
              }
              self.connection.message(methodReturnReply);
            },
            function(e) {
              self.sendError(
                msg,
                e.dbusName || "org.freedesktop.DBus.Error.Failed",
                e.message || ""
              );
            }
          );
        }
        var handler;
        if (msg.type === constants.messageType.methodReturn || msg.type === constants.messageType.error) {
          handler = self.cookies[msg.replySerial];
          if (handler) {
            delete self.cookies[msg.replySerial];
            var props = {
              connection: self.connection,
              bus: self,
              message: msg,
              signature: msg.signature
            };
            var args = msg.body || [];
            if (msg.type === constants.messageType.methodReturn) {
              args = [null].concat(args);
              handler.apply(props, args);
            } else {
              handler.call(props, args);
            }
          }
        } else if (msg.type === constants.messageType.signal) {
          self.signals.emit(self.mangle(msg), msg.body, msg.signature);
        } else {
          if (stdDbusIfaces(msg, self))
            return;
          var obj, iface, impl;
          if (obj = self.exportedObjects[msg.path]) {
            if (iface = obj[msg["interface"]]) {
              impl = iface[1];
              var func = impl[msg.member];
              if (!func) {
                self.sendError(
                  msg,
                  "org.freedesktop.DBus.Error.UnknownMethod",
                  `Method "${msg.member}" on interface "${msg.interface}" doesn't exist`
                );
                return;
              }
              var resultSignature = iface[0].methods[msg.member][1];
              invoke(impl, func, resultSignature);
              return;
            } else {
              console.error(`Interface ${msg["interface"]} is not supported`);
            }
          }
          handler = self.methodCallHandlers[self.mangle(msg)];
          if (handler) {
            invoke(null, handler[0], handler[1]);
          } else {
            self.sendError(
              msg,
              "org.freedesktop.DBus.Error.UnknownService",
              "Uh oh oh"
            );
          }
        }
      });
      this.setMethodCallHandler = function(objectPath, iface, member, handler) {
        var key = self.mangle(objectPath, iface, member);
        self.methodCallHandlers[key] = handler;
      };
      this.exportInterface = function(obj, path, iface) {
        var entry;
        if (!self.exportedObjects[path]) {
          entry = self.exportedObjects[path] = {};
        } else {
          entry = self.exportedObjects[path];
        }
        entry[iface.name] = [iface, obj];
        if (typeof obj.emit === "function") {
          var oldEmit = obj.emit;
          obj.emit = function() {
            var args = Array.prototype.slice.apply(arguments);
            var signalName = args[0];
            if (!signalName)
              throw new Error("Trying to emit undefined signa");
            var signal;
            if (iface.signals && iface.signals[signalName]) {
              signal = iface.signals[signalName];
              var signalMsg = {
                type: constants.messageType.signal,
                serial: self.serial++,
                interface: iface.name,
                path,
                member: signalName
              };
              if (signal[0]) {
                signalMsg.signature = signal[0];
                signalMsg.body = args.slice(1);
              }
              self.connection.message(signalMsg);
              self.serial++;
            }
            oldEmit.apply(obj, args);
          };
        }
      };
      if (opts.direct !== true) {
        this.invokeDbus({ member: "Hello" }, function(err, name) {
          if (err)
            throw new Error(err);
          self.name = name;
        });
      } else {
        self.name = null;
      }
      function DBusObject(name, service) {
        this.name = name;
        this.service = service;
        this.as = function(name2) {
          return this.proxy[name2];
        };
      }
      function DBusService(name, bus2) {
        this.name = name;
        this.bus = bus2;
        this.getObject = function(name2, callback2) {
          if (name2 == void 0)
            return callback2(new Error("Object name is null or undefined"));
          var obj = new DBusObject(name2, this);
          introspect(obj, function(err, ifaces, nodes) {
            if (err)
              return callback2(err);
            obj.proxy = ifaces;
            obj.nodes = nodes;
            callback2(null, obj);
          });
        };
        this.getInterface = function(objName, ifaceName, callback2) {
          this.getObject(objName, function(err, obj) {
            if (err)
              return callback2(err);
            callback2(null, obj.as(ifaceName));
          });
        };
      }
      this.getService = function(name) {
        return new DBusService(name, this);
      };
      this.getObject = function(path, name, callback2) {
        var service = this.getService(path);
        return service.getObject(name, callback2);
      };
      this.getInterface = function(path, objname, name, callback2) {
        return this.getObject(path, objname, function(err, obj) {
          if (err)
            return callback2(err);
          callback2(null, obj.as(name));
        });
      };
      this.addMatch = function(match, callback2) {
        this.invokeDbus(
          { member: "AddMatch", signature: "s", body: [match] },
          callback2
        );
      };
      this.removeMatch = function(match, callback2) {
        this.invokeDbus(
          { member: "RemoveMatch", signature: "s", body: [match] },
          callback2
        );
      };
      this.getId = function(callback2) {
        this.invokeDbus({ member: "GetId" }, callback2);
      };
      this.requestName = function(name, flags, callback2) {
        this.invokeDbus(
          { member: "RequestName", signature: "su", body: [name, flags] },
          function(err, name2) {
            if (callback2)
              callback2(err, name2);
          }
        );
      };
      this.releaseName = function(name, callback2) {
        this.invokeDbus(
          { member: "ReleaseName", signature: "s", body: [name] },
          callback2
        );
      };
      this.listNames = function(callback2) {
        this.invokeDbus({ member: "ListNames" }, callback2);
      };
      this.listActivatableNames = function(callback2) {
        this.invokeDbus({ member: "ListActivatableNames" }, callback2);
      };
      this.updateActivationEnvironment = function(env, callback2) {
        this.invokeDbus(
          {
            member: "UpdateActivationEnvironment",
            signature: "a{ss}",
            body: [env]
          },
          callback2
        );
      };
      this.startServiceByName = function(name, flags, callback2) {
        this.invokeDbus(
          { member: "StartServiceByName", signature: "su", body: [name, flags] },
          callback2
        );
      };
      this.getConnectionUnixUser = function(name, callback2) {
        this.invokeDbus(
          { member: "GetConnectionUnixUser", signature: "s", body: [name] },
          callback2
        );
      };
      this.getConnectionUnixProcessId = function(name, callback2) {
        this.invokeDbus(
          { member: "GetConnectionUnixProcessID", signature: "s", body: [name] },
          callback2
        );
      };
      this.getNameOwner = function(name, callback2) {
        this.invokeDbus(
          { member: "GetNameOwner", signature: "s", body: [name] },
          callback2
        );
      };
      this.nameHasOwner = function(name, callback2) {
        this.invokeDbus(
          { member: "NameHasOwner", signature: "s", body: [name] },
          callback2
        );
      };
    };
  }
});

// node_modules/dbus-native/lib/server.js
var require_server = __commonJS({
  "node_modules/dbus-native/lib/server.js"(exports2, module2) {
    var dbus2 = require_dbus_native();
    var net = require("net");
    module2.exports.createServer = function(handler) {
      function Server() {
        var id = 123;
        this.server = net.createServer(function(socket) {
          socket.idd = id;
          id++;
          var dbusConn = dbus2.createConnection({ stream: socket, server: true });
          if (handler)
            handler(dbusConn);
        });
        this.listen = this.server.listen.bind(this.server);
      }
      return new Server();
    };
  }
});

// node_modules/map-stream/index.js
var require_map_stream2 = __commonJS({
  "node_modules/map-stream/index.js"(exports2, module2) {
    var Stream = require("stream").Stream;
    module2.exports = function(mapper, opts) {
      var stream = new Stream(), inputs = 0, outputs = 0, ended = false, paused = false, destroyed = false, lastWritten = 0, inNext = false;
      opts = opts || {};
      var errorEventName = opts.failures ? "failure" : "error";
      var writeQueue = {};
      stream.writable = true;
      stream.readable = true;
      function queueData(data, number) {
        var nextToWrite = lastWritten + 1;
        if (number === nextToWrite) {
          if (data !== void 0) {
            stream.emit.apply(stream, ["data", data]);
          }
          lastWritten++;
          nextToWrite++;
        } else {
          writeQueue[number] = data;
        }
        if (writeQueue.hasOwnProperty(nextToWrite)) {
          var dataToWrite = writeQueue[nextToWrite];
          delete writeQueue[nextToWrite];
          return queueData(dataToWrite, nextToWrite);
        }
        outputs++;
        if (inputs === outputs) {
          if (paused)
            paused = false, stream.emit("drain");
          if (ended)
            end();
        }
      }
      function next(err, data, number) {
        if (destroyed)
          return;
        inNext = true;
        if (!err || opts.failures) {
          queueData(data, number);
        }
        if (err) {
          stream.emit.apply(stream, [errorEventName, err]);
        }
        inNext = false;
      }
      function wrappedMapper(input, number, callback2) {
        return mapper.call(null, input, function(err, data) {
          callback2(err, data, number);
        });
      }
      stream.write = function(data) {
        if (ended)
          throw new Error("map stream is not writable");
        inNext = false;
        inputs++;
        try {
          var written = wrappedMapper(data, inputs, next);
          paused = written === false;
          return !paused;
        } catch (err) {
          if (inNext)
            throw err;
          next(err);
          return !paused;
        }
      };
      function end(data) {
        ended = true;
        stream.writable = false;
        if (data !== void 0) {
          return queueData(data, inputs);
        } else if (inputs == outputs) {
          stream.readable = false, stream.emit("end"), stream.destroy();
        }
      }
      stream.end = function(data) {
        if (ended)
          return;
        end(data);
      };
      stream.destroy = function() {
        ended = destroyed = true;
        stream.writable = stream.readable = paused = false;
        process.nextTick(function() {
          stream.emit("close");
        });
      };
      stream.pause = function() {
        paused = true;
      };
      stream.resume = function() {
        paused = false;
      };
      return stream;
    };
  }
});

// node_modules/split/index.js
var require_split2 = __commonJS({
  "node_modules/split/index.js"(exports2, module2) {
    var through = require_through();
    var Decoder = require("string_decoder").StringDecoder;
    module2.exports = split;
    function split(matcher, mapper, options) {
      var decoder = new Decoder();
      var soFar = "";
      var maxLength = options && options.maxLength;
      var trailing = options && options.trailing === false ? false : true;
      if ("function" === typeof matcher)
        mapper = matcher, matcher = null;
      if (!matcher)
        matcher = /\r?\n/;
      function emit(stream, piece) {
        if (mapper) {
          try {
            piece = mapper(piece);
          } catch (err) {
            return stream.emit("error", err);
          }
          if ("undefined" !== typeof piece)
            stream.queue(piece);
        } else
          stream.queue(piece);
      }
      function next(stream, buffer) {
        var pieces = ((soFar != null ? soFar : "") + buffer).split(matcher);
        soFar = pieces.pop();
        if (maxLength && soFar.length > maxLength)
          return stream.emit("error", new Error("maximum buffer reached"));
        for (var i = 0; i < pieces.length; i++) {
          var piece = pieces[i];
          emit(stream, piece);
        }
      }
      return through(
        function(b) {
          next(this, decoder.write(b));
        },
        function() {
          if (decoder.end)
            next(this, decoder.end());
          if (trailing && soFar != null)
            emit(this, soFar);
          this.queue(null);
        }
      );
    }
  }
});

// node_modules/stream-combiner/index.js
var require_stream_combiner2 = __commonJS({
  "node_modules/stream-combiner/index.js"(exports2, module2) {
    var duplexer = require_duplexer();
    var through = require_through();
    module2.exports = function() {
      var streams;
      if (arguments.length == 1 && Array.isArray(arguments[0])) {
        streams = arguments[0];
      } else {
        streams = [].slice.call(arguments);
      }
      if (streams.length == 0)
        return through();
      else if (streams.length == 1)
        return streams[0];
      var first = streams[0], last = streams[streams.length - 1], thepipe = duplexer(first, last);
      function recurse(streams2) {
        if (streams2.length < 2)
          return;
        streams2[0].pipe(streams2[1]);
        recurse(streams2.slice(1));
      }
      recurse(streams);
      function onerror() {
        var args = [].slice.call(arguments);
        args.unshift("error");
        thepipe.emit.apply(thepipe, args);
      }
      for (var i = 1; i < streams.length - 1; i++)
        streams[i].on("error", onerror);
      return thepipe;
    };
  }
});

// node_modules/event-stream/index.js
var require_event_stream2 = __commonJS({
  "node_modules/event-stream/index.js"(exports2) {
    var Stream = require("stream").Stream;
    var es = exports2;
    var through = require_through();
    var from = require_from();
    var duplex = require_duplexer();
    var map = require_map_stream2();
    var pause = require_pause_stream();
    var split = require_split2();
    var pipeline = require_stream_combiner2();
    var immediately = global.setImmediate || process.nextTick;
    es.Stream = Stream;
    es.through = through;
    es.from = from;
    es.duplex = duplex;
    es.map = map;
    es.pause = pause;
    es.split = split;
    es.pipeline = es.connect = es.pipe = pipeline;
    es.concat = //actually this should be called concat
    es.merge = function() {
      var toMerge = [].slice.call(arguments);
      if (toMerge.length === 1 && toMerge[0] instanceof Array) {
        toMerge = toMerge[0];
      }
      var stream = new Stream();
      stream.setMaxListeners(0);
      var endCount = 0;
      stream.writable = stream.readable = true;
      if (toMerge.length) {
        toMerge.forEach(function(e) {
          e.pipe(stream, { end: false });
          var ended = false;
          e.on("end", function() {
            if (ended)
              return;
            ended = true;
            endCount++;
            if (endCount == toMerge.length)
              stream.emit("end");
          });
        });
      } else {
        process.nextTick(function() {
          stream.emit("end");
        });
      }
      stream.write = function(data) {
        this.emit("data", data);
      };
      stream.destroy = function() {
        toMerge.forEach(function(e) {
          if (e.destroy)
            e.destroy();
        });
      };
      return stream;
    };
    es.collect = es.writeArray = function(done) {
      if ("function" !== typeof done)
        throw new Error("function writeArray (done): done must be function");
      var a = new Stream(), array = [], isDone = false;
      a.write = function(l) {
        array.push(l);
      };
      a.end = function() {
        isDone = true;
        done(null, array);
      };
      a.writable = true;
      a.readable = false;
      a.destroy = function() {
        a.writable = a.readable = false;
        if (isDone)
          return;
        done(new Error("destroyed before end"), array);
      };
      return a;
    };
    es.readArray = function(array) {
      var stream = new Stream(), i = 0, paused = false, ended = false;
      stream.readable = true;
      stream.writable = false;
      if (!Array.isArray(array))
        throw new Error("event-stream.read expects an array");
      stream.resume = function() {
        if (ended)
          return;
        paused = false;
        var l = array.length;
        while (i < l && !paused && !ended) {
          stream.emit("data", array[i++]);
        }
        if (i == l && !ended)
          ended = true, stream.readable = false, stream.emit("end");
      };
      process.nextTick(stream.resume);
      stream.pause = function() {
        paused = true;
      };
      stream.destroy = function() {
        ended = true;
        stream.emit("close");
      };
      return stream;
    };
    es.readable = function(func, continueOnError) {
      var stream = new Stream(), i = 0, paused = false, ended = false, reading = false;
      stream.readable = true;
      stream.writable = false;
      if ("function" !== typeof func)
        throw new Error("event-stream.readable expects async function");
      stream.on("end", function() {
        ended = true;
      });
      function get(err, data) {
        if (err) {
          stream.emit("error", err);
          if (!continueOnError)
            stream.emit("end");
        } else if (arguments.length > 1)
          stream.emit("data", data);
        immediately(function() {
          if (ended || paused || reading)
            return;
          try {
            reading = true;
            func.call(stream, i++, function() {
              reading = false;
              get.apply(null, arguments);
            });
          } catch (err2) {
            stream.emit("error", err2);
          }
        });
      }
      stream.resume = function() {
        paused = false;
        get();
      };
      process.nextTick(get);
      stream.pause = function() {
        paused = true;
      };
      stream.destroy = function() {
        stream.emit("end");
        stream.emit("close");
        ended = true;
      };
      return stream;
    };
    es.mapSync = function(sync) {
      return es.through(function write(data) {
        var mappedData;
        try {
          mappedData = sync(data);
        } catch (err) {
          return this.emit("error", err);
        }
        if (mappedData !== void 0)
          this.emit("data", mappedData);
      });
    };
    es.filterSync = function(test) {
      return es.through(function(data) {
        var s = this;
        if (test(data)) {
          s.queue(data);
        }
      });
    };
    es.flatmapSync = function(mapper) {
      return es.through(function(data) {
        var s = this;
        data.forEach(function(e) {
          s.queue(mapper(e));
        });
      });
    };
    es.log = function(name) {
      return es.through(function(data) {
        var args = [].slice.call(arguments);
        if (name)
          console.error(name, data);
        else
          console.error(data);
        this.emit("data", data);
      });
    };
    es.child = function(child) {
      return es.duplex(child.stdin, child.stdout);
    };
    es.parse = function(options) {
      var emitError = !!(options ? options.error : false);
      return es.through(function(data) {
        var obj;
        try {
          if (data)
            obj = JSON.parse(data.toString());
        } catch (err) {
          if (emitError)
            return this.emit("error", err);
          return console.error(err, "attempting to parse:", data);
        }
        if (obj !== void 0)
          this.emit("data", obj);
      });
    };
    es.stringify = function() {
      var Buffer2 = require("buffer").Buffer;
      return es.mapSync(function(e) {
        return JSON.stringify(Buffer2.isBuffer(e) ? e.toString() : e) + "\n";
      });
    };
    es.replace = function(from2, to) {
      return es.pipeline(es.split(from2), es.join(to));
    };
    es.join = function(str) {
      if ("function" === typeof str)
        return es.wait(str);
      var first = true;
      return es.through(function(data) {
        if (!first)
          this.emit("data", str);
        first = false;
        this.emit("data", data);
        return true;
      });
    };
    es.wait = function(callback2) {
      var arr = [];
      return es.through(
        function(data) {
          arr.push(data);
        },
        function() {
          var body = Buffer.isBuffer(arr[0]) ? Buffer.concat(arr) : arr.join("");
          this.emit("data", body);
          this.emit("end");
          if (callback2)
            callback2(null, body);
        }
      );
    };
    es.pipeable = function() {
      throw new Error("[EVENT-STREAM] es.pipeable is deprecated");
    };
  }
});

// node_modules/dbus-native/index.js
var require_dbus_native = __commonJS({
  "node_modules/dbus-native/index.js"(exports2, module2) {
    var EventEmitter = require("events").EventEmitter;
    var net = require("net");
    var constants = require_constants2();
    var message = require_message2();
    var clientHandshake = require_handshake3();
    var serverHandshake = require_server_handshake();
    var MessageBus = require_bus2();
    var server = require_server();
    function createStream(opts) {
      if (opts.stream)
        return opts.stream;
      var host = opts.host;
      var port = opts.port;
      var socket = opts.socket;
      if (socket)
        return net.createConnection(socket);
      if (port)
        return net.createConnection(port, host);
      var busAddress = opts.busAddress || process.env.DBUS_SESSION_BUS_ADDRESS;
      if (!busAddress)
        throw new Error("unknown bus address");
      var addresses = busAddress.split(";");
      for (var i = 0; i < addresses.length; ++i) {
        var address = addresses[i];
        var familyParams = address.split(":");
        var family = familyParams[0];
        var params = {};
        familyParams[1].split(",").map(function(p) {
          var keyVal = p.split("=");
          params[keyVal[0]] = keyVal[1];
        });
        try {
          switch (family.toLowerCase()) {
            case "tcp":
              host = params.host || "localhost";
              port = params.port;
              return net.createConnection(port, host);
            case "unix":
              if (params.socket)
                return net.createConnection(params.socket);
              if (params.abstract) {
                var abs = require("abstract-socket");
                return abs.connect("\0" + params.abstract);
              }
              if (params.path)
                return net.createConnection(params.path);
              throw new Error(
                "not enough parameters for 'unix' connection - you need to specify 'socket' or 'abstract' or 'path' parameter"
              );
            case "unixexec":
              var eventStream = require_event_stream2();
              var spawn = require("child_process").spawn;
              var args = [];
              for (var n = 1; params["arg" + n]; n++)
                args.push(params["arg" + n]);
              var child = spawn(params.path, args);
              return eventStream.duplex(child.stdin, child.stdout);
            default:
              throw new Error("unknown address type:" + family);
          }
        } catch (e) {
          if (i < addresses.length - 1) {
            console.warn(e.message);
            continue;
          } else {
            throw e;
          }
        }
      }
    }
    function createConnection(opts) {
      var self = new EventEmitter();
      if (!opts)
        opts = {};
      var stream = self.stream = createStream(opts);
      stream.setNoDelay();
      stream.on("error", function(err) {
        self.emit("error", err);
      });
      stream.on("end", function() {
        self.emit("end");
        self.message = function() {
          console.warn("Didn't write bytes to closed stream");
        };
      });
      self.end = function() {
        stream.end();
        return self;
      };
      var handshake = opts.server ? serverHandshake : clientHandshake;
      handshake(stream, opts, function(error, guid) {
        if (error) {
          return self.emit("error", error);
        }
        self.guid = guid;
        self.emit("connect");
        message.unmarshalMessages(
          stream,
          function(message2) {
            self.emit("message", message2);
          },
          opts
        );
      });
      self._messages = [];
      self.message = function(msg) {
        self._messages.push(msg);
      };
      self.once("connect", function() {
        self.state = "connected";
        for (var i = 0; i < self._messages.length; ++i) {
          stream.write(message.marshall(self._messages[i]));
        }
        self._messages.length = 0;
        self.message = function(msg) {
          stream.write(message.marshall(msg));
        };
      });
      return self;
    }
    module2.exports.createClient = function(params) {
      var connection = createConnection(params || {});
      return new MessageBus(connection, params || {});
    };
    module2.exports.systemBus = function() {
      return module2.exports.createClient({
        busAddress: process.env.DBUS_SYSTEM_BUS_ADDRESS || "unix:path=/var/run/dbus/system_bus_socket"
      });
    };
    module2.exports.sessionBus = function(opts) {
      return module2.exports.createClient(opts);
    };
    module2.exports.messageType = constants.messageType;
    module2.exports.createConnection = createConnection;
    module2.exports.createServer = server.createServer;
  }
});

// server/player.js
var dbus, dbusnative, MediaPlayer, player_default;
var init_player = __esm({
  "server/player.js"() {
    dbus = require_dbus_next();
    dbusnative = require_dbus_native();
    MediaPlayer = class {
      constructor() {
        this.serviceName = null;
        this.player = null;
        this.playerObject = null;
        this.playerObjectProperties = null;
        this.sessionBus = dbus.sessionBus();
        this.serviceNameBus = dbusnative.sessionBus();
        this.connecting = false;
        this.connected = false;
        this.playerInitTimeout = 1e3;
        this.getSeekTimeCounterer = 6;
      }
      async detectMediaPlayer(callback2) {
        const mediaPlayerPrefixes = [
          "org.mpris.MediaPlayer2.spotify",
          "org.mpris.MediaPlayer2.firefox.instance_",
          "org.mpris.MediaPlayer2.chromium.instance_",
          "org.mpris.MediaPlayer2.google-chrome.instance_"
        ];
        this.serviceNameBus.listNames(async (err, names) => {
          if (err)
            return callback2(err);
          for (const prefix2 of mediaPlayerPrefixes) {
            const playerName = await names.find((name) => name.startsWith(prefix2));
            if (playerName) {
              console.log("Found media player:", playerName);
              this.serviceName = playerName;
              return callback2(null);
            }
          }
        });
      }
      // Connect to the media player service and get the player interface
      async connect(callback2) {
        if (this.connecting) {
          return callback2(new Error("Already connecting to media player."));
        }
        if (this.connected) {
          console.log("Already connected, refreshing player...");
          this.player = null;
        }
        this.connecting = true;
        console.log("Connecting to media player...");
        if (!this.serviceName) {
          await this.detectMediaPlayer((err) => {
            if (err) {
              this.connecting = false;
              throw err;
            }
            this.connectToService(callback2);
          });
        } else
          this.connectToService(callback2);
      }
      async connectToService(callback2) {
        try {
          const object = await this.sessionBus.getProxyObject(this.serviceName, "/org/mpris/MediaPlayer2");
          this.player = await object.getInterface("org.mpris.MediaPlayer2.Player");
          this.playerObject = object;
          this.playerObjectProperties = await object.getInterface("org.freedesktop.DBus.Properties");
          this.connecting = false;
          return setTimeout(() => {
            callback2(null);
          }, this.playerInitTimeout);
        } catch (err) {
          return callback2(err);
        }
      }
      // Ensure player is connected
      async ensureConnection(callback2) {
        await this.connect(callback2);
      }
      /**
       * @param {*} callback - Callback function returning a true or false error bool and a JSON array containing the following: 
       * @param {String} album
       * @param {Array} artist
       * @param {String} track_name
       * @param {String} thumbnail 
       * @param {Boolean} is_playing
       * @param {Number} volume
       * @param {Boolean} shuffle_state
       * @param {String} repeat_state
       * @param {Number} track_progress
       * @param {Number} track_duration
       * @param {Boolean} can_skip
       * @param {Boolean} can_play
       * @param {Boolean} can_pause
       * @param {Boolean} can_go_previous
       * @param {Boolean} can_fast_forward
       * @param {Boolean} can_change_volume
       * @param {Boolean} can_like - Unsupported at the moment, returns false
         @param {Boolean} can_set_output - Unsupported at the moment, returns false
       * @param {null} playlist - Unsupported at the moment, returns null
       * @param {null} playlist_id - Unsupported at the moment, returns null
      */
      // don't ask me why I made this jsdoc but I did 
      async getMetadata(callback2) {
        const result = {};
        this.ensureConnection(async (err) => {
          if (err) {
            return callback2(err);
          }
          console.log(await this.playerObjectProperties.Get("org.mpris.MediaPlayer2.Player", "Metadata"));
          const player = this.playerObjectProperties;
          const getData = (interfaceName, property, key) => {
            result[key] = player.Get(interfaceName, property).value;
            return result[key];
          };
          function appendPermanentVariables() {
            result["playlist"] = null;
            result["playlist_id"] = null;
            result["can_fast_forward"] = false;
            result["can_like"] = false;
            result["can_change_volume"] = true;
            result["can_set_output"] = false;
          }
          ;
          appendPermanentVariables();
          async function customGetterFunctions() {
            const playBackStatus = await player.Get("org.mpris.MediaPlayer2.Player", "PlaybackStatus");
            try {
              if (playBackStatus.value == "Playing") {
                result["is_playing"] = true;
              } else {
                result["is_playing"] = false;
              }
            } catch (err2) {
              console.log(err2);
            }
            const metaData = await player.Get("org.mpris.MediaPlayer2.Player", "Metadata");
            try {
              result["album"] = metaData.value["xesam:album"].value;
              result["artist"] = metaData.value["xesam:artist"].value;
              result["track_name"] = metaData.value["xesam:title"].value;
              result["thumbnail"] = metaData.value["mpris:artUrl"].value;
              result["track_progress"] = metaData.value["mpris:length"].value;
            } catch (err2) {
              console.log(err2);
            }
          }
          await customGetterFunctions();
          await getData("org.mpris.MediaPlayer2.Player", "CanGoNext", "can_skip");
          await getData("org.mpris.MediaPlayer2.Player", "CanPlay", "can_play");
          await getData("org.mpris.MediaPlayer2.Player", "CanPause", "can_pause");
          await getData("org.mpris.MediaPlayer2.Player", "CanGoPrevious", "can_go_previous");
          await getData("org.mpris.MediaPlayer2.Player", "Position", "track_progress");
          await getData("org.mpris.MediaPlayer2.Player", "LoopStatus", "repeat_state");
          await getData("org.mpris.MediaPlayer2.Player", "Shuffle", "shuffle_state");
          await getData("org.mpris.MediaPlayer2.Player", "CanSeek", "can_seek");
          await getData("org.mpris.MediaPlayer2.Player", "CanControl", "can_control");
          await getData("org.mpris.MediaPlayer2.Player", "Volume", "volume");
          await getData("org.mpris.MediaPlayer2.Player", "Rate", "playback_rate");
          setTimeout(() => {
            callback2(null, result);
          }, 1e3);
        });
      }
      async getSongId(returnRawObject) {
        this.ensureConnection(async (err) => {
          if (err) {
            console.log(err);
            return err;
          }
          const result = await this.playerObjectProperties.Get("org.mpris.MediaPlayer2.Player", "Metadata");
          if (returnRawObject)
            return result.value["mpris:trackid"];
          return result.value["mpris:trackid"].value.split("/").pop();
        });
      }
      async getCurrentPlaybackPos() {
        const result = await this.playerObjectProperties.Get("org.mpris.MediaPlayer2.Player", "Position");
        return result.value;
      }
      // Control playback
      play(callback2) {
        this.ensureConnection((err) => {
          if (err) {
            if (callback2) {
              return callback2(err);
            }
            return err;
          }
          try {
            this.player.Play();
            callback2(null);
          } catch (e) {
            callback2(e);
          }
        });
      }
      pause(callback2) {
        this.ensureConnection((err) => {
          if (err) {
            if (callback2) {
              return callback2(err);
            }
            return err;
          }
          try {
            this.player.Pause();
          } catch (e) {
            callback2(e);
          }
        });
      }
      stop(callback2) {
        this.ensureConnection((err) => {
          if (err) {
            if (callback2) {
              return callback2(err);
            }
            return err;
          }
          try {
            this.player.Stop();
          } catch (e) {
            console.log(e);
            callback2(e);
          }
        });
      }
      next(callback2) {
        this.ensureConnection(async (err) => {
          if (err) {
            if (callback2) {
              return callback2(err);
            }
            return err;
          }
          try {
            await this.player.Next();
            callback2(null, await this.getSongId());
          } catch (e) {
            console.log(e);
            callback2(e);
          }
        });
      }
      previous(callback2) {
        this.ensureConnection((err) => {
          if (err) {
            if (callback2) {
              return callback2(err);
            }
            return err;
          }
          try {
            this.player.Previous();
          } catch (e) {
            console.log(e);
            callback2(e);
          }
        });
      }
      /**
       * @param offset - Integer to seek forward or backwards in ms
       * @param callback - Callback function
       */
      seek(seekTime, callback2) {
        this.ensureConnection(async (err) => {
          if (err) {
            if (callback2) {
              return callback2(err);
            }
            return err;
          }
          console.log(seekTime);
          const newSeekTime = BigInt(seekTime);
          try {
            const currentSeekTime = BigInt(await this.getCurrentPlaybackPos()) / BigInt(1e3);
            if (newSeekTime < currentSeekTime) {
              const difference = currentSeekTime - newSeekTime - BigInt(this.getSeekTimeCounterer);
              this.player.Seek(-difference * BigInt(1e3));
            } else {
              this.player.Seek(newSeekTime * BigInt(1e3));
            }
          } catch (e) {
            console.log(e);
            callback2(e);
          }
        });
      }
      getVol(callback2) {
        let response;
        this.ensureConnection(async (err) => {
          if (err) {
            if (callback2) {
              return callback2(err);
            }
            return err;
          }
          response = await this.playerObjectProperties.Get("org.mpris.MediaPlayer2.Player", "Volume");
          console.log(response.value);
          if (callback2)
            return callback2(null, response.value * 100);
        });
      }
      setVol(volume, callback2) {
        this.ensureConnection(async (err) => {
          if (err) {
            if (callback2) {
              return callback2(err);
            }
            return err;
          }
          const vol = new dbus.Variant("d", volume / 100);
          const response = await this.playerObjectProperties.Set("org.mpris.MediaPlayer2.Player", "Volume", vol);
          if (callback2)
            return callback2(null, response);
          return;
        });
      }
      setRepeat(state) {
        this.ensureConnection(async (err) => {
          if (err) {
            if (callback) {
              return callback(err);
            }
            return err;
          }
          let currentState;
          try {
            switch (state) {
              case "off":
                currentState = "None";
                break;
              case "track":
                currentState = "Track";
                break;
              case "all":
                currentState = "Playlist";
                break;
              default:
                break;
            }
            this.playerObjectProperties.Set("org.mpris.MediaPlayer2.Player", "LoopStatus", new dbus.Variant("s", currentState));
            return true;
          } catch (e) {
            console.log(e);
          }
        });
      }
      setShuffle(state) {
        this.ensureConnection(async (err) => {
          if (err) {
            if (callback) {
              return callback(err);
            }
            return err;
          }
          try {
            this.playerObjectProperties.Set("org.mpris.MediaPlayer2.Player", "Shuffle", new dbus.Variant("b", state));
            return true;
          } catch (e) {
            console.log(e);
          }
        });
      }
    };
    player_default = MediaPlayer;
  }
});

// server/linuxplayer.js
var linuxplayer_exports = {};
__export(linuxplayer_exports, {
  linuxPlayer: () => linuxPlayer
});
var linuxPlayer;
var init_linuxplayer = __esm({
  "server/linuxplayer.js"() {
    init_player();
    linuxPlayer = class {
      constructor() {
        this.player = new player_default();
      }
      async returnSongData(DeskThing2, isRefresh) {
        try {
          let data = [];
          await this.player.getMetadata(async (err, result) => {
            data["album"] = result["album"];
            data["artist"] = result["artist"];
            data["track_name"] = result["track_name"];
            data["thumbnail"] = await this.processThumbnail(result["thumbnail"], DeskThing2);
            data["is_playing"] = result["is_playing"];
            data["can_skip"] = result["can_skip"];
            data["can_play"] = result["can_play"];
            data["can_pause"] = result["can_pause"];
            data["can_go_previous"] = result["can_go_previous"];
            data["playlist"] = result["playlist"];
            data["playlist_id"] = result["playlist_id"];
            data["volume"] = result["volume"];
            data["can_fast_forward"] = result["can_fast_forward"];
            data["can_like"] = result["can_like"];
            data["can_change_volume"] = result["can_change_volume"];
            data["can_set_output"] = result["can_set_output"];
            data["shuffle_state"] = result["shuffle_state"];
            data["repeat_state"] = result["repeat_state"];
            data["track_progress"] = result["track_progress"];
            data["track_duration"] = result["track_duration"];
            if (isRefresh) {
              DeskThing2.sendDataToClient({ app: "client", type: "refresh", payload: data });
              return;
            }
            DeskThing2.sendDataToClient({ app: "client", type: "song", payload: data });
          });
        } catch (error) {
          return false;
        }
      }
      async processThumbnail(thumbnail, DeskThing2) {
        const result = await DeskThing2.encodeImageFromUrl(thumbnail, "jpeg");
        return result;
      }
      async checkForRefresh(DeskThing2) {
        await this.returnSongData(DeskThing2, true);
      }
      async getSetVolume(args) {
        return new Promise((resolve, reject) => {
          if (!args) {
            const response = this.player.getVol((err, response2) => {
              if (err)
                reject(err);
              return response2;
            });
            resolve(response);
          } else {
            this.player.setVol(args, (err) => {
              if (err)
                reject(err);
            });
            resolve(true);
          }
        });
      }
      async getVolumeInfo() {
        return await this.getSetVolume();
      }
      async next(id) {
        this.player.next((err) => {
          if (err) {
            console.log(err);
            throw new Error("An error occured while skipping the track: " + err);
          }
        });
      }
      async previous(args) {
        return this.player.previous((err) => {
          if (err) {
            console.log(err);
            throw new Error("An error occured while going to previous track: " + err);
          }
        });
      }
      async fastForward(seconds) {
        return this.player.seek(seconds * 1e6);
      }
      async rewind(seconds) {
        return this.player.seek(-seconds * 1e6);
      }
      async play(args) {
        return this.player.play((err) => {
          if (err) {
            console.log(err);
            throw new Error("An error occured while playing the track: " + err);
          }
        });
      }
      async pause(args) {
        return this.player.pause((err) => {
          if (err) {
            console.log(err);
            throw new Error("An error occured while pausing: " + err);
          }
        });
      }
      async stop(args) {
        return this.player.stop((err) => {
          if (err) {
            console.log(err);
            throw new Error("An error occured while stopping: " + err);
          }
        });
      }
      async seek(trackid, positionMs) {
        return this.player.seek(trackid, positionMs);
      }
      async volume(volumePercentage) {
        this.getSetVolume(volumePercentage);
        return true;
      }
      async repeat(state) {
        this.player.setRepeat(state);
        return true;
      }
      async shuffle(state) {
        this.player.setShuffle(state);
      }
    };
  }
});

// server/index.ts
var server_exports = {};
__export(server_exports, {
  DeskThing: () => DeskThing
});
module.exports = __toCommonJS(server_exports);
var import_deskthing_server = __toESM(require_dist(), 1);
var import_os = __toESM(require("os"), 1);
var DeskThing = import_deskthing_server.DeskThing.getInstance();
var platform = import_os.default.platform();
var mediaPlayer;
var switchPlatform = async () => {
  let result;
  if (platform == "win32") {
    const { winPlayer: winPlayer2 } = await Promise.resolve().then(() => (init_winplayer(), winplayer_exports));
    result = new winPlayer2(DeskThing);
  } else if (platform == "linux") {
    const { linuxPlayer: linuxPlayer2 } = await Promise.resolve().then(() => (init_linuxplayer(), linuxplayer_exports));
    result = new linuxPlayer2();
  } else {
    console.warn("GMP APP: Unsupported platform, assuming linux.");
    const { linuxPlayer: linuxPlayer2 } = await Promise.resolve().then(() => (init_linuxplayer(), linuxplayer_exports));
    result = new linuxPlayer2();
  }
  return result;
};
var start = async () => {
  mediaPlayer = await switchPlatform();
  let Data = await DeskThing.getData();
  DeskThing.on("data", (newData) => {
    Data = newData;
    if (Data) {
      console.log(Data);
    }
  });
  if (!Data.settings?.change_source) {
    const settings = {
      "change_source": {
        "value": "true",
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
      }
    };
    DeskThing.addSettings(settings);
  }
  DeskThing.on("get", handleGet);
  DeskThing.on("set", handleSet);
};
DeskThing.on("start", start);
var handleGet = async (data) => {
  console.log("Receiving Get Data", data);
  if (data == null) {
    DeskThing.sendError("No args provided");
    return;
  }
  let response;
  let artUrl;
  console.log(data);
  switch (data.request) {
    case "song":
      await mediaPlayer.returnSongData(DeskThing);
      break;
    case "refresh":
      await mediaPlayer.checkForRefresh(DeskThing);
      break;
    default:
      DeskThing.sendError(`Unknown request: ${data.request}`);
      break;
  }
};
var handleSet = async (data) => {
  if (data == null) {
    DeskThing.sendError("No args provided");
    return;
  }
  DeskThing.sendLog("Receiving Set Data" + data);
  console.log("Receiving Set Data", data);
  let response;
  switch (data.request) {
    case "next":
      response = await mediaPlayer.next(data.payload);
      if (!response == false) {
        response = { app: "client", type: "song", payload: response };
        DeskThing.sendDataToClient(response);
      }
      break;
    case "previous":
      response = await mediaPlayer.previous();
      break;
    case "fast_forward":
      response = await mediaPlayer.fastForward(data.payload);
      break;
    case "rewind":
      response = await mediaPlayer.rewind(data.payload);
      break;
    case "play":
      response = await mediaPlayer.play(data.payload);
      break;
    case "pause":
    case "stop":
      response = await mediaPlayer.pause();
      break;
    case "seek":
      response = await mediaPlayer.seek(data.payload);
      break;
    case "like":
      response = "Unable to like songs!";
      break;
    case "volume":
      response = await mediaPlayer.volume(data.payload);
      break;
    case "repeat":
      response = await mediaPlayer.repeat(data.payload);
      break;
    case "shuffle":
      response = await mediaPlayer.shuffle(data.payload);
      break;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DeskThing
});
/*! Bundled license information:

sax/lib/sax.js:
  (*! http://mths.be/fromcodepoint v0.1.0 by @mathias *)

safe-buffer/index.js:
  (*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> *)
*/

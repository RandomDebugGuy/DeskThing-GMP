import { SocketData, EventTypes } from './types';
type EventCallback = (data: any) => void;
export declare class DeskThing {
    private static instance;
    private listeners;
    /**
     * Initializes the DeskThing instance and sets up event listeners.
     * Sends a message to the parent indicating that the client has started.
     * Also sets up a click event listener for buttons.
     */
    constructor();
    /**
     * Initializes the message event listener.
     * @private
     */
    private initialize;
    /**
     * Singleton pattern: Ensures only one instance of DeskThing exists.
     * @returns {DeskThing} The single instance of DeskThing
     *
     * @example
     * const deskThing = DeskThing.getInstance();
     */
    static getInstance(): DeskThing;
    /**
     * Registers an event listener for a specific event type.
     * @param {EventTypes} event - The type of event to listen for
     * @param {EventCallback} callback - The function to call when the event occurs
     * @returns {Function} A function to remove the event listener
     *
     * @example
     * const removeListener = deskThing.on('message', (data) => {
     *   console.log('Received message:', data);
     * });
     */
    on(event: EventTypes, callback: EventCallback): () => void;
    /**
     * Removes an event listener for a specific event type.
     * @param {EventTypes} event - The type of event to remove the listener from
     * @param {EventCallback} callback - The function to remove from the listeners
     *
     * @example
     * deskThing.off('message', messageCallback);
     */
    off(event: EventTypes, callback: EventCallback): void;
    /**
     * Handles incoming messages from the parent window.
     * @param {MessageEvent} event - The message event received
     * @private
     */
    private handleMessage;
    /**
     * Emits an event to all registered listeners for that event type.
     * @param {AppTypes | EventTypes} event - The type of event to emit
     * @param {SocketData} data - The data to pass to the event listeners
     * @returns {Promise<void>}
     * @private
     */
    private emit;
    /**
     * Sends a message to the parent window.
     * @param {SocketData} data - The data to send to the parent. "app" defaults to the current app
     *
     * @example
     * deskThing.sendMessageToParent({
     *   app: 'client',
     *   type: 'action',
     *   payload: { buttonClicked: 'submit' }
     * });
     */
    sendMessageToParent(data: SocketData): void;
}
declare const _default: DeskThing;
export default _default;

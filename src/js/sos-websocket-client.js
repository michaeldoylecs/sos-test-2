/**
 * SOSWebSocketClient connects to and handles messages from the websocket server
 * ran by the SOS BakkesMod plugin.
 */
class SOSWebSocketClient {
    #channels = {};
    #socket = null;

    constructor() {
        this.#channels = {};
        this.socket = null;
    }

    /**
     * Initialize the websocket connection for the given URI.
     * 
     * The connection will continuously retry to connect on failed connections.
     * 
     * @param {string} uri
     * @param {int} seconds_until_retry The number of seconds to wait until
     *                                  retrying a failed connection
     */
    init(uri, seconds_until_retry = 3) {
        if (uri == null || typeof(uri) !== "string") {
            throw new TypeError("Type of 'uri' parameter must be 'string'");
        }
        if (seconds_until_retry == null || typeof(seconds_until_retry) !== "number") {
            throw new TypeError("Type of 'channel' parameter must be 'number'");
        }

        // Initialize websocket connection
        this.socket = new WebSocket(uri);
        this.socket.onmessage = (event) => {
            try {
                // Parse and validate message into JSON
                let message = JSON.parse(event.data);
                const {is_valid, error_message} = __validateWebsocketJSONFormat(message);
                if (!is_valid) {
                    console.error(error_message);
                    return;
                }

                // Parse message into 'channel', 'event', and 'data' parts.
                const data = message.data;
                const [channel, rl_event] = message.event.split(':');

                // Trigger callbacks with parsed information.
                this.#triggerCallbacks(channel, rl_event, data);

            } catch (error) {
                console.error(error);
                return;
            }
            
        }
    }

    /**
     * Add a webhook subscription to listen to a particular channel:event pair and then execute
     * 
     * 
     * @param {channel: string, event: string, callback: function} subscriptionDetails
     *      channel     - A string name of a message channel
     *      event       - A string name of an event in a channel
     *      callback    - A function to be called when a channel:event is fired.
     *                    The function should expect a single parameter of a 'data' object.
     */
    subscribe({channel, event, callback}) {
        if (channel == null || typeof(channel) !== "string") {
            throw new TypeError("Type of 'channel' parameter must be 'string'");
        }
        if (event == null || typeof(event) !== "string") {
            throw new TypeError("Type of 'event' parameter must be 'string'");
        }
        if (callback == null || typeof(callback) !== "function") {
            throw new TypeError("Type of 'callback' parameter must be 'function'");
        }

        // Add channel to manager if it does not exist
        if (!this.#channels.hasOwnProperty(channel)) {
            this.#channels[channel] = {};
        }

        // Add event to the given channel if it does not exist
        if (!this.#channels[channel].hasOwnProperty(event)) {
            this.#channels[channel][event] = [];
        }

        // Finally, add the given callback function to the specified event
        this.#channels[channel][event].push(callback);
    }

    /**
     * Trigger all callbacks for a given channel:event
     * 
     * @param {string}  channel - A string name of a message channel
     * @param {string}  event   - A string name of an event in a channel
     * @param {*}       data    - The data to be passed to the callback functions
     */
    #triggerCallbacks(channel, event, data) {
        if (channel == null || typeof(channel) !== "string") {
            throw new TypeError("Type of 'channel' parameter must be 'string'");
        }
        if (event == null || typeof(event) !== "string") {
            throw new TypeError("Type of 'event' parameter must be 'string'");
        }

        // Verify that channel exists
        if (!this.#channels.hasOwnProperty(channel)) {
            console.error(`[triggerCallbacks]: channel '${channel}' does not exist`);
        }

        // Verify that event exists
        if (!this.#channels[channel].hasOwnProperty(event)) {
            console.error(
                `[triggerCallbacks]: Event '${event}' does not exist in channel '${channel}'`
            );
        }

        // Execute all callback functions for channel:event
        for (let callback of this.#channels[channel][event]) {
            if (callback instanceof Function) {
                callback(data);
            }
        }
    }

}

/**
 * Validates a websocket message to follow the format of:
 * {
 *     "data": <any value>,
 *     "event": <string of format 'channel:event'>
 * }
 * 
 * @returns {is_valid: boolean, error_message: string} MessageFormatDetails
 *      is_valid        - Whether or not the message is of valid format.
 *      error_message   - An error message if the message is an invalid format.
 *                        Empty string if message is valid.
 */
function __validateWebsocketJSONFormat(message) {
    // Validate incoming message properly parses into an object
    if (!(message instanceof Object)) {
        return {
            is_valid: false,
            error_message: 'Received message was not an object.',
        };
    }
    
    // Validate that message object has expected fields
    if (
        !message.hasOwnProperty('data')
        || !message.hasOwnProperty('event')
    ) {
        return {
            is_valid: false,
            error_message: 'Received message did not have expected fields.',
        };
    }

    // Validate that message 'event' field is formatted properly
    const formatRegex = /.*:.*/
    if (!formatRegex.test(message.event)) {
        return {
            is_valid: false,
            error_message: 'Received message event field has invalid format.',
        };
    }

    return {
        is_valid: true,
        error_message: '',
    };
}
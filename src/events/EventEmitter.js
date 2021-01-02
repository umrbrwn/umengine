/**
 * Event emitter object that registers listeners of system events
 * and provides api to emit events which call the registered listeners
 */
export class EventEmitter {
    constructor() {
        /** 
         * List of events and their listeners, each event has a unique 
         * name which can have more than one listeners
         */
        this.events = new Map();
    }

    /**
     * Bind callbacks to the events
     * @param {String} eventName name of the event
     * @param {Function} listener event handling callback or listeners
     */
    on(eventName, listener) {
        if (!this.events.has(eventName)) {
            this.events.set(eventName, []);
        }
        this.events.get(eventName).push(listener);
    }

    /**
     * Triggers the registered callbacks of an event
     * @param {String} eventName name of the event
     * @param {Object} eventArgs event arguments
     */
    emit(eventName, eventArgs) {
        const listeners = this.events.get(eventName);
        if (listeners === undefined || listeners.length === 0) {
            return;
        }
        listeners.forEach(listener => listener(eventArgs));
    }

    /** Clears the registered events and their listeners */
    clear() {
        this.events.clear();
    }
}

// singleton of the event emitter
const eventEmitter = new EventEmitter();
Object.freeze(eventEmitter);
export default eventEmitter;
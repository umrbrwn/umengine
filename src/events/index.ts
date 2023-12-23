import EventEmitter from './EventEmitter';

// singleton of the event emitter
const eventEmitter = new EventEmitter();
Object.freeze(eventEmitter);
export default eventEmitter;

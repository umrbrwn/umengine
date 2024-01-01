type EventListener = (event: any) => void;
type EventListeners = Map<number, EventListener>;

export class EventEmitter {
  /**
   * List of events and their listeners, each event has a unique
   * name which can have more than one listeners
   */
  events = new Map<string, EventListeners>();

  private counter = 0;

  /** Add listener to an event */
  on(eventName: string, listener: EventListener) {
    if (!this.events.has(eventName)) {
      this.events.set(eventName, new Map());
    }
    const listenerId = ++this.counter;
    this.events.get(eventName)!.set(listenerId, listener);
    return listenerId;
  }

  /** Emit event to all listeners of an event */
  emit(eventName: string, eventArgs: any) {
    const listeners = this.events.get(eventName);
    if (listeners === undefined || listeners.size === 0) {
      return;
    }
    listeners.forEach((listener, listenerId) => {
      try {
        listener(eventArgs);
      } catch (error) {
        console.error(`Listener ${listenerId} encountered an error in handling the event "${eventName}".`);
      }
    });
  }

  /** Remove an event listener */
  off(eventName: string, listenerId: number) {
    return this.events.get(eventName)?.delete(listenerId);
  }
}

type EventHandler = (pressed: boolean) => void;

/** Handle key input events */
export class KeyEventHandler {
  /** Keys currently pressed */
  private pressedKeys = new Map<string, boolean>();

  /** Key input handler */
  private handlers = new Map<string, EventHandler>();

  constructor(source: EventTarget) {
    this.listenTo(source);
  }

  /**
   * Add input handler for a key code
   * @param code key code from click event
   * @param handler key input handler
   */
  addHandler(code: string, handler: EventHandler) {
    this.handlers.set(code, handler);
  }

  /** Handle input event using the added key code mapping */
  private handleEvent(event: KeyboardEvent) {
    const { code } = event;
    if (!this.handlers.has(code)) {
      return;
    }
    event.preventDefault();
    const pressed = event.type === 'keydown';
    if (this.pressedKeys.get(code) === pressed) {
      return;
    }
    this.pressedKeys.set(code, pressed);

    // call key event handler
    const handler = this.handlers.get(code)!;
    handler(pressed);
  }

  /** Register input events */
  private listenTo(source: EventTarget) {
    ['keydown', 'keyup'].forEach((eventName) => {
      source.addEventListener(eventName, (event) => this.handleEvent(event as KeyboardEvent));
    });
  }
}

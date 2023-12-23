type KeyInputHandler = (pressed: boolean) => void;

/** Keyboard input handlers and input state manager */
export default class InputStateManager {
  /** Collection of input key states */
  private pressedKeys = new Map<string, boolean>();

  /** Input key code and event handler collection */
  private keyMap = new Map<string, KeyInputHandler>();

  /**
   * Add input handlers for key code
   * @param code key code from click event
   * @param handler click handler
   */
  addMapping(code: string, handler: KeyInputHandler) {
    this.keyMap.set(code, handler);
  }

  /**
   * Handle input event using the added key code mapping
   * @param event input event
   */
  handleEvent(event: KeyboardEvent) {
    const { code } = event;
    if (!this.keyMap.has(code)) {
      return;
    }

    event.preventDefault();

    const pressed = event.type === 'keydown';
    if (this.pressedKeys.get(code) === pressed) {
      return;
    }
    this.pressedKeys.set(code, pressed);

    // call key event handler
    this.keyMap.get(code)!(pressed);
  }

  /**
   * Add source of input events
   * @param source DOM element to act as input source
   */
  listenTo(source: HTMLElement) {
    ['keydown', 'keyup'].forEach((eventName) => {
      source.addEventListener(eventName, (event) => this.handleEvent(event as KeyboardEvent));
    });
  }
}

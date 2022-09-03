import KeyboardState from './KeyboardState';

/**
 * Input manager to set key mappings and route inputs to
 * objects having component InputReceptor
 */
export default class InputManager {
  keyboard = new KeyboardState();

  listeners: IGameObject[] = [];

  constructor(source: HTMLElement) {
    this.keyboard.listenTo(source);
  }

  /**
   * Set key mappings
   * @param mapping JSON object containing key codes and input key names
   */
  setKeyMapping(mapping: any) {
    Object.keys(mapping).forEach((key) => {
      this.keyboard.addMapping(mapping[key], (state) => this.handleKeyInput(key, state));
    });
  }

  /**
   * Handle input events
   * @param key key code of clicked button
   * @param state state of clicked key, it is 1 when key
   * is pressed and 0 when released
   */
  private handleKeyInput(key: string, state: number) {
    /* eslint-disable @typescript-eslint/dot-notation */
    if (state) {
      this.listeners.forEach((listener) => listener['input']?.add(key));
    } else {
      this.listeners.forEach((listener) => listener['input']?.remove(key));
    }
    /* eslint-enable @typescript-eslint/dot-notation */
  }
}

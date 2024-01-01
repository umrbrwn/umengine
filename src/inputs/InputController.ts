import { InputKeymap } from '../types';

const AxisMap = { X: ['A', 'D', 'LEFT', 'RIGHT'], Y: ['W', 'S', 'UP', 'DOWN'] };
const DirectionMap = { '': 0, A: -1, LEFT: -1, D: 1, RIGHT: 1, W: 1, UP: 1, S: -1, DOWN: -1 };

/** Handle key input events */
export class InputController {
  /** Key codes currently pressed */
  private readonly pressedKeys = new Set<string>();

  /** Key code that's just released */
  private releasedKey?: string;

  constructor(
    private readonly source: EventTarget,
    private readonly keymap: InputKeymap,
  ) {
    this.addHandlers();
  }

  isKeyDown(key: string) {
    return this.pressedKeys.has(key);
  }

  isKeyUp(key: string) {
    return this.releasedKey === key;
  }

  getAxis(axis: 'X' | 'Y'): number {
    const keys = AxisMap[axis];
    const match = keys.find((k) => this.pressedKeys.has(k)) || '';
    return DirectionMap[match];
  }

  removeHandlers() {
    this.source.removeEventListener('keydown', ({ code }: KeyboardEvent) => this.addKey(code));
    this.source.removeEventListener('keyup', ({ code }: KeyboardEvent) => this.removeKey(code));
  }

  postUpdate() {
    this.releasedKey = undefined;
  }

  private addKey(code: string) {
    const key = this.keymap[code];
    this.pressedKeys.add(key);
  }

  private removeKey(code: string) {
    const key = this.keymap[code];
    this.pressedKeys.delete(key);
    this.releasedKey = key;
  }

  private addHandlers() {
    this.source.addEventListener('keydown', ({ code }: KeyboardEvent) => this.addKey(code));
    this.source.addEventListener('keyup', ({ code }: KeyboardEvent) => this.removeKey(code));
    // TODO: design and implement mouse input support
    // this.source.addEventListener('click', (event: any) => {
    //   const mouseX = event.clientX - this.source.getBoundingClientRect().left;
    //   const mouseY = event.clientY - this.source.getBoundingClientRect().top;
    //   console.log(`Mouse Clicked at: ${mouseX}, ${mouseY}`);
    // });
  }
}

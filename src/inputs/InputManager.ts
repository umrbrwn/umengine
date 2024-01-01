import { IAtom, InputKeymap } from '../types';
import { KeyEventHandler } from './KeyEventHandler';
import { InputReceptor } from '../core';

/** Manage input events for atoms with input receptors */
export class InputManager {
  /** All atoms that can respond to inputs */
  readonly listeners: IAtom[] = [];

  /** Input key event handlers */
  private readonly keyEventHandler: KeyEventHandler;

  constructor(source: EventTarget, keymap: InputKeymap) {
    this.keyEventHandler = new KeyEventHandler(source);
    this.addHandlers(keymap);
  }

  /** Add an atom that has input receptor */
  addReceptor(atom: IAtom) {
    this.listeners.push(atom);
  }

  /** Remove atom by its id */
  remove(id: string) {
    const index = this.listeners.findIndex((atom) => atom.id === id);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  /** Add an event handler for each input key */
  private addHandlers(keymap: InputKeymap) {
    /** pass on pressed key to each input receptor */
    const handler = (key: string, pressed: boolean) => {
      const action = pressed ? 'add' : 'remove';
      this.listeners.forEach((listener) => listener.components.get<InputReceptor>(InputReceptor.name)?.[action](key));
    };
    Object.entries(keymap).forEach(([key, code]) => {
      this.keyEventHandler.addHandler(code, (pressed) => handler(key, pressed));
    });
  }
}

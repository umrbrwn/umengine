import InputStateManager from './InputStateManager';
import { InputReceptor } from 'core/components';

/** Bridge inputs from source to atoms that react to these input */
export default class InputBridge {
  private readonly stateManager: InputStateManager;

  readonly listeners: IAtom[] = [];

  constructor(source: HTMLElement) {
    this.stateManager = new InputStateManager();
    this.stateManager.listenTo(source);
  }

  /**
   * Set key mappings
   * @param mapping key codes mapping to readable input key names
   */
  setup(mapping: Record<string, string>) {
    Object.entries(mapping).forEach(([key, value]) => {
      this.stateManager.addMapping(value, (pressed) => {
        const action = pressed ? 'add' : 'remove';
        this.listeners.forEach((listener) => listener.components.get<InputReceptor>(InputReceptor.name)?.[action](key));
      });
    });
  }
}

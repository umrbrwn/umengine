import InputManager from 'input/InputManager';
import Canvas from 'graphics/Canvas';
import * as loaders from '../util/loaders';
import WorldContext from './WorldContext';

/**
 * Game world that contains engine configuration, context, and sub systems
 * such as input manager, rendering canvas and audio
 */
export default class World {
  /** Game window to render scenes on */
  window: HTMLCanvasElement;

  /** Game world context */
  context: WorldContext;

  /** Attaching game window as input source to the input manager */
  inputManager: InputManager;

  constructor() {
    this.context = new WorldContext();
    this.inputManager = new InputManager(window);
  }

  /**
   * Setup game engine
   * @param options engine start up configurations and context details
   */
  async setup(options: any) {
    const [defaultConfig, keyMap] = await Promise.all([
      loaders.loadJSON(`${options.configPath || '/umengine'}/config.json`),
      loaders.loadJSON(`${options.keyMapPath || '/umengine/input'}/keyMap.json`),
    ]);
    const config = { ...defaultConfig, ...options.config };
    // eslint-disable-next-line max-len
    this.window = Canvas.createHiDPICanvas(config.window.width, config.window.height, options.canvas);
    this.context.config = config;
    this.context.renderer = this.window.getContext('2d')!;
    this.inputManager.setKeyMapping(keyMap);
  }
}

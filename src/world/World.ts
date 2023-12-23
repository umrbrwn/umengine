import WorldContext from './WorldContext';
import { InputBridge } from 'input';
import * as loaders from '../util/loaders';
import { createHiDPICanvas } from 'graphics/Factory';

export default class World {
  /** Main rendering window */
  window: HTMLCanvasElement;

  /** Global context */
  private readonly context: WorldContext;

  /** Attaching main window as the input source */
  private readonly inputBridge: InputBridge;

  constructor() {
    this.context = new WorldContext();
    this.inputBridge = new InputBridge(this.window);
  }

  /**
   * Setup game engine
   * @param options engine start up configurations and context details
   */
  async setup(canvas: HTMLCanvasElement, options: { configPath: string; keyMapPath: string; config: Config }) {
    const [defaultConfig, keyMap] = await Promise.all([
      loaders.loadJSON(`${options.configPath || '/umengine'}/config.json`),
      loaders.loadJSON(`${options.keyMapPath || '/umengine'}/keyMap.json`),
    ]);
    const config = { ...defaultConfig, ...options.config };
    this.window = createHiDPICanvas(config.window.width, config.window.height, canvas);
    this.context.config = config;
    this.context.renderingContext = this.window.getContext('2d')!;
    this.inputBridge.setup(keyMap);
  }
}

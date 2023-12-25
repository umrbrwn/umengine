import { InputBridge } from 'inputs';
import { Factory } from 'graphics';
import { loadConfig, loadKeys } from 'config';
import Context from './Context';

type SetupOptions = { configPath?: string; keyMapPath?: string; config?: Config };

export default class World {
  /** Global context */
  readonly context: Context;

  /** Attaching main window as the input source */
  readonly inputBridge: InputBridge;

  /** Main rendering window */
  private window: HTMLCanvasElement;

  constructor() {
    this.context = new Context();
    this.inputBridge = new InputBridge(this.window);
  }

  /**
   * Setup game engine
   * @param options engine start up configurations and context details
   */
  async setup(canvas: HTMLCanvasElement, options?: SetupOptions) {
    const [config, keyMap] = await Promise.all([
      loadConfig(options?.configPath, options?.config),
      loadKeys(options?.keyMapPath),
    ]);
    this.window = Factory.createHiDPICanvas(config.window.width, config.window.height, canvas);
    this.context.config = config;
    this.context.renderingContext = this.window.getContext('2d')!;
    this.inputBridge.setup(keyMap);
  }
}

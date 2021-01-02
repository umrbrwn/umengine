import * as loaders from "./loader/index.js";
import * as engine from "./index.js";
import InputManager from "./input/InputManager.js";

/** 
 * Game world that contains engine configuration, context, and sub systems 
 * such as input manager, rendering canvas and audio
 */
export class World {
    constructor() {
        /** Game window to render scenes on */
        this.window = null;

        /** Game world context */
        this.context = new engine.core.Context();

        /** Attaching game window as input source to the input manager */
        this.inputManager = new InputManager(window);
    }

    /**
     * Setup game engine
     * @param {*} options engine start up configurations and context details
     */
    async setup(options) {
        const [defaultConfig, keyMap] = await Promise.all([
            loaders.loadJSON(`${options.configPath || '/engine'}/config.json`),
            loaders.loadJSON(`${options.keyMapPath || '/engine/input'}/keyMap.json`),
        ]);
        const config = Object.assign({}, defaultConfig, options.config);
        this.window = engine.core.Canvas.createHiDPICanvas(
            config.window.width, config.window.height, options.canvas);
        this.context.config = config;
        this.context.renderer = this.window.getContext('2d');
        this.inputManager.setKeyMapping(keyMap);
    }
}

const world = new World();
export default world;
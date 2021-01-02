import Context from "../core/Context.js";
import * as core from "../core/index.js";
import Scene from "./Scene.js";

/** Manage scenes by creating and maintaining states of the scene */
export class SceneManager {
    constructor() {
        /** Currently running scene */
        this.current = null;

        /** Collection of available scenes */
        this.scenes = new Map();

        /** Timer of the scene manager used for execution of the scene */
        this.timer = new core.Timer();
    }

    /**
     * Create new scene
     * @param {String} name name of the scene
     * @param {Context} context engine context detail
     */
    create(name, context) {
        const scene = new Scene(name, context);
        this.scenes.set(scene.name, scene);
        return scene;
    }

    /**
     * Get the scene object
     * @param {String} name name of the scene used in creation
     */
    get(name) {
        return this.scenes.get(name);
    }

    /**
     * Run the scene by using it's name, this switches currently
     * running scene by the scene provided in the name and puts
     * currently running scene on hold
     * @param {String} name name of the scene
     */
    run(name) {
        this.current = this.get(name);
        if (this.current === undefined) {
            throw new Error(`scene ${name} not found.`);
        }
        this.timer.update = () => this.current.update();
        this.timer.start();
    }

    /** Pause the currently running scene */
    pause() {
        this.timer.update = null;
    }
}

const sceneManager = new SceneManager();
export default sceneManager;
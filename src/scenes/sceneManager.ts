import WorldContext from 'world/WorldContext';
import * as core from '../core';
import Scene from './Scene';

/** Manage scenes by creating and maintaining states of the scene */
export class SceneManager {
  /** Currently running scene */
  current: Scene;

  /** Collection of available scenes */
  scenes = new Map();

  /** Timer of the scene manager used for execution of the scene */
  timer = new core.Timer();

  /**
   * Create new scene
   * @param name name of the scene
   * @param context engine context detail
   */
  create(name: string, context: WorldContext) {
    const scene = new Scene(name, context);
    this.scenes.set(scene.name, scene);
    return scene;
  }

  /**
   * Get the scene object
   * @param name name of the scene used in creation
   */
  get(name: string) {
    return this.scenes.get(name);
  }

  /**
   * Run the scene by using it's name, this switches currently
   * running scene by the scene provided in the name and puts
   * currently running scene on hold
   * @param name name of the scene
   */
  run(name: string) {
    this.current = this.get(name);
    if (this.current === undefined) {
      throw new Error(`Scene ${name} not found.`);
    }
    this.timer.update = () => this.current.update();
    this.timer.start();
  }

  /** Pause the currently running scene */
  pause() {
    this.timer.update = () => { };
  }
}

const sceneManager = new SceneManager();
export default sceneManager;

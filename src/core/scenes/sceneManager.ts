import { Context } from '../../world';
import Timer from '../Timer';
import Scene from './Scene';

/** Manage scenes by creating and maintaining states of the scene */
export class SceneManager {
  /** Currently running scene */
  private current: Scene;

  /** List of scenes */
  private readonly scenes = new Map<string, Scene>();

  /** Timer of the scene manager used for execution of the scene */
  private readonly timer = new Timer();

  /** Create a new scene */
  create(name: string, context: Context) {
    const scene = new Scene(name, context);
    this.scenes.set(scene.name, scene);
    return scene;
  }

  /** Get scene by name */
  get(name: string) {
    return this.scenes.get(name);
  }

  /** Switches to scene by name and starts running it */
  run(name: string) {
    if (!this.scenes.has(name)) {
      throw new Error(`Scene "${name}" not found.`);
    }
    this.current = this.get(name)!;
    this.timer.update = () => this.current.update();
    this.timer.start();
  }

  /** Pause the currently running scene */
  pause() {
    this.timer.update = () => {};
  }
}

const sceneManager = new SceneManager();
export default sceneManager;

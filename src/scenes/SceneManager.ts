import { Context } from '../types';
import { Scene } from './Scene';
import { Timer } from '../core/Timer';

/** Manage scenes by creating and maintaining scene states */
export class SceneManager {
  /** Global context */
  readonly context: Context;

  /** List of scenes */
  private readonly scenes = new Map<string, Scene>();

  private _current: Scene;

  /** Timer for scene execution */
  private readonly timer = new Timer();

  constructor(context: Context) {
    this.context = context;
  }

  /** Currently running scene */
  get current() {
    return this._current;
  }

  /** Create a new scene */
  create(name: string) {
    const scene = new Scene(name, this.context);
    this.scenes.set(scene.name, scene);
    if (name === 'default') {
      this._current = scene;
    }
    return scene;
  }

  /** Switches to scene by name and starts running it */
  run(name: string) {
    if (!this.scenes.has(name)) {
      throw new Error(`Scene "${name}" not found.`);
    }
    this._current = this.scenes.get(name)!;
    this.timer.update = () => {
      this.current.update();
      this.current.postUpdate();
    };
    this.timer.start();
  }

  /** Pause current scene */
  pause() {
    this.timer.update = () => {};
  }
}

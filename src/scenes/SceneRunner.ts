import { Timer } from '../core/Timer';
import { SceneManager } from './SceneManager';

/** Manage scenes by creating and maintaining scene states */
export class SceneRunner {
  /** Timer for scene execution */
  private readonly timer: Timer;

  constructor(private readonly sceneManager: SceneManager) {
    this.timer = new Timer();
  }

  /** Switches to scene by name and starts running it */
  run(name: string) {
    this.sceneManager.changeScene(name);
    this.timer.update = () => {
      this.sceneManager.update();
      this.sceneManager.postUpdate();
    };
    this.timer.start();
  }

  /** Pause current scene */
  pause() {
    this.timer.update = () => {};
  }
}

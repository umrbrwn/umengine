import { InputController } from '../inputs';
import { Context, IAtom } from '../types';
import { Scene } from './Scene';
import { Collider, createCollider } from '../physics';

export class SceneManager {
  /** User input controller */
  readonly inputController: InputController;

  /** Collision system */
  private readonly collider: Collider;

  /** List of scenes */
  private readonly scenes = new Map<string, Scene>();

  private _current: Scene;

  constructor(readonly context: Context) {
    const { config } = context;
    this.collider = createCollider(config.physics.collider, context)!;
    this.inputController = new InputController(context.renderingContext.canvas, config.keymap);
    this.addScene('default');
    this.current.addLayer('default');
  }

  /** Currently running scene */
  get current() {
    return this._current;
  }

  /** Create a new scene */
  addScene(name: string) {
    const scene = new Scene(name, this.context.renderingContext);
    this.scenes.set(scene.name, scene);
    if (name === 'default') {
      this._current = scene;
    }
    return scene;
  }

  /** Switch current scene by name */
  changeScene(name: string) {
    if (this.current.name === name) {
      return;
    }
    if (!this.scenes.has(name)) {
      throw new Error(`Scene "${name}" not found.`);
    }
    this._current = this.scenes.get(name)!;
  }

  /** Add an atom to the scene */
  addItem(atom: IAtom) {
    const hasCollider = atom.components.query((component) => component.name.endsWith('Collider'));
    if (hasCollider?.length) {
      this.collider.addBody(atom);
    }

    this.current.addItem(atom);
  }

  /** Run once every frame */
  update() {
    this.updatePhysics();
    this.updateGameLogic();
    this.renderScene();
  }

  /** Run once after updating every frame */
  postUpdate() {
    this.inputController.postUpdate();
  }

  /** Update state of all physics bodies */
  private updatePhysics() {
    this.collider?.test();
  }

  /** Update all atoms game logic */
  private updateGameLogic() {
    this.current.items.forEach((atom) => atom.update());
    this.current.items.forEach((atom) => atom.postUpdate());
  }

  private renderScene() {
    this.current.update();
  }
}

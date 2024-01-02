import { IAtom, Context } from '../types';
import { LayerManager } from './LayerManager';
import { createCollider, Collider } from '../physics';
import { SpriteRenderer } from '../core';
import { InputController } from '../inputs';

/** Scene that is run on collection of atoms */
export class Scene {
  /** Organize layers and their ordering */
  readonly layerManager: LayerManager;

  /** User input controller */
  readonly inputController: InputController;

  /** Collision system */
  private readonly collider: Collider;

  /** All the atoms loaded in the scene */
  private readonly atoms: IAtom[];

  constructor(
    /** Name used to identify in the SceneManager */
    readonly name: string,

    /** Scene context */
    readonly context: Context,
  ) {
    const { config } = context;
    this.layerManager = new LayerManager({ x: config.window.width, y: config.window.height });
    this.collider = createCollider(config.physics.collider, config)!;
    this.inputController = new InputController(context.renderingContext.canvas, config.keymap);
    this.atoms = [];
  }

  /** Run once every frame */
  update() {
    this.updatePhysics();
    this.updateGameLogic();
    this.render();
  }

  /** Run once after updating every frame */
  postUpdate() {
    this.inputController.postUpdate();
  }

  /** Add an atom to the scene */
  addItem(atom: IAtom) {
    const renderer = atom.components.get<SpriteRenderer>(SpriteRenderer.name);
    if (atom.layer && renderer) {
      this.layerManager.addItem(renderer, atom.layer);
    }

    const hasCollider = atom.components.query((component) => component.name.endsWith('Collider'));
    if (hasCollider?.length) {
      this.collider.addBody(atom);
    }

    this.atoms.push(atom);
    atom.init();
  }

  /** Update state of all physics bodies */
  private updatePhysics() {
    this.collider?.test();
  }

  /** Update all atoms game logic */
  private updateGameLogic() {
    this.atoms.forEach((atom) => atom.update());
    this.atoms.forEach((atom) => atom.postUpdate());
  }

  /** Render scene layers and compose them in the main renderer */
  private render() {
    // sort layer items
    this.layerManager.layers.forEach((layer) => layer.sortDepth());
    const { renderingContext } = this.context;
    // clear the main rendering canvas
    renderingContext.clearRect(0, 0, renderingContext.canvas.width, renderingContext.canvas.height);
    // compose all the layers
    this.layerManager.layers.forEach((layer) => layer.render(renderingContext));
  }
}

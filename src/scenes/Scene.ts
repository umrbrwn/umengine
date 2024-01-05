import { IAtom, Context } from '../types';
import { LayerComposer } from '../graphics';
import { createCollider, Collider } from '../physics';
import { InputController } from '../inputs';
import { SpriteRenderer } from '../core';

/** Scene that is run on collection of atoms */
export class Scene {
  /** Organize layers and their ordering */
  readonly layerComposer: LayerComposer;

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
    this.layerComposer = new LayerComposer(this.context);
    this.collider = createCollider(config.physics.collider, config)!;
    this.inputController = new InputController(context.renderingContext.canvas, config.keymap);
    this.atoms = [];
  }

  /** Runs once every frame */
  update() {
    this.updatePhysics();
    this.updateGameLogic();
    this.render();
  }

  /** Runs once after updating every frame */
  postUpdate() {
    this.inputController.postUpdate();
  }

  /** Add an atom to the scene */
  addItem(atom: IAtom) {
    // add to layer
    const renderer = atom.components.get<SpriteRenderer>(SpriteRenderer.name);
    if (atom.layer && renderer) {
      this.layerComposer.addItem(renderer, atom.layer);
    }
    // add to collider
    const hasCollider = atom.components.query((component) => component.name.endsWith('Collider'));
    if (hasCollider?.length) {
      this.collider.addBody(atom);
    }
    // add to scene
    this.atoms.push(atom);
    atom.init();
  }

  /** Remove atom from the scene */
  removeItem(atom: IAtom) {
    // remove from layer
    const spriteRenderer = atom.components.get<SpriteRenderer>(SpriteRenderer.name);
    this.layerComposer.removeItem(spriteRenderer, atom.layer);

    // remove from colliders
    this.collider.removeBody(atom);

    // remove from scene
    const index = this.atoms.indexOf(atom) || -1;
    if (index > -1) {
      this.atoms.splice(index, 1);
    }
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

  private render() {
    this.layerComposer.render();
  }
}

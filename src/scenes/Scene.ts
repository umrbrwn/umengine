import { IAtom, Context, IComponent } from '../types';
import { LayerComposer } from '../graphics';
import { createCollider, Collider } from '../physics';
import { InputController } from '../inputs';
import { Sprite } from '../core';
import { systemEvents } from '../core/events/internal';

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

    systemEvents.on('COMPONENT_REMOVED', (component: IComponent) => this.removeComponent(component));
  }

  /** Runs once every frame */
  update() {
    this.collider?.test();
    this.atoms.forEach((atom) => atom.update());
    this.layerComposer.render();
  }

  /** Runs once after updating frame */
  postUpdate() {
    this.inputController.postUpdate();
    this.atoms.forEach((atom) => atom.postUpdate());
  }

  /** Add an atom to the scene */
  addItem(atom: IAtom) {
    // add to layer
    const renderable = atom.components.get<Sprite>('Sprite');
    if (atom.layer && renderable) {
      this.layerComposer.addItem(renderable, atom.layer);
    }

    // add to collider
    const hasCollider = atom.components.query((component) => component.name.endsWith('Collider'))?.length;
    if (hasCollider) {
      this.collider.addBody(atom);
    }

    // add to scene
    this.atoms.push(atom);
    atom.init();
  }

  /** Remove atom from the scene */
  removeItem(atom: IAtom) {
    // remove from layer
    const renderable = atom.components.get<Sprite>('Sprite');
    this.layerComposer.removeItem(renderable, atom.layer);

    // remove from colliders
    this.collider.removeBody(atom);

    // remove from scene
    const index = this.atoms.indexOf(atom) || -1;
    if (index > -1) {
      this.atoms.splice(index, 1);
    }
  }

  /** Remove component from its manager */
  private removeComponent(component: IComponent) {
    if (component instanceof Sprite) {
      this.layerComposer.removeItem(component, component.atom.layer);
    } else if (component.name.endsWith('Collider')) {
      this.collider.removeBody(component.atom);
    }
  }
}

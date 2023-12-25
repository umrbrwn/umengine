import { IAtom } from '../../global';
import { SpriteRenderer } from '../components';
import { Context } from '../../world';
import { createCollisionSystem, Collision } from '../../physics';
import LayerManager from './LayerManager';

/** Scene that is run on collection of atoms */
export default class Scene {
  /** Organize layers and their ordering */
  readonly layerManager: LayerManager;

  /** Collision system */
  private readonly collision: Collision;

  /** All the atoms loaded in the scene */
  private atoms: IAtom[];

  constructor(
    /** Name used to identify in the SceneManager */
    readonly name: string,

    /** Used to render scene and its layers in the main view */
    readonly context: Context
  ) {
    this.layerManager = new LayerManager(context.config);
    this.collision = createCollisionSystem(context.config.physics.collider, context)!;
    this.atoms = [];
  }

  /** Update the scene state */
  update() {
    this.updatePhysics();
    this.updateGameLogic();
    this.render();
  }

  /** Add an atom to the scene */
  addItem(atom: IAtom) {
    const renderer = atom.components.get<SpriteRenderer>(SpriteRenderer.name);
    if (atom.layer && renderer) {
      this.layerManager.addItem(renderer, atom.layer);
    }

    const hasCollider = atom.components.query((component) => component.name.endsWith('Collider'));
    if (hasCollider?.length) {
      this.collision.addBody(atom);
    }

    this.atoms.push(atom);
    atom.setup();
  }

  /** Update state of all physics bodies */
  private updatePhysics() {
    this.collision?.test();
  }

  /** Update all atoms game logic */
  private updateGameLogic() {
    this.atoms.forEach((atom) => atom.update());
    this.atoms.forEach((atom) => atom.postUpdate());
  }

  /** Render scene layers and compose them in the main renderer */
  private render() {
    // do the depth sorting of renderable objects
    // this.layerManager.layers.forEach((layer) => layer.sortDepth());
    // clear the main rendering canvas
    this.context.renderingContext.clearRect(
      0,
      0,
      this.context.renderingContext.canvas.width,
      this.context.renderingContext.canvas.height
    );
    // compose all the layers
    this.layerManager.layers.forEach((layer) => layer.render(this.context.renderingContext));
  }
}

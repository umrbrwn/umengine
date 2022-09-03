import WorldContext from 'world/WorldContext';
import * as physics from 'physics/index';
import Collision from 'physics/Collision';
import LayerManager from './LayerManager';

/** Scene that is run on collection of game objects */
export default class Scene {
  /** Name used to identify in the SceneManager */
  readonly name: string;

  /** Used to render scene and its layers in the main view */
  context: WorldContext;

  /** Organize layers and their ordering */
  layerManager: LayerManager;

  /** Collision system */
  collision: Collision;

  constructor(name: string, context: WorldContext) {
    this.name = name;
    this.context = context;
    this.layerManager = new LayerManager(context.config);
    // eslint-disable-next-line max-len
    this.collision = physics.createCollisionSystem(context.config.physics.collisionResolver, context);
  }

  /** Update the state of scene and objects attached to the scene */
  update() {
    this.updatePhysics();
    this.updateGameLogic();
    this.postUpdateGameLogic();
    this.render();
  }

  /**
   * Add a game object in the scene
   * @param object game object to add
   */
  addObject(object: IGameObject) {
    if (this.layerManager.addObject(object)) {
      if (object.physicBody) {
        this.collision.addBody(object.physicBody);
      }
      object.start();
    }
  }

  /** Update physics state of all the physics bodies */
  private updatePhysics() {
    this.collision?.test();
  }

  /** Update state of all the objects with provide context */
  private updateGameLogic() {
    this.layerManager.layers.forEach((layer) => {
      layer.objects.forEach((object) => object.update(this.context));
    });
  }

  /** Post update state of all the objects with provide context */
  private postUpdateGameLogic() {
    this.layerManager.layers.forEach((layer) => {
      layer.objects.forEach((object) => object.postUpdate(this.context));
    });
  }

  /** Render scene layers and compose them in the main renderer */
  private render() {
    // do the depth sorting of renderable objects
    this.layerManager.layers.forEach((layer) => layer.sortDepth());
    // clear the main rendering canvas
    // eslint-disable-next-line max-len
    this.context.renderer.clearRect(0, 0, this.context.renderer.canvas.width, this.context.renderer.canvas.height);
    // compose all the layers
    this.layerManager.layers.forEach((layer) => layer.render(this.context.renderer));
  }
}

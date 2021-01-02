import * as physics from "../physics/index.js"
import LayerManager from "./LayerManager.js";

/** Scene that is run on collection of game objects */
export default class Scene {
    constructor(name, context) {
        this.name = name;
        this.context = context;
        this.layerManager = new LayerManager(context.config);
        this.collision = physics.createCollisionSystem(
            context.config.physics.collisionResolver, context);
    }

    /** Update the state of scene and objects attached to the scene */
    update() {
        this._updatePhysics();
        this._updateGameLogic();
        this._postUpdateGameLogic();
        this._render();
    }

    /**
     * Add a game object in the scene
     * @param {*} object game object to add
     */
    addObject(object) {
        if (this.layerManager.addObject(object)) {
            this.collision.addBody(object);
            object.start();
        }
    }


    /** Update physics state of all the physics bodies */
    _updatePhysics() {
        this.collision && this.collision.test();
    }

    /** Update state of all the objects with provide context */
    _updateGameLogic() {
        this.layerManager.layers.forEach(layer => {
            layer.objects.forEach(object =>
                object.update(this.context));
        });
    }

    /** Post update state of all the objects with provide context */
    _postUpdateGameLogic() {
        this.layerManager.layers.forEach(layer => {
            layer.objects.forEach(object =>
                object.postUpdate(this.context));
        });
    }

    /** Render scene layers and compose them in the main renderer */
    _render() {
        // do the depth sorting of renderable objects
        this.layerManager.layers.forEach(layer => layer.sortDepth());
        // clear the main rendering canvas
        this.context.renderer.clearRect(0, 0, this.context.renderer.canvas.width,
            this.context.renderer.canvas.height
        );
        // compose all the layers
        this.layerManager.layers.forEach(layer =>
            layer.render(this.context.renderer));
    }
}
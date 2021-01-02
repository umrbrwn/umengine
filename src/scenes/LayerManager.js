import Layer from "./Layer.js";
import { getObjectName } from "../util/GameObjectHelper.js";
import { eventEmitter } from "../events/index.js";

/** Manage layers by arrangement of layer order */
export default class LayerManager {
    constructor(config) {
        /** Engine configurations required to create layers */
        this.config = config;

        /** Layers being managed */
        this.layers = [];

        this.create('default');

        /**
         * set the pending depth sort flag of the layer which 
         * sorts the objects before rendering
         */
        eventEmitter.on('SPRITE_RENDERER_DEPTH_CHANGED', (layerName) => {
            const layer = this.get(layerName);
            layer && (layer.pendingDepthSort = true);
        });
    }

    /**
     * Create a new layer
     * @param {String} name name of the layer for reference
     * @param {*} config layering order, width and height can be configured
     */
    create(name, config = {}) {
        if (this.layers.length === 10) {
            throw new Error('layer capacity full.');
        }
        config = this._getConfig(config);
        const layer = new Layer(name, config.width, config.height);
        this.layers.push(layer);
        try {
            this._rearrange(name, config.order);
        } catch (err) {
            this.remove(name);
            throw err;
        }
    }

    /**
     * Get layer by the layer name
     * @param {*} name name of the layer
     */
    get(name) {
        return this.layers.find(layer => layer.name === name);
    }

    /**
     * Remove the layer by name
     * @param {String} name name of the layer to remove
     */
    remove(name) {
        const index = this.layers.indexOf(layer => layer.name === name);
        if (index !== -1) {
            this.layers = this.layers.splice(index, 1);
            this._sort();
        }
    }

    /**
     * Add game object in the appropriate layer
     * @param {*} object game object to add
     * @returns true when object is successfully added, otherwise false
     */
    addObject(object) {
        if (typeof object === 'undefined' || object === null) {
            return false;
        }
        const layer = this.get(object.layer);
        const layerExists = !!layer;
        if (layerExists) {
            object.name = getObjectName(object, this.layers);
            if (object.spriteRenderer && object.spriteRenderer.depth < 0) {
                object.spriteRenderer.depth = layer.objects.size;
            }
            layer.objects.set(object.name, object);
        }
        return layerExists;
    }

    /**
     * Change order of the layer
     * @param {String} name name of the layer
     * @param {number} order new order of the layer
     */
    _rearrange(name, order) {
        if (order < 1 || order > 20) {
            throw new Error('layer order out of range.');
        }
        if (this.layers.some(layer => layer.order === order)) {
            throw new Error('layer order is in use.');
        }
        const layer = this.get(name);
        if (layer) {
            layer.order = order;
            this._sort();
        }
    }

    /**
     * Sort all the layers in the ascending order using 
     * order property of the layers
     */
    _sort() {
        this.layers.sort((lhs, rhs) => lhs.order - rhs.order);
    }

    /**
     * Get default configuration for the layer
     * @param {*} config user defined configurations
     */
    _getConfig(config) {
        const def = {
            order: this.layers.length + 1,
            width: this.config.window.width,
            height: this.config.window.height,
        };
        return { ...def, config };
    }
}
import { eventEmitter } from 'events';
import Creator from 'util/Creator';
import Layer from './Layer';

/** Manage layers by arrangement of layer order */
export default class LayerManager {
  /** Engine configurations required to create layers */
  config: any;

  /** Managed layers */
  layers: Layer[] = [];

  constructor(config: any) {
    this.config = config;
    this.create('default', () => { });

    // set the pending depth sort flag of the layer which sorts the objects before rendering
    eventEmitter.on('SPRITE_RENDERER_DEPTH_CHANGED', (layerName: string) => {
      const layer = this.get(layerName);
      if (layer) {
        layer.pendingDepthSort = true;
      }
    });
  }

  /**
   * Create a new layer
   * @param name name of the layer for reference
   * @param options layering order, width and height can be set
   */
  create(name: string, options: any) {
    if (this.layers.length === 10) {
      throw new Error('Maximum layer capacity is full.');
    }
    const opt = this.getOptions(options);
    const layer = new Layer(name, opt.width, opt.height);
    this.layers.push(layer);
    try {
      this.rearrange(name, opt.order);
    } catch (err) {
      this.remove(name);
      throw err;
    }
  }

  /**
   * Get layer by the layer name
   * @param name name of the layer
   */
  get(name: string) {
    return this.layers.find((layer) => layer.name === name);
  }

  /**
   * Remove the layer by name
   * @param name name of the layer to remove
   */
  remove(name: string) {
    const index = this.layers.findIndex((layer: Layer) => layer.name === name);
    if (index !== -1) {
      this.layers = this.layers.splice(index, 1);
      this.sort();
    }
  }

  /**
   * Add game object in the layer
   * @param object game object to add
   * @returns true when object is successfully added
   */
  addObject(object: IGameObject) {
    if (typeof object === 'undefined' || object === null) {
      return false;
    }
    /* eslint-disable no-param-reassign */
    /* eslint-disable @typescript-eslint/dot-notation */
    const layer = this.get(object.layer);
    const layerExists = !!layer;
    if (layerExists) {
      if (!object.name) {
        object.name = Creator.createObjectName(object, this.layers);
      }
      if (object['spriteRenderer']?.depth < 0) {
        object['spriteRenderer'].depth = layer.objects.size;
      }
      layer.objects.set(object.name, object);
    }
    /* eslint-enable @typescript-eslint/dot-notation */
    /* eslint-enable no-param-reassign */
    return layerExists;
  }

  /**
   * Change order of the layer
   * @param name name of the layer
   * @param order new order of the layer
   */
  private rearrange(name: string, order: number) {
    if (order < 1 || order > 20) {
      throw new Error('Layer order out of range.');
    }
    if (this.layers.some((layer) => layer.order === order)) {
      throw new Error('Layer order is in use.');
    }
    const layer = this.get(name);
    if (layer) {
      layer.order = order;
      this.sort();
    }
  }

  /** Sort all layers in ascending order */
  private sort() {
    this.layers.sort((lhs, rhs) => lhs.order - rhs.order);
  }

  /**
   * Get default configuration for the layer
   * @param config user defined configurations
   */
  private getOptions(config: any) {
    const def = {
      order: this.layers.length + 1,
      width: this.config.window.width,
      height: this.config.window.height,
    };
    return { ...def, ...config };
  }
}

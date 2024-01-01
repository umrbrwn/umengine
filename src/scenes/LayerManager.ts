import { IRenderer, Vector } from '../types';
import { Layer } from './Layer';
import { systemEvents } from '../core/events/internal';

/** Manage layers by arrangement of layer order */
export class LayerManager {
  /** Managed layers */
  layers: Layer[] = [];

  constructor(
    /** Default size for new layers */
    private readonly scale: Vector,
  ) {
    this.createLayer('default');
    // when a drawable item reorders itself, the layer that contains the item should reorder its items
    systemEvents.on('RENDERER_DEPTH_CHANGED', (layerName: string) => {
      const layer = this.get(layerName);
      if (layer) {
        layer.pendingDepthSort = true;
      }
    });
  }

  /** Get layer by name */
  get(name: string) {
    return this.layers.find((layer) => layer.name === name);
  }

  /** Remove layer by name */
  remove(name: string) {
    const index = this.layers.findIndex((layer: Layer) => layer.name === name);
    if (index !== -1) {
      this.layers.splice(index, 1);
      this.layers.sort(({ order: a }, { order: b }) => a - b);
    }
  }

  /**
   * Add drawable item to the layer
   * @param item drawable item
   * @param name target layer name
   * @returns true when target layer exists
   */
  addItem(item: IRenderer, name: string) {
    const layer = this.get(name);
    const layerExists = !!layer;
    if (layerExists) {
      if (item.order < 0) {
        // eslint-disable-next-line no-param-reassign
        item.order = layer.drawables.length;
      }
      layer.drawables.push(item);
    }
    return layerExists;
  }

  createLayer(name: string, options?: { order?: number; scale?: Vector }) {
    if (this.layers.length === 10) {
      throw new Error('Maximum layer capacity reached, cannot create new layer.');
    }

    const opts = {
      order: this.layers.length + 1,
      scale: this.scale,
      ...options,
    };

    const { order } = opts;

    if (order < 1 || order > 20) {
      throw new Error(`Layer order ${order} is out of range.`);
    }

    if (this.layers.some((layer) => layer.order === order)) {
      throw new Error(`Layer order ${order} is in use.`);
    }

    const layer = new Layer(name, opts.scale);
    layer.order = order;

    this.layers.push(layer);
    this.layers.sort(({ order: a }, { order: b }) => a - b);
  }
}

import { Context, IRenderable, Vector } from '../types';
import { Layer } from './Layer';
import { systemEvents } from '../core/events/internal';

/** Manage layers in order to compose a scene */
export class LayerComposer {
  /** Managed layers */
  readonly layers: Layer[] = [];

  constructor(readonly context: Context) {
    this.add('default');
    // when a renderable item reorders itself, the layer that contains the item should reorder its items
    systemEvents.on('RENDERING_ORDER_CHANGED', (layerName: string) => {
      const layer = this.get(layerName);
      if (layer) {
        layer.pendingDepthSort = true;
      }
    });
  }

  /** Add new layer */
  add(name: string, options?: { order?: number; scale?: Vector }) {
    if (this.layers.length === 10) {
      throw new Error('Maximum layer capacity reached, cannot create new layer.');
    }

    const { width, height } = this.context.config.window;
    const opts = {
      order: this.layers.length + 1,
      scale: { x: width, y: height },
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
   * Add renderable item to the layer
   * @param item renderable item
   * @param name target layer name
   * @returns true when target layer exists
   */
  addItem(item: IRenderable, name: string) {
    const layer = this.get(name);
    const layerExists = !!layer;
    if (layerExists) {
      if (item.order < 0) {
        // eslint-disable-next-line no-param-reassign
        item.order = layer.items.length;
      }
      layer.items.push(item);
    }
  }

  /**
   * Remove renderable item from layer
   * @param item renderable item
   * @param name target layer name
   */
  removeItem(item: IRenderable, name: string) {
    const layer = this.layers.find((l) => l.name === name);
    const index = layer?.items.indexOf(item) || -1;
    if (layer && index > -1) {
      layer.items.splice(index, 1);
    }
  }

  /** Compose layers in the order */
  render() {
    // sort layer items
    this.layers.forEach((layer) => layer.sortDepth());
    const { renderingContext } = this.context;
    // clear the main rendering canvas
    renderingContext.clearRect(0, 0, renderingContext.canvas.width, renderingContext.canvas.height);
    // compose all the layers
    this.layers.forEach((layer) => layer.render(renderingContext));
  }
}

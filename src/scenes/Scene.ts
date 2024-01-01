import { IAtom } from '../types';
import { Layer } from './Layer';
import { SpriteRenderer } from '../core';
import { systemEvents } from '../core/events/internal';

/** Scene that is run on collection of atoms */
export class Scene {
  /** All the atoms loaded in the scene */
  readonly items: IAtom[];

  /** Ordered layers composing this scene */
  private readonly layers: Layer[];

  constructor(
    /** Name used to identify in the SceneManager */
    readonly name: string,

    /** Scene context */
    readonly context: CanvasRenderingContext2D,
  ) {
    this.layers = [];
    this.items = [];
    systemEvents.on('RENDERER_DEPTH_CHANGED', (layerName: string) => {
      const layer = this.getLayer(layerName);
      if (layer) {
        layer.pendingDepthSort = true;
      }
    });
  }

  /** Add new layer in the scene */
  addLayer(name: string, options?: { order?: number; width?: number; height?: number }) {
    if (this.layers.length === 10) {
      throw new Error('Maximum layer capacity reached, cannot create new layer.');
    }
    const { canvas } = this.context;
    const opts = {
      order: this.layers.length + 1,
      width: canvas.width,
      height: canvas.height,
      ...options,
    };
    const { order } = opts;
    if (order < 1 || order > 20) {
      throw new Error(`Layer order ${order} is out of range.`);
    }
    if (this.layers.some((layer) => layer.order === order)) {
      throw new Error(`Layer order ${order} is in use.`);
    }
    const layer = new Layer(name, opts.width, opts.height);
    layer.order = order;
    this.layers.push(layer);
    this.layers.sort(({ order: a }, { order: b }) => a - b);
  }

  /** Add an atom to the scene */
  addItem(atom: IAtom) {
    this.addToLayer(atom);
    this.items.push(atom);
    atom.init();
  }

  /** Render scene layers and compose them in the main renderer */
  update() {
    // sort layer items
    this.layers.forEach((layer) => layer.sortDepth());
    const renderingContext = this.context;
    // clear the main rendering canvas
    renderingContext.clearRect(0, 0, renderingContext.canvas.width, renderingContext.canvas.height);
    // compose all the layers
    this.layers.forEach((layer) => layer.render(renderingContext));
  }

  private addToLayer(atom: IAtom) {
    const renderer = atom.components.get<SpriteRenderer>(SpriteRenderer.name);
    if (atom.layer && renderer) {
      const layer = this.getLayer(atom.layer);
      if (layer) {
        if (renderer.order < 0) {
          renderer.order = layer.drawables.length;
        }
        layer.drawables.push(renderer);
      }
    }
  }

  /** Get layer by name */
  private getLayer(name: string) {
    return this.layers.find((l) => l.name === name);
  }
}

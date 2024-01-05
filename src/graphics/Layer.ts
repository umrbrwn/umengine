import { IRenderable, Vector } from '../types';

/** Composer layer */
export class Layer implements IRenderable {
  /** Order in which the composer renders this layer */
  order = -1;

  /** Renderable items */
  items: IRenderable[] = [];

  /** Flags that items need to be sorted */
  pendingDepthSort = false;

  /** Local rendering context */
  private readonly renderingContext: OffscreenCanvasRenderingContext2D;

  constructor(
    /** Layer name */
    readonly name: string,

    /** Layer size, normally scale up to full canvas size */
    readonly scale: Vector,
  ) {
    this.renderingContext = new OffscreenCanvas(scale.x, scale.y).getContext('2d')!;
  }

  /** Render items in locally, and then compose them on target layer */
  render(target: CanvasRenderingContext2D) {
    // clear this layer for redraw
    this.renderingContext.clearRect(0, 0, this.scale.x, this.scale.y);
    // render all items
    this.items.forEach((item) => item.render(this.renderingContext));
    // compose this layer on the target layer
    target.drawImage(this.renderingContext.canvas, 0, 0);
  }

  /** Sort layer items by their order */
  sortDepth() {
    if (this.pendingDepthSort && this.items.length) {
      this.items.sort((curr, next) => curr.order - next.order);
    }
    this.pendingDepthSort = false;
  }
}

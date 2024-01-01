import { IRenderer } from '../types';

/** Composer layer */
export class Layer implements IRenderer {
  /** Order in which this layer is rendered on the composer */
  order = -1;

  /** Drawable items added to this layer */
  drawables: IRenderer[] = [];

  /** Flags that a depth sort operation on this layer is needed */
  pendingDepthSort = false;

  /** Local rendering context */
  private readonly renderingContext: OffscreenCanvasRenderingContext2D;

  constructor(
    /** Layer name */
    readonly name: string,

    /** Layer width */
    readonly width: number,

    /** Layer height */
    readonly height: number,
  ) {
    this.renderingContext = new OffscreenCanvas(width, height).getContext('2d')!;
  }

  /** Render drawable items of this layer in local rendering context and then compose them on target layer */
  render(target: CanvasRenderingContext2D) {
    // clear this layer for redraw
    this.renderingContext.clearRect(0, 0, this.width, this.height);
    // render all the drawable items
    this.drawables.forEach((item) => item.render(this.renderingContext));
    // compose this layer on the target layer
    target.drawImage(this.renderingContext.canvas, 0, 0);
  }

  /** Sort layer items by their order */
  sortDepth() {
    if (this.pendingDepthSort && this.drawables.length) {
      this.drawables.sort((curr, next) => curr.order - next.order);
    }
    this.pendingDepthSort = false;
  }
}

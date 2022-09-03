/** Layer of the renderer */
export default class Layer {
  /** Name of the layer */
  readonly name: string;

  /** Order in which this layer is rendered on the composer */
  order = -1;

  /** Position and size detail of the layer */
  transform: ITransform;

  /** Collection of objects present in the layer */
  objects = new Map();

  /** Rendering context of the layer */
  localRenderer: CanvasRenderingContext2D;

  /** When true, indicates a depth sort operation on this layer is pending */
  pendingDepthSort = false;

  constructor(name: string, width = 50, height = 50) {
    this.name = name;
    this.setTransform(width, height);
    this.localRenderer = this.createRenderer();
  }

  /**
   * Render game objects of this layer on the target layer
   * @param target target renderer to draw this layer's image on
   */
  render(target: CanvasRenderingContext2D) {
    /* eslint-disable max-len */
    // clear this layer first
    this.localRenderer.clearRect(0, 0, this.localRenderer.canvas.width, this.localRenderer.canvas.height);
    // render all the drawable objects of this layer locally
    this.objects.forEach((obj) => obj.spriteRenderer && obj.spriteRenderer.render(this.localRenderer));
    // compose this layer on the target layer
    target.drawImage(this.localRenderer.canvas, this.transform.position.x, this.transform.position.y);
    /* eslint-enable max-len */
  }

  /** Sort renderable objects of this layer by their depth */
  sortDepth() {
    if (this.pendingDepthSort) {
      if (this.objects.size === 0) {
        this.pendingDepthSort = false;
        return;
      }
      const sorted = Array.from(this.objects)
        .filter((obj) => obj[1].spriteRenderer)
        .sort((curr, next) => curr[1].spriteRenderer.depth - next[1].spriteRenderer.depth);
      this.objects.clear();
      sorted.forEach((curr) => this.objects.set(curr[0], curr[1]));
      this.pendingDepthSort = false;
    }
  }

  private setTransform(width: number, height: number) {
    this.transform = {
      position: { x: 0, y: 0 },
      scale: { x: width, y: height },
    };
  }

  /** Create new rendering context of this layer */
  private createRenderer() {
    const buffer = document.createElement('canvas');
    buffer.width = this.transform.scale.x;
    buffer.height = this.transform.scale.y;
    return buffer.getContext('2d')!;
  }
}

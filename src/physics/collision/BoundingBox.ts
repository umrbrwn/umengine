/** Axis Aligned Bounding Box */
export class BoundingBox {
  /** Vertical midpoint (x + widthHalf) */
  readonly xm: number;

  /** Horizontal midpoint (y + heightHalf) */
  readonly ym: number;

  /** Half of the box width */
  readonly widthHalf: number;

  /** Half of box height */
  readonly heightHalf: number;

  constructor(
    public readonly x: number,
    public readonly y: number,
    public readonly width: number,
    public readonly height: number,
  ) {
    this.widthHalf = width / 2;
    this.heightHalf = height / 2;
    this.xm = x + this.widthHalf;
    this.ym = y + this.heightHalf;
  }
}

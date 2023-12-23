/** Structured tileset created from a tileset image
 * @example Named collection of graphics like trees, player, grass etc. created from one image tileset
 */
export default class Tilemap {
  constructor(
    /** Tileset image */
    public readonly tileset: ImageBitmap,
    /** Named collection of tiles sliced from the tileset */
    private readonly map = new Map<string, ImageBitmap>(),
    /** Default width of a tile in the tileset image */
    private readonly width: number,
    /** Default height of a tile in the tileset image */
    private readonly height: number
  ) {}

  /**
   * Slice a tile from the tileset
   * @param name name of the tile
   * @param x tile starting x position
   * @param y tile starting y position
   * @param width tile width, uses default width if not provided
   * @param height tile height, uses default height if not provided
   */
  async slice(name: string, x: number, y: number, width: number = this.width, height: number = this.height) {
    return createImageBitmap(this.tileset, x, y, width, height).then((tile) => {
      this.map.set(name, tile);
    });
  }

  /** Get tile by name */
  get(name: string) {
    return this.map.get(name);
  }
}

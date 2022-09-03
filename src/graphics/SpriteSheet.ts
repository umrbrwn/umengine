/** Sprite sheet that manages sprites collection sliced from tileset */
export default class SpriteSheet {
  /** Image broken into tile grid */
  private tileset: HTMLImageElement;

  /** Width of a tile in the tile set */
  private width: number;

  /** Height of a tile in the tile set */
  private height: number;

  /** Scaling factor to adjust size of the generated sprite */
  private scale: number;

  /** Collection of the sprites sliced from the tileset */
  private sprites = new Map();

  constructor(tileset: HTMLImageElement, width: number, height: number, scale = 1) {
    this.tileset = tileset;
    this.width = width;
    this.height = height;
    this.scale = scale;
  }

  /**
   * Create a tile using the tile set
   * @param x starting x position of the sprite in tileset image
   * @param y starting y position of the sprite in tileset image
   * @param width width of this sprite in tileset
   * @param height height of this sprite in tileset
   */
  createTile(x: number, y: number, width: number, height: number) {
    const buffer = document.createElement('canvas');
    buffer.width = width * this.scale;
    buffer.height = height * this.scale;

    /* eslint-disable function-paren-newline */
    /* eslint-disable function-call-argument-newline */
    buffer.getContext('2d')!.drawImage(
      this.tileset,
      x, y, width, height,
      0, 0, buffer.width, buffer.height,
    );
    /* eslint-enable function-call-argument-newline */
    /* eslint-enable function-paren-newline */
    return buffer;
  }

  /**
   * Define a sprite from the tileset of defined width and height from given
   * x and y position in tileset
   * @param name name of the sprite
   * @param x starting x position of the sprite in tileset
   * @param y starting y position of the sprite in tileset
   * @param width width of this sprite in tileset
   * @param height height of this sprite in tileset
   */
  define(name: string, x: number, y: number, width: number, height: number) {
    const tile = this.createTile(x, y, width, height);
    this.sprites.set(name, tile);
  }

  /**
   * Define a sprite from the tileset using fixed tile size from sprite sheet
   * at given x and y index of the tileset
   * @param name name of the sprite
   * @param x starting x position of the sprite in tileset
   * @param y starting y position of the sprite in tileset
   */
  defineTile(name: string, x: number, y: number) {
    this.define(name, x * this.width, y * this.height, this.width, this.height);
  }

  /**
   * Define pattern of given width and height based on the tile
   * size from the tilset
   * @param name name of the sprite
   * @param x x-index of the sprite in tileset
   * @param y y-index of the sprite in tileset
   * @param width width of the generated pattern
   * @param height height of the generated pattern
   */
  defineTiledPattern(name: any, x: number, y: number, width: number, height: number) {
    const tile = this.createTile(x * this.width, y * this.height, this.width, this.height);
    const buffer = document.createElement('canvas');
    buffer.width = width;
    buffer.height = height;
    const bufferCtx = buffer.getContext('2d')!;
    bufferCtx.rect(0, 0, width, height);
    bufferCtx.fillStyle = bufferCtx.createPattern(tile, 'repeat')!;
    bufferCtx.fill();
    bufferCtx.fillStyle = '#000';
    this.sprites.set(name, buffer);
  }

  /**
   * Get sprite from sprite collection
   * @param name name of the sprite
   */
  get(name: string) {
    return this.sprites.get(name);
  }
}

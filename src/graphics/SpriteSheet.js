/** Sprite sheet that manages sprites collection sliced from tileset */
export default class SpriteSheet {
    constructor(tileset, width, height, scale = 1) {
        /** Image broken into tile grid */
        this.tileset = tileset;

        /** Width of a tile in the tile set */
        this.width = width;

        /** Height of a tile in the tile set */
        this.height = height;

        /** Collection of the sprites sliced from the tileset */
        this.sprites = new Map();

        /** Scaling factor to adjust size of the generated sprite */
        this.scale = scale;
    }

    /**
     * Create a tile using the tile set
     * @param {number} x starting x position of the sprite in tileset image
     * @param {number} y starting y position of the sprite in tileset image
     * @param {number} width width of this sprite in tileset
     * @param {number} height height of this sprite in tileset
     */
    createTile(x, y, width, height) {
        const buffer = document.createElement('canvas');
        buffer.width = width * this.scale;
        buffer.height = height * this.scale;
        buffer.getContext('2d').drawImage(
            this.tileset,
            x, y, width, height,
            0, 0, buffer.width, buffer.height
        );
        return buffer;
    }

    /**
     * Define a sprite from the tileset of defined width and height from given 
     * x and y position in tileset
     * @param {String} name name of the sprite
     * @param {number} x starting x position of the sprite in tileset
     * @param {number} y starting y position of the sprite in tileset
     * @param {number} width width of this sprite in tileset
     * @param {number} height height of this sprite in tileset
     */
    define(name, x, y, width, height) {
        const tile = this.createTile(x, y, width, height);
        this.sprites.set(name, tile);
    }

    /**
     * Define a sprite from the tileset using fixed tile size from sprite sheet
     * at given x and y index of the tileset
     * @param {String} name name of the sprite
     * @param {number} x starting x position of the sprite in tileset
     * @param {number} y starting y position of the sprite in tileset
     */
    defineTile(name, x, y) {
        this.define(name, x * this.width, y * this.height, this.width, this.height);
    }

    /**
     * Define pattern of given width and height based on the tile
     * size from the tilset
     * @param {String} name name of the sprite
     * @param {number} x x-index of the sprite in tileset
     * @param {number} y y-index of the sprite in tileset
     * @param {number} width width of the generated pattern
     * @param {number} height height of the generated pattern
     */
    defineTiledPattern(name, x, y, width, height) {
        const tile = this.createTile(x * this.width, y * this.height, this.width, this.height);
        const buffer = document.createElement('canvas');
        buffer.width = width;
        buffer.height = height;
        const bufferCtx = buffer.getContext('2d');
        bufferCtx.rect(0, 0, width, height);
        bufferCtx.fillStyle = bufferCtx.createPattern(tile, 'repeat');
        bufferCtx.fill();
        bufferCtx.fillStyle = '#000';
        this.sprites.set(name, buffer);
    }

    /**
     * Get sprite from sprite collection
     * @param {*} name name of the sprite
     */
    get(name) {
        return this.sprites.get(name);
    }
}
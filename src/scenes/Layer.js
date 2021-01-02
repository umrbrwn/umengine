import Transform from "../core/objects/components/Transform.js";

/** Layer of the renderer */
export default class Layer {
    constructor(name, width = 50, height = 50) {
        /** Name of the layer */
        this.name = name;

        /** Order in which this layer is rendered on the composer */
        this.order = -1;

        /** Position and size detail of the layer */
        this.transform = new Transform();

        /** Size of the layer */
        this.transform.scale.set(width, height);

        /** Collection of objects present in the layer */
        this.objects = new Map();

        /** Rendering context of the layer */
        this.localRenderer = this._getRenderer();

        /** When true, indicates a depth sort operation on this layer is pending */
        this.pendingDepthSort = false;
    }

    /**
     * Render game objects present in the layer
     * @param {*} renderer main renderer to draw this layer's image on
     */
    render(renderer) {
        // clear the layer rendering context
        this.localRenderer.clearRect(0, 0, this.localRenderer.canvas.width,
            this.localRenderer.canvas.height);
        // render all the drawable objects present in the layer
        this.objects.forEach(obj => obj.spriteRenderer && obj.spriteRenderer.render(this.localRenderer));
        // compose the layer on the main renderer
        renderer.drawImage(this.localRenderer.canvas,
            this.transform.position.x,
            this.transform.position.y);
    }

    /** Sort renderable objects of this layer by their depth */
    sortDepth() {
        if (this.pendingDepthSort) {
            if (this.objects.size === 0) {
                this.pendingDepthSort = false;
                return;
            }
            const sorted = Array.from(this.objects)
                .filter(obj => obj[1].spriteRenderer)
                .sort((curr, next) => curr[1].spriteRenderer.depth - next[1].spriteRenderer.depth);
            this.objects.clear();
            sorted.forEach(curr => this.objects.set(curr[0], curr[1]));
            this.pendingDepthSort = false;
        }
    }

    /** Get new rendering context for this layer */
    _getRenderer() {
        const buffer = document.createElement('canvas');
        buffer.width = this.transform.scale.x;
        buffer.height = this.transform.scale.y;
        return buffer.getContext('2d');
    }
}
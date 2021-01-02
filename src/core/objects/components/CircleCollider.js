import Component from "./Component.js";

/** Circle collider component */
export default class CircleCollider extends Component {
    constructor() {
        super('circleCollider');

        this.radius = 0;

        /** X-offset from the X-position of the game object */
        this.offsetX = 0;

        /** Y-offset from the Y-position of the game object */
        this.offsetY = 0;
    }

    set radius(value) {
        this._radius = value;
        this.diameter = value * 2;
    }

    /** Radius of the circle collider */
    get radius() {
        return this._radius;
    }

    /**
     * Offsetted center of the circle collider, defaults to
     * anchor point of the game object with 0 offset
     */
    get center() {
        return {
            x: this.gameObject.transform.position.x + this.offsetX,
            y: this.gameObject.transform.position.y + this.offsetY
        };
    }
}


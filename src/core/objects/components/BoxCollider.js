import Component from "./Component.js";
import Vector2 from "../../math/Vector2.js";

/** Box collider component */
export default class BoxCollider extends Component {
    constructor() {
        super('boxCollider');

        /** Size of the box collider */
        this.size = new Vector2();

        /** X-offset from the X-position of the game object */
        this.offsetX = 0;

        /** Y-offset from the Y-position of the game object */
        this.offsetY = 0;
    }

    /**
     * Offsetted position with respect to the game object,
     * defaults to the anchor position of the game object
     */
    get position() {
        return {
            x: this.gameObject.transform.position.x + this.offsetX,
            y: this.gameObject.transform.position.y + this.offsetY
        }
    }

    /** Centroid of the box collider */
    get center() {
        return {
            x: (this.size.x / 2) + this.position.x,
            y: (this.size.y / 2) + this.position.y
        }
    }

    /** Top left vertex of the box */
    get topLeft() {
        return {
            x: this.position.x,
            y: this.position.y
        }
    }

    /** Top right vertex of the box */
    get topRight() {
        return {
            x: this.position.x + this.size.x,
            y: this.position.y
        }
    }

    /** Bottom right vertex of the box */
    get bottomRight() {
        return {
            x: this.position.x + this.size.x,
            y: this.position.y + this.size.y
        }
    }

    /** Bottom left vertex of the box */
    get bottomLeft() {
        return {
            x: this.position.x,
            y: this.position.y + this.size.y
        }
    }

    /** Top edge of the box */
    get topEdge() {
        return {
            initial: this.topLeft,
            terminal: this.topRight
        };
    }

    /** Right edge of the box */
    get rightEdge() {
        return {
            initial: this.topRight,
            terminal: this.bottomRight
        };
    }

    /** Bottom edge of the box */
    get bottomEdge() {
        return {
            initial: this.bottomRight,
            terminal: this.bottomLeft
        };
    }

    /** Left edge of the box */
    get leftEdge() {
        return {
            initial: this.bottomLeft,
            terminal: this.topLeft
        };
    }

    init() {
        this.setDefaultSize();
    }

    /** Set size of collider to game object size */
    setDefaultSize() {
        this.size.set(
            this.gameObject.transform.scale.x,
            this.gameObject.transform.scale.y);
    }
}
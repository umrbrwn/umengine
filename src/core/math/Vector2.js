/**  Simple 2D vector type */
export default class Vector2 {
    constructor(x = 0, y = 0) {
        this.set(x, y);
    }

    /**
     * Set the vector components.
     * Simple object with x and y components can be passed.
     * If y component is undefined then it's set to x component.
     * @param {*} x x-component of the vector
     * @param {*} y y-component of the vector
     */
    set(x, y) {
        if (typeof x === 'object' && x !== null) {
            this.x = x.x;
            this.y = x.y;
        }
        else if (typeof y === 'undefined') {
            this.x = x;
            this.y = x;
        } else {
            this.x = x;
            this.y = y;
        }
    }

    /** Length of vector */
    get magnitude() {
        return Math.sqrt((this.x * this.x) + (this.y * this.y));
    }

    /** Normalizes this vector */
    normalize() {
        if (this.magnitude > 0) {
            const normalzied = Vector2.divN(this, this.magnitude);
            this.set(normalzied.x, normalzied.y);
        } else {
            this.set(0, 0);
        }
    }

    /** Converts the vector coordinates to string */
    toString() {
        return `${this.x},${this.y}`;
    }

    /**
     * Compare two vector to check if they are equal
     * @param {Vector2} lhs left hand side of the operator
     * @param {Vector2} rhs right hand side of the operator
     */
    static equal(lhs, rhs) {
        return lhs.x === rhs.x && lhs.y === rhs.y;
    }

    /**
     * Divide two vectors
     * @param {Vector2} lhs left hand side of the operator
     * @param {Vector2} rhs right hand side of the operator
     * @param {Boolean} typed returns result of type Vector2 when true
     * otherwise returns simple javascript object with x and y coordinates.
     */
    static div(lhs, rhs, typed = false) {
        const ret = { x: lhs.x / rhs.x, y: lhs.y / rhs.y };
        return !!typed ? new Vector2(ret.x, ret.y) : ret;
    }

    /**
     * Divide a vector by a number
     * @param {Vector2} lhs left hand side of the operator
     * @param {number} rhs right hand side of the operator
     * @param {Boolean} typed returns result of type Vector2 when true
     * otherwise returns simple javascript object with x and y coordinates.
     */
    static divN(lhs, rhs, typed = false) {
        const ret = { x: lhs.x / rhs, y: lhs.y / rhs };
        return !!typed ? new Vector2(ret.x, ret.y) : ret;
    }

    /**
     * Multiply two vectors
     * @param {Vector2} lhs left hand side of the operator
     * @param {Vector2} rhs right hand side of the operator
     * @param {Boolean} typed returns result of type Vector2 when true
     * otherwise returns simple javascript object with x and y coordinates.
     */
    static mul(lhs, rhs, typed = false) {
        const ret = { x: lhs.x * rhs.x, y: lhs.y * rhs.y };
        return !!typed ? new Vector2(ret.x, ret.y) : ret;
    }

    /**
     * Multiply a vector by a number
     * @param {Vector2} lhs left hand side of the operator
     * @param {number} rhs right hand side of the operator
     * @param {Boolean} typed returns result of type Vector2 when true
     * otherwise returns simple javascript object with x and y coordinates.
     */
    static mulN(lhs, rhs, typed = false) {
        const ret = { x: lhs.x * rhs, y: lhs.y * rhs };
        return !!typed ? new Vector2(ret.x, ret.y) : ret;
    }

    /**
     * Add two vectors
     * @param {Vector2} lhs left hand side of the operator
     * @param {Vector2} rhs right hand side of the operator
     * @param {Boolean} typed returns result of type Vector2 when true
     * otherwise returns simple javascript object with x and y coordinates.
     */
    static sum(lhs, rhs, typed = false) {
        const ret = { x: lhs.x + rhs.x, y: lhs.y + rhs.y };
        return !!typed ? new Vector2(ret.x, ret.y) : ret;
    }

    /**
     * Subtract two vectors
     * @param {Vector2} lhs left hand side of the operator
     * @param {Vector2} rhs right hand side of the operator
     * @param {Boolean} typed returns result of type Vector2 when true
     * otherwise returns simple javascript object with x and y coordinates.
     */
    static sub(lhs, rhs, typed = false) {
        const ret = { x: lhs.x - rhs.x, y: lhs.y - rhs.y };
        return !!typed ? new Vector2(ret.x, ret.y) : ret;
    }

    /**
     * Dot product of two vectors
     * @param {Vector2} lhs left hand side of the operator
     * @param {Vector2} rhs right hand side of the operator
     */
    static dot(lhs, rhs) {
        return lhs.x * rhs.x + lhs.y * rhs.y;
    }
}
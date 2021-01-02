import Component from "./Component.js";

/** Input receptor that buffers inputs */
export default class InputReceptor extends Component {
    constructor() {
        super('input');

        /** List of inputs buffered */
        this._buffer = new Set();
        this._downBuffer = new Set();
    }

    /**
     * Buffer an input
     * @param {*} key input key code
     */
    add(key) {
        this._buffer.add(key);
        if (!this._downBuffer.has(key)) {
            this._downBuffer.add(key);
        }
    }

    /**
     * Get the buffered input
     * @param {*} key input key code
     * @returns true if the key is in pressed state
     */
    get(key) {
        return this._buffer.has(key);
    }

    /**
     * Consume the buffered input
     * @param {*} key input key code
     * @returns true only once for the input key when it's pressed
     */
    getKeyDown(key) {
        const hasKey = this._downBuffer.has(key);
        if (hasKey) {
            this._downBuffer.delete(key);
        }
        return hasKey;
    }

    /**
     * Remove the buffered input
     * @param {*} key input key code
     */
    remove(key) {
        this._buffer.delete(key);
        this._downBuffer.delete(key);
    }

    /** Check if there is any input available */
    hasAnyInput() {
        return this._buffer.size > 0;
    }

    /**
     * Get motion on X or Y axis
     * @param {String} axis "X" or "Y" as valid argument for motion axis
     * @returns Positive integer for motion in downward and right side direction,
     * and negative integer for motion in upward and right side direction.
     * Returns 0 when there is no motion on the provided axis.
     */
    getMotion(axis) {
        if (axis === 'X') {
            if (this.get("A") || this.get('LEFT')) {
                return -1;
            } else if (this.get("D") || this.get('RIGHT')) {
                return 1;
            }
        } else if (axis === 'Y') {
            if (this.get("W") || this.get('UP')) {
                return -1;
            } else if (this.get("S") || this.get('DOWN')) {
                return 1;
            }
        }
        return 0;
    }
}
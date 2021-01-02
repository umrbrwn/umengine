const PRESSED = 1;
const RELEASED = 0;

/** Keyboard input handlers and input state manager */
export default class KeyboardState {
    constructor() {
        /** Collection of input key states */
        this.keyStates = new Map();

        /** Input key code and event handler collection */
        this.keyMap = new Map();
    }

    /**
     * Add input handlers for key code
     * @param {*} code key code from click event
     * @param {*} callback click handler callback
     */
    addMapping(code, callback) {
        this.keyMap.set(code, callback);
    }

    /**
     * Handle input event using the added key code mapping
     * @param {*} event input event
     */
    handleEvent(event) {
        const { code } = event;
        if (!this.keyMap.has(code)) {
            return;
        }

        event.preventDefault();
        const keyState = event.type === 'keydown' ? PRESSED : RELEASED;

        if (this.keyStates.get(code) === keyState) {
            return;
        }

        this.keyStates.set(code, keyState);
        this.keyMap.get(code)(keyState);
    }

    /**
     * Add source of keyboard input events
     * @param {*} source DOM element to act as input source
     */
    listenTo(source) {
        ['keydown', 'keyup'].forEach(eventName => {
            source.addEventListener(eventName, event => {
                this.handleEvent(event);
            })
        });
    }
}
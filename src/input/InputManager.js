import KeyboardState from "./KeyboardState.js";

/**
 * Input manager to set key mappings and route inputs to 
 * objects having component InputReceptor
 */
export default class InputManager {
    constructor(source) {
        this.keyboard = new KeyboardState();
        this.keyboard.listenTo(source);
        this.listeners = [];
    }

    /**
     * Set key mappings
     * @param {JSON} mapping JSON object containing key codes and input
     * key names
     */
    setKeyMapping(mapping) {
        Object.keys(mapping).forEach(key => {
            this.keyboard.addMapping(mapping[key], state =>
                this._handleKeyInput(key, state));
        });
    }

    /**
     * Handle input events
     * @param {*} key key code of clicked button
     * @param {*} state state of clicked key, it is 1 when key 
     * is pressed and 0 when released
     */
    _handleKeyInput(key, state) {
        if (state) {
            this.listeners.forEach(listener =>
                listener.input.add(key));
        } else {
            this.listeners.forEach(listener =>
                listener.input.remove(key));
        }
    }
}
import Component from "./components/Component.js";
import createComponent from "./components/componentFactory.js";

/** Game object type */
export default class GameObject {
    constructor() {
        /** Name of this game object */
        this.name = null;

        /** Tag or data of the game object */
        this.tag = null;

        /** Collection of components attached to this game object */
        this.components = [];

        /** Game object user data */
        this.data = {};

        // default transform component
        this.addComponent('transform');
    }

    /**
    * Layer at which this game object will render. Is set to
    * "default" layer when the value is not user defined
    * */
    get layer() {
        return this._layer || 'default';
    }

    set layer(value) {
        this._layer = value;
    }

    /** Game object setup on start */
    start() { }

    /** Update state of the game object */
    update() { }

    /** Post update state of the game object */
    postUpdate() { }

    /**
     * Attach game object component to extend functionality.
     * All attached components are accessible by component's name as a
     * property of game object instance
     * @param {Component} component extended type of the base Component class
     */
    attachComponent(component) {
        if (!component instanceof Component) {
            throw new Error('argument must be a Component.');
        }
        component.gameObject = this;
        component.init();
        this[component.NAME] = component;
        this.components.push(component);
    }

    /**
     * Add component to the game object. Uses component factory to
     * create component that is uniquely identified by it's NAME property.
     * @param {String} name unique name that identifies the component
     */
    addComponent(name) {
        const component = createComponent(name);
        if (!component) {
            throw new Error(`failed to create component with name '${name}'.`);
        }
        this.attachComponent(component);
    }
}
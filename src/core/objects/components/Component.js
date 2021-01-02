/** Component base type */
export default class Component {
    constructor(name) {
        /** Deriving component types must define a constant component name */
        this.NAME = name;

        /** Flag to check if component is enabled */
        this.enabled = true;

        /** Instance of game object to which the component is attached */
        this.gameObject = null;
    }

    init() { }
}
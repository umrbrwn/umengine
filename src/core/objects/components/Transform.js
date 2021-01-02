import Component from "./Component.js";
import Vector2 from "../../math/Vector2.js";

/** Transform component that provides position, scale vectors details in 2D space */
export default class Transform extends Component {
    constructor() {
        super('transform');

        /** Position of the object in 2D space to which the transform is attached */
        this.position = new Vector2(0, 0);

        /** Scale of the object in 2D space to which the transform is attached */
        this.scale = new Vector2(1, 1);
    }
}
import Transform from "./Transform.js";
import SpriteRenderer from "./SpriteRenderer.js";
import BoxCollider from "./BoxCollider.js";
import CircleCollider from "./CircleCollider.js";
import InputReceptor from "./InputReceptor.js";

export default function createComponent(name) {
    let comp = null;
    switch (name) {
        case "transform": comp = new Transform(); break;
        case "spriteRenderer": comp = new SpriteRenderer(); break;
        case "boxCollider": comp = new BoxCollider(); break;
        case "circleCollider": comp = new CircleCollider(); break;
        case "input": comp = new InputReceptor(); break;
    }
    return comp;
}
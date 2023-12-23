import Component from "./Component";

/** Transform component that provides position, scale vectors details in 2D space */
export default class Transform extends Component implements ITransform {
  /** Position of the object in 2D space to which the transform is attached */
  position: Vector = { x: 0, y: 0 };

  /** Scale of the object in 2D space to which the transform is attached */
  scale: Vector = { x: 1, y: 1 };

  constructor(gameObject: IGameObject) {
    super("transform", gameObject);
  }
}

import Component from './Component';
import { Vector2 } from '../math/Vector2';

/** Transform component that provides position, scale vectors details in 2D space */
export default class Transform extends Component implements ITransform {
  /** Position of the object in 2D space to which the transform is attached */
  position = new Vector2(0, 0);

  /** Scale of the object in 2D space to which the transform is attached */
  scale = new Vector2(1, 1);

  constructor(gameObject: IGameObject) {
    super('transform', gameObject);
  }
}

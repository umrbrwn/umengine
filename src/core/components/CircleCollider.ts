import { IComponent, ICircle, Vector, IAtom } from '../../types';
import Vector2H from '../maths/Vector2H';

/** Circle collider component */
export default class CircleCollider implements IComponent, ICircle {
  readonly name: string;
  enabled: boolean;

  /** Radius of the circle collider */
  radius: number;

  /** Offset from the position of atom */
  offset: Vector;

  constructor(readonly atom: IAtom) {
    this.name = CircleCollider.name;
    this.radius = 1;
    this.offset = Vector2H.zero();
    this.enabled = true;
  }

  /** Offsetted center position relative to atom */
  get center() {
    return Vector2H.add(this.atom.position, this.offset);
  }
}

import { IAtom, ICircle, IComponent, Vector } from '../../types';
import { Vector2H } from '../maths';

/** Circle collider component */
export class CircleCollider implements IComponent, ICircle {
  readonly name = CircleCollider.name;
  enabled: boolean;

  /** Radius of the circle collider */
  radius: number;

  /** Offset from the position of atom, defaults to zero vector */
  offset: Vector;

  constructor(readonly atom: IAtom) {
    this.radius = 1;
    this.offset = Vector2H.zero();
    this.enabled = true;
  }

  /** Offsetted center position relative to atom */
  get center() {
    return Vector2H.add(this.atom.position, this.offset);
  }
}

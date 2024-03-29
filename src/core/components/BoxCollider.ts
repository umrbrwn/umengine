import { IAtom, IComponent, IRectangle, Vector } from '../../types';
import { Vector2H } from '../maths';

/** Box collider component */
export class BoxCollider implements IComponent, IRectangle {
  readonly name = BoxCollider.name;
  enabled: boolean;

  /** Size of the box collider, defaults to scale of attached atom */
  scale: Vector;

  /** Offset from the position of atom, defaults to zero vector */
  offset: Vector;

  constructor(readonly atom: IAtom) {
    this.scale = { ...atom.scale };
    this.offset = Vector2H.zero();
    this.enabled = true;
  }

  /** Offsetted position relative to atom */
  get position() {
    return Vector2H.add(this.atom.position, this.offset);
  }

  /** Centroid of the box collider */
  get center() {
    return Vector2H.add(this.position, Vector2H.divScaler(this.scale, 2));
  }

  get topLeft() {
    return this.position;
  }

  /** Top right vertex of the box */
  get topRight() {
    return {
      x: this.position.x + this.scale.x,
      y: this.position.y,
    };
  }

  get bottomRight() {
    return Vector2H.add(this.position, this.scale);
  }

  /** Bottom left vertex of the box */
  get bottomLeft() {
    return {
      x: this.position.x,
      y: this.position.y + this.scale.y,
    };
  }

  get topEdge() {
    return {
      initial: this.topLeft,
      terminal: this.topRight,
    };
  }

  get rightEdge() {
    return {
      initial: this.topRight,
      terminal: this.bottomRight,
    };
  }

  get bottomEdge() {
    return {
      initial: this.bottomRight,
      terminal: this.bottomLeft,
    };
  }

  get leftEdge() {
    return {
      initial: this.bottomLeft,
      terminal: this.topLeft,
    };
  }
}

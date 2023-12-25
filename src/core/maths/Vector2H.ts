import { Vector } from '../../global';

/** 2D Vector math helper */
export default abstract class Vector2H {
  /** Divide two vectors */
  static div(u: Vector, v: Vector): Vector {
    return { x: u.x / v.x, y: u.y / v.y };
  }

  /** Divide a vector by a scaler value */
  static divScaler(v: Vector, scaler: number): Vector {
    return { x: v.x / scaler, y: v.y / scaler };
  }

  /** Multiply two vectors */
  static mul(u: Vector, v: Vector): Vector {
    return { x: u.x * v.x, y: u.y * v.y };
  }

  /** Multiply a vector by a scaler value */
  static mulScaler(u: Vector, scaler: number): Vector {
    return { x: u.x * scaler, y: u.y * scaler };
  }

  /** Add two vectors */
  static add(u: Vector, v: Vector): Vector {
    return { x: u.x + v.x, y: u.y + v.y };
  }

  /** Subtract two vectors */
  static sub(u: Vector, v: Vector): Vector {
    return { x: u.x - v.x, y: u.y - v.y };
  }

  /** Calculate length (magnitude) of the vector */
  static magnitude(v: Vector): number {
    return Math.sqrt(v.x ** 2 + v.y ** 2);
  }

  /** Calculate normalized vector */
  static normalize(v: Vector): Vector {
    const mag = this.magnitude(v);
    return mag > 0 ? this.divScaler(v, mag) : this.zero();
  }

  /** Dot product of two vectors */
  static dot(u: Vector, v: Vector): number {
    return u.x * v.x + u.y * v.y;
  }

  /** Check if vectors are equal */
  static equal(u: Vector, v: Vector): boolean {
    return u.x === v.x && u.y === v.y;
  }

  /** Creates zero vector */
  static zero() {
    return { x: 0, y: 0 };
  }
}

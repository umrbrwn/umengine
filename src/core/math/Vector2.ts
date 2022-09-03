/** Simple 2D vector */
export default interface IVector2 {
  x: number;
  y: number;
}

/** 2D vector type */
export class Vector2 implements IVector2 {
  x: number;
  y: number;

  constructor(x = 0, y = 0) {
    this.set(x, y);
  }

  /**
   * Set the vector components.
   * Simple object with x and y components can be passed.
   * If y component is undefined then it's set to x component.
   * @param x x-component of the vector
   * @param y y-component of the vector
   */
  set(x: number | IVector2, y: number) {
    if (typeof x === 'object' && x !== null) {
      this.x = x.x;
      this.y = x.y;
    } else if (typeof x !== 'undefined' && typeof y === 'undefined') {
      this.x = x as number;
      this.y = x as number;
    } else {
      this.x = x as number;
      this.y = y;
    }
  }

  /** Length of vector */
  get magnitude() {
    return Math.sqrt((this.x * this.x) + (this.y * this.y));
  }

  /** Normalizes this vector */
  normalize() {
    if (this.magnitude > 0) {
      const normalzied = Vector2.divN(this, this.magnitude);
      this.set(normalzied.x, normalzied.y);
    } else {
      this.set(0, 0);
    }
  }

  /** Converts the vector coordinates to string */
  toString() {
    return `${this.x},${this.y}`;
  }

  /**
   * Compare two vector to check if they are equal
   * @param lhs left hand side of the operator
   * @param rhs right hand side of the operator
   */
  static equal(lhs: IVector2, rhs: IVector2) {
    return lhs.x === rhs.x && lhs.y === rhs.y;
  }

  /**
   * Divide two vectors
   * @param lhs left hand side of the operator
   * @param rhs right hand side of the operator
   * @param typed returns result of type Vector2 when true
   * otherwise returns simple javascript object with x and y coordinates.
   */
  static div(lhs: IVector2, rhs: IVector2, typed = false): Vector2 | IVector2 {
    const ret = { x: lhs.x / rhs.x, y: lhs.y / rhs.y };
    return typed ? new Vector2(ret.x, ret.y) : ret;
  }

  /**
   * Divide a vector by a number
   * @param lhs left hand side of the operator
   * @param rhs right hand side of the operator
   * @param typed returns result of type Vector2 when true
   * otherwise returns simple javascript object with x and y coordinates.
   */
  static divN(lhs: IVector2, rhs: number, typed = false): Vector2 | IVector2 {
    const ret = { x: lhs.x / rhs, y: lhs.y / rhs };
    return typed ? new Vector2(ret.x, ret.y) : ret;
  }

  /**
   * Multiply two vectors
   * @param lhs left hand side of the operator
   * @param rhs right hand side of the operator
   * @param typed returns result of type Vector2 when true
   * otherwise returns simple javascript object with x and y coordinates.
   */
  static mul(lhs: IVector2, rhs: IVector2, typed = false): Vector2 | IVector2 {
    const ret = { x: lhs.x * rhs.x, y: lhs.y * rhs.y };
    return typed ? new Vector2(ret.x, ret.y) : ret;
  }

  /**
   * Multiply a vector by a number
   * @param lhs left hand side of the operator
   * @param rhs right hand side of the operator
   * @param typed returns result of type Vector2 when true
   * otherwise returns simple javascript object with x and y coordinates.
   */
  static mulN(lhs: IVector2, rhs: number, typed = false): Vector2 | IVector2 {
    const ret = { x: lhs.x * rhs, y: lhs.y * rhs };
    return typed ? new Vector2(ret.x, ret.y) : ret;
  }

  /**
   * Add two vectors
   * @param lhs left hand side of the operator
   * @param rhs right hand side of the operator
   * @param typed returns result of type Vector2 when true
   * otherwise returns simple javascript object with x and y coordinates.
   */
  static sum(lhs: IVector2, rhs: IVector2, typed = false): Vector2 | IVector2 {
    const ret = { x: lhs.x + rhs.x, y: lhs.y + rhs.y };
    return typed ? new Vector2(ret.x, ret.y) : ret;
  }

  /**
   * Subtract two vectors
   * @param lhs left hand side of the operator
   * @param rhs right hand side of the operator
   * @param typed returns result of type Vector2 when true
   * otherwise returns simple javascript object with x and y coordinates.
   */
  static sub(lhs: IVector2, rhs: IVector2, typed = false): Vector2 | IVector2 {
    const ret = { x: lhs.x - rhs.x, y: lhs.y - rhs.y };
    return typed ? new Vector2(ret.x, ret.y) : ret;
  }

  /**
   * Dot product of two vectors
   * @param lhs left hand side of the operator
   * @param rhs right hand side of the operator
   */
  static dot(lhs: IVector2, rhs: IVector2) {
    return lhs.x * rhs.x + lhs.y * rhs.y;
  }
}

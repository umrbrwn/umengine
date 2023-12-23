import { Vector2H } from "core/math";
import { ICircle, ILine, IRectangle } from "./shapes";

/** Geometrical intersection between 2D shapes */
export default class Intersection {
  /**
   * Test if the given circle is intersecting with the given rectangle
   * @param circle circle to test intersection with
   * @param rect rect to intersect with the given circle
   */
  static intersectCircleToRectangle(circle: ICircle, rect: IRectangle) {
    return (
      this.isPointInsideRectangle(circle.center, rect) ||
      this.intersectCircleToLine(circle, rect.topEdge) ||
      this.intersectCircleToLine(circle, rect.rightEdge) ||
      this.intersectCircleToLine(circle, rect.bottomEdge) ||
      this.intersectCircleToLine(circle, rect.leftEdge)
    );
  }

  /**
   * Test if the given circle is intersecting with the given line.
   * reference: https://stackoverflow.com/questions/1073336/circle-line-segment-collision-detection-algorithm
   * @param circle circle to test intersection with
   * @param line line to intersect with the given circle
   */
  static intersectCircleToLine(circle: ICircle, line: ILine) {
    const ac = Vector2H.sub(circle.center, line.initial);
    const ab = Vector2H.sub(line.terminal, line.initial);
    const ab2 = Vector2H.dot(ab, ab);
    const acab = Vector2H.dot(ac, ab);
    let t = acab / ab2;
    // eslint-disable-next-line no-nested-ternary
    t = t < 0 ? 0 : t > 1 ? 1 : t;
    // h = ((ab * t) + lineFrom) - circleLocation;
    const h = Vector2H.sub(
      Vector2H.add(Vector2H.mulScaler(ab, t), line.initial),
      circle.center
    );
    const h2 = Vector2H.dot(h, h);
    return h2 <= circle.radius * circle.radius;
  }

  /**
   * Test if the given point is inside bounds of the rectangle in 2D space
   * @param point point to test in or outside the rectangle
   * @param rect rectangle to test given point with
   * @returns true when the point is inside the rectangle otherwise false
   */
  static isPointInsideRectangle(point: Vector, rect: IRectangle) {
    return (
      point.x > rect.topLeft.x &&
      point.x < rect.bottomRight.x &&
      point.y > rect.topLeft.y &&
      point.y < rect.bottomRight.y
    );
  }
}

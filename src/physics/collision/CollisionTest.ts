import { ICircle, StraightLine, Vector, IRectangle, IAtom } from '../../types';
import { Vector2H } from '../../core/maths';
import { BoxCollider, CircleCollider } from '../../core/components';

/**
 * Test if the given circle is intersecting with the given line.
 * reference: https://stackoverflow.com/questions/1073336/circle-line-segment-collision-detection-algorithm
 * @param circle circle to test intersection with
 * @param line line to intersect with the given circle
 */
function testCircleToLine(circle: ICircle, line: StraightLine) {
  const ac = Vector2H.sub(circle.center, line.initial);
  const ab = Vector2H.sub(line.terminal, line.initial);
  const ab2 = Vector2H.dot(ab, ab);
  const acab = Vector2H.dot(ac, ab);
  const t = Math.max(0, Math.min(1, acab / ab2));
  // h = ((ab * t) + lineFrom) - circleLocation;
  const h = Vector2H.sub(Vector2H.add(Vector2H.mulScaler(ab, t), line.initial), circle.center);
  const h2 = Vector2H.dot(h, h);
  return h2 <= circle.radius * circle.radius;
}

/**
 * Test if the given point is inside bounds of the rectangle in 2D space
 * @param point point to test in or outside the rectangle
 * @param rect rectangle to test given point with
 * @returns true when the point is inside the rectangle otherwise false
 */
function isPointInsideRectangle(point: Vector, rect: IRectangle) {
  return (
    point.x > rect.topLeft.x && point.x < rect.bottomRight.x && point.y > rect.topLeft.y && point.y < rect.bottomRight.y
  );
}

/**
 * Test if the given circle is intersecting with the given rectangle
 * @param circle circle to test intersection with
 * @param rect rect to intersect with the given circle
 */
function intersectCircleToRectangle(circle: ICircle, rect: IRectangle) {
  return (
    isPointInsideRectangle(circle.center, rect) ||
    testCircleToLine(circle, rect.topEdge) ||
    testCircleToLine(circle, rect.rightEdge) ||
    testCircleToLine(circle, rect.bottomEdge) ||
    testCircleToLine(circle, rect.leftEdge)
  );
}

/** Test two Axis Aligned Bounding boxes are colliding */
function testAABB(rect1: IRectangle, rect2: IRectangle) {
  return (
    rect1.topLeft.x <= rect2.topEdge.terminal.x &&
    rect1.topEdge.terminal.x >= rect2.topLeft.x &&
    rect1.topLeft.y <= rect2.bottomEdge.initial.y &&
    rect1.bottomEdge.terminal.y >= rect2.topLeft.y
  );
}

/** Test two circles are colliding */
function testCircleCollision(circle1: ICircle, circle2: ICircle) {
  const dx = circle1.center.x - circle2.center.x;
  const dy = circle1.center.y - circle2.center.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  return distance < circle1.radius + circle2.radius;
}

/** Test collision between two atoms */
export function testCollision(body: IAtom, other: IAtom) {
  if (body === other) {
    return false;
  }

  const bodyBox = body.components.get<BoxCollider>(BoxCollider.name);
  const bodyCircle = body.components.get<CircleCollider>(CircleCollider.name);

  if (!(bodyBox?.enabled || bodyCircle?.enabled)) {
    return false;
  }

  const otherBox = other.components.get<BoxCollider>(BoxCollider.name);
  const otherCircle = other.components.get<CircleCollider>(CircleCollider.name);

  if (!(otherBox?.enabled || otherCircle?.enabled)) {
    return false;
  }

  let hit = false;
  if (bodyBox && otherBox) {
    hit = testAABB(bodyBox, otherBox);
  } else if (bodyCircle && otherCircle) {
    hit = testCircleCollision(bodyCircle, otherCircle);
  } else if (bodyBox && otherCircle) {
    hit = intersectCircleToRectangle(otherCircle, bodyBox);
  } else if (bodyCircle && otherBox) {
    hit = intersectCircleToRectangle(bodyCircle, otherBox);
  }
  return hit;
}

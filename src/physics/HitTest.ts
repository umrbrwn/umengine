import BoxCollider from 'core/components/BoxCollider';
import CircleCollider from 'core/components/CircleCollider';
import Intersection from './Intersection';

export type NamedType = { name: string, enabled: boolean };

export default class HitTest {
  /**
   * Test collision of two physics bodies represented using Geometrical shape
   * @param {*} body first body to test
   * @param {*} candidate second body to test
   * @returns true when collision is detected
   */
  static test<T extends NamedType, K extends NamedType>(body: T, candidate: K) {
    if (!HitTest.canCollider(body, candidate)) {
      return false;
    }
    const bothRect = body.name === 'boxCollider' && candidate.name === 'boxCollider';
    const bothCircle = body.name === 'circleCollider' && candidate.name === 'circleCollider';

    let colliding = false;
    if (bothRect) {
      colliding = this.testAABB(body, candidate);
    } else if (bothCircle) {
      colliding = this.testCircleCollision(body, candidate);
    } else if (body.name === 'boxCollider' && candidate.name === 'circleCollider') {
      colliding = Intersection.intersectCircleToRectangle(candidate, body);
    } else if (body.name === 'circleCollider' && candidate.name === 'boxCollider') {
      colliding = Intersection.intersectCircleToRectangle(body, candidate);
    }
    return colliding;
  }

  /**
   * Test collision of two Axis Aligned Bounding Bodies for given box colliders
   * @param rect1 first box collider to test
   * @param rect2 second box collider to test
   * @returns true when collision is detected, false otherwise
   */
  static testAABB(rect1: BoxCollider, rect2: BoxCollider) {
    return rect1.topLeft.x <= rect2.topRight.x
      && rect1.topRight.x >= rect2.topLeft.x
      && rect1.topLeft.y <= rect2.bottomLeft.y
      && rect1.bottomLeft.y >= rect2.topLeft.y;
  }

  /**
   * Test collision of two circle collider bodies
   * @param circle1 first circle collider to test
   * @param circle2 second circle collider to test
   * @returns true when collision is detected, false otherwise
   */
  static testCircleCollision(circle1: CircleCollider, circle2: CircleCollider) {
    const dx = circle1.center.x - circle2.center.x;
    const dy = circle1.center.y - circle2.center.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    return distance < circle1.radius + circle2.radius;
  }

  /**
   * Bodies can only collide if they have active colliders,
   * body cannot collide with itself
   * @param {*} body collider body
   * @param {*} candidate candidate that body can potentially collide with
   */
  static canCollider(body, candidate) {
    return body && candidate && body.enabled && candidate.enabled
      && body !== candidate;
  }
}

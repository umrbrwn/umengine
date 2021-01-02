import Intersection from "../core/math/Intersection.js";
import BoxCollider from "../core/objects/components/BoxCollider.js";
import CircleCollider from "../core/objects/components/CircleCollider.js";

export default class HitTest {

    /**
     * Test collision of two physics bodies represented using Geometrical shape
     * @param {*} body first body to test
     * @param {*} candidate second body to test
     * @returns true when collision is detected
     */
    static test(body, candidate) {
        if (!HitTest.canCollider(body, candidate)) {
            return false;
        }

        const bothRect = body.NAME === 'boxCollider' && candidate.NAME === 'boxCollider';
        const bothCircle = body.NAME === 'circleCollider' && candidate.NAME === 'circleCollider';

        let colliding = false;
        if (bothRect) {
            colliding = this.testAABB(body, candidate);
        } else if (bothCircle) {
            colliding = this.testCircleCollision(body, candidate);
        } else {
            if (body.NAME === 'boxCollider' && candidate.NAME === 'circleCollider') {
                colliding = Intersection.intersectCircleToRectangle(candidate, body);
            } else if (body.NAME === 'circleCollider' && candidate.NAME === 'boxCollider') {
                colliding = Intersection.intersectCircleToRectangle(body, candidate);
            }
        }
        return colliding;
    }

    /**
     * Test collision of two Axis Aligned Bounding Bodies for given box colliders
     * @param {BoxCollider} rect1 first box collider to test
     * @param {BoxCollider} rect2 second box collider to test
     * @returns true when collision is detected, false otherwise
     */
    static testAABB(rect1, rect2) {
        return rect1.topLeft.x <= rect2.topRight.x
            && rect1.topRight.x >= rect2.topLeft.x
            && rect1.topLeft.y <= rect2.bottomLeft.y
            && rect1.bottomLeft.y >= rect2.topLeft.y;
    }

    /**
     * Test collision of two circle collider bodies
     * @param {CircleCollider} circle1 first circle collider to test
     * @param {CircleCollider} circle2 second circle collider to test
     * @returns true when collision is detected, false otherwise
     */
    static testCircleCollision(circle1, circle2) {
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
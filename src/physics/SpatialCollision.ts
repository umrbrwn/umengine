import WorldContext from 'world/WorldContext';
import QuadTree from './QuadTree';
import HitTest from './HitTest';
import Collision from './Collision';
import { BoundingBox } from './shapes';

/** Spatial space collision detection in 2D space */
export default class SpatialCollision extends Collision {
  /** Quad tree to store spatial details of the bodies */
  private tree: QuadTree<ITransform>;

  constructor(context: WorldContext) {
    super();
    this.tree = new QuadTree({
      x: 0,
      y: 0,
      width: context.config.window.width,
      height: context.config.window.height,
    } as BoundingBox);
  }

  /** Update the state of the tree and perform collision testing */
  test() {
    this.tree.clear();
    this.tree.insert(this.bodies);

    this.bodies.forEach((body) => {
      const candidates = this.tree.fetch(body);
      candidates.forEach((candidate) => {
        // when candidate-body collision has already occured in this pass
        // then we can skip checking body-candidate collision test, since
        // they are already colliding. body doesn't collide with itself either.
        if (this.collidingBodies.has(Collision.collisionId(candidate, body))
          || body.name === candidate.name) {
          return;
        }

        // any body can have more than 1 type of colliders so each has to be tested
        const colliding = HitTest.test(body.boxCollider, candidate.boxCollider)
          || HitTest.test(body.boxCollider, candidate.circleCollider)
          || HitTest.test(body.circleCollider, candidate.boxCollider)
          || HitTest.test(body.circleCollider, candidate.circleCollider);

        this.respond(body, candidate, colliding);
      });
    });
  }
}

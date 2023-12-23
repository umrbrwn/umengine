import WorldContext from 'world/WorldContext';
import QuadTree from '../QuadTree';
import BoundingBox from './BoundingBox';
import test from './CollisionTest';
import Collision from './Collision';

/** Spatial space collision detection in 2D space */
export default class SpatialCollision extends Collision {
  private tree: QuadTree<IAtom>;

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
        if (this.colliding.has(Collision.collisionId(body, candidate))) {
          return;
        }

        // any body can have more than 1 type of colliders so each has to be tested
        const result = test(body, candidate);
        this.respond(body, candidate, result);
      });
    });
  }
}

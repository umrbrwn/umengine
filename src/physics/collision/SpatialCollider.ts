import { IAtom, Context } from '../../types';
import { Collider, GetCollisionId } from './Collider';
import { QuadTree } from './QuadTree';
import { BoundingBox } from './BoundingBox';
import { testCollision } from './CollisionTest';

/** Spatial space collision detection in 2D space */
export default class SpatialCollider extends Collider {
  private tree: QuadTree<IAtom>;

  constructor(context: Context) {
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
        if (this.colliding.has(GetCollisionId(body, candidate)[0])) {
          return;
        }

        // any body can have more than 1 type of colliders so each has to be tested
        const result = testCollision(body, candidate);
        this.respond(body, candidate, result);
      });
    });
  }
}

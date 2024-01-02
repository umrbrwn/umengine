import { IAtom, Config } from '../../types';
import { Collider, GetCollisionKey } from './Collider';
import { QuadTree } from './QuadTree';
import { BoundingBox } from './BoundingBox';
import { testCollision } from './CollisionTest';

/** Spatial space collision detection in 2D space */
export default class SpatialCollider extends Collider {
  private tree: QuadTree<IAtom>;

  constructor({ window }: Config) {
    super();
    this.tree = new QuadTree(new BoundingBox(0, 0, window.width, window.height));
  }

  /** Update the state of the tree and perform collision testing */
  test() {
    this.tree.clear();
    this.tree.insert(this.bodies);

    this.bodies.forEach((body) => {
      const candidates = this.tree.fetch(body);

      // exclude body, we don't need to test body against itself
      candidates.splice(candidates.indexOf(body), 1);

      candidates.forEach((candidate) => {
        // if body and candidate are already tested, don't need to test the other way around
        if (this.cache.has(GetCollisionKey(candidate, body))) {
          return;
        }
        const result = testCollision(body, candidate);
        this.respond(body, candidate, result);
      });
    });
  }
}

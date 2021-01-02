import QuadTree from "../core/math/QuadTree.js";
import HitTest from "./HitTest.js";
import Collision from "./Collision.js";

/** Spatial space collision detection in 2D space */
export default class SpatialCollision extends Collision {
    constructor(context) {
        super();
        /** Quad tree to store spatial details of the bodies */
        this._tree = new QuadTree({
            x: 0, y: 0,
            width: context.config.window.width,
            height: context.config.window.height
        });
    }

    /** Update the state of the tree and perform collision testing */
    test() {
        this._tree.clear();
        this._tree.insert(this.bodies);

        this.bodies.forEach(body => {
            const candidates = this._tree.fetch(body);
            candidates.forEach(candidate => {
                
                // when candidate-body collision has already occured in this pass
                // then we can skip checking body-candidate collision test, since
                // they are already colliding. body doesn't collide with itself either.
                if (this.collidingBodies.has(Collision.collisionId(candidate, body))
                    || body.name === candidate.name) {
                    return;
                }

                // any body can have more than 1 type of colliders so each has to be tested
                let colliding = HitTest.test(body.boxCollider, candidate.boxCollider)
                    || HitTest.test(body.boxCollider, candidate.circleCollider)
                    || HitTest.test(body.circleCollider, candidate.boxCollider)
                    || HitTest.test(body.circleCollider, candidate.circleCollider);

                this.respond(body, candidate, colliding);
            });
        });
    }
}
/** Collision testing base type */
export default class Collision {
    constructor() {
        /** Bodies to test for collision detection */
        this.bodies = [];

        /** Name pairs of bodies that are currently colliding */
        this.collidingBodies = new Set();
    }

    /** Perform collision testing on physics bodies in the system */
    test() { }

    /**
     * Add physics body in collision system
     * @param {*} obj single or an array of game objects having physics body
     */
    addBody(obj) {
        const filteredBodies = Collision._filterPhysicsBodies(obj);
        if (filteredBodies.length) {
            this.bodies = this.bodies.concat(filteredBodies);
        }
    }

    /** Clear list of the bodies */
    clear() {
        this.bodies.length = 0;
    }

    /**
     * Collision response keeps track of collision between bodies
     * and runs onCollisionXXX callbacks based on the collision state
     * @param {*} body body tested for collision
     * @param {*} candidate candidate that the body has been tested for collision with
     * @param {*} colliding true when the collision has occured between body and candidate
     */
    respond(body, candidate, colliding) {
        const id = Collision.collisionId(body, candidate);
        if (colliding) {
            if (!this.collidingBodies.has(id)) {
                this.collidingBodies.add(id);
            }
            candidate.onCollision && candidate.onCollision(body);
            body.onCollision && body.onCollision(candidate);
        } else if (this.collidingBodies.has(id)) {
            this.collidingBodies.delete(id);
            candidate.onCollisionEnd && candidate.onCollisionEnd(body);
            body.onCollisionEnd && body.onCollisionEnd(candidate);
        }
    }

    /**
     * Filter physics bodies that can act in the collision system
     * @param {*} obj singe or array of objects
     */
    static _filterPhysicsBodies(obj) {
        let bodies = [];
        if (typeof obj === 'object') {
            const hasColliders = Collision._hasCollider(obj);
            if (hasColliders) {
                bodies.push(obj);
            }
        } else if (obj instanceof Array) {
            bodies.concat(obj.filter(current => Collision._hasCollider(current)));
        }
        return bodies;
    }

    /**
     * Check if the body has collider attached
     * @param {*} body game object that may have collider attached to it
     */
    static _hasCollider(body) {
        return body.components.some(comp =>
            comp.NAME.includes('Collider'));
    }

    static collisionId(body, candidate) {
        return `${body.name}_${body.layer}:${candidate.name}_${candidate.layer}`;
    }
}
/** Collision testing base type */
export default class Collision {
  /** Bodies to test for collision detection */
  protected bodies: IPhysicsBody[] = [];

  /** Name pairs of bodies that are currently colliding */
  protected collidingBodies = new Set();

  /** Perform collision testing on physics bodies in the system */
  // eslint-disable-next-line class-methods-use-this
  test() { }

  /**
   * Add physics body in collision system
   * @param object physics body belonging to a game object
   */
  addBody(object: IPhysicsBody) {
    this.bodies.push(object);
  }

  /** Clear list of the bodies */
  clear() {
    this.bodies.length = 0;
  }

  /**
   * Collision response keeps track of collision between bodies
   * and runs onCollisionXXX callbacks based on the collision state
   * @param body body tested for collision
   * @param candidate candidate that the body has been tested for collision with
   * @param colliding true when the collision has occured between body and candidate
   */
  respond(body: IPhysicsBody, candidate: IPhysicsBody, colliding: boolean) {
    const id = Collision.collisionId(body, candidate);
    if (colliding) {
      if (!this.collidingBodies.has(id)) {
        this.collidingBodies.add(id);
      }
      candidate.onCollision(body);
      body.onCollision(candidate);
    } else if (this.collidingBodies.has(id)) {
      this.collidingBodies.delete(id);
      candidate.onCollisionEnd(body);
      body.onCollisionEnd(candidate);
    }
  }

  static collisionId = (body: IPhysicsBody, candidate: IPhysicsBody) =>
    // eslint-disable-next-line implicit-arrow-linebreak
    `${body.gameObject.name}_${body.gameObject.layer}:${candidate.gameObject.name}_${candidate.gameObject.layer}`;
}

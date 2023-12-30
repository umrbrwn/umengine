import { IAtom } from '../../types';

/** Collision testing base type */
export default abstract class Collision {
  /** Bodies present in this collision system */
  protected bodies: IAtom[] = [];

  /** Bodies that currently in a collision */
  protected colliding = new Set<string>();

  /** Test collision on the bodies */
  abstract test(): void;

  /** Add body in the collision system */
  addBody(body: IAtom) {
    this.bodies.push(body);
  }

  /** Remove all the bodies from the collision system */
  clear() {
    this.bodies.length = 0;
  }

  /**
   * Notify both bodies if collision is starting or ending
   * @param body body tested for collision
   * @param other other body starting or ending collision
   * @param hit are both of the bodies colliding
   */
  respond(body: IAtom, other: IAtom, hit: boolean) {
    const id = Collision.collisionId(body, other);
    const revId = Collision.collisionId(other, body);
    if (hit) {
      this.colliding.add(id).add(revId);
      other.collision(body);
      body.collision(other);
    } else if (this.colliding.has(id) || this.colliding.has(revId)) {
      this.colliding.delete(id);
      this.colliding.delete(revId);
      other.collisionEnd(body);
      body.collisionEnd(other);
    }
  }

  static collisionId = (body: IAtom, other: IAtom) => `${body.id}:${other.id}`;
}

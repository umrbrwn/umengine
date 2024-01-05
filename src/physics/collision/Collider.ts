import { IAtom } from '../../types';

export const GetCollisionKey = (body: IAtom, other: IAtom) => `${body.id}:${other.id}`;

/** Collision testing base type */
export abstract class Collider {
  /** Bodies present in this collision system */
  protected bodies: IAtom[] = [];

  /** Collision cache to prevent redundant testing */
  protected cache = new Set<string>();

  /** Bodies that are currently colliding */
  private colliding = new Set<string>();

  /** Test collision on the bodies */
  abstract test(): void;

  /** Add body in the collision system */
  addBody(body: IAtom) {
    this.bodies.push(body);
  }

  /** Remove body from collision system */
  removeBody(body: IAtom) {
    const index = this.bodies.findIndex((b) => b.id === body.id) || -1;
    this.bodies.splice(index, 1);
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
    const key = GetCollisionKey(body, other);
    this.cache.add(key);
    if (hit) {
      // track that these bodies are colliding
      this.colliding.add(key);
      // notify both bodies that they are colliding
      other.collision(body);
      body.collision(other);
    } else if (this.colliding.has(key)) {
      // clear collision tracking and invalidate cache
      this.colliding.delete(key);
      this.cache.delete(key);
      // notify both bodies that their collision has ended
      other.collisionEnd(body);
      body.collisionEnd(other);
    }
  }
}

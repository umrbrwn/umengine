import * as components from "core/components";

declare global {
  /** Game object */
  interface IGameObject {
    /** Name of this game object */
    name: string;

    /** Tag or data of the game object */
    tag: any;

    /** Default transform component */
    transform: components.Transform;

    /** Collection of components attached to this game object */
    components: components.Component[];

    /** Game object user data */
    data: any;

    /** Layer at which this game object will render */
    layer: string;

    /** Optional physics body attached to the game object where physics act upon */

    physicBody: IPhysicsBody;

    /** Game object setup on start */
    start(): void;

    /** Update state of the game object */
    update(): void;

    /** Post-update state of the game object */
    postUpdate(): void;
  }

  /** Physics body */
  interface IPhysicsBody {
    /** Attached game object */
    gameObject: IGameObject;

    /**
     * On collision handler
     * @param other body that it has collided with
     */
    onCollision(other: IPhysicsBody): void;

    /**
     * On collision end handler
     * @param other body that it has collided with
     */
    onCollisionEnd(other: IPhysicsBody): void;
  }
}

export { };

import Component from './Component';
import { eventEmitter } from '../../events/index';

/** Sprite rendering component */
export default class SpriteRenderer extends Component {
  /** Renderable image as sprite */
  sprite: CanvasImageSource;

  private _depth = -1;

  constructor(gameObject: IGameObject) {
    super('spriteRenderer', gameObject);
  }

  /**
   * Set sprite of the sprite
   * @param sprite renderable image
   */
  setSprite(sprite: CanvasImageSource) {
    this.sprite = sprite;
  }

  /**
  * Rendering order of the sprite on associated game object's
  * current layer. Defaults to current index of the game object on
  * it's current layer when this object is first added into the scene.
  * When a whole number value is set before adding to scene
  * then the set value is retained
  */
  get depth() {
    return this._depth;
  }

  set depth(value) {
    this._depth = value;
    eventEmitter.emit('SPRITE_RENDERER_DEPTH_CHANGED', this.gameObject.layer);
  }

  /**
   * Render the sprite on the given context
   * @param context context to render the sprite in
   */
  render(context: CanvasRenderingContext2D) {
    context.drawImage(
      this.sprite,
      this.gameObject.transform.position.x,
      this.gameObject.transform.position.y,
    );
  }
}
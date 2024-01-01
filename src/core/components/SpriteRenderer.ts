import { IComponent, IRenderer, IAtom } from '../../types';
import { systemEvents } from '../events/internal';

/** Sprite rendering component */
export class SpriteRenderer implements IComponent, IRenderer {
  name: string;
  enabled: boolean;

  /** Renderable image */
  sprite: CanvasImageSource;

  private _order = -1;

  constructor(
    readonly atom: IAtom,
    sprite: CanvasImageSource,
  ) {
    this.name = SpriteRenderer.name;
    this.sprite = sprite;
    this.enabled = true;
  }

  /**
   * The order in which this sprite renders.
   *
   * Defaults to current index of the atom on it's current layer
   * when this atom is first added into the scene.
   *
   * When a whole number value is set before adding to scene
   * then the set value is retained
   */
  get order() {
    return this._order;
  }

  set order(value) {
    this._order = value;
    systemEvents.emit('RENDERER_DEPTH_CHANGED', this.atom.layer);
  }

  /** Renders the sprite */
  render(context: OffscreenCanvasRenderingContext2D) {
    context.drawImage(this.sprite, this.atom.position.x, this.atom.position.y);
  }
}

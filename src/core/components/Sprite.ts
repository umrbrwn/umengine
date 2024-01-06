import { IAtom, IComponent, IRenderable } from '../../types';
import { systemEvents } from '../events/internal';

/** Sprite rendering component */
export class Sprite implements IComponent, IRenderable {
  readonly name = Sprite.name;
  enabled: boolean;

  /** Renderable image */
  image: CanvasImageSource;

  private _order = -1;

  constructor(readonly atom: IAtom) {
    this.enabled = true;
  }

  /**
   * Determines the rendering order of this sprite within its layer.
   *
   * The order defaults to the current index of the atom within its layer
   * when the atom is first added to the scene.
   *
   * If a whole number value is set before adding the atom to the scene,
   * the specified value will be retained.
   */
  get order() {
    return this._order;
  }

  set order(value) {
    this._order = value;
    systemEvents.emit('RENDERING_ORDER_CHANGED', this.atom.layer);
  }

  /** Renders the sprite */
  render(context: OffscreenCanvasRenderingContext2D) {
    if (this.enabled) {
      context.drawImage(this.image, this.atom.position.x, this.atom.position.y);
    }
  }
}

export type Vector = { x: number; y: number };

export interface ITransform {
  /** Position on the plane */
  position: Vector;

  /** The size in the plane */
  scale: Vector;
}

/** Component type to extends an atom's functionality */
export interface IComponent {
  /** Deriving component types must define a unique component name */
  readonly name: string;

  /** Atom to which the component is attached */
  atom: IAtom;

  /** Is component enable */
  enabled: boolean;

  /** Called once when attached to an atom, to initialize default values with respect to attached atom */
  // init(): void;
}

type ComponentType = 'BoxCollider' | 'CircleCollider' | 'FixedBody' | 'Sprite';

/** Component collection */
export interface IComponentMap {
  /** Add component to the atom */
  add<T extends IComponent>(component: ComponentType): T;

  /** Remove component from the atom */
  remove(name: ComponentType): void;

  /** Get component by name */
  get<T extends IComponent>(name: ComponentType): T;

  /** Query components matching a criteria */
  query(predicate: (component: IComponent) => boolean): IComponent[];
}

export interface ILifecycleHooks {
  /** Called once when attaching to a scene */
  init(): void;

  /** Called once every frame */
  update(): void;

  /** Called once after rendering current frame */
  postUpdate(): void;
}

export interface IPhysicsHooks {
  /** Called when atom collides with another atom */
  collision(other: IAtom): void;

  /** Called when collision ends with with another atom */
  collisionEnd(other: IAtom): void;
}

/** Basic building block of the game engine. */
export interface IAtom extends ITransform, ILifecycleHooks, IPhysicsHooks {
  /** Unique id */
  readonly id: number;

  /** Friendly name */
  name: string;

  /** Tag anything */
  tag?: string | number;

  /** Collection of components making up this atom */
  components: IComponentMap;

  /** Any user data */
  data: Record<string, unknown>;

  /** Layer at which this atom will render */
  layer: string;
}

export interface ICircle {
  center: Vector;
  radius: number;
}

export type StraightLine = {
  /** Start of the line */
  initial: Vector;

  /** End of the line */
  terminal: Vector;
};

export interface IRectangle {
  /** Top left vertex of the rectangle */
  topLeft: Vector;

  /** Bottom right vertex of the rectangle */
  bottomRight: Vector;

  /** Top edge of the rectangle */
  topEdge: StraightLine;

  /** Right edge of the rectangle */
  rightEdge: StraightLine;

  /** Bottom edge of the rectangle */
  bottomEdge: StraightLine;

  /** Left edge of the rectangle */
  leftEdge: StraightLine;
}

export interface IRenderable {
  /** Order in which this renderer will work */
  order: number;

  /** Render any drawable item on the given context */
  render(context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D): void;
}

export type InputKeymap = Record<string, string>;

export type Config = {
  window: {
    title: string;
    width: number;
    height: number;
    backgroundColor: string;
  };
  physics: { collider: string };
  keymap: InputKeymap;
};

export type Context = {
  /** Rendering context */
  renderingContext: CanvasRenderingContext2D;

  /** Audio output context */
  audioContext: AudioContext;

  /** System configurations */
  config: Config;

  /** Data store */
  store: Record<string, unknown>;
};

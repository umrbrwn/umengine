export type Vector = { x: number; y: number };

export interface ITransform {
  /** Position on the plane */
  position: Vector;

  /** The size in the plane */
  scale: Vector;
}

/** Component that extends functionality of atom */
export interface IComponent {
  /** Deriving component types must define a unique component name */
  readonly name: string;

  /** Target object to which component is attached */
  readonly atom: IAtom;

  /** Is component enable */
  enabled: boolean;
}

/** Component collection */
export interface IComponentMap {
  /** Add component to the atom */
  add(component: IComponent): void;

  /** Remove component from the atom */
  remove(name: string): void;

  /** Get component by name */
  get<T extends IComponent>(name: string): T;

  /** Query components matching a criteria */
  query(predicate: (component: IComponent) => boolean): IComponent[];
}

export interface IStateHooks {
  /** Called once when attaching atom to a scene */
  setup(): void;

  /** Called in each frame to update state of atom */
  update(): void;

  /** Called after updating state of atom */
  postUpdate(): void;
}

export interface IPhysicsHooks {
  /** Called when atom collides with another atom */
  collision(other: IAtom): void;

  /** Called when collision ends with with another atom */
  collisionEnd(other: IAtom): void;
}

/** Basic building block of the game engine. */
export interface IAtom extends ITransform, IStateHooks, IPhysicsHooks {
  /** Unique id */
  readonly id: string;

  /** Friendly name */
  name: string;

  /** Tag anything */
  tag?: any;

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

export interface IRenderer {
  /** Order in which this renderer will work */
  order: number;

  /** Renders any drawable item on the given context */
  render(context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D): void;
}

/** User friendly key names to internal key code mapping */
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

  /** User data */
  store: Record<string, unknown>;
};

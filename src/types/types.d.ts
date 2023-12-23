type Vector = { x: number; y: number };

interface ITransform {
  /** Position on the plane */
  position: Vector;

  /** The size in the plane */
  scale: Vector;
}

/** Component that extends functionality of atom */
interface IComponent {
  /** Deriving component types must define a unique component name */
  readonly name: string;

  /** Target object to which component is attached */
  readonly atom: IAtom;

  /** Is component enable */
  enabled: boolean;
}

/** Component collection */
interface IComponentMap {
  /** Add component to the atom */
  add(component: IComponent): void;

  /** Remove component from the atom */
  remove(name: string): void;

  /** Get component by name */
  get<T extends IComponent>(name: string): T;

  /** Query components matching a criteria */
  query(predicate: (component: IComponent) => boolean): IComponent[];
}

interface IStateHooks {
  /** Called once to setup this atom */
  setup(): void;

  /** Called in each frame to update state of atom */
  update(): void;

  /** Called after updating state of atom */
  postUpdate(): void;
}

interface IPhysicsHooks {
  /** Called when atom collides with another atom */
  collision(other: IAtom): void;

  /** Called when collision ends with with another atom */
  collisionEnd(other: IAtom): void;
}

/** Basic building block of the game engine. */
interface IAtom extends ITransform, IStateHooks, IPhysicsHooks {
  /** Unique id */
  readonly id: string;

  /** Friendly name */
  name: string;

  /** Tag anything */
  tag?: any;

  /** Collection of components making up this atom */
  components: IComponentMap;

  /** Any user data */
  data?: Record<string, unknown>;

  /** Layer at which this atom will render */
  layer: string;
}

interface ICircle {
  center: Vector;
  radius: number;
}

type StraightLine = {
  /** Start of the line */
  initial: Vector;

  /** End of the line */
  terminal: Vector;
};

interface IRectangle {
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

interface IRenderer {
  /** Order in which this renderer will work */
  order: number;

  /** Renders any drawable item on the given context */
  render(context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D): void;
}

type Config = {
  window: {
    title: string;
    width: number;
    height: number;
    backgroundColor: string;
  };
  physics: { collider: string };
};

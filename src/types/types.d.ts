/** 2D vector type */
declare type Vector = {
  x: number;
  y: number;
};

interface ITransform {
  /** Position of the object on the plane */
  position: Vector;

  /** The size of the object */
  scale: Vector;
}

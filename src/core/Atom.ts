/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable class-methods-use-this */

import { IAtom, Vector, IComponentMap } from '../types';
import { ComponentMap } from './components/ComponentMap';
import { Vector2H } from './maths';

let counter = Number.MIN_SAFE_INTEGER;
const generateId = () => ++counter;

export class Atom implements IAtom {
  readonly id: number;
  name: string;
  tag?: any;
  position: Vector;
  scale: Vector;
  components: IComponentMap;
  data: Record<string, unknown>;
  layer: string;

  constructor(name: string) {
    this.id = generateId();
    this.name = name;
    this.position = Vector2H.zero();
    this.scale = { x: 1, y: 1 };
    this.components = new ComponentMap();
    this.data = {};
    this.layer = 'default';
  }

  init(): void {}

  update(): void {}

  postUpdate(): void {}

  collision(other: IAtom): void {}

  collisionEnd(other: IAtom): void {}
}

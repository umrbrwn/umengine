import { IAtom, IComponent } from 'types';

/** Immoveable object component, physics forces do not affect it, and two fixed bodies cannot collide. */
export class FixedBody implements IComponent {
  readonly name = FixedBody.name;
  enabled: boolean;

  constructor(readonly atom: IAtom) {
    this.enabled = true;
  }
}

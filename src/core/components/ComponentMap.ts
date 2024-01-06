import { IComponentMap, IComponent, IAtom, ComponentType } from '../../types';
import * as Components from '.';
import { systemEvents } from '../events/internal';

/** @internal */
export class ComponentMap implements IComponentMap {
  private readonly map: Map<string, IComponent>;

  constructor(private readonly atom: IAtom) {
    this.map = new Map<string, IComponent>();
  }

  add<T extends IComponent>(name: ComponentType): T {
    if (this.map.has(name)) {
      throw new Error(`${name} component already exists.`);
    }
    const type = Components[name];
    if (!type) {
      throw new Error(`${name} is not a valid component type.`);
    }
    // eslint-disable-next-line new-cap
    const component = new type(this.atom);
    this.map.set(name, component);
    return component as T;
  }

  remove(name: ComponentType): void {
    const component = this.get(name);
    if (component) {
      systemEvents.emit('COMPONENT_REMOVED', component);
      this.map.delete(name);
    }
  }

  get<T extends IComponent>(name: ComponentType): T {
    return this.map.get(name) as T;
  }

  query(predicate: (component: IComponent) => boolean): IComponent[] {
    return Array.from(this.map.values()).filter((component) => predicate(component));
  }
}

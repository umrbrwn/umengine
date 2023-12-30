import { IComponentMap, IComponent } from '../../types';

export default class ComponentMap implements IComponentMap {
  private readonly map: Map<string, IComponent>;

  constructor() {
    this.map = new Map<string, IComponent>();
  }

  add(component: IComponent): void {
    if (this.map.has(component.name)) {
      throw new Error(`"${component.name}" component already exists.`);
    }
    this.map.set(component.name, component);
  }

  remove(name: string): void {
    this.map.delete(name);
  }

  get<T extends IComponent>(name: string): T {
    return this.map.get(name) as T;
  }

  query(predicate: (component: IComponent) => boolean): IComponent[] {
    return Array.from(this.map.values()).filter((component) => predicate(component));
  }
}

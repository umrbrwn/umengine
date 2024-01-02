import { Config } from '../../types';
import SpatialCollider from './SpatialCollider';

export * from './Collider';

/** Factory to create collision system */
export function createCollider(name: string, config: Config) {
  switch (name) {
    case 'spatial':
      return new SpatialCollider(config);
    default:
      throw new Error(`Collider "${name}" not found.`);
  }
}

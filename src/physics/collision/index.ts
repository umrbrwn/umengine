import { Context } from '../../types';
import SpatialCollider from './SpatialCollider';

export * from './Collider';

/** Factory to create collision system */
export function createCollider(name: string, context: Context) {
  switch (name) {
    case 'spatial':
      return new SpatialCollider(context);
    default:
      throw new Error(`Collider "${name}" not found.`);
  }
}

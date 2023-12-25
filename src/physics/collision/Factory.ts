import { Context } from '../../world';
import SpatialCollision from './SpatialCollision';

/** Factory to create collision system */
export default function createCollisionSystem(name: string, context: Context) {
  switch (name) {
    case 'spatial':
      return new SpatialCollision(context);
    default:
      throw new Error(`Collision system "${name}" not found.`);
  }
}

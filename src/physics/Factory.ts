import WorldContext from 'world/WorldContext';
import SpatialCollision from './collision/SpatialCollision';

/** Factory to create collision system */
export default function createCollisionSystem(name: string, context: WorldContext) {
  switch (name) {
    case 'spatial':
      return new SpatialCollision(context);
    default:
      throw new Error(`Collision system "${name}" not found.`);
  }
}

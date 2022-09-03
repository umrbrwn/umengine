/* eslint-disable import/prefer-default-export */
import WorldContext from 'world/WorldContext';
import SpatialCollision from './SpatialCollision';

/** Factory to create collision system */
export function createCollisionSystem(name: string, context: WorldContext) {
  let system;
  switch (name) {
    case 'spatial':
      system = new SpatialCollision(context);
      break;
    default:
      system = null;
      break;
  }
  return system;
}

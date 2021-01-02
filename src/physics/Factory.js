import SpatialCollision from "./SpatialCollision.js";

/** Factory to create collision system */
export function createCollisionSystem(name, context) {
    let system;
    switch (name) {
        case 'spatial':
            system = new SpatialCollision(context);
            break;
    }
    return system;
}
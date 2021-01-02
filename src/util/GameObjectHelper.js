import GameObject from "../core/objects/GameObject.js";

/**
 * Get or generate new name for a game object
 * @param {GameObject} object game object to get the name for
 * @param {*} layers layers present in the layer manager
 */
export function getObjectName(object, layers) {
    let name = object.name;
    if (name === null || name.trim() === '') {
        const objectsCount = layers.reduce((acc, curr) => acc + curr.objects.size, 0);
        name = `unnamed_go_${objectsCount}`;
    }
    return name;
}
import * as components from 'core/components';
import Layer from 'scenes/Layer';

export default class Creator {
  static createObject(name: string) {
    const obj = {
      name,
      components: [] as components.Component[],
      layer: 'default',
      data: {},
    } as IGameObject;
    Creator.addComponent('transform', obj);
    return obj;
  }

  static addComponent(name: string, gameObject: IGameObject) {
    /* eslint-disable no-new */
    switch (name) {
      case 'transform': new components.Transform(gameObject); break;
      case 'spriteRenderer': new components.SpriteRenderer(gameObject); break;
      case 'boxCollider': new components.BoxCollider(gameObject); break;
      case 'circleCollider': new components.CircleCollider(gameObject); break;
      case 'input': new components.InputReceptor(gameObject); break;
      default: throw new Error('No such component found');
    }
    /* eslint-enable no-new */
    return gameObject;
  }

  /**
   * Get or generate new name for a game object
   * @param gameObject game object to get the name for
   * @param layers layers present in the layer manager
   */
  static createObjectName(gameObject: IGameObject, layers: Layer[]) {
    let { name } = gameObject;
    if (name === null || name.trim() === '') {
      const objectsCount = layers.reduce((acc, curr) => acc + curr.objects.size, 0);
      name = `unnamed_go_${objectsCount}`;
    }
    return name;
  }
}

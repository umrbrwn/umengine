/** Component base type */
export default class Component {
  /** Deriving component types must define a unique component name */
  readonly name: string;

  /** A component must be attached to a game object */
  readonly gameObject: IGameObject;

  /** Flag to check if component is enabled */
  enabled = true;

  constructor(name: string, gameObject: IGameObject) {
    this.name = name;
    this.gameObject = gameObject;
    this.bindObject();
  }

  private bindObject() {
    this.gameObject[this.name] = this;
    this.gameObject.components.push(this);
  }
}

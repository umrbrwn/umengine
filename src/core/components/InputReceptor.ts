/** Input receptor that buffers inputs */
export default class InputReceptor implements IComponent, IComponent {
  readonly name: string;

  enabled: boolean;

  /** Input keys buffered */
  private buffer: Set<string>;

  /** Input keys that are currently down */
  private downBuffer: Set<string>;

  constructor(readonly atom: IAtom) {
    this.name = InputReceptor.name;
    this.buffer = new Set<string>();
    this.downBuffer = new Set<string>();
    this.enabled = true;
  }

  /**
   * Buffer an input
   * @param key input key code
   */
  add(key: string) {
    this.buffer.add(key);
    if (!this.downBuffer.has(key)) {
      this.downBuffer.add(key);
    }
  }

  /**
   * Get the buffered input
   * @param key input key code
   * @returns true if the key is in pressed state
   */
  get(key: string) {
    return this.buffer.has(key);
  }

  /**
   * Consume the buffered input
   * @param key input key code
   * @returns true only once for the input key when it's pressed
   */
  getKeyDown(key: string) {
    const hasKey = this.downBuffer.has(key);
    if (hasKey) {
      this.downBuffer.delete(key);
    }
    return hasKey;
  }

  /**
   * Remove the buffered input
   * @param key input key code
   */
  remove(key: string) {
    this.buffer.delete(key);
    this.downBuffer.delete(key);
  }

  /** Check if there is any input available */
  hasAnyInput() {
    return this.buffer.size > 0;
  }

  /**
   * Get motion on X or Y axis
   * @param axis 'X' or 'Y' as valid argument for motion axis
   * @returns Positive integer for motion in downward and right side direction,
   * and negative integer for motion in upward and right side direction.
   * Returns 0 when there is no motion on the provided axis.
   */
  getMotion(axis: string) {
    if (axis === 'X') {
      if (this.get('A') || this.get('LEFT')) {
        return -1;
      }
      if (this.get('D') || this.get('RIGHT')) {
        return 1;
      }
    } else if (axis === 'Y') {
      if (this.get('W') || this.get('UP')) {
        return -1;
      }
      if (this.get('S') || this.get('DOWN')) {
        return 1;
      }
    }
    return 0;
  }
}

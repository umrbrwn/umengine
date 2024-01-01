/** Timer to control the execution flow */
export class Timer {
  update: () => void;

  // TODO: check if deltaTime can be non-static
  /** Time difference between two frame updates */
  private static deltaTime: number;

  private accumulatedTime = 0;

  private lastTime?: number;

  constructor(deltaTime = 1 / 60) {
    Timer.deltaTime = deltaTime;
  }

  /** Enqueue updates from the execution loop */
  enqueue() {
    requestAnimationFrame(this._update);
  }

  /** Start timer */
  start() {
    this.enqueue();
  }

  private _update = (time: number) => {
    if (this.lastTime) {
      this.accumulatedTime += (time - this.lastTime) / 1000;
      if (this.accumulatedTime > 1) {
        this.accumulatedTime = 1;
      }
      while (this.accumulatedTime > Timer.deltaTime) {
        this.update();
        this.accumulatedTime -= Timer.deltaTime;
      }
    }
    this.lastTime = time;
    this.enqueue();
  };
}

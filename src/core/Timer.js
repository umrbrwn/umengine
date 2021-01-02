/** Timer to control the execution flow */
export default class Timer {
    /** Time difference between two frame updates */
    static deltaTime;

    constructor(deltaTime = 1 / 60) {
        Timer.deltaTime = deltaTime;
        let accumulatedTime = 0;
        let lastTime = null;

        this.updateProxy = (time) => {
            if (lastTime) {
                accumulatedTime += (time - lastTime) / 1000;
                if (accumulatedTime > 1) {
                    accumulatedTime = 1;
                }
                while (accumulatedTime > deltaTime) {
                    this.update(deltaTime);
                    accumulatedTime -= deltaTime;
                }
            }
            lastTime = time;
            this.enqueue();
        }
    }

    /** Enqueue updates from the execution loop */
    enqueue() {
        requestAnimationFrame(this.updateProxy);
    }

    /** Start timer */
    start() {
        this.enqueue();
    }
}
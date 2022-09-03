/* eslint-disable @typescript-eslint/dot-notation */

/** Rendering canvas of the game engine */
export default class Canvas {
  /**
   * Create Hi-DPI Canvas by adjusting the size with respect to device screen pixel ratio,
   * this removes the bluriness of the artificats in the canvas due to high pixel ratio.
   * @param {*} width width of the canvas
   * @param {*} height height of the canvas
   * @param {*} canvas canvas element, creates an off-screen canvas if no element is specified
   */
  static createHiDPICanvas(canvas: HTMLCanvasElement, width = 640, height = 640) {
    const cvs = canvas || document.createElement('canvas');
    const context = cvs.getContext('2d')!;
    const ratio = Canvas.getPixelRatio(context);

    // scale the canvas with the pixel ratio
    cvs.width = width * ratio;
    cvs.height = height * ratio;

    // fit the canvas into the original size
    cvs.style.width = `${width}px`;
    cvs.style.height = `${height}px`;

    context?.scale(ratio, ratio);

    return cvs;
  }

  /** Determine correct pixel ratio of the device screen */
  private static getPixelRatio(context: CanvasRenderingContext2D) {
    const devicePixelRatio = window.devicePixelRatio || 1;
    const backingStoreRatio = context['webkitBackingStorePixelRatio']
      || context['mozBackingStorePixelRatio']
      || context['msBackingStorePixelRatio']
      || context['oBackingStorePixelRatio']
      || context['backingStorePixelRatio'] || 1;
    return devicePixelRatio / backingStoreRatio;
  }
}
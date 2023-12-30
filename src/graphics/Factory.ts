/**
 * TODO: determine its usefulness
 *
 * Create Hi-DPI Canvas by adjusting the size with respect to device screen pixel ratio,
 * this removes the bluriness of the artificats in the canvas due to high pixel ratio.
 * @param width width of the canvas
 * @param height height of the canvas
 * @param canvasElement canvas element, creates an off-screen canvas if no element is specified
 * @returns created or provided canvas element
 */
export function createHiDPICanvas(width = 640, height = 640, canvasElement?: HTMLCanvasElement) {
  const canvas = canvasElement || document.createElement('canvas');
  const context = canvas.getContext('2d')!;

  if (!context) {
    throw new Error('2D context is not supported.');
  }

  // Determine correct pixel ratio of the device screen
  const ratio = (() => {
    const devicePixelRatio = window.devicePixelRatio || 1;
    const ctx = context as any;
    const backingStoreRatio =
      ctx.webkitBackingStorePixelRatio ||
      ctx.mozBackingStorePixelRatio ||
      ctx.msBackingStorePixelRatio ||
      ctx.oBackingStorePixelRatio ||
      ctx.backingStorePixelRatio ||
      1;
    return devicePixelRatio / backingStoreRatio;
  })();

  // scale the canvas with the pixel ratio
  canvas.width = width * ratio;
  canvas.height = height * ratio;

  // fit the canvas into the original size

  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  context.scale(ratio, ratio);

  return canvas;
}

/**
 * Create a pattern from a slice
 * @param name name of the pattern or custom tile
 * @param x tile starting x position
 * @param y tile starting y position
 * @param width tile width that will repeat in pattern
 * @param height tile height that will repeat in pattern
 * @param patternWidth pattern width, up to canvas width
 * @param patternHeight pattern height, up to canvas height
 */
export async function createPattern(
  tileset: ImageBitmap,
  x: number,
  y: number,
  width: number,
  height: number,
  patternWidth: number,
  patternHeight: number,
) {
  return createImageBitmap(tileset, x, y, width, height).then((tile) => {
    const buffer = new OffscreenCanvas(patternWidth, patternHeight);
    const ctx = buffer.getContext('2d')!;
    ctx.rect(0, 0, width, height);
    ctx.fillStyle = ctx.createPattern(tile, 'repeat')!;
    ctx.fill();
    ctx.fillStyle = '#000';
    return createImageBitmap(ctx.getImageData(0, 0, patternWidth, patternHeight));
  });
}

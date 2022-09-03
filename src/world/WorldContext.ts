export default class WorldContext {
  /** Global rendering context */
  renderer: CanvasRenderingContext2D;

  /** Global audio context */
  audioContext: AudioContext;

  /** Global configurations */
  config: any;

  /** User data */
  data: any = {};
}

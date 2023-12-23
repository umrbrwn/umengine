export default class WorldContext {
  /** Global rendering context */
  renderingContext: CanvasRenderingContext2D;

  /** Global audio context */
  audioContext: AudioContext;

  /** Global configurations */
  config: Config;

  /** User data */
  data: Record<string, unknown> = {};
}

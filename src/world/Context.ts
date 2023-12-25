import { Config } from '../global';

export default class Context {
  /** Global rendering context */
  renderingContext: CanvasRenderingContext2D;

  /** Global audio context */
  audioContext: AudioContext;

  /** Global configurations */
  config: Config;

  /** User data */
  store: Record<string, unknown> = {};
}

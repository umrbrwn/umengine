import { Config, Context } from './types';
import { loadConfig } from './config';
import { createHiDPICanvas } from './graphics';
import { SceneManager } from './scenes';

export * as core from './core';
export * as graphics from './graphics';
export * as physics from './physics';
export * as utils from './utils';

let sceneManager: SceneManager | null = null;

type Options = { configPath?: string; config?: Partial<Config> };
export async function init(canvas: HTMLCanvasElement, options?: Options) {
  // load configurations
  const config = await loadConfig(options?.configPath, options?.config);

  // create high dpi rendering context
  const renderingContext = createHiDPICanvas(config.window.width, config.window.height, canvas).getContext('2d')!;

  // create context
  const context = {
    renderingContext,
    config,
    store: {},
  } as Context;

  sceneManager = new SceneManager(context);
  sceneManager.create('default');
  sceneManager.run('default');
}

export const scenes: SceneManager = new Proxy({} as SceneManager, {
  get(target, property, receiver) {
    if (!sceneManager) {
      throw new Error('Initialize engine configurations before accessing scenes');
    }
    return Reflect.get(sceneManager, property, receiver);
  },
});

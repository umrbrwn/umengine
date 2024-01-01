import { Config } from '../types';
import { loadJSON } from '../utils/loaders';

const getDefaultPath = (file: string) => `node_modules/umengine/config/${file}`;

/** @internal */
export async function loadConfig(path = getDefaultPath('config.json'), overrides?: Partial<Config>): Promise<Config> {
  return loadJSON(path)
    .then((defaultConfig) => ({ ...defaultConfig, ...overrides }))
    .catch((error) => {
      console.error(`Failed to load configurations from ${path}`, error);
      throw error;
    });
}

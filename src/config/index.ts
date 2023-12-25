import { Config, InputKeyMap } from '../global';
import { loadJSON } from '../utils/loaders';

/** @internal */
export async function loadConfig(path = './config.json', overrides?: Config): Promise<Config> {
  return loadJSON(path)
    .then((defaultConfig) => ({ ...defaultConfig, ...overrides }))
    .catch((error) => {
      console.error(`Failed to load configurations from ${path}`, error);
      throw error;
    });
}

/** @internal */
export async function loadKeys(path = './keys.json', overrides?: InputKeyMap): Promise<InputKeyMap> {
  return loadJSON(path)
    .then((defaultKeys) => ({ ...defaultKeys, ...overrides }))
    .catch((error) => {
      console.error(`Failed to load key mapping from ${path}`, error);
      throw error;
    });
}

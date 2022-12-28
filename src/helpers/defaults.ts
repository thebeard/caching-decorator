import { CacheOptions } from '@types';

// Keep the default options in scoped memory
const defaultConfig: CacheOptions = {};

/**
 * Set the application default options
 * @param options Caching options
 */
export function setDefaultOptions(options: CacheOptions) {
  Object.assign(defaultConfig, options);
}

/**
 * Get the application default options
 * @returns Default options
 */
export function getDefaultOptions(): CacheOptions {
  return defaultConfig;
}

/**
 * Reset the application default options
 */
export function resetDefaultOptions(): void {
  for (const config in defaultConfig) {
    delete defaultConfig[config];
  }
}

import { CacheOptions } from '@types';
import { getCacheClearFunction, getLogFunction } from '@helpers';

/**
 * Attach cache clearing function to associated class property or method
 * @param options Caching options
 * @returns `(target:any) => PropertyDescriptor`
 */
export function CacheClear(options?: CacheOptions): any {
  return function (target: any) {
    return {
      configurable: true,
      enumerable: false,
      writable: true,
      value: function () {
        const log = getLogFunction(options),
          clearCache = getCacheClearFunction(target);

        if (clearCache && typeof clearCache === 'function') {
          if (clearCache()) {
            log(`-cleared- cache for ${target.constructor.name}`);
          } else {
            log(`no cache to clear for ${target.constructor.name}`);
          }
        }
      }
    };
  };
}

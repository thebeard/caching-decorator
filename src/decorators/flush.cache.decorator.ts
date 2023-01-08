import { CacheOptions } from '@types';
import { flushCacheFactory } from '@helpers';

/**
 * Attach cache clearing function to associated class property or method
 * @param options Caching options
 * @returns `(target:any) => PropertyDescriptor`
 */
export function FlushCache(options?: CacheOptions): any {
  return function (target: any) {
    return {
      configurable: true,
      enumerable: false,
      writable: true,
      value: flushCacheFactory(target.constructor.name, options)
    };
  };
}

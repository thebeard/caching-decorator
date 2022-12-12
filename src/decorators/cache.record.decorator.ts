import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { CacheOptions } from '@types';
import { getDefaultKey, getStoreAndKey } from '@helpers';

/**
 * Add single record caching to an observable-returning class method
 *
 * @param options Caching options
 * @returns Original method with caching added
 * @see README.md For example usage
 */
export function CacheRecord<K = any>(options?: CacheOptions): any {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    // Grab original method
    const childFunction: (...args: any[]) => Observable<K> = descriptor.value,
      // Determine storeKey and get store
      [storeKey, store] = getStoreAndKey<K>(options, propertyName);

    // Point class to generated store
    target[storeKey] = store;

    // Rewrite the method with our decorator
    descriptor.value = function (...args: any[]) {
      // Calculate record key
      const { single = getDefaultKey } = options?.keys ?? {},
        key = single(args);

      // Place return observable into store if not found
      if (!store.has(key)) {
        store.set(key, childFunction.apply(this, args).pipe(shareReplay()));
      }

      // Return observable from store
      return store.get(key);
    };

    let clearCache;
    const oldClearCache = target['clearCache'];
    if (oldClearCache !== undefined) {
      clearCache = () => {
        oldClearCache();
        store.clear();
      };
    } else {
      clearCache = () => {
        store.clear();
      };
    }

    target['clearCache'] = clearCache;

    // Return descriptor with replaced (wrapped) method
    return descriptor;
  };
}

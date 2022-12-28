import { Observable } from 'rxjs';
import { shareReplay, tap } from 'rxjs/operators';
import { CacheOptions } from '@types';
import { getDefaultKey, getLogFunction, getStoreAndKey } from '@helpers';

/**
 * Add single record caching to an observable-returning class method
 * @param options Caching options
 * @returns `(target: any, propertyName: string, descriptor: PropertyDescriptor) => PropertyDescriptor`
 */
export function CacheRecord<K = any>(options?: CacheOptions): any {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    // Grab original method
    const childFunction: (...args: any[]) => Observable<K> = descriptor.value;

    // Rewrite the method with our decorator
    descriptor.value = function (...args: any[]) {
      // Determine storeKey and get store
      const [storeKey, store] = getStoreAndKey<K>(target, options, propertyName),
        // Get logging function
        log = getLogFunction(options),
        // Calculate record key
        { single = getDefaultKey } = options?.keys ?? {},
        key = single(args);

      // Place return observable into store if not found
      if (!store.has(key)) {
        store.set(
          key,
          childFunction.apply(this, args).pipe(
            shareReplay(),
            tap(value => {
              log(`-stored- ${storeKey} with identifier [${key}]: ${JSON.stringify(value)}`);
            })
          )
        );
      }

      // Return observable from store
      return store
        .get(key)
        .pipe(
          tap(value =>
            log(`-returned- ${storeKey} with identifier [${key}]: ${JSON.stringify(value)}`)
          )
        );
    };

    // Return descriptor with replaced (wrapped) method
    return descriptor;
  };
}

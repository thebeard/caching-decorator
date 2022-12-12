import { forkJoin, Observable, of } from 'rxjs';
import { map, shareReplay, switchMap } from 'rxjs/operators';
import { CacheOptions } from '@types';
import { getDefaultKey, getStoreAndKeySet } from '@helpers';

/**
 * Add multiple record caching to an observable-returning class method
 *
 * @param options Caching options
 * @returns Original method with caching added
 * @see README.md For example usage
 */
export function CacheRecords<K = any>(options?: CacheOptions): any {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    // Grab original method
    const childFunction: (...args: any[]) => Observable<K[]> = descriptor.value,
      // Determine storeKey and get singular and multiple stores
      [storeKey, store, singleStore] = getStoreAndKeySet(target, options, propertyName),
      // Get transform operation from options or non-transforming operation if omitted
      transformOp =
        options.transform ??
        function (r) {
          return r;
        };

    // Point class to generated store
    target[storeKey] = store;

    // Rewrite the method with our decorator
    descriptor.value = function (...args: any[]) {
      const { multi = getDefaultKey, singleInMulti = ({ id }: any) => '' + id } =
          options?.keys ?? {},
        key = multi(args);

      if (!store.has(key)) {
        let response$: Observable<string[]> = childFunction.apply(this, args).pipe(
          map(transformOp),
          map((records: K[]) => {
            return records.map(record => {
              const singleKey = singleInMulti(record);

              singleStore.set(singleKey, of(record));
              return singleKey;
            });
          }),
          shareReplay()
        );

        store.set(key, response$);
      }

      // Return an observable, mapped via singular store, from indexed multiple store
      return store.get(key).pipe(
        switchMap(records$ => {
          return forkJoin(...records$.map(recordId => singleStore.get(recordId)));
        })
      );
    };

    let clearCache;
    const oldClearCache = target['clearCache'];
    if (oldClearCache !== undefined) {
      clearCache = () => {
        oldClearCache();
        store.clear();
        singleStore.clear();
      };
    } else {
      clearCache = () => {
        store.clear();
        singleStore.clear();
      };
    }

    target['clearCache'] = clearCache;

    // Return descriptor with replaced (wrapped) method
    return descriptor;
  };
}

import { forkJoin, Observable, of } from 'rxjs';
import { map, shareReplay, switchMap, tap } from 'rxjs/operators';
import {
  attachClearCacheToTarget,
  getDefaultKey,
  getLogFunction,
  getStoreAndKeySet
} from '@helpers';
import { CacheOptions } from '@types';

/**
 * Add multiple record caching to an observable-returning class method
 * @param options Caching options
 * @returns `(target: any, propertyName: string, descriptor: PropertyDescriptor) => PropertyDescriptor`
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

    // Rewrite the method with our decorator
    descriptor.value = function (...args: any[]) {
      const log = getLogFunction(options),
        { multi = getDefaultKey, singleInMulti = ({ id }: any) => '' + id } = options?.keys ?? {},
        key = multi(args);

      if (!store.has(key)) {
        let response$: Observable<string[]> = childFunction.apply(this, args).pipe(
          map(transformOp),
          tap((value: any) =>
            log(`-stored- ${storeKey} with ${value.length} entries: ${JSON.stringify(value)}`)
          ),
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
        }),
        tap(value =>
          log(`-returned- ${storeKey} with ${value.length} entries: ${JSON.stringify(value)}`)
        )
      );
    };

    // Register these stores for clearance on target cache clear
    attachClearCacheToTarget(target, () => {
      store.clear();
      singleStore.clear();
    });

    // Return descriptor with replaced (wrapped) method
    return descriptor;
  };
}

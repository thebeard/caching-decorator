import { forkJoin, map, Observable, of, shareReplay, switchMap, tap } from 'rxjs';
import { CacheOptions } from '@types';
import {
  getDefaultKey,
  getFlushCacheFunction,
  getLogFunction,
  getStoreAndKey,
  getStoreAndKeySet
} from './cache.functions';

export function cacheOneFactory<K>(
  primaryId: string,
  secondaryId: string,
  fn: (...args: any[]) => Observable<K>,
  options?: CacheOptions
): (...args: any) => Observable<any> {
  return function (...args: any[]) {
    // Determine storeKey and get store
    const [storeKey, store] = getStoreAndKey<K>(primaryId, options, secondaryId),
      // Get logging function
      log = getLogFunction(options),
      // Calculate record key
      { single = getDefaultKey } = options?.keys ?? {},
      key = single(args);

    // Place return observable into store if not found
    if (!store.has(key)) {
      store.set(
        key,
        fn.apply(this, args).pipe(
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
}

export function cacheManyFactory<K>(
  primaryId: string,
  secondaryId: string,
  fn: (...args: any[]) => Observable<K[]>,
  options?: CacheOptions
): (...args: any) => Observable<any> {
  return function (...args: any[]) {
    // Get transform operation from options or non-transforming operation if omitted
    const transformOp =
        options.transform ??
        function (r) {
          return r;
        },
      // Determine storeKey and get singular and multiple stores
      [storeKey, store, singleStore] = getStoreAndKeySet(primaryId, options, secondaryId),
      // Get logging function
      log = getLogFunction(options),
      // Calculate record key
      { multi = getDefaultKey, singleInMulti = ({ id }: any) => '' + id } = options?.keys ?? {},
      key = multi(args);

    if (!store.has(key)) {
      let response$: Observable<string[]> = fn.apply(this, args).pipe(
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
}

export function flushCacheFactory(id: string, options?: CacheOptions): () => void {
  return function () {
    const log = getLogFunction(options),
      clearCache = getFlushCacheFunction(id);

    if (clearCache && typeof clearCache === 'function') {
      if (clearCache()) {
        log(`-cleared- cache for ${id}`);
      } else {
        log(`no cache to clear for ${id}`);
      }
    }
  };
}

import { forkJoin, Observable, of } from "rxjs";
import { map, shareReplay, switchMap } from "rxjs/operators";
import { CacheOptions } from "./cache-options";
import { getStoreAndKeySet } from "./functions.decorator";

/**
 * Add multiple record caching to an observable-returning class method
 *
 * @param options Caching options
 * @returns Original method with caching added
 * @see README.md For example usage
 */
export function CacheRecords<K = any>(options?: CacheOptions): any {
  return function (
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor
  ) {
    // Grab original method
    const childFunction: (...args: any[]) => Observable<K[]> = descriptor.value,
      // Determine storeKey and get singular and multiple stores
      [storeKey, store, singleStore] = getStoreAndKeySet(
        target,
        options,
        propertyName
      ),
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
      if (!store.has("1")) {
        let response$: Observable<string[]> = childFunction
          .apply(this, args)
          .pipe(
            map(transformOp),
            map((records: K[]) => {
              return records.map((record) => {
                singleStore.set("" + record["id"], of(record));
                return "" + record["id"];
              });
            }),
            shareReplay()
          );

        // store page "1" (pagination)
        store.set("1", response$);
      }

      // Return an observable, mapped via singular store, from indexed multiple store
      return store.get("1").pipe(
        switchMap((records$) => {
          return forkJoin(
            ...records$.map((recordId) => singleStore.get(recordId))
          );
        })
      );
    };

    // Return descriptor with replaced (wrapped) method
    return descriptor;
  };
}

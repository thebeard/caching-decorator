import { Observable } from 'rxjs';
import * as pluralize from 'pluralize';
import { CacheOptions } from '@types';
import { getDefaultOptions } from './defaults';

/**
 * From a list of arguments produce a string identifier
 * @param args Indefinite list of arguments
 * @returns Key string
 */
export function getDefaultKey(...args: any[]) {
  return args.map(allToString).join('-').toLowerCase();
}

/**
 * Convert an object or array to a string
 * @param prop Array or object to convert
 * @returns Converted string
 */
function objToString(prop: any[] | Record<string, any>) {
  if (prop instanceof Array) {
    return prop.map(allToString).join('-');
  } else {
    let keyStringCollection: string[] = [];
    const sortedProps = Object.entries(prop).sort(([a], [b]) => (a > b ? 1 : -1));

    for (const [key, value] of sortedProps) {
      keyStringCollection = [...keyStringCollection, '' + key.toLowerCase(), allToString(value)];
    }

    return keyStringCollection.map(k => k.toLowerCase()).join('-');
  }
}

/**
 * Convert variable of any type to a string
 * @param prop Variable to convert
 * @returns Converted string
 */
function allToString(prop: any): string {
  let keyString: string;
  switch (typeof prop) {
    case 'number':
      keyString = prop.toString();
      break;
    case 'string':
      keyString = prop.replace(/ /g, '-').toLowerCase();
      break;
    case 'object':
      keyString = objToString(prop);
      break;
  }

  return keyString || '*';
}

/**
 * Generate and return a store and its key (identifier)
 * @param options Caching options
 * @param propertyName Name of associated method
 * @returns Store and its key
 */
export function getStoreAndKey<K>(
  options: CacheOptions,
  propertyName: string
): [string, Map<string, Observable<K>>] {
  let storeKey: string;
  const store = new Map<string, Observable<K>>();

  if (options?.storeKeys?.length && !!options.storeKeys[0]) {
    storeKey = options.storeKeys[0];
  } else {
    if (propertyName.length > 3 && propertyName.substring(0, 3) === 'get') {
      propertyName = propertyName.substring(3);
    }

    storeKey = `${propertyName}Store`;
  }

  return [storeKey, store];
}

/**
 * Generate and return 2x complementary stores and their keys (identifiers)
 * This also links the singular store to-/from- the class from which the
 * method decorator is attached
 *
 * @param target Class containing associated method
 * @param options Caching options
 * @param propertyName Name of associated method
 * @returns Two stores and their keys
 */
export function getStoreAndKeySet<K>(
  target: any,
  options: CacheOptions,
  propertyName: string
): [string, Map<string, Observable<string[]>>, Map<string, Observable<K>>] {
  let singleStoreKey, multipleStoreKey;

  if (propertyName.length > 3 && propertyName.substring(0, 3) === 'get') {
    propertyName = propertyName.substring(3);
  }

  if (options?.storeKeys?.length > 1) {
    singleStoreKey = options?.storeKeys[0];
  } else {
    singleStoreKey = `${pluralize.singular(propertyName)}Store`;
  }

  if (options?.storeKeys?.length > 1) {
    multipleStoreKey = options?.storeKeys[1];
  } else if (options?.storeKeys?.length === 1) {
    multipleStoreKey = options?.storeKeys[0];
  } else {
    multipleStoreKey = `${propertyName}Store`;
  }

  const singleStore: Map<string, Observable<K>> = target[singleStoreKey] ??
    new Map<string, Observable<K>>(),
    store = new Map<string, Observable<string[]>>();

  return [multipleStoreKey, store, singleStore];
}

/**
 * Attach store clearance function to existing clearance function
 * and re(attach) to target of decorator(s)
 * @param target Class containing stores to clear
 * @param decoratorClear Function to clear (more) store(s)
 */
export function attachClearCacheToTarget(target: any, decoratorClear: () => void) {
  let clearCache;
  const oldClearCache = target['_clearCache'];
  if (oldClearCache !== undefined) {
    clearCache = () => {
      oldClearCache();
      decoratorClear();
    };
  } else {
    clearCache = () => {
      decoratorClear();
    };
  }

  target['_clearCache'] = clearCache;
}

/**
 * Return a function that will log a message, using the
 * log provider specified in the options
 * @param options Caching options
 * @returns A function to log a message
 */
export function getLogFunction(options: CacheOptions): (message: string) => void {
  const { debug } = Object.assign({ ...getDefaultOptions() }, options),
    debugProperty = debug === true ? 'debug' : debug;

  return debug ? console[debugProperty] : function () {};
}

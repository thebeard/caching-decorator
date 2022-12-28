import { Observable } from 'rxjs';
import * as pluralize from 'pluralize';
import { getAssociatedKeysAndTargets, getGlobalStore } from './state';
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
  target: any,
  options: CacheOptions,
  propertyName: string
): [string, Map<string, Observable<K>>] {
  let storeKey: string;
  const globalStore = getGlobalStore();

  if (options?.storeKeys?.length && !!options.storeKeys[0]) {
    storeKey = options.storeKeys[0];
  } else {
    if (propertyName.length > 3 && propertyName.substring(0, 3) === 'get') {
      propertyName = propertyName.substring(3);
    }

    storeKey = `${propertyName}Store`;
  }

  if (!globalStore[storeKey]) {
    globalStore[storeKey] = new Map<string, Observable<K>>();
  }

  associateKeyAndTarget(target, [storeKey]);

  return [storeKey, globalStore[storeKey]];
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
  const globalStore = getGlobalStore();

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

  if (!globalStore[singleStoreKey]) {
    globalStore[singleStoreKey] = new Map<string, Observable<K>>();
  }

  if (!globalStore[multipleStoreKey]) {
    globalStore[multipleStoreKey] = new Map<string, Observable<string[]>>();
  }

  associateKeyAndTarget(target, [singleStoreKey, multipleStoreKey]);

  return [multipleStoreKey, globalStore[multipleStoreKey], globalStore[singleStoreKey]];
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

export function getCacheClearFunction(target?: any): () => boolean {
  return () => {
    const globalStore = getGlobalStore(),
      associatedKeys = getAssociatedKeysAndTargets().get(target.constructor.name),
      clearableKeys = Object.keys(globalStore).filter(k => associatedKeys?.includes(k));

    if ((!associatedKeys || !clearableKeys?.length) && !!target) {
      return false;
    }

    for (const key of Object.keys(globalStore).filter(k => associatedKeys?.includes(k) ?? true)) {
      delete globalStore[key];
    }

    return true;
  };
}

export function associateKeyAndTarget(target: any, keys: string[]) {
  const associatedKeysAndTargets = getAssociatedKeysAndTargets();

  const associatedKeys = associatedKeysAndTargets.get(target.constructor.name) ?? [];
  keys.forEach(k => {
    if (!associatedKeys.includes(k)) {
      associatedKeys.push(k);
    }
  });

  associatedKeysAndTargets.set(target.constructor.name, associatedKeys);
}

import { Observable } from "rxjs";
import { CacheOptions } from "./cache-options";
import * as pluralize from "pluralize";

export function getDefaultKey(...args: any[]) {
  return args
    .map((a) => ("" + a).replace(/ /g, "-"))
    .join("-")
    .toLowerCase();
}

export function getStoreAndKey<K>(
  options: CacheOptions,
  propertyName: string
): [string, Map<string, Observable<K>>] {
  let storeKey: string;
  const store = new Map<string, Observable<K>>();

  if (options?.storeKeys?.length && !!options.storeKeys[0]) {
    storeKey = options.storeKeys[0];
  } else {
    if (propertyName.length > 3 && propertyName.substring(0, 3) === "get") {
      propertyName = propertyName.substring(3);
    }

    storeKey = `${propertyName}Store`;
  }

  return [storeKey, store];
}

export function getStoreAndKeySet<K>(
  target: any,
  options: CacheOptions,
  propertyName: string
): [string, Map<string, Observable<string[]>>, Map<string, Observable<K>>] {
  let singleStoreKey, multipleStoreKey;
  if (propertyName.length > 3 && propertyName.substring(0, 3) === "get") {
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

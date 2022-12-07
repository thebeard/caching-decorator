export interface CacheOptions {
  key?: string;
  storeKeys?: [string?, string?];
  transform?: (response: any) => any;
}

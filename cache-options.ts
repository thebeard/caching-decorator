export interface CacheOptions {
  keys?: {
    single?: (...args: any[]) => string,
    multi?: (...args: any[]) => string,
    singleInMulti?: (response: any) => string
  }

  /**
   * Set of custom store keys for single records
   * and a collection of record keys, respectively
   *
   * Example: `["productStore", "productsStore"]`
   *
   * When using both the CacheRecord and CacheRecords
   * decorators within the same class to cache the
   * same entity types, the first argument of this key
   * set should match the complementing methods.
   *
   * In most CRUD-like services, it's easier to omit
   * this property and have the class resolve the keys
   * itself.
   *
   * When auto resolving store keys, naming methods
   * with a `get` prefix would produce semantically
   * correct store keys. `getPost` and `getPosts`
   * method names would produce `PostStore` and
   * `PostsStore` keys.
   */
  storeKeys?: [string?, string?];

  /**
   * Optional method that transforms an Observable
   * response before storing it in cache.
   *
   * Typically used for multiple-record API requests
   * where the response is wrapped in an object and
   * not returned as an array
   *
   * Example: `({posts}) => posts`
   */
  transform?: (response: any) => any;
}

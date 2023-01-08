export interface CacheOptions {
  debug?: 'debug' | 'log' | true;

  keys?: {
    single?: (...args: any[]) => string;
    multi?: (...args: any[]) => string;
    singleInMulti?: (response: any) => string;
  };

  mode?: 'read' | 'write';

  normalize?: boolean;

  /**
   * Set of custom store keys for single records and
   * for a collection of record identifiers, respectively
   *
   * Example: `["productStore", "productsStore"]`
   *
   * When using both the CacheOne and CacheMany
   * decorators within the same class to cache the
   * same entity types, the first argument of this key
   * set (array) should match the complementing methods.
   *
   * In most CRUD-like services, it's easier to omit
   * this property and have the class helpers in this
   * library resolve the keys itself.
   *
   * When automatically resolving these store keys,
   * naming methods with a `get` prefix would produce
   * semantically correct store keys. `getPost` and
   * `getPosts` method names would produce `PostStore`
   * and `PostsStore` keys.
   *
   * Predominantly these store keys are arbitrary and
   * the use of the automatic resolver is encouraged.
   * With debug mode on, or when using certain storage
   * providers, troubleshooting might be easier when
   * knowing (or explicitly setting) your store keys.
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

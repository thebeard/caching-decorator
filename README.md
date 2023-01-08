## :peanuts: Cashew &middot; Jewels :gem:

#### _Basic to advanced, yet simple-to-use (TypeScript) caching tools._

> Even though this library will ultimately allow for vanilla ES6 usage, and include code patterns familiar to users of multiple Javascript Frameworks, the caching engine in this library is currently only invocable using TypeScript decorators.

> _Regarding the name, suggestions are welcome. When faced with the decision of choosing a ridiculously quirky name or a very descriptive bland one, well you know..._

### Table of Contents

- [Introduction](#introduction)
- [Example Usage](#example-usage)
- [Scope](#scope)
- [Options](#options)
- [Recipes](#recipes)

### Introduction

In the spirit of keeping things simple, this library makes available, two often used together, but intrinsically independent, primary decorators and a third auxillary decorator.

1. `@CacheOne`
2. `@CacheMany`
3. `@FlushCache`

When these primary decorators are used in conjunction, a REST controller method decorated with `@CacheOne` would, for example, instead fetch an entity with `{id: 1}` from cache, had a prior usage of a method decorated with `@CacheMany` fetched a collection; including an entity with `{id: 1}`.

As part of the simple to use principle, the library includes as a first-level feature, data normalization for API's where the data structure of a single entity query matches that of a collection query returning a set of entities.

### Example Usage

```ts
class MyPostService {
  @CacheOne()
  getPost(id: number): Observable<Post> {
    return this.http.get(`${this.serviceUrl}/${id}`);
  }

  @CacheMany({
    transform: ({ posts }) => posts
  })
  getPosts(): Observable<Post[]> {
    return this.http.get(this.serviceUrl);
  }

  @CacheOne()
  createPost(post: Partial<Post>): Observable<Post> {
    return this.http.post(this.serviceUrl, post);
  }

  @CacheOne()
  updatePost(id: number, post: Partial<Post>): Observable<Post> {
    return this.http.put(`${this.serviceUrl}/${id}`, post);
  }

  @FlushCache()
  clearCache: IFlushCache;
}
```

Even though a single, easy to re-use [options object](#options) can be passed to each of these decorators, when used to consume an API with basic or "predictable" CRUD responses, the usage of the decorators in the example enough, is sufficient to configure a data normalized http post service.

This is made possible by the use of some syntactic sugar in the form of pre-determined method name prefixes.

More details are available (and will continually be added) to the [examples](./examples) folder.

### Scope

The scope of any cached entry is global by store key. In other words, multiple instances of the same class (intrinsically using the same caching key(s)), will share - and flush - the same cached entries.

Different classes, using either dependency-injection or a multiple instantiation approach, with the **same** store keys as another class, will also share - and flush - the same cached entries.

```ts
class AppleService {
  @CacheOne({
    `storeKeys: ['fruitStore', fruitsStore]`
  })
  getApple(id: number) {}
}

class PeachService {
  @CacheOne({
    `storeKeys: ['fruitStore', fruitsStore]`
  })
  getPeach(id: number) {}
}
```

The example above uses the optional `storeKeys` property in the `CacheOptions` configuration, to demonstrate the improper usage of store keys that will ultimately deliver unexpected results for the user.

### Options

The most detailed description of the options available for use in all of the decorator is available directly in the
[CacheOptions](./src/types//cache-options.interface.ts) file annotations.

### Recipes

# Caching Decorators

The Caching Decorators project consist of two independent, but often used together, caching decorators.

- `@CacheRecord`
- `@CacheRecords`

When these are used in conjunction, a single record could be found in cache if that record had previously been part of a collection that was fetched prior.

The collection API requests only store record keys (or identifiers) and not the entire objects. They are placed in the singular stores and using these in conjunction does not result in multiple source of truth dilemmas.

## Example Usage

```ts
class PostsService {
  @CacheRecord()
  getPost(id: number): Observable<Post> {
    return of(/* from some origin */);
  }

  @CacheRecords({
    transform: ({ posts }) => posts
  })
  getPosts(): Observable<Post[]> {
    return of(/* from some origin */);
  }
}
```

As per this example, if the library user did a `getPosts()` fetch, with a response including a post with `id: 1`, and subsequently a `getPost(1)` is fetched, the latter would be fetched from cache and an additional API request avoided.

## Project Name

Hopefully we can come up with something at least a little more original

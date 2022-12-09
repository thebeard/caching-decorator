import axios from "axios";
import { from, Observable } from "rxjs";
import { CacheOptions } from "./cache-options";
import { CacheRecord } from "./cache.record.decorator";
import { CacheRecords } from "./cache.records.decorator";
import { Post } from "./post.interface";

export let httpRequests = 0;

axios.interceptors.request.use((config) => {
  httpRequests++;
  return config;
});

const defaultCachingConfig: CacheOptions = {
  keys: { singleInMulti: ({ id }) => "" + id },
  storeKeys: ["postStore", "postsStore"],
};

export class AppService {
  private readonly apiUrl = "https://dummyjson.com";

  @CacheRecord(defaultCachingConfig)
  getPost(id: number): Observable<Post> {
    return from(
      axios.get<Post>(`${this.apiUrl}/posts/${id}`).then(({ data }) => data)
    );
  }

  @CacheRecords({
    ...defaultCachingConfig,
    transform: ({ posts }) => posts,
  })
  getPosts(): Observable<Post[]> {
    return from(
      axios.get<Post[]>(`${this.apiUrl}/posts?limit=1`).then(({ data }) => data)
    );
  }

  @CacheRecords({
    ...defaultCachingConfig,
    transform: ({ posts }) => posts,
  })
  getPostsOneArg(someObject): Observable<Post[]> {
    return from(
      axios.get<Post[]>(`${this.apiUrl}/posts?limit=1`).then(({ data }) => data)
    );
  }

  @CacheRecords({
    ...defaultCachingConfig,
    transform: ({ posts }) => posts,
  })
  getPostsTwoArgs(pagination, someObject): Observable<Post[]> {
    return from(
      axios.get<Post[]>(`${this.apiUrl}/posts?limit=1`).then(({ data }) => data)
    );
  }
}

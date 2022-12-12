import { Observable } from 'rxjs';
import { CacheOptions } from '@types';
import { CacheClear, CacheRecord, CacheRecords } from '@decorators';
import { Post } from './interfaces/post.interface';
import { MockHttpServer } from '@test/helpers';

const defaultCachingConfig: CacheOptions = {
  keys: { singleInMulti: ({ id }) => '' + id },
  storeKeys: ['postStore', 'postsStore']
};

export class PostService {
  private readonly apiUrl = 'https://example.com';

  constructor(private http: MockHttpServer) {}

  @CacheClear()
  clearCache() {}

  @CacheRecord(defaultCachingConfig)
  getPost(id: number): Observable<Post> {
    return this.http.get<Post>(`${this.apiUrl}/posts/${id}`);
  }

  @CacheRecords({
    ...defaultCachingConfig
    // transform: ({ posts }) => posts
  })
  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}/posts`);
  }

  @CacheRecords({
    ...defaultCachingConfig
    // transform: ({ posts }) => posts
  })
  getPostsOneArg(someObject): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}/posts?limit=1`);
  }

  @CacheRecords({
    ...defaultCachingConfig
    // transform: ({ posts }) => posts
  })
  getPostsTwoArgs(pagination, someObject): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}/posts?limit=2`);
  }
}

import { Observable } from 'rxjs';
import { CacheOne, CacheMany, FlushCache } from '@decorators';
import { CacheOptions, IFlushCache } from '@types';
import { MockHttpServer } from '@test/helpers';
import { Post } from './interfaces/post.interface';

const defaultCachingConfig: CacheOptions = {
  keys: { singleInMulti: ({ id }) => '' + id },
  storeKeys: ['postStore', 'postsStore']
};

export class PostService {
  private readonly apiUrl = 'https://example.com';

  constructor(private http: MockHttpServer) {}

  @FlushCache()
  clearCache: IFlushCache;

  @CacheOne(defaultCachingConfig)
  getPost(id: number): Observable<Post> {
    return this.http.get<Post>(`${this.apiUrl}/posts/${id}`);
  }

  @CacheMany({
    ...defaultCachingConfig
  })
  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}/posts`);
  }

  @CacheMany({
    ...defaultCachingConfig
  })
  getPostsOneArg(someObject): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}/posts?limit=1`);
  }

  @CacheMany({
    ...defaultCachingConfig
  })
  getPostsTwoArgs(pagination, someObject): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}/posts?limit=2`);
  }
}

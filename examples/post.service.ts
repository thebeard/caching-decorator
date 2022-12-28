import { Observable } from 'rxjs';
import { CacheClear, CacheRecord, CacheRecords } from '@decorators';
import { CacheOptions, ICacheClear } from '@types';
import { MockHttpServer } from '@test/helpers';
import { Post } from './interfaces/post.interface';

const defaultCachingConfig: CacheOptions = {
  keys: { singleInMulti: ({ id }) => '' + id },
  storeKeys: ['postStore', 'postsStore']
};

export class PostService {
  private readonly apiUrl = 'https://example.com';

  constructor(private http: MockHttpServer) {}

  @CacheClear()
  clearCache: ICacheClear;

  @CacheRecord(defaultCachingConfig)
  getPost(id: number): Observable<Post> {
    return this.http.get<Post>(`${this.apiUrl}/posts/${id}`);
  }

  @CacheRecords({
    ...defaultCachingConfig
  })
  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}/posts`);
  }

  @CacheRecords({
    ...defaultCachingConfig
  })
  getPostsOneArg(someObject): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}/posts?limit=1`);
  }

  @CacheRecords({
    ...defaultCachingConfig
  })
  getPostsTwoArgs(pagination, someObject): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}/posts?limit=2`);
  }
}

import axios from "axios";
import { from, Observable } from "rxjs";
import { CacheRecord } from "./cache.record.decorator";
import { CacheRecords } from "./cache.records.decorator";
import { Post } from "./post.interface";

axios.interceptors.request.use((config) => {
  console.log(config.url);
  return config;
});

export class AppService {
  private readonly apiUrl = "https://dummyjson.com";

  @CacheRecord()
  getPost(id: number): Observable<Post> {
    return from(
      axios.get<Post>(`${this.apiUrl}/posts/${id}`).then(({ data }) => data)
    );
  }

  @CacheRecords({
    transform: ({ posts }) => posts,
  })
  getPosts(): Observable<Post[]> {
    return from(
      axios.get<Post[]>(`${this.apiUrl}/posts?limit=1`).then(({ data }) => data)
    );
  }
}

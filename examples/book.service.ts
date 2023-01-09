import { Observable } from 'rxjs';
import { Book, BookSummary } from './interfaces';
import { CacheOne, CacheMany, FlushCache } from '@decorators';
import { IFlushCache } from '@types';
import { MockHttpServer } from '@test/helpers';

export class BookService {
  private readonly apiUrl = 'https://example.com';

  constructor(private http: MockHttpServer) {}

  @FlushCache()
  clearCache: IFlushCache;

  @CacheOne()
  getBook(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/books/${id}`);
  }

  @CacheMany({
    normalize: false
  })
  getBooks(): Observable<BookSummary[]> {
    return this.http.get<BookSummary[]>(`${this.apiUrl}/books`);
  }
}

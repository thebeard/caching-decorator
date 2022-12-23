import { delay, Observable, of } from 'rxjs';
import { MockDatabase } from './mock.database';

export class MockHttpServer {
  private _count = 0;
  private readonly db = new MockDatabase();

  get count(): number {
    return this._count;
  }

  get<K = any>(url: string, options?: any): Observable<K> {
    this._count++;

    const records = this.getResources<K>(url);
    return of(records).pipe(delay(50));
  }

  post<K = any, L = K>(url: string, request: any, options?: any): Observable<K> {
    this._count++;

    const record = this.postResource<K, L>(url, request);
    return of(record);
  }

  put<K = any, L = K>(url: string, request: any, options?: any): Observable<K> {
    this._count++;

    const record = this.putResource<K, L>(url, request);
    return of(record);
  }

  delete<K = any, L = K>(url: string, request?: any, options?: any): Observable<void> {
    this._count++;

    this.deleteResource<K>(url);
    return of(null);
  }

  private getResources<K>(url: string): K {
    const [resource, resourceId = null] = this.resolveResource(url);

    return this.db.query('get', resource, resourceId);
  }

  private postResource<Response, Request = Response>(url: string, request: any): Response {
    const [resource, resourceId = null] = this.resolveResource(url),
      post = this.db.query('post', resource, resourceId);

    return post(request);
  }

  private putResource<Response, Request = Response>(url: string, request: any): Response {
    const [resource, resourceId = null] = this.resolveResource(url),
      post = this.db.query('put', resource, resourceId);

    return post(request);
  }

  private deleteResource<K>(url: string) {
    const [resource, resourceId = null] = this.resolveResource(url),
      del = this.db.query('delete', resource, resourceId);

    del(resourceId);
  }

  private resolveResource(url: string): string[] {
    return (
      url
        /**
         * @todo Improve this with a regex
         */
        .replace('https://', '')
        .replace('http://', '')
        .split('/')
        .slice(1)
    );
  }
}

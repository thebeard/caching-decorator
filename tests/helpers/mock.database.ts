import { MockBooksData, MockPostsData } from '@test/data';

export class MockDatabase {
  private readonly tables = new Map<string, any>();

  constructor() {
    this.tables.set('posts', MockPostsData);
    this.tables.set('books', MockBooksData);
  }

  query(method: string, table: string, id?: string): any {
    if (method === 'get') {
      method = 'index';
      if (id) {
        method = 'read';
      } else {
        method = 'index';
      }
    }

    return this.tables.get(table)[method](id);
  }
}

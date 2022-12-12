import { MockPostsData } from '@test/data';

export class MockDatabase {
  private readonly tables = new Map<string, any>();

  constructor() {
    this.tables.set('posts', MockPostsData);
  }

  query(method: string, table: string, id?: string): any {
    let result = this.tables.get(table)[method];

    if (id) {
      result = result.find(({ id: i }) => '' + id === '' + i);
    }

    return result;
  }
}

import { MockHttpServer, runTest } from '@test/helpers';
import { BookService } from '@examples';
import { Test } from '@test/types';

describe('Denormalized tests', function () {
  let http: MockHttpServer, service: BookService;

  beforeEach(() => {
    http = new MockHttpServer();
    service = new BookService(http);
  });

  it('can cache de-normalized APIs correctly', () => {
    const test: Test = [
      [() => service.getBooks(), booksummary => expect(booksummary.synopsis).to.be.undefined],
      [() => service.getBook(1), ({ id }) => expect(id).to.equal(1)],
      [() => service.getBook(2), book => expect(book.synopsis).not.to.be.undefined],
      [
        () => service.getBook(1),
        book => {
          expect(book.synopsis).not.to.be.undefined;
          expect(http.count).to.eq(3);
        }
      ]
    ];

    return runTest(service, test);
  });
});

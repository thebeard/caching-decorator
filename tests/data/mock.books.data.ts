import { faker } from '@faker-js/faker';
import { Book, BookSummary } from '@examples';
import { MockDataGenerationSet } from '@test/types';

export const BOOKS: Book[] = [];
export const BOOKSUMMARIES: BookSummary[] = [];

function createRandomBook(id: number): Book {
  return {
    ...createRandomBookSummary(id),
    rating: +faker.helpers.regexpStyleStringParse('[1-5]'),
    synopsis: faker.lorem.paragraph()
  };
}

function createRandomBookSummary(id: number): BookSummary {
  return {
    author: faker.name.fullName(),
    id,
    isbn: faker.helpers.replaceSymbolWithNumber('###-#-##-######-#'),
    title: faker.lorem.sentence()
  };
}

Array.from({ length: 20 }).forEach((_, i) => {
  BOOKS.push(createRandomBook(i + 1));
  BOOKSUMMARIES.push(createRandomBookSummary(i + 1));
});

/**
 * @todo Complete first example db write operations
 */
export const MockBooksData: MockDataGenerationSet<Book, Book, BookSummary> = {
  index: () => BOOKSUMMARIES,
  read: (resourceId: number) => BOOKS.find(({ id }) => +id === +resourceId),
  post: req => req,
  put: req => req,
  delete: id => null
};

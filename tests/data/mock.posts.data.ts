import { faker } from '@faker-js/faker';
import { MockDataGenerationSet } from '@test/types';
import { Post } from '@examples';

export const POSTS: Post[] = [];

function createRandomPost(id: number): Post {
  return {
    body: faker.lorem.paragraph(),
    id,
    title: faker.lorem.sentence(),
    userId: faker.datatype.number()
  };
}

Array.from({ length: 20 }).forEach((_, i) => {
  POSTS.push(createRandomPost(i + 1));
});

/**
 * @todo Complete first example db write operations
 */
export const MockPostsData: MockDataGenerationSet<Post, Post> = {
  get: POSTS,
  post: req => req,
  put: req => req,
  delete: id => null
};

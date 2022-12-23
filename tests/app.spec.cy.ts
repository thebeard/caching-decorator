import { MockHttpServer, runTest } from '@test/helpers';
import { PostService } from '@examples';
import { Test } from '@test/types';

describe('Basic tests', function () {
  let http: MockHttpServer, service: PostService;

  beforeEach(() => {
    http = new MockHttpServer();
    service = new PostService(http);
  });

  it('can cache a few basic requests', () => {
    const test: Test = [
      [() => service.getPosts()],
      [() => service.getPost(1)],
      [
        () => service.getPosts(),
        () => {
          expect(http.count).to.eq(1);
        }
      ]
    ];

    return runTest(service, test);
  });

  it('can cache another few basic requests', () => {
    const test: Test = [
      [() => service.getPost(1)],
      [() => service.getPost(2)],
      [() => service.getPost(3)],
      [() => service.getPost(4)],
      [() => service.getPosts()],
      [
        () => service.getPost(4),
        () => {
          expect(http.count).to.eq(5);
        }
      ]
    ];

    return runTest(service, test);
  });

  it('can cache clear cache from decorator', () => {
    const test: Test = [
      [() => service.getPosts()],
      [() => service.clearCache()],
      [
        () => service.getPosts(),
        () => {
          expect(http.count).to.eq(2);
        }
      ]
    ];

    return runTest(service, test);
  });
});

import { MockHttpServer, runTest } from '@test/helpers';
import { IncompleteService, PostService } from '@examples';
import { setDefaultOptions, resetDefaultOptions, getLogHistory } from '@helpers';
import { Test } from '@test/types';

describe('Logging tests', function () {
  let debugHistory, logHistory;

  before(() => {
    [debugHistory, logHistory] = getLogHistory();
    setDefaultOptions({ debug: true });
  });

  it('will correctly log basic operations', () => {
    const service = new PostService(new MockHttpServer()),
      test: Test = [
        [
          () => service.getPost(1),
          () => {
            expect(debugHistory).to.satisfy(logs =>
              logs.some(log => log.includes('-stored- postStore with identifier [1]:'))
            );
            expect(debugHistory).to.satisfy(logs =>
              logs.some(log => log.includes('-returned- postStore with identifier [1]:'))
            );
            expect(debugHistory.length).to.equal(2);
          }
        ],
        [() => service.getPosts()]
      ];

    return runTest(service, test);
  });

  it('will report missing cache on an incomplete service', () => {
    const service = new IncompleteService(),
      matchClearanceString = msg => msg === 'no cache to clear for IncompleteService',
      test: Test = [
        [() => service.clearAndLog()],
        [() => service.clearAndDebug()],
        [
          () => service.clearCache(),
          () => {
            expect(debugHistory.filter(matchClearanceString).length).to.equal(2);
            expect(logHistory.filter(matchClearanceString).length).to.equal(1);
          }
        ]
      ];

    return runTest(service, test);
  });

  after(() => {
    resetDefaultOptions();
  });
});

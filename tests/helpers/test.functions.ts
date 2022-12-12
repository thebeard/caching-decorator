import { firstValueFrom, Observable } from 'rxjs';
import { Test } from '@test/types';

export async function runTest(service: any, tests: Test): Promise<any> {
  service['clearCache']();
  for (const [test, expectation] of tests) {
    const result = test();
    if (result instanceof Observable) {
      await firstValueFrom(result);
    } else if (result instanceof Promise) {
      await result;
    }

    if (!!expectation) {
      expectation();
    }
  }

  return Promise.resolve();
}

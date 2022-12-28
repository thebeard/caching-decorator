import { firstValueFrom, Observable } from 'rxjs';
import { clearLogHistory } from '@helpers';
import { Test } from '@test/types';

export async function runTest(service: any, tests: Test): Promise<any> {
  service.clearCache();
  clearLogHistory();
  for (const [test, expectation] of tests) {
    let value;
    const result = test();

    if (result instanceof Observable) {
      value = await firstValueFrom(result);
    } else if (result instanceof Promise) {
      value = await result;
    }

    if (!!expectation) {
      expectation(value);
    }
  }

  return Promise.resolve();
}

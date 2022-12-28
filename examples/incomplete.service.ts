import { CacheClear } from '@decorators';
import { ICacheClear } from '@types';

export class IncompleteService {
  @CacheClear({ debug: 'log' })
  clearAndLog: ICacheClear;

  @CacheClear({ debug: 'debug' })
  clearAndDebug: ICacheClear;

  /**
   * Debug setting provided by default settings in associated tests
   */
  @CacheClear()
  clearCache: ICacheClear;
}

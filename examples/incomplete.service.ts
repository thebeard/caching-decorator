import { FlushCache } from '@decorators';
import { IFlushCache } from '@types';

export class IncompleteService {
  @FlushCache({ debug: 'log' })
  clearAndLog: IFlushCache;

  @FlushCache({ debug: 'debug' })
  clearAndDebug: IFlushCache;

  /**
   * Debug setting provided by default settings in associated tests
   */
  @FlushCache()
  clearCache: IFlushCache;
}

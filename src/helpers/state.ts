import { Observable } from 'rxjs';

const globalStore: Record<string, Map<string, Observable<any>>> = {};

export function getGlobalStore(): Record<string, Map<string, Observable<any>>> {
  return globalStore;
}

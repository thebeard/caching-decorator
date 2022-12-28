import { Observable } from 'rxjs';

const globalStore: Record<string, Map<string, Observable<any>>> = {},
  associatedKeysAndTargets = new Map<string, string[]>();

export function getGlobalStore(): Record<string, Map<string, Observable<any>>> {
  return globalStore;
}

export function getAssociatedKeysAndTargets(): Map<string, string[]> {
  return associatedKeysAndTargets;
}

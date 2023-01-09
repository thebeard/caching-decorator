export interface MockDataGenerationSet<K, L, M = L> {
  index: () => M[];
  read: (id: any) => K;
  post: (request: K) => L;
  put: (request: K) => L;
  delete: (id: string) => void;
}

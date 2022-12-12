export interface MockDataGenerationSet<K, L> {
  get: K[];
  post: (request: K) => L;
  put: (request: K) => L;
  delete: (id: string) => void;
}

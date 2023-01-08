import { Observable } from 'rxjs';
import { CacheOptions } from '@types';
import { cacheManyFactory } from '@helpers';

/**
 * Add multiple record caching to an observable-returning class method
 * @param options Caching options
 * @returns `(target: any, propertyName: string, descriptor: PropertyDescriptor) => PropertyDescriptor`
 */
export function CacheMany<K = any>(options?: CacheOptions): any {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    // Grab original method
    const childFunction: (...args: any[]) => Observable<K[]> = descriptor.value;

    // Rewrite the method with our decorator
    descriptor.value = cacheManyFactory<K>(
      target.constructor.name,
      propertyName,
      childFunction,
      options
    );

    // Return descriptor with replaced (wrapped) method
    return descriptor;
  };
}

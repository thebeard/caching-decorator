/**
 * Attach cache clearing function to associated class property or method
 *
 * @returns Cache clearing method
 */
export function CacheClear(): any {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    descriptor.value = target['clearCache'];
    return descriptor;
  };
}

export function CacheClear(): any {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    descriptor.value = target['clearCache'];
    return descriptor;
  };
}

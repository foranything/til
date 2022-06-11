export function log(
  target: any,
  property: string,
  descriptor: PropertyDescriptor
) {
  const oriMethod = descriptor.value;
  descriptor.value = function (...rest: unknown[]) {
    const result = oriMethod.apply(this, rest);
    console.log(`${property}(${rest}): ${result}`);
    return result;
  };
  return descriptor;
}

export function evalTime(
  target: any,
  property: string,
  descriptor: PropertyDescriptor
) {
  const oriMethod = descriptor.value;
  descriptor.value = function (...rest: unknown[]) {
    const start = Date.now();
    const result = oriMethod.apply(this, rest);
    const now = Date.now();
    const diff = now - start;
    console.log(`${property}(${rest}) ${diff}ms`);
    return result;
  };
  return descriptor;
}

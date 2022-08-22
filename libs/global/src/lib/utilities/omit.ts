/**
 * Maps an object to a version of itself without a particular key.
 *
 * @param object reference to object with string keys
 * @param keyToRemove property to omit when object mapping
 * @returns mapped object without the input key
 */
export function omit<T extends { [key: string]: any }>(
  object: T,
  keyToRemove: keyof T
): Partial<T> {
  return Object.keys(object)
    .filter((key) => key !== keyToRemove)
    .reduce((result, key) => Object.assign(result, { [key]: object[key] }), {});
}

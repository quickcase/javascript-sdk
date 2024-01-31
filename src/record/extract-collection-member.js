/**
 * Creates an instance of a relative value extractor for members of a complex collection field.
 *
 * @param {function} extract - Primed extract function, either `extractValue` or `extractMember`
 * @param {string} collectionPath - Path to parent collection field
 * @returns {function(*): *} Extract function relative to collection parent
 */
const extractCollectionMember = (extract, collectionPath) => (item) => (path) => {
  const resolver = resolvePath(collectionPath)(item);
  return extract(processPath(resolver)(path));
};

const resolvePath = (parentPath) => (item) => (path) => {
  if (path[0] === '[') {
    return path;
  }

  if (Number.isInteger(item)) {
    return `${parentPath}[${item}].value.${path}`;
  }

  return `${parentPath}[id:${item}].value.${path}`;
};

const processPath = (resolve) => (path) => {
  if (Array.isArray(path)) {
    return path.map(resolve);
  } else if (typeof path === 'object' && path !== null) {
    return Object.fromEntries(
      Object.entries(path).map(([k, p]) => [k, resolve(p)])
    );
  }

  return resolve(path);
};

export default extractCollectionMember;

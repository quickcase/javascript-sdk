import {isAbsolute, isMetadata} from '../path/index.js';

/**
 * Creates an instance of a relative value extractor for items of a collection field.
 * This can be further combined with `extractMember` to extract members of complex collection items.
 *
 * @param {function} extract - Primed extract function, either `extractValue` or `extractMember`
 * @param {string} collectionPath - Path to parent collection field
 * @returns {function(*): *} Extract function relative to collection parent
 */
const extractCollectionItem = (extract, collectionPath) => (path) => {
  const resolver = resolvePath(collectionPath);
  return extract(processPath(resolver)(path));
};

const resolvePath = (parentPath) => (path) => {
  if (Number.isInteger(path)) {
    return `${parentPath}[${path}].value`;
  }

  if (isMetadata(path) || isAbsolute(path)) {
    return path;
  }

  return `${parentPath}[id:${path}].value`;
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

export default extractCollectionItem;

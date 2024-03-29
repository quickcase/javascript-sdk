import * as Path from '../path/index.js';

/**
 * Creates an instance of a relative value extractor for members of a complex field.
 *
 * @param {function} extract - Primed extract function, either `extractValue`, `extractCollectionItem` or `extractMember`
 * @param {string} complexPath - Path to parent complex field
 * @returns {function(*): *} Extract function relative to complex parent
 */
const extractMember = (extract, complexPath) => (path) => {
  const resolver = resolvePath(complexPath);
  return extract(processPath(resolver)(path));
};

const resolvePath = (parentPath) => (path) => {
  if (Path.isMetadata(path) || Path.isAbsolute(path)) {
    return path;
  }
  return Path.build(parentPath, path);
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

export default extractMember;

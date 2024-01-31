/**
 * Creates an instance of a relative value extractor for members of a complex field.
 *
 * @param {function} extract - Primed extract function, either `extractValue` or `extractMember`
 * @param {string} complexPath - Path to parent complex field
 * @returns {function(*): *} Extract function relative to complex parent
 */
const extractMember = (extract, complexPath) => (path) => {
  const resolver = resolvePath(complexPath);
  return extract(processPath(resolver)(path));
};

const resolvePath = (parentPath) => (path) => {
  if (path[0] === '[') {
    return path;
  }
  return parentPath + '.' + path;
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

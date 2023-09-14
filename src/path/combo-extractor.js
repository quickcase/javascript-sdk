/**
 * @callback SimplePathExtractor
 * {string} path - A path using field path syntax
 * @return {any} The value(s) extracted, in the same shape as the provided path
 */

/**
 * @callback ComboPathExtractor
 * {string|Array.<string>|object} path - One or many paths to a field using field path syntax
 * @return {any} The value(s) extracted, in the same shape as the provided path
 */

/**
 * Decorates an extractor with support for combo-path extraction: ability to extract multiple paths at once using array
 * or objects of paths.
 *
 * @param {SimplePathExtractor} simpleExtractor - Simple extractor to be given combo capability
 * @return {ComboPathExtractor}
 */
const comboExtractor = (simpleExtractor) => (path) => {
  if (typeof path === 'string') {
    return simpleExtractor(path);
  } else if(Array.isArray(path)) {
    return path.map(simpleExtractor);
  } else if(typeof path === 'object' && path !== null) {
    return Object.fromEntries(
      Object.entries(path)
            .map(([key, path]) => [key, simpleExtractor(path)])
    );
  } else {
    throw `Unsupported path '${path}' of type ${typeof path}`;
  }
};

export default comboExtractor;

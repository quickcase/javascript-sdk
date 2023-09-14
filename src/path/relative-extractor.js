import comboExtractor from './combo-extractor.js';

/**
 *
 * @param {ComboPathExtractor} extractor - Extractor to decorate with relative path resolution
 * @param {string} basePath - Absolute path from which to extract
 * @return {ComboPathExtractor}
 */
const relativeExtractor = (extractor, basePath) => {
  const resolver = resolve(basePath);
  return (path) => extractor(resolver(path));
};

const resolve = (basePath) => {
  const absolutePath = () => basePath ? basePath + '.' : '';
  const resolvePath = (path) => path.replace(/@\./, absolutePath);
  return comboExtractor(resolvePath);
};

export default relativeExtractor;

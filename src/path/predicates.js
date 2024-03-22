import isMetadata from '../metadata/is-metadata.js';
import {ABSOLUTE_START} from './constants.js';

export const isAbsolute = (path) => path.slice(0,2) === ABSOLUTE_START;

export {
  // Reexport `isMetadata()` for convenience
  isMetadata,
};

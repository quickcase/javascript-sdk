import isMetadata from '../metadata/is-metadata.js';
import {ABSOLUTE_START} from './constants.js';

/**
 * Test whether a path is explicitly absolute.
 *
 * @param {string} path - Path to be tested
 * @returns {boolean} Whether the path is explicitly absolute (i.e. starts with `$.`)
 */
export const isAbsolute = (path) => path.slice(0,2) === ABSOLUTE_START;

/**
 * Test whether a path is relative.
 *
 * @param {string} path - Path to be tested
 * @returns {boolean} Whether the path is relative (i.e. does not start with `$.`)
 */
export const isRelative = (path) => !isAbsolute(path);

/**
 * Test whether a path points to a root field.
 * Note: This will return true for relative paths targeting top-level members for relative to current location.
 *
 * @param {string} path - Path to be tested
 * @returns {boolean} Whether the path points to a root field
 */
export const isRoot = (path) => !!path.match(/^(?:\$\.)?[a-zA-Z0-9_]+$/);

export {
  // Reexport `isMetadata()` for convenience
  isMetadata,
};

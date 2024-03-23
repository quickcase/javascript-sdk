import {ABSOLUTE_START} from './constants.js';
import {isAbsolute} from './predicates.js';

/**
 * Make a path explicitly absolute when it is not already.
 *
 * @param {string} path - Path to make explicitly absolute
 * @returns {string} Absolute path (i.e. starts with `$.`)
 */
export const absolute = (path) => isAbsolute(path) ? path : ABSOLUTE_START + path;

/**
 * Extract root field from path, excluding absolute path prefix `$.`.
 *
 * @param {string} path - Field path from which to extract root field
 * @returns {string} Root field identifier
 */
export const root = (path) => path.match(/^(?:\$\.)?([a-zA-Z0-9_]+)/)?.[1];

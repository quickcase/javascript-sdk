import {ABSOLUTE_START, SEPARATOR} from './constants.js';
import {isAbsolute, isRelative} from './predicates.js';

/**
 * Make a path explicitly absolute when it is not already.
 *
 * @param {string} path - Path to make explicitly absolute
 * @returns {string} Absolute path (i.e. starts with `$.`)
 */
export const absolute = (path) => isAbsolute(path) ? path : ABSOLUTE_START + path;

/**
 * Build a field path out of its individual parts.
 *
 * @param {...string} parts - Parts to assemble to build full path
 * @returns {string} Assembled field path
 */
export const build = (...parts) => parts.join(SEPARATOR);

/**
 * Make a path relative when it is not already.
 *
 * @param {string} path - Path to make relative
 * @returns {string} Relative path (i.e. does not start with `$.`)
 */
export const relative = (path) => isRelative(path) ? path : path.slice(2);

/**
 * Extract root field from path, excluding absolute path prefix `$.`.
 *
 * @param {string} path - Field path from which to extract root field
 * @returns {string} Root field identifier
 */
export const root = (path) => path.match(/^(?:\$\.)?([a-zA-Z0-9_]+)/)?.[1];

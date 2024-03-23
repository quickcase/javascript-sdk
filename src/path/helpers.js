/**
 * Extract root field from path, excluding absolute path prefix `$.`.
 *
 * @param {string} path - Field path from which to extract root field
 * @returns {string} Root field identifier
 */
export const root = (path) => path.match(/^(?:\$\.)?([a-zA-Z0-9_]+)/)?.[1];

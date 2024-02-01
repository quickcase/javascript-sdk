const METADATA_START = '[';

/**
 * Checks whether a field path targets metadata (ie. starts with `[`).
 * Attention: This does not guarantee the metadata itself exists.
 *
 * @param {string} path - Field path to check
 * @returns {boolean} True when field path follows metadata format
 */
const isMetadata = (path) => path[0] === METADATA_START;

export default isMetadata;

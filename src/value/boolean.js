const TRUE_VALUES = ['yes', 'true'];

/**
 * Parse a field value as a boolean.
 * **Attention:** Any value other than `'true'`, `'yes'` and `true` (ignoring case) will be parsed as `false`!
 *
 * @param {any} value - Value to parse as boolean
 * @returns {boolean} `true` if value was a boolean `true` or a string `'yes'` or `'true'` (ignoring case); `false` otherwise
 */
export const parseBool = (value) => {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    return TRUE_VALUES.includes(value.toLowerCase());
  }

  return false;
};

/**
 * Intended as a replacement for legacy @quickcase/node-toolkit `isYes()`.
 */
export const isTrue = parseBool;

/**
 * Intended as a replacement for legacy @quickcase/node-toolkit `isNo()`.
 */
export const isFalse = (value) => !parseBool(value);

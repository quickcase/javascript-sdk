import {isFalse, isTrue, parseBool} from './boolean.js';

const TEST_CASES = [
  // Actual, Expected
  ['', false],
  ['yes', true],
  ['yeS', true],
  ['Yes', true],
  ['YES', true],
  ['true', true],
  ['True', true],
  ['TRUE', true],
  ['TRuE', true],
  [true, true],
  ['no', false],
  ['NO', false],
  ['No', false],
  ['nO', false],
  ['false', false],
  ['False', false],
  ['FALSE', false],
  ['FalsE', false],
  [false, false],
  ['word', false],
  ['Yess', false],
  ['Noo', false],
  [123, false],
];

describe('parseBool', () => {
  test.each(TEST_CASES)(`should parse '%s' as %s`, (actual, expected) => {
    expect(parseBool(actual)).toBe(expected);
  });
});

describe('isTrue', () => {
  test.each(TEST_CASES)(`should identify '%s' as %s`, (actual, expected) => {
    expect(isTrue(actual)).toBe(expected);
  });
});

describe('isFalse', () => {
  test.each(TEST_CASES)(`should identify '%s' as not %s`, (actual, expected) => {
    expect(isFalse(actual)).toBe(!expected);
  });
});

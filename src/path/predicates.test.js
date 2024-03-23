import {isAbsolute, isRelative, isRoot} from './predicates.js';

describe('isAbsolute', () => {
  test.each([
    ['field1', false],
    ['$.field1', true],
    ['$.level1.level2', true],
    ['level1.level2', false],
    ['collection[0]', false],
    ['$.collection[0]', true],
    ['collection[0]', false],
    ['[state]', true], // Metadata paths are absolute by nature
  ])(`should path '%s' be absolute: %s`, (path, expectedAbsolute) => {
    expect(isAbsolute(path)).toBe(expectedAbsolute);
  });
});

describe('isRelative', () => {
  test.each([
    ['field1', true],
    ['$.field1', false],
    ['$.level1.level2', false],
    ['level1.level2', true],
    ['collection[0]', true],
    ['$.collection[0]', false],
    ['collection[0]', true],
    ['[state]', false], // Metadata paths are absolute by nature
  ])(`should path '%s' be relative: %s`, (path, expectedRelative) => {
    expect(isRelative(path)).toBe(expectedRelative);
  });
});

describe('isRoot', () => {
  test.each([
    ['field1', true],
    ['$.field1', true],
    ['$.level1.level2', false],
    ['level1.level2', false],
    ['$.collection[0]', false],
    ['collection[0]', false],
  ])(`should path '%s' be root: %s`, (path, expectedRoot) => {
    expect(isRoot(path)).toBe(expectedRoot);
  });
});

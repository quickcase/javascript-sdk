import {isRoot} from './predicates.js';

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

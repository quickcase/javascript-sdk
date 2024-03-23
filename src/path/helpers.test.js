import {root} from './helpers.js';

describe('root', () => {
  test.each([
    ['$', undefined],
    ['$.', undefined],
    ['field1', 'field1'],
    ['$.field1', 'field1'],
    ['$.level1.level2', 'level1'],
    ['level1.level2', 'level1'],
    ['collection[0]', 'collection'],
    ['$.collection[0]', 'collection'],
  ])(`should path '%s' be root: %s`, (path, expectedRoot) => {
    expect(root(path)).toBe(expectedRoot);
  });
});

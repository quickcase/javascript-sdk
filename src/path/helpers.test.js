import {absolute, relative, root} from './helpers.js';

describe('absolute', () => {
  test.each([
    ['field1', '$.field1'],
    ['$.field1', '$.field1'],
    ['$.level1.level2', '$.level1.level2'],
    ['level1.level2', '$.level1.level2'],
    ['collection[0]', '$.collection[0]'],
    ['$.collection[0]', '$.collection[0]'],
  ])(`should path '%s' be root: %s`, (path, expectedAbsolute) => {
    expect(absolute(path)).toBe(expectedAbsolute);
  });
});

describe('relative', () => {
  test.each([
    ['field1', 'field1'],
    ['$.field1', 'field1'],
    ['$.level1.level2', 'level1.level2'],
    ['level1.level2', 'level1.level2'],
    ['collection[0]', 'collection[0]'],
    ['$.collection[0]', 'collection[0]'],
  ])(`should path '%s' be root: %s`, (path, expectedRelative) => {
    expect(relative(path)).toBe(expectedRelative);
  });
});

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

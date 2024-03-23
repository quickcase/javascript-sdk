import {absolute, build, relative, root} from './helpers.js';

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

describe('build', () => {
  test.each([
    {parts: ['field1'], expected: 'field1'},
    {parts: ['$.field1'], expected: '$.field1'},
    {parts: ['level1', 'level2'], expected: 'level1.level2'},
    {parts: ['$.level1', 'level2'], expected: '$.level1.level2'},
    {parts: ['$.level1', 'level2', 'level3'], expected: '$.level1.level2.level3'},
    {parts: ['$.level1.level2', 'level3'], expected: '$.level1.level2.level3'},
    {parts: ['collection[0]', 'value', 'member'], expected: 'collection[0].value.member'},
    {parts: ['$.collection[0]', 'value', 'member'], expected: '$.collection[0].value.member'},
  ])('should build path: $expected', ({parts, expected}) => {
    expect(build(...parts)).toBe(expected);
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

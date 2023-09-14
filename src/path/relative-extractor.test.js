// Mock value extractor
import comboExtractor from './combo-extractor.js';
import relativeExtractor from './relative-extractor.js';

const mockExtractor = comboExtractor((path) => ({
  'level0.field1': 'value 1',
  'level0.field2': 'value 2',
  'level0.field3': 'value 3',
  'level0.level1.level2.field1': 'deep value 1',
  'level0.level1.level2.field2': 'deep value 2',
  'level0.level1.level2.field3': 'deep value 3',
  'rootField': 'root value',
  'rootField1': 'root value 1',
  'rootField2': 'root value 2',
})[path]);

test('should extract simple path relative to root complex path', () => {
  const extractor = relativeExtractor(mockExtractor, 'level0');

  expect(extractor('@.field1')).toEqual('value 1');
});

test('should extract array of paths relative to root complex path', () => {
  const extractor = relativeExtractor(mockExtractor, 'level0');

  const paths = [
    'field1', // <-- missing relative suffix
    '@.field1',
    '@.field2',
    '@.field3',
    '@.rootField', // <-- not found in `level0`
    'rootField',
  ];
  expect(extractor(paths)).toEqual([
    undefined,
    'value 1',
    'value 2',
    'value 3',
    undefined,
    'root value',
  ]);
});

test('should extract object of paths relative to root complex path', () => {
  const extractor = relativeExtractor(mockExtractor, 'level0');

  const paths = {
    a: 'field1', // <-- missing relative suffix
    b: '@.field1',
    c: '@.field2',
    d: '@.field3',
    e: '@.rootField', // <-- not found in `level0`
    f: 'rootField',
  };
  expect(extractor(paths, {relativeTo: 'level0'})).toEqual({
    a: undefined,
    b: 'value 1',
    c: 'value 2',
    d: 'value 3',
    e: undefined,
    f: 'root value',
  });
});

test('should accept nesting in absolute path', () => {
  const extractor = relativeExtractor(mockExtractor, 'level0.level1.level2');

  const paths = [
    'field1', // <-- missing relative suffix
    '@.field1',
    '@.field2',
    '@.field3',
    '@.rootField', // <-- not found in `level0`
    'rootField',
  ];
  expect(extractor(paths)).toEqual([
    undefined,
    'deep value 1',
    'deep value 2',
    'deep value 3',
    undefined,
    'root value',
  ]);
});

test('should resolve relative prefix to root when no relative path', () => {
  const extractor = relativeExtractor(mockExtractor, '');

  const paths = [
    'rootField1',
    '@.rootField1',
    '@.rootField2',
    '@.field1', // <-- does not exist
  ];
  expect(extractor(paths)).toEqual([
    'root value 1',
    'root value 1',
    'root value 2',
    undefined,
  ]);
});

import extractCollectionMember from './extract-collection-member.js';
import extractValue from './extract-value.js';
import extractCollectionItem from './extract-collection-item.js';

const extractor = extractValue({
  id: '1111222233334444',
  data: {
    'field0': 'Root value 0',
    'collection1': [
      {id: 'item-1', value: 'Value 1'},
      {id: 'item-2', value: 'Value 2'},
      {id: 'item-3', value: 'Value 3'},
    ],
  },
});

describe('when single item path', () => {
  test('should extract item by ID', () => {
    expect(
      extractCollectionItem(extractor, 'collection1')('item-1')
    ).toEqual('Value 1');
  });

  test('should extract item by index (0-based)', () => {
    expect(
      extractCollectionItem(extractor, 'collection1')(2)
    ).toEqual('Value 3');
  });

  test('should extract metadata from root', () => {
    expect(
      extractCollectionItem(extractor, 'collection1')('[id]')
    ).toEqual('1111222233334444');
  });

  test('should extract absolute path from root', () => {
    expect(
      extractCollectionItem(extractor, 'collection1')('$.field0')
    ).toEqual('Root value 0');
  });
});

describe('when array of item paths', () => {
  test('should extract items from collection in same order', () => {
    expect(extractCollectionItem(extractor, 'collection1')([
      'item-2', // By ID
      0, // By index
      'item-3',
    ])).toEqual([
      'Value 2',
      'Value 1',
      'Value 3',
    ]);
  });

  test('should extract metadata from root', () => {
    expect(
      extractCollectionItem(extractor, 'collection1')(['item-1', '[id]'])
    ).toEqual([
      'Value 1',
      '1111222233334444',
    ]);
  });
});

describe('when object of item paths', () => {
  test('should extract items from collection with matching shape', () => {
    expect(extractCollectionItem(extractor, 'collection1')({
      '1': 1, // By index
      '2': 'item-1', // By ID
      '3': 2,
    })).toEqual({
      '1': 'Value 2',
      '2': 'Value 1',
      '3': 'Value 3',
    });
  });

  test('should extract metadata from root', () => {
    expect(extractCollectionItem(extractor, 'collection1')({
      '1': 'item-2',
      '2': '[id]',
    })).toEqual({
      '1': 'Value 2',
      '2': '1111222233334444',
    });
  });
});

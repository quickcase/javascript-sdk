import extractCollectionMember from './extract-collection-member.js';
import extractValue from './extract-value.js';

const extractor = extractValue({
  id: '1111222233334444',
  data: {
    'field0': 'Root value 0',
    'collection1': [
      {
        id: 'item-1',
        value: {
          'member1': 'Value 1.1',
          'member2': 'Value 1.2',
        }
      },
      {
        id: 'item-2',
        value: {
          'member1': 'Value 2.1',
          'member2': 'Value 2.2',
        }
      },
      {
        id: 'item-3',
        value: {
          'member1': 'Value 3.1',
          'member2': 'Value 3.2',
        }
      },
    ],
  },
});

describe('when single item path', () => {
  test('should extract item by ID', () => {
    const extract = extractCollectionMember(extractor, 'collection1')('item-2');
    expect(extract('member1')).toEqual('Value 2.1');
  });

  test('should extract item by index (0-based)', () => {
    const extract = extractCollectionMember(extractor, 'collection1')(2);
    expect(extract('member2')).toEqual('Value 3.2');
  });

  test('should extract metadata from root', () => {
    const extract = extractCollectionMember(extractor, 'collection1')('item-2');
    expect(extract('[id]')).toEqual('1111222233334444');
  });

  test('should extract absolute path from root', () => {
    const extract = extractCollectionMember(extractor, 'collection1')('item-2');
    expect(extract('$.field0')).toEqual('Root value 0');
  });
});

describe('when array of item paths', () => {
  test('should extract items from collection in same order', () => {
    const extract = extractCollectionMember(extractor, 'collection1')(1);
    expect(extract([
      'member2',
      'member1',
    ])).toEqual([
      'Value 2.2',
      'Value 2.1',
    ]);
  });

  test('should extract metadata from root', () => {
    const extract = extractCollectionMember(extractor, 'collection1')('item-3');
    expect(extract(['member1', '[id]'])).toEqual([
      'Value 3.1',
      '1111222233334444',
    ]);
  });
});

describe('when object of item paths', () => {
  test('should extract items from collection with matching shape', () => {
    const extract = extractCollectionMember(extractor, 'collection1')('item-1');
    expect(extract({
      '1': 'member2',
      '2': 'member1',
    })).toEqual({
      '1': 'Value 1.2',
      '2': 'Value 1.1',
    });
  });

  test('should extract metadata from root', () => {
    const extract = extractCollectionMember(extractor, 'collection1')(0);
    expect(extract({
      '1': 'member1',
      '2': '[id]',
    })).toEqual({
      '1': 'Value 1.1',
      '2': '1111222233334444',
    });
  });
});

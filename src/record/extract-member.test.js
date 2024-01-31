import extractValue from './extract-value.js';
import extractMember from './extract-member.js';

const extractor = extractValue({
  id: '1111222233334444',
  data: {
    'complex1': {
      'member1': 'Value 1',
      'member2': 'Value 2',
      'member3': 'Value 3',
    },
  },
});

describe('when single member path', () => {
  test('should extract member from complex', () => {
    expect(
      extractMember(extractor, 'complex1')('member1')
    ).toEqual('Value 1');
  });

  test('should extract metadata from root', () => {
    expect(
      extractMember(extractor, 'complex1')('[id]')
    ).toEqual('1111222233334444');
  });
});

describe('when array of member paths', () => {
  test('should extract members from complex in same order', () => {
    expect(extractMember(extractor, 'complex1')([
      'member2',
      'member1',
      'member3',
    ])).toEqual([
      'Value 2',
      'Value 1',
      'Value 3',
    ]);
  });

  test('should extract metadata from root', () => {
    expect(
      extractMember(extractor, 'complex1')(['member1', '[id]'])
    ).toEqual([
      'Value 1',
      '1111222233334444',
    ]);
  });
});

describe('when object of member paths', () => {
  test('should extract members from complex with matching shape', () => {
    expect(extractMember(extractor, 'complex1')({
      '1': 'member2',
      '2': 'member1',
      '3': 'member3',
    })).toEqual({
      '1': 'Value 2',
      '2': 'Value 1',
      '3': 'Value 3',
    });
  });

  test('should extract metadata from root', () => {
    expect(extractMember(extractor, 'complex1')({
      '1': 'member2',
      '2': '[id]',
    })).toEqual({
      '1': 'Value 2',
      '2': '1111222233334444',
    });
  });
});

import extractValue from '../record/extract-value.js';
import {parse, renderer} from './template.js';

describe('parser', () => {
  test('should return all field paths used in template', () => {
    const template = `
      Regular field path: {{applicant.firstName}}
      Coerced boolean field path: {{hasDisability?}}
      Section:
        {{#address}}
          Relative address field: {{@.postcode}}
          Root field: {{applicant.lastName}}
        {{/address}}
    `;

    const fieldPaths = parse(template);

    expect(fieldPaths).toEqual([
      'applicant.firstName',
      'hasDisability', // <-- coercion suffix trimmed
      'address',
      '@.postcode',
      'applicant.lastName',
    ]);
  });
});

describe('renderer', () => {
  describe('should render template and index paths', () => {
    test.each([
      {
        data: {firstName: 'Henry'},
        template: 'Hello {{firstName}}',
        expected: 'Hello Henry',
      },
      {
        data: {firstName: 'Henry', lastName: 'Tudor'},
        template: 'Hello {{firstName}} {{lastName}}',
        expected: 'Hello Henry Tudor',
      },
    ])('template: $template', ({data, template, expected}) => {
      const extractor = extractValue({data});
      const render = renderer(extractor);

      expect(render(template)).toEqual(expected);
    });
  });

  describe('Conditional section', () => {
    test.each([
      {
        name: 'should not render section when variable undefined',
        data: {},
        template: '{{#field1}}Section{{/field1}}',
        expected: '', // <-- empty string
      },
      {
        name: 'should not render section when variable null',
        data: {field1: null},
        template: '{{#field1}}Section{{/field1}}',
        expected: '', // <-- empty string
      },
      {
        name: 'should not render section when variable empty string',
        data: {field1: ''},
        template: '{{#field1}}Section{{/field1}}',
        expected: '', // <-- empty string
      },
      {
        name: 'should render section when variable non-empty string',
        data: {field1: 'any string'},
        template: '{{#field1}}Section{{/field1}}',
        expected: 'Section',
      },
    ])('$name', ({data, template, expected}) => {
      const extractor = extractValue({data});
      const render = renderer(extractor);

      expect(render(template)).toEqual(expected);
    });
  });

  describe('Conditional section on complex with relative paths', () => {
    test('should render section and resolve paths relative to complex when complex is set', () => {
      const extractor = extractValue({
        data: {
          applicant: {
            firstName: 'Henry',
            lastName: 'Tudor',
          },
        },
      });
      const render = renderer(extractor);

      const output = render('{{#applicant}}Hello {{@.firstName}} {{@.lastName}}{{/applicant}}');

      expect(output).toEqual('Hello Henry Tudor');
    });

    test('should not render section when complex is falsy', () => {
      const extractor = extractValue({
        data: {
          applicant: undefined, // <-- falsy
        },
      });
      const render = renderer(extractor);

      const output = render('{{#applicant}}Hello {{@.firstName}} {{@.lastName}}{{/applicant}}');

      expect(output).toEqual('');
    });

    test('should render nested sections', () => {
      const extractor = extractValue({
        data: {
          person: {
            firstName: 'Henry',
            lastName: 'Tudor',
            address: {
              line1: '102 Petty France',
              postcode: 'SW1H 9EA',
            }
          }
        },
      });
      const render = renderer(extractor);

      const output = render('{{#person}}Hello {{@.firstName}} {{#@.address}}from {{@.line1}}{{/@.address}}{{/person}}');

      expect(output).toEqual('Hello Henry from 102 Petty France');
    });

    test('should traverse context stack from top (nested context) to bottom (root context) until a value is found', () => {
      const extractor = extractValue({
        data: {
          person: {
            firstName: 'Henry',
            lastName: 'Tudor',
            address: {
              line1: '102 Petty France',
              postcode: 'SW1H 9EA',
            }
          }
        },
      });
      const render = renderer(extractor);

      const output = render('{{#person}}Hello {{#@.address}}{{@.firstName}} from {{@.line1}}{{/@.address}}{{/person}}');

      // First name is rendered from parent `person` context even though it doesn't belongs to top `@.address` context
      expect(output).toEqual('Hello Henry from 102 Petty France');
    });
  });

  describe('Repeated section on collection with relative paths', () => {
    test('should render section once per collection item and resolve paths relative to collection items when collection is set and non empty', () => {
      const extractor = extractValue({
        data: {
          addresses: [
            {
              value: {postcode: 'AA0 0AA'}
            },
            {
              value: {postcode: 'BB0 0BB'}
            },
            {
              value: {postcode: 'CC0 0CC'}
            },
          ],
        },
      });
      const render = renderer(extractor);

      const output = render('{{#addresses}}- {{@.value.postcode}}\n{{/addresses}}');

      expect(output).toEqual('- AA0 0AA\n- BB0 0BB\n- CC0 0CC\n');
    });

    test('should not render section when collection is empty', () => {
      const extractor = extractValue({
        data: {
          addresses: [], // <-- empty
        },
      });
      const render = renderer(extractor);

      const output = render('{{#addresses}}- {{@.value.postcode}}\n{{/addresses}}');

      expect(output).toEqual('');
    });

    test('should render relative nested sections in items', () => {
      const extractor = extractValue({
        data: {
          persons: [
            {
              value: {
                address: {postcode: 'AA0 0AA'},
              }
            },
            {
              value: {
                address: {postcode: 'BB0 0BB'},
              }
            },
            {
              value: {
                address: {postcode: 'CC0 0CC'},
              }
            },
          ],
        },
      });
      const render = renderer(extractor);

      const output = render('{{#persons}}- {{#@.value.address}}Postcode: {{@.postcode}}{{/@.value.address}}\n{{/persons}}');

      expect(output).toEqual('- Postcode: AA0 0AA\n- Postcode: BB0 0BB\n- Postcode: CC0 0CC\n');
    });
  });

  describe('Inverted section', () => {
    test.each([
      {
        name: 'should render section when variable undefined',
        data: {},
        template: '{{^field1}}Section{{/field1}}',
        expected: 'Section',
      },
      {
        name: 'should render section when variable null',
        data: {field1: null},
        template: '{{^field1}}Section{{/field1}}',
        expected: 'Section',
      },
      {
        name: 'should render section when variable empty string',
        data: {field1: ''},
        template: '{{^field1}}Section{{/field1}}',
        expected: 'Section',
      },
      {
        name: 'should not render section when variable non-empty string',
        data: {field1: 'any string'},
        template: '{{^field1}}Section{{/field1}}',
        expected: '', // <-- empty string
      },
    ])('$name', ({data, template, expected}) => {
      const extractor = extractValue({data});
      const render = renderer(extractor);

      expect(render(template)).toEqual(expected);
    });
  });

  describe('Inverted section with Yes/No coercion to boolean using `?` suffix', () => {
    test.each([
      {
        name: 'should coerce to false when undefined',
        data: {},
        template: '{{^field1?}}Section{{/field1?}}',
        expected: 'Section',
      },
      {
        name: 'should coerce to false when null',
        data: {field1: null},
        template: '{{^field1?}}Section{{/field1?}}',
        expected: 'Section',
      },
      {
        name: 'should coerce to false when empty string',
        data: {field1: ''},
        template: '{{^field1?}}Section{{/field1?}}',
        expected: 'Section',
      },
      {
        name: 'should coerce to false when value is anything but `yes`',
        data: {field1: 'something'},
        template: '{{^field1?}}Section{{/field1?}}',
        expected: 'Section',
      },
      {
        name: 'should coerce to false when value is `no`',
        data: {field1: 'no'},
        template: '{{^field1?}}Section{{/field1?}}',
        expected: 'Section',
      },
      {
        name: 'should coerce to false when value is `nO` (any case)',
        data: {field1: 'nO'},
        template: '{{^field1?}}Section{{/field1?}}',
        expected: 'Section',
      },
      {
        name: 'should coerce to true when value is `yes`',
        data: {field1: 'yes'},
        template: '{{^field1?}}Section{{/field1?}}',
        expected: '', // <-- empty string
      },
      {
        name: 'should coerce to true when value is `yEs` (any case)',
        data: {field1: 'yEs'},
        template: '{{^field1?}}Section{{/field1?}}',
        expected: '', // <-- empty string
      },
    ])('$name', ({data, template, expected}) => {
      const extractor = extractValue({data});
      const render = renderer(extractor);

      expect(render(template)).toEqual(expected);
    });
  });

  describe('Conditional section with Yes/No coercion to boolean using `?` suffix', () => {
    test.each([
      {
        name: 'should coerce to false when undefined',
        data: {},
        template: '{{#field1?}}Section{{/field1?}}',
        expected: '', // <-- empty string
      },
      {
        name: 'should coerce to false when null',
        data: {field1: null},
        template: '{{#field1?}}Section{{/field1?}}',
        expected: '', // <-- empty string
      },
      {
        name: 'should coerce to false when empty string',
        data: {field1: ''},
        template: '{{#field1?}}Section{{/field1?}}',
        expected: '', // <-- empty string
      },
      {
        name: 'should coerce to false when value is anything but `yes`',
        data: {field1: 'something'},
        template: '{{#field1?}}Section{{/field1?}}',
        expected: '', // <-- empty string
      },
      {
        name: 'should coerce to false when value is `no`',
        data: {field1: 'no'},
        template: '{{#field1?}}Section{{/field1?}}',
        expected: '', // <-- empty string
      },
      {
        name: 'should coerce to false when value is `nO` (any case)',
        data: {field1: 'nO'},
        template: '{{#field1?}}Section{{/field1?}}',
        expected: '', // <-- empty string
      },
      {
        name: 'should coerce to true when value is `yes`',
        data: {field1: 'yes'},
        template: '{{#field1?}}Section{{/field1?}}',
        expected: 'Section',
      },
      {
        name: 'should coerce to true when value is `yEs` (any case)',
        data: {field1: 'yEs'},
        template: '{{#field1?}}Section{{/field1?}}',
        expected: 'Section',
      },
    ])('$name', ({data, template, expected}) => {
      const extractor = extractValue({data});
      const render = renderer(extractor);

      expect(render(template)).toEqual(expected);
    });
  });
});

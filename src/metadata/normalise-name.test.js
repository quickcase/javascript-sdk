import * as NAMES from './constants.js';
import normaliseName from './normalise-name.js';

test('should return undefined when name not valid', () => {
  expect(normaliseName('notValid')).toBeUndefined();
});

describe('workspace', () => {
  test.each([
    ['identity', NAMES.WORKSPACE, NAMES.WORKSPACE],
    ['case insensitive', '[WORKspace]', NAMES.WORKSPACE],
    ['legacy', '[jurisdiction]', NAMES.WORKSPACE],
    ['legacy', '[organisation]', NAMES.WORKSPACE],
    ['no brackets', 'workspace', NAMES.WORKSPACE],
    ['no brackets + case insensitive', 'WORKspace', NAMES.WORKSPACE],
    ['no brackets + legacy', 'jurisdiction', NAMES.WORKSPACE],
    ['no brackets + legacy', 'organisation', NAMES.WORKSPACE],
  ])('should normalise workspace name when %s (%s)', (name, actual, expected) => {
    expect(normaliseName(actual)).toBe(expected);
  });
});

describe('type', () => {
  test.each([
    ['identity', NAMES.TYPE, NAMES.TYPE],
    ['case insensitive', '[TYpe]', NAMES.TYPE],
    ['legacy', '[case_type]', NAMES.TYPE],
    ['no brackets', 'type', NAMES.TYPE],
    ['no brackets + case insensitive', 'TypE', NAMES.TYPE],
    ['no brackets + legacy', 'case_type', NAMES.TYPE],
  ])('should normalise type name when %s (%s)', (name, actual, expected) => {
    expect(normaliseName(actual)).toBe(expected);
  });
});

describe('id', () => {
  test.each([
    ['identity', NAMES.ID, NAMES.ID],
    ['case insensitive', '[Id]', NAMES.ID],
    ['legacy', '[reference]', NAMES.ID],
    ['legacy', '[case_reference]', NAMES.ID],
    ['no brackets', 'id', NAMES.ID],
    ['no brackets + case insensitive', 'Id', NAMES.ID],
    ['no brackets + legacy', 'reference', NAMES.ID],
    ['no brackets + legacy', 'case_reference', NAMES.ID],
  ])('should normalise reference name when %s (%s)', (name, actual, expected) => {
    expect(normaliseName(actual)).toBe(expected);
  });
});

describe('title', () => {
  test.each([
    ['identity', NAMES.TITLE, NAMES.TITLE],
    ['case insensitive', '[TiTle]', NAMES.TITLE],
    ['no brackets', 'title', NAMES.TITLE],
    ['no brackets + case insensitive', 'TitLe', NAMES.TITLE],
  ])('should normalise title name when %s (%s)', (name, actual, expected) => {
    expect(normaliseName(actual)).toBe(expected);
  });
});

describe('state', () => {
  test.each([
    ['identity', NAMES.STATE, NAMES.STATE],
    ['case insensitive', '[StAtE]', NAMES.STATE],
    ['no brackets', 'state', NAMES.STATE],
    ['no brackets + case insensitive', 'STAte', NAMES.STATE],
  ])('should normalise state name when %s (%s)', (name, actual, expected) => {
    expect(normaliseName(actual)).toBe(expected);
  });
});

describe('classification', () => {
  test.each([
    ['identity', NAMES.CLASSIFICATION, NAMES.CLASSIFICATION],
    ['case insensitive', '[ClAssificatioN]', NAMES.CLASSIFICATION],
    ['legacy', '[security_classification]', NAMES.CLASSIFICATION],
    ['no brackets', 'classification', NAMES.CLASSIFICATION],
    ['no brackets + case insensitive', 'ClassificatioN', NAMES.CLASSIFICATION],
    ['no brackets + legacy', 'Security_Classification', NAMES.CLASSIFICATION],
  ])('should normalise classification name when %s (%s)', (name, actual, expected) => {
    expect(normaliseName(actual)).toBe(expected);
  });
});

describe('createdAt', () => {
  test.each([
    ['identity', NAMES.CREATED_AT, NAMES.CREATED_AT],
    ['case insensitive', '[CREATEDat]', NAMES.CREATED_AT],
    ['legacy', '[created_date]', NAMES.CREATED_AT],
    ['no brackets', 'createdAt', NAMES.CREATED_AT],
    ['no brackets + case insensitive', 'CREATEDat', NAMES.CREATED_AT],
    ['no brackets + legacy', 'created_date', NAMES.CREATED_AT],
  ])('should normalise createdAt name when %s (%s)', (name, actual, expected) => {
    expect(normaliseName(actual)).toBe(expected);
  });
});

describe('lastModifiedAt', () => {
  test.each([
    ['identity', NAMES.LAST_MODIFIED_AT, NAMES.LAST_MODIFIED_AT],
    ['case insensitive', '[lastMODIFIEDat]', NAMES.LAST_MODIFIED_AT],
    ['legacy', '[last_modified]', NAMES.LAST_MODIFIED_AT],
    ['no brackets', 'lastModifiedAt', NAMES.LAST_MODIFIED_AT],
    ['no brackets + case insensitive', 'lastMODIFIEDat', NAMES.LAST_MODIFIED_AT],
    ['no brackets + legacy', 'last_modified', NAMES.LAST_MODIFIED_AT],
  ])('should normalise lastModifiedAt name when %s (%s)', (name, actual, expected) => {
    expect(normaliseName(actual)).toBe(expected);
  });
});

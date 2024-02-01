import isMetadata from './is-metadata.js';

test.each([
  // Current
  '[workspace]',
  '[type]',
  '[id]',
  '[title]',
  '[state]',
  '[classification]',
  '[createdAt]',
  '[lastModifiedAt]',

  // Legacy
  '[organisation]',
  '[jurisdiction]',
  '[case_type]',
  '[reference]',
  '[case_reference]',
  '[security_classification]',
  '[created]',
  '[created_date]',
  '[modified]',
  '[last_modified]',
  '[last_modified_date]',
])('should be recognised as metadata when name between brackets: %s', (actual) => {
  expect(isMetadata(actual)).toBeTruthy();
});

test.each([
  'workspace',
  'type',
  'id',
  'title',
  'state',
  'classification',
  'createdAt',
  'lastModifiedAt',
  'organisation',
  'jurisdiction',
  'case_type',
  'reference',
  'case_reference',
  'security_classification',
  'created',
  'created_date',
  'modified',
  'last_modified',
  'last_modified_date',
  'randomField',
  'randomPath.to.field',
  'collection[123]',
  'collection[id:item-1]',
  'collection[123].value.member',
])('should not be recognised as metadata when name not between brackets: %s', (actual) => {
  expect(isMetadata(actual)).toBeFalsy();
});

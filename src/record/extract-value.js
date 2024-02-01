import {isMetadata} from '../metadata/index.js';
import * as Metadata from '../metadata/index.js';
import comboExtractor from '../path/combo-extractor.js';

const COLLECTION_ITEM_PATTERN = /^(?<name>[^[\]]+)(?:\[(?:(?<colIndex>\d+)|id:(?<colId>[^[\]]+))\])?$/;

/**
 * Given a record and the path to a field, extract the value of that field. When accessing case fields, this approach should
 * be preferred as a way to avoid hard references to case fields through the use of a fields map.
 * This also supports extracting metadata.
 * <b>Please note: The extraction logic is written against data-store's API contract.</b>
 *
 * @param {object} record - Record from which the field value should be extracted
 * @returns {ComboPathExtractor} Extractor extracting the value associated with a field path if found or `undefined`
 * if case has no data or path cannot be found
 */
const extractValue = (record) => comboExtractor(valueExtractor(record))

const valueExtractor = (record) => (path) => {
  if (isMetadata(path)) {
    return metadataExtractor(record)(path);
  }

  const caseData = dataExtractor(record);
  return caseData ? field(caseData)(path.split('.').map(parsePathElement)) : undefined;
};

const metadataExtractor = (record) => (path) => {
  const metadata = Metadata.normaliseName(path);

  // Detect legacy API v1 & v2 records
  const legacy = !record.metadata;

  switch (metadata) {
    case Metadata.WORKSPACE:
      return legacy ? record.jurisdiction : record.metadata.workspace;
    case Metadata.TYPE:
      return legacy ? record.case_type_id: record.metadata.type;
    case Metadata.ID:
      return record.id;
    case Metadata.TITLE:
      return record.metadata?.title;
    case Metadata.STATE:
      return legacy ? record.state : record.metadata.state;
    case Metadata.CLASSIFICATION:
      return legacy? record.security_classification : record.metadata.classification;
    case Metadata.CREATED_AT:
      return legacy ? record.created_date : record.metadata.createdAt;
    case Metadata.LAST_MODIFIED_AT:
      return legacy ? record.last_modified : record.metadata.lastModifiedAt;
    default:
      throw new Error(`No metadata with name '${path}'`);
  }
};

const parsePathElement = (pathElement) => {
  const match = COLLECTION_ITEM_PATTERN.exec(pathElement);
  return match ? match.groups : pathElement;
};

/**
 * Handle the fact that legacy search endpoint return cases with data under `case_data` while others endpoints return data under `data`.
 * While provided for convenience, function `fieldExtractor` should be preferred to avoid hard references to fields.
 *
 * @param record Record from which the data should be retrieved.
 * @returns {object} data property of the given case
 */
const dataExtractor = (record) => record && (record.data || record.case_data);

const field = (from) => (pathElements) => {
  const [nextElement, ...remainingElements] = pathElements;
  const nextValue = extractNextElement(from, nextElement);

  if (remainingElements && remainingElements.length > 0) {
    return field(nextValue)(remainingElements);
  } else {
    return nextValue;
  }
};

const isObjectWithKey = (obj, key) => obj && typeof obj === 'object' && Object.keys(obj).includes(key);

const extractCollectionItem = (collection, {colIndex, colId}) => {
  if (!Array.isArray(collection)) {
    return undefined;
  }

  if (colId) {
    return collection.find((item) => item.id === colId);
  }

  return collection[parseInt(colIndex)];
};

const extractNextElement = (from, {name, colIndex, colId}) => {
  if (isObjectWithKey(from, name)) {
    const nextValue = from[name];

    if (colIndex || colId) {
      return extractCollectionItem(nextValue, {colIndex, colId});
    }

    return nextValue;
  }
};

export default extractValue;

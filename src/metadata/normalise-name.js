import * as NAMES from './constants.js';

/**
 * Transforms a legacy or non-standard metadata name into its bracketed standard equivalent
 *
 * @param {string} metadataName - Non-standard or legacy name to normalise.
 * @return {string} Normalised name or `undefined` if name could not be associated to a known metadata
 */
const normaliseName = (metadataName) => {
  const name = dropBrackets(metadataName.toLowerCase());

  switch (name) {
    case 'workspace':
    case 'organisation': // Legacy
    case 'jurisdiction': // Legacy
      return NAMES.WORKSPACE;
    case 'type':
    case 'case_type': // Legacy
      return NAMES.TYPE;
    case 'reference':
    case 'id': // Legacy
    case 'case_reference': // Legacy
      return NAMES.REFERENCE;
    case 'title':
      return NAMES.TITLE;
    case 'state':
      return NAMES.STATE;
    case 'classification':
    case 'security_classification': // Legacy
      return NAMES.CLASSIFICATION;
    case 'createdat':
    case 'created_date': // Legacy
      return NAMES.CREATED_AT;
    case 'lastmodifiedat':
    case 'last_modified': // Legacy
      return NAMES.LAST_MODIFIED_AT;
    default:
      return;
  }
};

const dropBrackets = (name) => {
  if (name[0] === '[') {
    return name.slice(1, -1);
  }

  return name;
};

export default normaliseName;

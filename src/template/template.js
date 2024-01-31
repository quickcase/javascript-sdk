import Mustache from 'mustache';
import {extractCollectionMember, extractMember} from '../record/index.js';

const COERCE_BOOL_SUFFIX = '?';
const TEMPLATE_VALUE_PATTERN = /{{{?[#^]?((?:@\.)?[a-zA-Z0-9._[\]:]+)[?]?}?}}/g;

/**
 * Decorates a standard Mustache Context with QuickCase-specific interpolation logic and syntax.
 * The Context view is only used to store the `relativeTo` path instead of the actual view.
 *
 * @param {function} extractor - Record.extractField function primed with an actual record
 * @param {Mustache.Context} context - Current context, defaults to new empty Mustache Context
 * @return {Mustache.Context}
 */
const RecordContext = (extractor, context = new Mustache.Context()) => {
  let lastLookup = null;

  const recordLastLookup = (path, value) => {
    lastLookup = {path, value};
  };

  const pathForView = (view) => {
    const extract = context.view || extractor;

    if (Array.isArray(lastLookup?.value)) {
      // Build path to array item by index
      return extractCollectionMember(extract, lastLookup.path)(lastLookup.value.indexOf(view));
    }

    if (lastLookup?.value && typeof lastLookup?.value === 'object') {
      return extractMember(extract, lastLookup.path);
    }
  };

  context.lookup = (path) => {
    let ctx = context;
    let value;

    // Iterates from current context to root context
    while (ctx) {
      const extractValue = ctx.view || extractor;

      // Coerce to boolean when `?` suffix used in path
      if (path.slice(-COERCE_BOOL_SUFFIX.length) === COERCE_BOOL_SUFFIX) {
        path = path.slice(0, -COERCE_BOOL_SUFFIX.length);
        value = extractValue(path)?.toLowerCase() === 'yes';
      } else {
        console.log(extractValue);
        value = extractValue(path);
      }

      if (value !== undefined) {
        // Abort context iteration as soon as a defined value is extracted
        break;
      }

      ctx = ctx.parent;
    }

    recordLastLookup(path, value);
    return value;
  };

  context.push = (view) => RecordContext(extractor, new Mustache.Context(pathForView(view), context));

  return context;
};

/**
 * Render templates in the context of a record using field paths as the notation for variable interpolation.
 * For template syntax and capabilities, see http://mustache.github.io/mustache.5.html
 *
 * @param extractor Record extractor used to resolve field paths
 * @return {function(string): string} rendering function
 */
export const renderer = (extractor) => {
  const context = RecordContext(extractor);

  return (template) => Mustache.render(template, context);
};

export const parse = (template) => {
  return [...template.matchAll(TEMPLATE_VALUE_PATTERN)].map(([, firstGroup]) => firstGroup);
};

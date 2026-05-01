import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

/**
 * Sanitizes a string or an object containing strings.
 */
export function sanitize(input) {
  if (typeof input === 'string') {
    return DOMPurify.sanitize(input);
  }

  if (Array.isArray(input)) {
    return input.map(item => sanitize(item));
  }

  if (typeof input === 'object' && input !== null) {
    const sanitizedObj = {};
    for (const key in input) {
      sanitizedObj[key] = sanitize(input[key]);
    }
    return sanitizedObj;
  }

  return input;
}

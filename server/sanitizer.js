/**
 * A lightweight HTML sanitizer that strips tags to prevent basic XSS
 * without requiring jsdom/dompurify (which crashes Vercel Serverless Functions).
 */
export function sanitize(input) {
  if (typeof input === 'string') {
    // Strip HTML tags
    return input.replace(/<\/?[^>]+(>|$)/g, '');
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

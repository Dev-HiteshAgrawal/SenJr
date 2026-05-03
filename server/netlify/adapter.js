/**
 * Bridges Netlify Functions (Lambda-style) to Node http-style req/res
 * used by server/handlers/*.
 */

function normalizeHeaders(raw) {
  const out = {};
  for (const [k, v] of Object.entries(raw || {})) {
    if (v === undefined || v === null) continue;
    out[k.toLowerCase()] = Array.isArray(v) ? v.join(',') : String(v);
  }
  return out;
}

function parseBody(event) {
  let raw = event.body;
  if (raw == null) return '';
  if (event.isBase64Encoded) {
    raw = Buffer.from(raw, 'base64').toString('utf8');
  }
  return typeof raw === 'string' ? raw : String(raw);
}

export function lambdaEventToNodeReqRes(event) {
  const headers = normalizeHeaders(event.headers);
  const rawBody = parseBody(event);
  let parsedBody;
  if (rawBody && event.httpMethod && event.httpMethod !== 'GET' && event.httpMethod !== 'HEAD') {
    try {
      parsedBody = JSON.parse(rawBody);
    } catch {
      parsedBody = undefined;
    }
  }

  const req = {
    method: event.httpMethod || 'GET',
    headers,
    url: event.path || '/',
    body: parsedBody,
    async *[Symbol.asyncIterator]() {
      if (rawBody) yield Buffer.from(rawBody, 'utf8');
    },
  };

  const res = {
    statusCode: 200,
    headers: {},
    body: '',
    setHeader(name, value) {
      this.headers[name] = value;
    },
    end(chunk) {
      if (chunk !== undefined && chunk !== null) {
        this.body = typeof chunk === 'string' ? chunk : String(chunk);
      }
    },
  };

  return { req, res };
}

export function nodeResToLambdaResponse(res) {
  const headers = { ...res.headers };
  if (!headers['content-type'] && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json; charset=utf-8';
  }
  return {
    statusCode: res.statusCode || 200,
    headers,
    body: res.body || '',
  };
}

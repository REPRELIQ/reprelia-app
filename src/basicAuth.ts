import { timingSafeEqual } from 'node:crypto';
import type { RequestHandler } from 'express';

const PUBLIC_PATHS = new Set(['/health']);

// Constant-time comparison so response timing doesn't leak how many characters matched.
function safeCompare(a: string, b: string): boolean {
  const bufferA = Buffer.from(a);
  const bufferB = Buffer.from(b);

  if (bufferA.length !== bufferB.length) {
    return false;
  }

  return timingSafeEqual(bufferA, bufferB);
}

function parseBasicAuthHeader(
  header: string | undefined,
): { username: string; password: string } | undefined {
  if (!header?.startsWith('Basic ')) {
    return undefined;
  }

  const decoded = Buffer.from(header.slice('Basic '.length), 'base64').toString('utf8');
  const separatorIndex = decoded.indexOf(':');

  if (separatorIndex === -1) {
    return undefined;
  }

  return {
    username: decoded.slice(0, separatorIndex),
    password: decoded.slice(separatorIndex + 1),
  };
}

export function createBasicAuthMiddleware(username: string, password: string): RequestHandler {
  return (req, res, next) => {
    if (PUBLIC_PATHS.has(req.path)) {
      next();
      return;
    }

    const credentials = parseBasicAuthHeader(req.headers.authorization);
    const isAuthorized =
      credentials !== undefined &&
      safeCompare(credentials.username, username) &&
      safeCompare(credentials.password, password);

    if (!isAuthorized) {
      res.setHeader('WWW-Authenticate', 'Basic realm="reprelia-app"');
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    next();
  };
}

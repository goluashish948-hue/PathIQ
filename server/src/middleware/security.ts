import { Request, Response, NextFunction } from 'express';
import { URL } from 'url';

// SSRF Protection: validate outbound URLs
export function isSafeOutboundUrl(rawUrl: string): boolean {
  try {
    const parsed = new URL(rawUrl);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return false;
    }

    const host = parsed.hostname.toLowerCase();
    // Block localhost and private IP subnets
    if (
      host === 'localhost' ||
      host === '127.0.0.1' ||
      host === '0.0.0.0' ||
      host.startsWith('192.168.') ||
      host.startsWith('10.') ||
      host.startsWith('172.16.') ||
      host.startsWith('169.254.') ||
      host.endsWith('.internal') ||
      host.endsWith('.local')
    ) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

// In-memory simple rate limiter for auth / AI endpoints
const rateLimitMap = new Map<string, { count: number; expiresAt: number }>();

export function rateLimit(limit: number = 60, windowMs: number = 60000) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const key = (req.ip || '127.0.0.1') + ':' + req.baseUrl;
    const now = Date.now();
    const entry = rateLimitMap.get(key);

    if (!entry || now > entry.expiresAt) {
      rateLimitMap.set(key, { count: 1, expiresAt: now + windowMs });
      return next();
    }

    if (entry.count >= limit) {
      res.status(429).json({
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many requests. Please slow down and try again later.',
        },
      });
      return;
    }

    entry.count += 1;
    next();
  };
}

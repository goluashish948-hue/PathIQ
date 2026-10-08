import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../db.js';

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: string;
  isUnder18: boolean;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'pathiq_secret_key_default';

export function signToken(user: { id: string; email: string; name: string; role: string; isUnder18: boolean }): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      isUnder18: user.isUnder18,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      error: { code: 'UNAUTHORIZED', message: 'Authentication required. Please log in.' },
    });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthenticatedUser;
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({
      error: { code: 'INVALID_TOKEN', message: 'Invalid or expired session token.' },
    });
    return;
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (!req.user || req.user.role !== 'ADMIN') {
    res.status(403).json({
      error: { code: 'FORBIDDEN', message: 'Admin privileges required.' },
    });
    return;
  }
  next();
}

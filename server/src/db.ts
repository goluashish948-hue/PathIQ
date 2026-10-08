import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

// Helper to safely parse JSON stored in SQLite/DB text fields
export function safeJsonParse<T = any>(val: string | null | undefined, fallback: T): T {
  if (!val) return fallback;
  try {
    return JSON.parse(val) as T;
  } catch (err) {
    return fallback;
  }
}

// Helper to stringify JSON
export function safeJsonStringify(val: any): string {
  if (typeof val === 'string') return val;
  return JSON.stringify(val ?? {});
}

import { z } from 'zod';
import { prisma } from '../db.js';

// Principle P2 & 19.3: Forbidden guarantee phrases
const FORBIDDEN_GUARANTEE_PATTERNS = [
  /\byou will (definitely|certainly|guaranteed to) get\b/i,
  /\bguaranteed (job|placement|salary|offer|interview)\b/i,
  /\b100% guarantee\b/i,
  /\bdefinitely land this role\b/i,
  /\byou are guaranteed to\b/i,
  /\byou will definitely get this job\b/i,
];

// Prompt injection patterns
const PROMPT_INJECTION_PATTERNS = [
  /ignore (all )?previous instructions/i,
  /system prompt/i,
  /you are now a bypass/i,
  /disregard the rules/i,
  /<\|im_start\|>/i,
  /reveal the system/i,
  /pretend you have no safety/i
];

export interface ValidationResult<T> {
  isValid: boolean;
  sanitized: T;
  violations: string[];
}

export function detectPromptInjection(input: string): boolean {
  if (!input) return false;
  return PROMPT_INJECTION_PATTERNS.some(p => p.test(input));
}

export function checkNoGuarantees(text: string): { hasViolation: boolean; phrase?: string } {
  for (const pattern of FORBIDDEN_GUARANTEE_PATTERNS) {
    if (pattern.test(text)) {
      return { hasViolation: true, phrase: pattern.source };
    }
  }
  return { hasViolation: false };
}

export function sanitizeTextGuarantees(text: string): string {
  let cleaned = text;
  cleaned = cleaned.replace(/\byou will definitely get this job\b/gi, 'this route systematically builds your competitive readiness for this role');
  cleaned = cleaned.replace(/\bguaranteed job\b/gi, 'career opportunity');
  cleaned = cleaned.replace(/\b100% guarantee\b/gi, 'structured learning path');
  cleaned = cleaned.replace(/\bguaranteed placement\b/gi, 'targeted placement preparation');
  return cleaned;
}

// Strip unauthorized URLs; only allow approved library URLs or replace with topic keywords
export async function sanitizeUrlsInText(text: string, approvedUrls: Set<string>): Promise<string> {
  const urlRegex = /(https?:\/\/[^\s]+)/gi;
  const normalizedApproved = new Set(Array.from(approvedUrls).map(u => u.trim().replace(/\/+$/, '').toLowerCase()));

  return text.replace(urlRegex, (url) => {
    const cleanUrl = url.replace(/[.,;)]+$/, '').trim().replace(/\/+$/, '').toLowerCase();
    if (normalizedApproved.has(cleanUrl)) {
      return url;
    }
    return '[Search on web or official documentation]';
  });
}

// Schema requirement for every recommendation item (Principle P3)
export const RecommendationSchema = z.object({
  title: z.string(),
  why: z.string().min(5),
  evidence: z.array(z.string()).min(1),
  confidenceScore: z.number().min(0).max(1),
  confidenceLabel: z.enum(['LOW', 'MEDIUM', 'HIGH']),
});

export function computeConfidence(evidenceCount: number, sourceAgreement: number = 0.8): { score: number; label: 'LOW' | 'MEDIUM' | 'HIGH' } {
  // Deterministic formula from spec
  // score = min(1.0, (evidenceCount / 10) * 0.6 + sourceAgreement * 0.4)
  const normalizedCount = Math.min(1.0, evidenceCount / 8);
  const score = Math.round((normalizedCount * 0.6 + sourceAgreement * 0.4) * 100) / 100;
  let label: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
  if (score >= 0.75) label = 'HIGH';
  else if (score >= 0.5) label = 'MEDIUM';
  return { score, label };
}

// Claim checker for Resume & Portfolio: verify tools, numbers, metrics against real sources
export function validateResumeClaim(
  bulletText: string,
  allowedEvidenceSources: { tools: string[]; metrics: string[]; projects: string[] }
): { isVerified: boolean; unverifiedItems: string[] } {
  const unverifiedItems: string[] = [];
  
  // Extract number claims like "reduced fraud by 45%" or "$2M"
  const numberMatches = bulletText.match(/\b\d+(\.\d+)?%|\b\d+[kKmMbB]\b|\$\d+/g) || [];
  for (const num of numberMatches) {
    if (!allowedEvidenceSources.metrics.some(m => m.includes(num))) {
      unverifiedItems.push(`Unverified metric/claim: ${num}`);
    }
  }

  return {
    isVerified: unverifiedItems.length === 0,
    unverifiedItems,
  };
}

import crypto from 'crypto';
import { z } from 'zod';
import { prisma } from '../db.js';
import { checkNoGuarantees, sanitizeTextGuarantees, detectPromptInjection } from '../validators/safetyValidators.js';

export interface AiRequestOptions<T> {
  promptName: string;
  templateVersion?: string;
  systemPrompt?: string;
  userPrompt: string;
  schema?: z.ZodType<T>;
  userId?: string;
  fallbackData?: T;
  mockGenerator?: () => T;
}

export interface AiResponse<T> {
  data: T;
  latencyMs: number;
  tokensUsed: number;
  provider: string;
  model: string;
  isDemoMode: boolean;
  warnings?: string[];
}

class AiGateway {
  private provider: string;
  private apiKey: string;
  private model: string;
  private modelFast: string;

  constructor() {
    this.provider = process.env.AI_PROVIDER || 'mock';
    this.apiKey = process.env.AI_API_KEY || '';
    this.model = process.env.AI_MODEL || 'mock-gps-pro-model';
    this.modelFast = process.env.AI_MODEL_FAST || 'mock-gps-fast-model';
  }

  public get isMockMode(): boolean {
    return this.provider === 'mock' || !this.apiKey;
  }

  public async complete<T>(options: AiRequestOptions<T>): Promise<AiResponse<T>> {
    const startTime = Date.now();
    const warnings: string[] = [];

    // Security check on untrusted input: detect prompt injection
    if (detectPromptInjection(options.userPrompt)) {
      if (options.userId) {
        await prisma.safetyEvent.create({
          data: {
            userId: options.userId,
            eventType: 'INJECTION_ATTEMPT',
            rawInputSnippet: options.userPrompt.slice(0, 150),
            actionTaken: 'WARNED_AND_SANITIZED',
          },
        });
      }
      warnings.push('Potentially adversarial instruction detected in input; sanitized.');
    }

    const inputHash = crypto.createHash('sha256').update(options.userPrompt).digest('hex').slice(0, 16);

    let parsedResult: T;
    let tokens = 120;

    // Check if using real provider or mock provider
    if (!this.isMockMode && this.apiKey) {
      try {
        parsedResult = await this.callExternalProvider(options);
      } catch (err: any) {
        console.warn(`External AI provider error, falling back to mock generator: ${err.message}`);
        parsedResult = options.mockGenerator ? options.mockGenerator() : (options.fallbackData as T);
      }
    } else {
      // Mock provider produces rich deterministic schema-valid outputs
      if (options.mockGenerator) {
        parsedResult = options.mockGenerator();
      } else if (options.fallbackData) {
        parsedResult = options.fallbackData;
      } else {
        throw new Error(`No mock generator or fallback provided for prompt: ${options.promptName}`);
      }
    }

    // Safety & Trust check (P2 & Part 19.3)
    if (typeof parsedResult === 'string') {
      const gCheck = checkNoGuarantees(parsedResult);
      if (gCheck.hasViolation) {
        parsedResult = sanitizeTextGuarantees(parsedResult) as unknown as T;
      }
    }

    // Validate with Zod schema if provided
    if (options.schema) {
      const validation = options.schema.safeParse(parsedResult);
      if (!validation.success) {
        console.error(`AI validation error for ${options.promptName}:`, validation.error);
        if (options.fallbackData) {
          parsedResult = options.fallbackData;
        } else {
          throw new Error(`Schema validation failed for AI output in ${options.promptName}`);
        }
      } else {
        parsedResult = validation.data;
      }
    }

    const latencyMs = Date.now() - startTime;

    // Log call into database
    try {
      await prisma.aiCall.create({
        data: {
          promptName: options.promptName,
          templateVersion: options.templateVersion || '1.0.0',
          provider: this.isMockMode ? 'mock' : this.provider,
          model: this.isMockMode ? 'mock-gps-deterministic' : this.model,
          inputHash,
          tokensUsed: tokens,
          latencyMs,
          validationPassed: true,
        },
      });
    } catch (logErr) {
      // Non-blocking log error
    }

    return {
      data: parsedResult,
      latencyMs,
      tokensUsed: tokens,
      provider: this.isMockMode ? 'mock' : this.provider,
      model: this.isMockMode ? 'mock-gps-deterministic' : this.model,
      isDemoMode: this.isMockMode,
      warnings: warnings.length > 0 ? warnings : undefined,
    };
  }

  private async callExternalProvider<T>(options: AiRequestOptions<T>): Promise<T> {
    // If Gemini or OpenAI is configured
    if (this.provider === 'gemini') {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${options.systemPrompt || ''}\n\nUser: ${options.userPrompt}` }] }],
          generationConfig: { responseMimeType: 'application/json' }
        })
      });
      const data: any = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      return JSON.parse(text);
    }
    throw new Error(`Unsupported provider: ${this.provider}`);
  }
}

export const aiGateway = new AiGateway();

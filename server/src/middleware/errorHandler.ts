import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction): void {
  console.error(`[Error] ${req.method} ${req.url}:`, err);

  if (err instanceof ZodError) {
    const formattedFields: Record<string, string> = {};
    for (const issue of err.issues) {
      formattedFields[issue.path.join('.')] = issue.message;
    }
    res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request input fields',
        fields: formattedFields,
      },
    });
    return;
  }

  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || 'An unexpected internal server error occurred';

  res.status(statusCode).json({
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message,
    },
  });
}

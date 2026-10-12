import type { Response } from 'express';
import type { ZodError } from 'zod';

export function sendValidationError(response: Response, error: ZodError): void {
  response.status(400).json({
    error: error.issues[0]?.message ?? 'Invalid request.',
  });
}
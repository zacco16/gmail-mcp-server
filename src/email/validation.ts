import { DraftEmailArgs } from './types.js';

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateDraftEmail(args: DraftEmailArgs): ValidationResult {
  if (!args.to || !Array.isArray(args.to) || args.to.length === 0) {
    return {
      valid: false,
      error: "'to' must be a non-empty array of email addresses"
    };
  }

  if (!args.subject) {
    return {
      valid: false,
      error: "'subject' is required"
    };
  }

  if (!args.body) {
    return {
      valid: false,
      error: "'body' is required"
    };
  }

  return { valid: true };
}
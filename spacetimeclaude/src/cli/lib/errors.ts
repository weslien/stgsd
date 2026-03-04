export class CliError extends Error {
  constructor(
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = 'CliError';
  }
}

export const ErrorCodes = {
  NOT_GIT_REPO: 'NOT_GIT_REPO',
  NOT_CONFIGURED: 'NOT_CONFIGURED',
  PROJECT_NOT_FOUND: 'PROJECT_NOT_FOUND',
  PHASE_NOT_FOUND: 'PHASE_NOT_FOUND',
  PLAN_NOT_FOUND: 'PLAN_NOT_FOUND',
  INVALID_ARGUMENT: 'INVALID_ARGUMENT',
  CONNECTION_FAILED: 'CONNECTION_FAILED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;

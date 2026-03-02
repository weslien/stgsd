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
  PROJECT_NOT_FOUND: 'PROJECT_NOT_FOUND',
  CONNECTION_FAILED: 'CONNECTION_FAILED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;

/**
 * Retry with exponential backoff
 * NOVELMAN OS §8 compliance — all async AI work must support retries
 */

export interface RetryOptions {
  maxRetries?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const { maxRetries = 3, baseDelayMs = 500, maxDelayMs = 8000 } = options;
  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt === maxRetries) throw error;

      const delay = Math.min(baseDelayMs * Math.pow(2, attempt), maxDelayMs);
      const jittered = delay * (0.8 + Math.random() * 0.4);
      console.warn(
        `[withRetry] attempt ${attempt + 1} failed, retrying in ${Math.round(jittered)}ms`,
        error instanceof Error ? error.message : String(error)
      );
      await new Promise((r) => setTimeout(r, jittered));
    }
  }
  throw lastError;
}

/** Pre-configured for Anthropic API calls */
export async function withAnthropicRetry<T>(fn: () => Promise<T>): Promise<T> {
  return withRetry(fn, { maxRetries: 3, baseDelayMs: 1000, maxDelayMs: 10000 });
}

import { RateLimiterMemory } from "rate-limiter-flexible";

// Rate limiters for different endpoints
export const loginLimiter = new RateLimiterMemory({
  points: 5, // 5 attempts
  duration: 900, // per 15 minutes
});

export const signupLimiter = new RateLimiterMemory({
  points: 3, // 3 attempts
  duration: 3600, // per hour
});

export const orderLimiter = new RateLimiterMemory({
  points: 10, // 10 orders
  duration: 3600, // per hour
});

export async function checkRateLimit(
  limiter: RateLimiterMemory,
  identifier: string
): Promise<{ allowed: boolean; remaining?: number; resetTime?: Date }> {
  try {
    const result = await limiter.consume(identifier);
    return {
      allowed: true,
      remaining: result.remainingPoints,
      resetTime: result.msBeforeNext
        ? new Date(Date.now() + result.msBeforeNext)
        : undefined,
    };
  } catch (rejRes: any) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: rejRes.msBeforeNext
        ? new Date(Date.now() + rejRes.msBeforeNext)
        : undefined,
    };
  }
}


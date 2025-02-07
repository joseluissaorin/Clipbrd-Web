import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL,
  token: process.env.UPSTASH_REDIS_TOKEN,
});

const RATE_LIMIT_WINDOW = 60 * 60; // 1 hour
const MAX_REQUESTS = {
  VERIFY: 360, // 1 request every 10 seconds
  FAILED: 10,  // 10 failed attempts per hour
};

export async function checkRateLimit(key, type = 'VERIFY') {
  const limit = MAX_REQUESTS[type];
  const now = Math.floor(Date.now() / 1000);
  const windowStart = now - RATE_LIMIT_WINDOW;

  // Remove old entries and add new request
  const multi = redis.multi();
  multi.zremrangebyscore(`ratelimit:${key}:${type}`, 0, windowStart);
  multi.zadd(`ratelimit:${key}:${type}`, { score: now, member: now });
  multi.zcard(`ratelimit:${key}:${type}`);
  multi.expire(`ratelimit:${key}:${type}`, RATE_LIMIT_WINDOW * 2);

  const results = await multi.exec();
  const requestCount = results[2];

  if (requestCount > limit) {
    const retryAfter = Math.ceil(RATE_LIMIT_WINDOW - (now - windowStart));
    return {
      success: false,
      retryAfter,
      message: `Rate limit exceeded. Try again in ${Math.ceil(retryAfter / 60)} minutes.`
    };
  }

  return { success: true };
}

export async function recordFailedAttempt(key) {
  return checkRateLimit(key, 'FAILED');
} 
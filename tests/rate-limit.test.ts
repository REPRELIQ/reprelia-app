import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';

describe('rate limiting', () => {
  it('allows requests up to the configured limit', async () => {
    const app = createApp({ rateLimit: { windowMs: 60_000, max: 2 } });

    const first = await request(app).get('/health');
    const second = await request(app).get('/health');

    expect(first.status).toBe(200);
    expect(second.status).toBe(200);
  });

  it('returns 429 once the limit is exceeded', async () => {
    const app = createApp({ rateLimit: { windowMs: 60_000, max: 2 } });

    await request(app).get('/health');
    await request(app).get('/health');
    const third = await request(app).get('/health');

    expect(third.status).toBe(429);
    expect(third.body).toEqual({ error: 'Too many requests, please try again later.' });
  });
});

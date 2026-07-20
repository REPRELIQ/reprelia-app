import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { AUTH_HEADER, createTestApp } from './helpers.js';

describe('Basic Auth', () => {
  it('allows GET /health without credentials', async () => {
    const app = createTestApp();

    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
  });

  it('returns 401 for a protected route without credentials', async () => {
    const app = createTestApp();

    const response = await request(app).get('/items');

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: 'Unauthorized' });
    expect(response.headers['www-authenticate']).toBe('Basic realm="reprelia-app"');
  });

  it('returns 401 for a protected route with wrong credentials', async () => {
    const app = createTestApp();
    const wrongHeader = `Basic ${Buffer.from('wrong-user:wrong-password').toString('base64')}`;

    const response = await request(app).get('/items').set('Authorization', wrongHeader);

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: 'Unauthorized' });
  });

  it('allows a protected route with correct credentials', async () => {
    const app = createTestApp();

    const response = await request(app).get('/items').set('Authorization', AUTH_HEADER);

    expect(response.status).toBe(200);
  });

  it('throws when no credentials are configured via options or environment', () => {
    const originalUser = process.env.BASIC_AUTH_USER;
    const originalPassword = process.env.BASIC_AUTH_PASSWORD;
    delete process.env.BASIC_AUTH_USER;
    delete process.env.BASIC_AUTH_PASSWORD;

    try {
      expect(() => createApp()).toThrow(/Basic Auth credentials are required/);
    } finally {
      if (originalUser !== undefined) process.env.BASIC_AUTH_USER = originalUser;
      if (originalPassword !== undefined) process.env.BASIC_AUTH_PASSWORD = originalPassword;
    }
  });
});

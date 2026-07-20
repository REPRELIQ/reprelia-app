import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { AUTH_HEADER, createTestApp } from './helpers.js';

describe('POST /echo', () => {
  it('returns the message when given a valid body', async () => {
    const app = createTestApp();

    const response = await request(app)
      .post('/echo')
      .set('Authorization', AUTH_HEADER)
      .send({ message: 'hello' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'hello' });
  });

  it('returns 400 when message is missing', async () => {
    const app = createTestApp();

    const response = await request(app).post('/echo').set('Authorization', AUTH_HEADER).send({});

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'message is required and must be a string' });
  });

  it('returns 400 when message is not a string', async () => {
    const app = createTestApp();

    const response = await request(app)
      .post('/echo')
      .set('Authorization', AUTH_HEADER)
      .send({ message: 123 });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'message is required and must be a string' });
  });
});

import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';

describe('POST /echo', () => {
  it('returns the message when given a valid body', async () => {
    const app = createApp();

    const response = await request(app).post('/echo').send({ message: 'hello' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'hello' });
  });

  it('returns 400 when message is missing', async () => {
    const app = createApp();

    const response = await request(app).post('/echo').send({});

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'message is required and must be a string' });
  });

  it('returns 400 when message is not a string', async () => {
    const app = createApp();

    const response = await request(app).post('/echo').send({ message: 123 });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'message is required and must be a string' });
  });
});

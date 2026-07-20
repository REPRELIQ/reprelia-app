import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';

describe('PUT /items/:id', () => {
  it('replaces an existing item', async () => {
    const app = createApp();

    const response = await request(app).put('/items/1').send({ name: 'updated-item' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: '1', name: 'updated-item' });
  });

  it('creates the item when the id does not exist yet (upsert)', async () => {
    const app = createApp();

    const response = await request(app).put('/items/999').send({ name: 'new-item' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: '999', name: 'new-item' });
  });

  it('returns 400 when name is missing', async () => {
    const app = createApp();

    const response = await request(app).put('/items/1').send({});

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'name is required and must be a non-empty string' });
  });

  it('returns 400 when name is an empty string', async () => {
    const app = createApp();

    const response = await request(app).put('/items/1').send({ name: '  ' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'name is required and must be a non-empty string' });
  });
});

import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';

describe('PATCH /items/:id', () => {
  it('updates only the provided field (description)', async () => {
    const app = createApp();

    const response = await request(app).patch('/items/1').send({ description: 'a great item' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: '1', name: 'item-1', description: 'a great item' });
  });

  it('updates only the provided field (name)', async () => {
    const app = createApp();

    const response = await request(app).patch('/items/1').send({ name: 'renamed-item' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: '1', name: 'renamed-item' });
  });

  it('returns 404 when the item does not exist', async () => {
    const app = createApp();

    const response = await request(app).patch('/items/999').send({ name: 'anything' });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'item 999 not found' });
  });

  it('returns 400 when no fields are provided', async () => {
    const app = createApp();

    const response = await request(app).patch('/items/1').send({});

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'at least one of name or description must be provided',
    });
  });

  it('returns 400 when name is an empty string', async () => {
    const app = createApp();

    const response = await request(app).patch('/items/1').send({ name: '  ' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'name must be a non-empty string' });
  });
});

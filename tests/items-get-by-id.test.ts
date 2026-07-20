import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';

describe('GET /items/:id', () => {
  it('returns the item when it exists', async () => {
    const app = createApp();

    const response = await request(app).get('/items/1');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: '1', name: 'item-1' });
  });

  it('returns 404 when the item does not exist', async () => {
    const app = createApp();

    const response = await request(app).get('/items/999');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'item 999 not found' });
  });

  it('returns 404 after the item is deleted', async () => {
    const app = createApp();

    await request(app).delete('/items/1');
    const response = await request(app).get('/items/1');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'item 1 not found' });
  });
});

import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';

describe('DELETE /items/:id', () => {
  it('returns 204 and removes an existing item', async () => {
    const app = createApp();

    const response = await request(app).delete('/items/1');

    expect(response.status).toBe(204);
    expect(response.body).toEqual({});
  });

  it('returns 404 when the item does not exist', async () => {
    const app = createApp();

    const response = await request(app).delete('/items/999');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'item 999 not found' });
  });

  it('returns 404 when deleting the same item twice', async () => {
    const app = createApp();

    await request(app).delete('/items/1');
    const response = await request(app).delete('/items/1');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'item 1 not found' });
  });
});

import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { AUTH_HEADER, createTestApp } from './helpers.js';

describe('GET /items', () => {
  it('returns the seeded items', async () => {
    const app = createTestApp();

    const response = await request(app).get('/items').set('Authorization', AUTH_HEADER);

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      { id: '1', name: 'item-1' },
      { id: '2', name: 'item-2' },
      { id: '3', name: 'item-3' },
    ]);
  });

  it('reflects changes made through other endpoints', async () => {
    const app = createTestApp();

    await request(app).delete('/items/2').set('Authorization', AUTH_HEADER);
    await request(app).put('/items/4').set('Authorization', AUTH_HEADER).send({ name: 'item-4' });

    const response = await request(app).get('/items').set('Authorization', AUTH_HEADER);

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      { id: '1', name: 'item-1' },
      { id: '3', name: 'item-3' },
      { id: '4', name: 'item-4' },
    ]);
  });
});

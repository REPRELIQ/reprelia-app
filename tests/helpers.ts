import { createApp, type CreateAppOptions } from '../src/app.js';

export const TEST_BASIC_AUTH = { username: 'test-user', password: 'test-password' };

export const AUTH_HEADER = `Basic ${Buffer.from(
  `${TEST_BASIC_AUTH.username}:${TEST_BASIC_AUTH.password}`,
).toString('base64')}`;

export function createTestApp(options: Omit<CreateAppOptions, 'basicAuth'> = {}) {
  return createApp({ ...options, basicAuth: TEST_BASIC_AUTH });
}

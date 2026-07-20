import express, { type Express, type Request, type Response } from 'express';
import rateLimit from 'express-rate-limit';
import { createBasicAuthMiddleware } from './basicAuth.js';
import { echoBodySchema, parseBody, patchItemBodySchema, putItemBodySchema } from './schemas.js';

export interface CreateAppOptions {
  rateLimit?: {
    windowMs?: number;
    max?: number;
  };
  basicAuth?: {
    username: string;
    password: string;
  };
}

export function createApp(options: CreateAppOptions = {}): Express {
  const app = express();

  app.use(
    rateLimit({
      windowMs:
        options.rateLimit?.windowMs ?? Number(process.env.RATE_LIMIT_WINDOW_MS ?? 15 * 60 * 1000),
      limit: options.rateLimit?.max ?? Number(process.env.RATE_LIMIT_MAX ?? 100),
      standardHeaders: true,
      legacyHeaders: false,
      message: { error: 'Too many requests, please try again later.' },
    }),
  );

  const basicAuthUsername = options.basicAuth?.username ?? process.env.BASIC_AUTH_USER;
  const basicAuthPassword = options.basicAuth?.password ?? process.env.BASIC_AUTH_PASSWORD;

  if (!basicAuthUsername || !basicAuthPassword) {
    throw new Error(
      'Basic Auth credentials are required: set BASIC_AUTH_USER and BASIC_AUTH_PASSWORD, or pass options.basicAuth',
    );
  }

  app.use(createBasicAuthMiddleware(basicAuthUsername, basicAuthPassword));

  app.use(express.json());

  // In-memory demo data, seeded per app instance so tests stay isolated.
  const items = new Map<string, { name: string; description?: string }>([
    ['1', { name: 'item-1' }],
    ['2', { name: 'item-2' }],
    ['3', { name: 'item-3' }],
  ]);

  app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'ok' });
  });

  app.post('/echo', (req: Request, res: Response) => {
    const parsed = parseBody(echoBodySchema, req.body);

    if (!parsed.success) {
      res.status(400).json({ error: parsed.error });
      return;
    }

    res.status(200).json({ message: parsed.data.message });
  });

  app.get('/items', (_req: Request, res: Response) => {
    const list = Array.from(items, ([id, item]) => ({ id, ...item }));
    res.status(200).json(list);
  });

  app.get('/items/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const item = typeof id === 'string' ? items.get(id) : undefined;

    if (!item) {
      res.status(404).json({ error: `item ${String(id)} not found` });
      return;
    }

    res.status(200).json({ id, ...item });
  });

  app.put('/items/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const parsed = parseBody(putItemBodySchema, req.body);

    if (typeof id !== 'string') {
      res.status(400).json({ error: 'id is required' });
      return;
    }

    if (!parsed.success) {
      res.status(400).json({ error: parsed.error });
      return;
    }

    const { name, description } = parsed.data;
    const item = description === undefined ? { name } : { name, description };
    items.set(id, item);
    res.status(200).json({ id, ...item });
  });

  app.patch('/items/:id', (req: Request, res: Response) => {
    const { id } = req.params;

    if (typeof id !== 'string' || !items.has(id)) {
      res.status(404).json({ error: `item ${String(id)} not found` });
      return;
    }

    const parsed = parseBody(patchItemBodySchema, req.body);

    if (!parsed.success) {
      res.status(400).json({ error: parsed.error });
      return;
    }

    const existing = items.get(id)!;
    const { name, description } = parsed.data;
    const nextName = name ?? existing.name;
    const nextDescription = description ?? existing.description;
    const updated =
      nextDescription === undefined
        ? { name: nextName }
        : { name: nextName, description: nextDescription };
    items.set(id, updated);
    res.status(200).json({ id, ...updated });
  });

  app.delete('/items/:id', (req: Request, res: Response) => {
    const { id } = req.params;

    if (typeof id !== 'string' || !items.has(id)) {
      res.status(404).json({ error: `item ${String(id)} not found` });
      return;
    }

    items.delete(id);
    res.status(204).send();
  });

  return app;
}

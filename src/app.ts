import express, { type Express, type Request, type Response } from 'express';

export function createApp(): Express {
  const app = express();
  app.use(express.json());

  // In-memory demo data, seeded per app instance so tests stay isolated.
  const items = new Map<string, { name: string }>([
    ['1', { name: 'item-1' }],
    ['2', { name: 'item-2' }],
    ['3', { name: 'item-3' }],
  ]);

  app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'ok' });
  });

  app.post('/echo', (req: Request, res: Response) => {
    const { message } = req.body as { message?: unknown };

    if (typeof message !== 'string') {
      res.status(400).json({ error: 'message is required and must be a string' });
      return;
    }

    res.status(200).json({ message });
  });

  app.put('/items/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const { name } = req.body as { name?: unknown };

    if (typeof id !== 'string') {
      res.status(400).json({ error: 'id is required' });
      return;
    }

    if (typeof name !== 'string' || name.trim() === '') {
      res.status(400).json({ error: 'name is required and must be a non-empty string' });
      return;
    }

    items.set(id, { name });
    res.status(200).json({ id, name });
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

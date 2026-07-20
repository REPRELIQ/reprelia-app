import express, { type Express, type Request, type Response } from 'express';

export function createApp(): Express {
  const app = express();
  app.use(express.json());

  // In-memory demo data, seeded per app instance so tests stay isolated.
  const itemIds = new Set(['1', '2', '3']);

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

  app.delete('/items/:id', (req: Request, res: Response) => {
    const { id } = req.params;

    if (typeof id !== 'string' || !itemIds.has(id)) {
      res.status(404).json({ error: `item ${String(id)} not found` });
      return;
    }

    itemIds.delete(id);
    res.status(204).send();
  });

  return app;
}

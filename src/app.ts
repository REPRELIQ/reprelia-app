import express, { type Express, type Request, type Response } from 'express';

export function createApp(): Express {
  const app = express();
  app.use(express.json());

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

  return app;
}

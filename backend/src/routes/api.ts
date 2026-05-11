import { Router } from 'express';
import { getNodes } from '../simulation/nodeSimulator';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: Date.now(), service: 'RASTA Cortex Backend' });
});

router.get('/nodes', (_req, res) => {
  res.json(getNodes());
});

export default router;

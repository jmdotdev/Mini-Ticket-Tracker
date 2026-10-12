import { Router } from 'express';
import {
  createTicket,
  getStats,
  getTickets,
  updateTicket,
} from '../controllers/ticket.controller.ts';

const router = Router();

router.get('/stats', getStats);
router.get('/', getTickets);
router.post('/', createTicket);
router.patch('/:id', updateTicket);

export default router;
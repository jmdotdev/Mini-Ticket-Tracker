import { z } from 'zod';
import { TicketPriority } from '../types/ticket';

export const createTicketSchema = z.object({
  title: z.string().trim().min(1, 'A title is required.').max(160, 'Title must be 160 characters or fewer.'),
  description: z.string().trim().max(2000, 'Description must be 2000 characters or fewer.').optional(),
  priority: z.enum(TicketPriority),
}).transform(({ description, ...ticket }) => ({
  ...ticket,
  description: description || null,
}));
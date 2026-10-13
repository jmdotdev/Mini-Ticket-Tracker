import { z } from 'zod';
import { TicketPriority, TicketStatus } from '../types/ticket.ts';

export const createTicketSchema = z.object({
  title: z.string().trim().min(1, 'A title is required.').max(160, 'Title must be 160 characters or fewer.'),
  description: z.string().trim().nullable().optional().transform((value) => value || null),
  status: z.enum(TicketStatus).default(TicketStatus.Open),
  priority: z.enum(TicketPriority).default(TicketPriority.Medium),
});

export const updateTicketSchema = z.object({
  status: z.enum(TicketStatus).optional(),
  priority: z.enum(TicketPriority).optional(),
}).refine((updates) => updates.status !== undefined || updates.priority !== undefined, {
  message: 'Provide a status or priority to update.',
});

const positiveIntegerQuerySchema = z.string()
  .regex(/^[1-9]\d*$/, 'Must be a positive integer.')
  .transform(Number)
  .pipe(z.number().int().safe().positive());

export const listTicketsQuerySchema = z.object({
  status: z.enum(TicketStatus).optional(),
  page: positiveIntegerQuerySchema.optional().transform((value) => value ?? 1),
  limit: positiveIntegerQuerySchema.optional()
    .transform((value) => Math.min(value ?? 10, 25)),
});

export const ticketIdSchema = z.string()
  .regex(/^[1-9]\d*$/, 'Invalid ticket ID.')
  .transform(Number)
  .pipe(z.number().int().safe().positive());

export type CreateTicketInput = z.output<typeof createTicketSchema>;
export type TicketUpdates = z.output<typeof updateTicketSchema>;
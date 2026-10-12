import type { RequestHandler } from 'express';
import {
  createTicket as createTicketRecord,
  getTicketStats,
  listTickets as listTicketRecords,
  updateTicket as updateTicketRecord,
} from '../services/ticket.service.ts';
import {
  createTicketSchema,
  listTicketsQuerySchema,
  ticketIdSchema,
  updateTicketSchema,
} from '../schemas/ticket.schema.ts';
import { sendValidationError } from '../utils/validation.ts';

export const getStats: RequestHandler = async (_request, response) => {
  response.json(await getTicketStats());
};

export const getTickets: RequestHandler = async (request, response) => {
  const parsedQuery = listTicketsQuerySchema.safeParse(request.query);
  if (!parsedQuery.success) {
    sendValidationError(response, parsedQuery.error);
    return;
  }

  response.json(await listTicketRecords(parsedQuery.data));
};

export const createTicket: RequestHandler = async (request, response) => {
  const input = createTicketSchema.safeParse(request.body);
  if (!input.success) {
    sendValidationError(response, input.error);
    return;
  }

  response.status(201).json(await createTicketRecord(input.data));
};

export const updateTicket: RequestHandler = async (request, response) => {
  const parsedId = ticketIdSchema.safeParse(request.params.id);
  if (!parsedId.success) {
    sendValidationError(response, parsedId.error);
    return;
  }

  const updates = updateTicketSchema.safeParse(request.body);
  if (!updates.success) {
    sendValidationError(response, updates.error);
    return;
  }

  const ticket = await updateTicketRecord(parsedId.data, updates.data);
  if (!ticket) {
    response.status(404).json({ error: 'Ticket not found.' });
    return;
  }
  response.json(ticket);
};
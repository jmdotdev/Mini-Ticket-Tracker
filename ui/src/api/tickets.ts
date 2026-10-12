import axios from 'axios';
import type {
  CreateTicketInput,
  Ticket,
  TicketListResult,
  TicketPriority,
  TicketStats,
  TicketStatus,
} from '../types/ticket';

const http = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

interface ListTicketsOptions {
  page: number;
  limit: number;
  status?: TicketStatus;
}

export const ticketApi = {
  list({ page, limit, status }: ListTicketsOptions): Promise<TicketListResult> {
    return http.get<TicketListResult>('/tickets', {
      params: { page, limit, ...(status ? { status } : {}) },
    }).then(({ data }) => data);
  },

  stats(): Promise<TicketStats> {
    return http.get<TicketStats>('/tickets/stats').then(({ data }) => data);
  },

  create(input: CreateTicketInput): Promise<Ticket> {
    return http.post<Ticket>('/tickets', input).then(({ data }) => data);
  },

  update(
    id: number,
    updates: { status?: TicketStatus; priority?: TicketPriority },
  ): Promise<Ticket> {
    return http.patch<Ticket>(`/tickets/${id}`, updates).then(({ data }) => data);
  },
};
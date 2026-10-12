import type { QueryResultRow } from 'pg';

export enum TicketStatus {
  Open = 'open',
  InProgress = 'in_progress',
  Closed = 'closed',
}

export enum TicketPriority {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
}

export interface Ticket extends QueryResultRow {
  id: number;
  title: string;
  description: string | null;
  status: TicketStatus;
  priority: TicketPriority;
  created_at: Date;
}

export interface TicketStats {
  open: number;
  in_progress: number;
  closed: number;
  total: number;
}

export interface TicketPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface TicketListResult {
  data: Ticket[];
  pagination: TicketPagination;
}

export interface TicketListOptions {
  status?: TicketStatus;
  page: number;
  limit: number;
}
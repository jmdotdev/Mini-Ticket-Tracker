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

export interface Ticket {
  id: number;
  title: string;
  description: string | null;
  status: TicketStatus;
  priority: TicketPriority;
  created_at: string;
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

export interface CreateTicketInput {
  title: string;
  description: string | null;
  priority: TicketPriority;
}
import pool from '../db/pool.ts';
import {
  TicketStatus,
  type Ticket,
  type TicketListOptions,
  type TicketListResult,
  type TicketStats,
} from '../types/ticket.ts';
import type { CreateTicketInput, TicketUpdates } from '../schemas/ticket.schema.ts';

export async function getTicketStats(): Promise<TicketStats> {
  const { rows } = await pool.query<{ status: string; count: number }>(
    'SELECT status, COUNT(*)::int AS count FROM tickets GROUP BY status',
  );
  const stats: TicketStats = { open: 0, in_progress: 0, closed: 0, total: 0 };

  for (const row of rows) {
    if (Object.values(TicketStatus).includes(row.status as TicketStatus)) {
      stats[row.status as TicketStatus] = row.count;
    }
  }

  stats.total = stats.open + stats.in_progress + stats.closed;
  return stats;
}

export async function listTickets(options: TicketListOptions): Promise<TicketListResult> {
  const { status, page, limit } = options;
  const offset = (page - 1) * limit;
  const filter = status ? 'WHERE status = $1' : '';
  const filterValues = status ? [status] : [];
  const countResult = await pool.query<{ total: number }>(
    `SELECT COUNT(*)::int AS total FROM tickets ${filter}`,
    filterValues,
  );
  const { rows } = await pool.query<Ticket>(
    `SELECT id, title, description, status, priority, created_at
     FROM tickets ${filter}
     ORDER BY created_at DESC, id DESC
     LIMIT $${filterValues.length + 1} OFFSET $${filterValues.length + 2}`,
    [...filterValues, limit, offset],
  );
  const total = countResult.rows[0].total;

  return {
    data: rows,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

export async function createTicket(input: CreateTicketInput): Promise<Ticket> {
  const { rows } = await pool.query<Ticket>(
    `INSERT INTO tickets (title, description, status, priority)
     VALUES ($1, $2, $3, $4)
     RETURNING id, title, description, status, priority, created_at`,
    [input.title, input.description, input.status, input.priority],
  );
  return rows[0];
}

export async function updateTicket(id: number, updates: TicketUpdates): Promise<Ticket | null> {
  const fields = Object.entries(updates) as [keyof TicketUpdates, string][];
  const assignments = fields.map(([field], index) => `${field} = $${index + 1}`);
  const values = fields.map(([, value]) => value);
  values.push(String(id));

  const { rows } = await pool.query<Ticket>(
    `UPDATE tickets SET ${assignments.join(', ')}
     WHERE id = $${values.length}
     RETURNING id, title, description, status, priority, created_at`,
    values,
  );
  return rows[0] ?? null;
}
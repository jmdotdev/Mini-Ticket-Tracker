import 'dotenv/config';
import assert from 'node:assert/strict';
import { after, test } from 'node:test';
import request from 'supertest';
import app from '../src/app.ts';
import pool from '../src/db/pool.ts';
import { TicketPriority, TicketStatus } from '../src/types/ticket.ts';

const createdTicketIds: number[] = [];
const uniqueTitle = (prefix: string) => `${prefix}-${crypto.randomUUID()}`;

after(async () => {
  if (createdTicketIds.length > 0) {
    await pool.query('DELETE FROM tickets WHERE id = ANY($1::int[])', [createdTicketIds]);
  }
  await pool.end();
});

async function createTicket(title: string, status?: TicketStatus) {
  const response = await request(app)
    .post('/tickets')
    .send({ title, ...(status ? { status } : {}) })
    .expect(201);

  createdTicketIds.push(response.body.id as number);
  return response.body as {
    id: number;
    title: string;
    description: string | null;
    status: TicketStatus;
    priority: TicketPriority;
    created_at: string;
  };
}

test('POST /tickets creates a ticket with defaults', async () => {
  const title = uniqueTitle('integration-create');
  const ticket = await createTicket(title);

  assert.equal(ticket.title, title);
  assert.equal(ticket.description, null);
  assert.equal(ticket.status, TicketStatus.Open);
  assert.equal(ticket.priority, TicketPriority.Medium);
  assert.ok(ticket.created_at);
});

test('GET /tickets filters by status and paginates results', async () => {
  const first = await createTicket(uniqueTitle('integration-page-one'), TicketStatus.InProgress);
  const second = await createTicket(uniqueTitle('integration-page-two'), TicketStatus.InProgress);

  const [pageOne, pageTwo] = await Promise.all([
    request(app).get('/tickets').query({ status: TicketStatus.InProgress, page: 1, limit: 1 }).expect(200),
    request(app).get('/tickets').query({ status: TicketStatus.InProgress, page: 2, limit: 1 }).expect(200),
  ]);

  assert.equal(pageOne.body.pagination.page, 1);
  assert.equal(pageTwo.body.pagination.page, 2);
  assert.equal(pageOne.body.data.length, 1);
  assert.equal(pageTwo.body.data.length, 1);
  assert.ok(pageOne.body.data.every((ticket: { status: string }) => ticket.status === TicketStatus.InProgress));
  assert.ok(pageTwo.body.data.every((ticket: { status: string }) => ticket.status === TicketStatus.InProgress));
  assert.deepEqual(
    new Set([pageOne.body.data[0].id, pageTwo.body.data[0].id]),
    new Set([first.id, second.id]),
  );
});

test('PATCH /tickets/:id updates priority and status stats', async () => {
  const before = await request(app).get('/tickets/stats').expect(200);
  const ticket = await createTicket(uniqueTitle('integration-update'));

  const updated = await request(app)
    .patch(`/tickets/${ticket.id}`)
    .send({ status: TicketStatus.Closed, priority: TicketPriority.High })
    .expect(200);
  const afterUpdate = await request(app).get('/tickets/stats').expect(200);

  assert.equal(updated.body.status, TicketStatus.Closed);
  assert.equal(updated.body.priority, TicketPriority.High);
  assert.equal(afterUpdate.body.total, before.body.total + 1);
  assert.equal(afterUpdate.body.open, before.body.open);
  assert.equal(afterUpdate.body.closed, before.body.closed + 1);
});
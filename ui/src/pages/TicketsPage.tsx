import { useEffect, useState } from 'react';
import { ticketApi } from '../api/tickets';
import TicketBoard from '../components/TicketBoard';
import TicketFormModal from '../components/TicketFormModal';
import TicketStats from '../components/TicketStats';
import { getApiErrorMessage } from '../utils/apiError';
import type {
  CreateTicketInput,
  Ticket,
  TicketListResult,
  TicketPagination,
  TicketStats as TicketStatsData,
} from '../types/ticket';
import { TicketStatus } from '../types/ticket';

const emptyStats: TicketStatsData = { open: 0, in_progress: 0, closed: 0, total: 0 };
const emptyPagination: TicketPagination = { page: 1, limit: 5, total: 0, totalPages: 0 };

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [stats, setStats] = useState(emptyStats);
  const [pagination, setPagination] = useState(emptyPagination);
  const [page, setPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');

    Promise.all([
      ticketApi.list({ page, limit: 25 }),
      ticketApi.stats(),
    ])
      .then(([ticketResult, nextStats]: [TicketListResult, TicketStatsData]) => {
        if (!active) return;
        setTickets(ticketResult.data);
        setPagination(ticketResult.pagination);
        setStats(nextStats);
      })
      .catch((requestError: unknown) => {
        if (active) setError(getApiErrorMessage(requestError));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [page, refreshKey]);

  async function handleCreate(input: CreateTicketInput): Promise<boolean> {
    setSaving(true);
    setError('');
    try {
      await ticketApi.create(input);
      setPage(1);
      setRefreshKey((key) => key + 1);
      return true;
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function handleStatusChange(ticket: Ticket, status: TicketStatus) {
    setError('');
    try {
      const updated = await ticketApi.update(ticket.id, { status });
      setTickets((current) => current.map((item) => item.id === updated.id ? updated : item));
      setRefreshKey((key) => key + 1);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    }
  }

  return (
    <>
      <section className="flex min-h-30 items-center justify-between py-7 max-sm:min-h-[176px] max-sm:items-end">
        <div>
          <p className="mb-3 font-mono text-[9px] text-[#dd684b]">MONDAY MORNING, MADE MANAGEABLE</p>
          <h1 className="text-[40px] font-medium leading-[1.08] max-sm:text-[35px]">Good work starts<br className="hidden max-sm:block" /> with a clear queue.</h1>
        </div>
      </section>

      <TicketStats stats={stats} />
      {error && <div className="mt-4 border-l-[3px] border-[#dd684b] bg-[#fff1ed] px-4 py-3 text-[13px] text-[#853e2d]" role="alert">{error}</div>}

      <div className="mb-4 mt-11 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-[23px] font-medium">Ticket board <span className="ml-1 align-[3px] font-mono text-[11px] text-[#88928a]">{stats.total}</span></h2>
        </div>
        <TicketFormModal saving={saving} onCreate={handleCreate} />
      </div>

      <div>
        <TicketBoard
          tickets={tickets}
          stats={stats}
          pagination={pagination}
          page={page}
          loading={loading}
          onPageChange={setPage}
          onStatusChange={(ticket, status) => { void handleStatusChange(ticket, status); }}
        />
      </div>
    </>
  );
}
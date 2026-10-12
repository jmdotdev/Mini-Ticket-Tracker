import { useEffect, useState } from 'react';
import { ticketApi } from '../api/tickets';
import TicketForm from '../components/TicketForm';
import TicketList from '../components/TicketList';
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
const emptyPagination: TicketPagination = { page: 1, limit: 10, total: 0, totalPages: 0 };

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [stats, setStats] = useState(emptyStats);
  const [pagination, setPagination] = useState(emptyPagination);
  const [filter, setFilter] = useState<TicketStatus | 'all'>('all');
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
      ticketApi.list({ page, limit: 10, ...(filter === 'all' ? {} : { status: filter }) }),
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
  }, [filter, page, refreshKey]);

  async function handleCreate(input: CreateTicketInput): Promise<boolean> {
    setSaving(true);
    setError('');
    try {
      await ticketApi.create(input);
      setFilter('all');
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
      <section className="flex min-h-[203px] items-center justify-between py-7 max-sm:min-h-[176px] max-sm:items-end">
        <div>
          <p className="mb-3 font-mono text-[9px] text-[#dd684b]">MONDAY MORNING, MADE MANAGEABLE</p>
          <h1 className="text-[40px] font-medium leading-[1.08] max-sm:text-[35px]">Good work starts<br className="hidden max-sm:block" /> with a clear queue.</h1>
        </div>
        <div className="mt-6 mr-1 flex items-center gap-3 text-xs text-[#727c75] max-sm:hidden"><span className="h-px w-[31px] bg-[#dd684b]" /> Every request, in one place.</div>
      </section>

      <TicketStats stats={stats} />
      {error && <div className="mt-4 border-l-[3px] border-[#dd684b] bg-[#fff1ed] px-4 py-3 text-[13px] text-[#853e2d]" role="alert">{error}</div>}

      <div className="mt-11 grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_318px]">
        <TicketList
          tickets={tickets}
          pagination={pagination}
          page={page}
          filter={filter}
          loading={loading}
          onFilterChange={(nextFilter) => { setFilter(nextFilter); setPage(1); }}
          onPageChange={setPage}
          onStatusChange={(ticket, status) => { void handleStatusChange(ticket, status); }}
        />
        <TicketForm saving={saving} onCreate={handleCreate} />
      </div>
    </>
  );
}
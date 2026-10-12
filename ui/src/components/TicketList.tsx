import type { ChangeEvent } from 'react';
import { TicketStatus, TicketPriority, type Ticket, type TicketPagination } from '../types/ticket';

interface TicketListProps {
  tickets: Ticket[];
  pagination: TicketPagination;
  page: number;
  filter: TicketStatus | 'all';
  loading: boolean;
  onFilterChange: (filter: TicketStatus | 'all') => void;
  onPageChange: (page: number) => void;
  onStatusChange: (ticket: Ticket, status: TicketStatus) => void;
}

const statusLabels: Record<TicketStatus, string> = {
  [TicketStatus.Open]: 'Open',
  [TicketStatus.InProgress]: 'In progress',
  [TicketStatus.Closed]: 'Closed',
};

export default function TicketList({
  tickets,
  pagination,
  page,
  filter,
  loading,
  onFilterChange,
  onPageChange,
  onStatusChange,
}: TicketListProps) {
  const firstItem = pagination.total === 0 ? 0 : (page - 1) * pagination.limit + 1;
  const lastItem = Math.min(page * pagination.limit, pagination.total);

  function handleFilterChange(event: ChangeEvent<HTMLSelectElement>) {
    onFilterChange(event.target.value as TicketStatus | 'all');
  }

  return (
    <section aria-labelledby="tickets-heading">
      <div className="flex min-h-[69px] items-start justify-between">
        <div>
          <p className="mb-1.5 font-mono text-[9px] text-[#dd684b]">THE WORK</p>
          <h2 id="tickets-heading" className="text-[23px] font-medium">Ticket queue <span className="ml-1 align-[3px] font-mono text-[11px] text-[#88928a]">{pagination.total}</span></h2>
        </div>
        <label className="mt-2.5 flex items-center gap-2 text-[#78817b]">
          <span className="font-mono text-[9px]">SHOW</span>
          <select className="bg-transparent py-1 pr-4 text-[11px] text-[#19251f] focus-visible:outline-2 focus-visible:outline-[#dd684b]" value={filter} onChange={handleFilterChange} aria-label="Filter tickets by status">
            <option value="all">All tickets</option>
            <option value={TicketStatus.Open}>Open</option>
            <option value={TicketStatus.InProgress}>In progress</option>
            <option value={TicketStatus.Closed}>Closed</option>
          </select>
        </label>
      </div>

      <div className="border-t border-[#dce2dc]">
        {loading ? (
          <div className="flex min-h-[200px] items-center justify-center gap-2 text-xs text-[#7a857d]" role="status">Loading the queue<span className="animate-pulse text-[#dd684b]">...</span></div>
        ) : tickets.length === 0 ? (
          <div className="flex min-h-[200px] items-center justify-center gap-3 text-xs leading-relaxed text-[#7a857d]"><span className="text-[21px] text-[#dd684b]">✳</span><span>No tickets here yet.<br />A clear queue is a good place to start.</span></div>
        ) : tickets.map((ticket, index) => (
          <article className="grid min-h-[106px] grid-cols-[22px_minmax(0,1fr)_auto] items-center gap-x-2.5 border-b border-[#dce2dc] px-0.5 py-4 md:grid-cols-[29px_minmax(100px,1fr)_93px_120px] md:gap-x-3" key={ticket.id}>
            <div className="self-start pt-1 font-mono text-[9px] text-[#a4ada5]">{String((page - 1) * pagination.limit + index + 1).padStart(2, '0')}</div>
            <div className="min-w-0">
              <h3 className="mb-1 break-words text-[13px] font-semibold">{ticket.title}</h3>
              {ticket.description && <p className="mb-1.5 break-words text-[11px] leading-relaxed text-[#68736b]">{ticket.description}</p>}
              <span className="font-mono text-[8px] text-[#9aa39b]">{new Date(ticket.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <span className="inline-flex w-fit items-center gap-1.5 rounded-sm border border-[#dce2dc] px-2 py-1 font-mono text-[9px] uppercase text-[#626c65]">
              <span className={`size-[5px] rounded-full ${ticket.priority === TicketPriority.High ? 'bg-[#dd684b]' : ticket.priority === TicketPriority.Medium ? 'bg-[#e3b548]' : 'bg-[#6eaa80]'}`} />{ticket.priority}
            </span>
            <label className="col-start-2 col-end-4 row-start-2 -mt-4 flex w-fit max-w-[120px] items-center gap-1.5 md:col-auto md:row-auto md:mt-0">
              <span className={`size-[7px] shrink-0 rounded-full ${ticket.status === TicketStatus.Closed ? 'bg-[#6eaa80]' : ticket.status === TicketStatus.InProgress ? 'bg-[#e3b548]' : 'bg-[#dd684b]'}`} />
              <select
                className="max-w-[106px] bg-transparent py-1 pr-3 text-[10px] text-[#19251f] focus-visible:outline-2 focus-visible:outline-[#dd684b]"
                value={ticket.status}
                onChange={(event) => onStatusChange(ticket, event.target.value as TicketStatus)}
                aria-label={`Change status for ${ticket.title}`}
              >
                {Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </label>
          </article>
        ))}
      </div>

      <footer className="flex min-h-[59px] items-center justify-between font-mono text-[8px] text-[#88928a]">
        <span>SHOWING {firstItem}–{lastItem} OF {pagination.total}</span>
        <div className="flex items-center gap-3 text-[10px] text-[#19251f]">
          <button className="grid size-[27px] place-items-center rounded-full border border-[#dce2dc] bg-transparent text-[13px] disabled:cursor-default disabled:text-[#bbc2bc]" type="button" onClick={() => onPageChange(page - 1)} disabled={page <= 1 || loading} aria-label="Previous page">←</button>
          <span>{page} <i className="px-0.5 not-italic text-[#a8b0a9]">/</i> {Math.max(pagination.totalPages, 1)}</span>
          <button className="grid size-[27px] place-items-center rounded-full border border-[#dce2dc] bg-transparent text-[13px] disabled:cursor-default disabled:text-[#bbc2bc]" type="button" onClick={() => onPageChange(page + 1)} disabled={page >= pagination.totalPages || loading} aria-label="Next page">→</button>
        </div>
      </footer>
    </section>
  );
}
import { useDroppable } from '@dnd-kit/core';
import { TicketStatus, type Ticket } from '../types/ticket';
import TicketCard from './TicketCard';

interface StatusLaneProps {
  status: TicketStatus;
  label: string;
  marker: string;
  count: number;
  tickets: Ticket[];
}

export default function StatusLane({ status, label, marker, count, tickets }: StatusLaneProps) {
  const { isOver, setNodeRef } = useDroppable({ id: status });

  return (
    <section
      ref={setNodeRef}
      aria-label={`${label} tickets`}
      className={`min-h-[340px] rounded-sm border p-3 transition-colors sm:p-4 ${isOver ? 'border-[#316a4b] bg-[#edf4ee]' : 'border-[#dce2dc] bg-[#f7f8f5]'}`}
    >
      <header className="mb-4 flex items-center justify-between border-b border-[#dce2dc] pb-3">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-[#19251f]">
          <span className={`size-2 rounded-full ${marker}`} />
          {label}
        </h3>
        <span className="grid min-w-7 place-items-center rounded-sm bg-white px-2 py-1 font-mono text-[11px] text-[#657168]" aria-label={`${count} tickets`}>
          {count}
        </span>
      </header>
      <div className="flex min-h-[275px] flex-col gap-2.5">
        {tickets.length === 0 ? (
          <p className="flex flex-1 items-center justify-center px-3 text-center text-xs text-[#929b93]">Drop a ticket here</p>
        ) : tickets.map((ticket) => <TicketCard key={ticket.id} ticket={ticket} />)}
      </div>
    </section>
  );
}
import { useState } from 'react';
import {
  closestCorners,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  TicketStatus,
  type Ticket,
  type TicketPagination,
  type TicketStats,
} from '../types/ticket';
import StatusLane from './StatusLane';
import TicketCard from './TicketCard';

interface TicketBoardProps {
  tickets: Ticket[];
  stats: TicketStats;
  pagination: TicketPagination;
  page: number;
  loading: boolean;
  onPageChange: (page: number) => void;
  onStatusChange: (ticket: Ticket, status: TicketStatus) => void;
}

const lanes = [
  { status: TicketStatus.Open, label: 'Open', marker: 'bg-red-500' },
  { status: TicketStatus.InProgress, label: 'In progress', marker: 'bg-orange-500' },
  { status: TicketStatus.Closed, label: 'Closed', marker: 'bg-green-600' },
] as const;

const laneStatuses = lanes.map((lane) => lane.status);

export default function TicketBoard({
  tickets,
  stats,
  pagination,
  page,
  loading,
  onPageChange,
  onStatusChange,
}: TicketBoardProps) {
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor),
  );
  const firstItem = pagination.total === 0 ? 0 : (page - 1) * pagination.limit + 1;
  const lastItem = Math.min(page * pagination.limit, pagination.total);

  function handleDragEnd(event: DragEndEvent) {
    setActiveTicket(null);
    const ticket = event.active.data.current?.ticket as Ticket | undefined;
    const targetStatus = laneStatuses.find((status) => status === event.over?.id);
    if (ticket && targetStatus && ticket.status !== targetStatus) {
      onStatusChange(ticket, targetStatus);
    }
  }

  return (
    <section aria-label="Ticket status board">
      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center gap-2 text-sm text-[#7a857d]" role="status">
          Loading the board<span className="animate-pulse text-[#dd684b]">...</span>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={({ active }) => {
            const ticket = active.data.current?.ticket as Ticket | undefined;
            setActiveTicket(ticket ?? null);
          }}
          onDragEnd={handleDragEnd}
          onDragCancel={() => setActiveTicket(null)}
        >
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
            {lanes.map((lane) => (
              <StatusLane
                key={lane.status}
                {...lane}
                count={stats[lane.status]}
                tickets={tickets.filter((ticket) => ticket.status === lane.status)}
              />
            ))}
          </div>
          <DragOverlay dropAnimation={null}>
            {activeTicket ? <div className="w-[min(320px,80vw)]"><TicketCard ticket={activeTicket} dragOverlay /></div> : null}
          </DragOverlay>
        </DndContext>
      )}

      {!loading && tickets.length === 0 && <p className="mt-4 text-center text-xs text-[#929b93]">No tickets on this page yet.</p>}

      <footer className="flex min-h-[59px] items-center justify-between font-mono text-[8px] text-[#88928a]">
        <span>SHOWING {firstItem}–{lastItem} OF {pagination.total}</span>
        <div className="flex items-center gap-3 text-[10px] text-[#19251f]">
          <button className="grid size-[30px] place-items-center rounded-full border border-[#dce2dc] bg-transparent text-[13px] disabled:cursor-default disabled:text-[#bbc2bc]" type="button" onClick={() => onPageChange(page - 1)} disabled={page <= 1 || loading} aria-label="Previous page">←</button>
          <span>{page} <i className="px-0.5 not-italic text-[#a8b0a9]">/</i> {Math.max(pagination.totalPages, 1)}</span>
          <button className="grid size-[30px] place-items-center rounded-full border border-[#dce2dc] bg-transparent text-[13px] disabled:cursor-default disabled:text-[#bbc2bc]" type="button" onClick={() => onPageChange(page + 1)} disabled={page >= pagination.totalPages || loading} aria-label="Next page">→</button>
        </div>
      </footer>
    </section>
  );
}
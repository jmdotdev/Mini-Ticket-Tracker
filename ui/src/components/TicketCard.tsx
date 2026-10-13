import type { CSSProperties } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { TicketPriority, type Ticket } from '../types/ticket';

interface TicketCardProps {
  ticket: Ticket;
  dragOverlay?: boolean;
}

const priorityStyles: Record<TicketPriority, string> = {
  [TicketPriority.High]: 'border-red-200 bg-red-50 text-red-700',
  [TicketPriority.Medium]: 'border-orange-200 bg-orange-50 text-orange-800',
  [TicketPriority.Low]: 'border-green-200 bg-green-50 text-green-800',
};

export default function TicketCard({ ticket, dragOverlay = false }: TicketCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: ticket.id,
    data: { ticket },
    disabled: dragOverlay,
  });
  const style: CSSProperties = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : {};

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={`rounded-sm border border-[#dce2dc] bg-white p-3.5 shadow-[0_1px_2px_#19251f0d] ${isDragging ? 'opacity-35' : ''} ${dragOverlay ? 'rotate-1 shadow-lg' : ''}`}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="min-w-0 break-words text-sm font-semibold leading-snug text-[#19251f]">{ticket.title}</h3>
        {!dragOverlay && (
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="-mr-1 -mt-1 grid size-8 shrink-0 cursor-grab touch-none place-items-center rounded-sm text-lg leading-none text-[#88928a] hover:bg-[#f3f5f1] hover:text-[#19251f] active:cursor-grabbing focus-visible:outline-2 focus-visible:outline-[#dd684b]"
            aria-label={`Drag ${ticket.title} to another status lane`}
            title="Drag ticket"
          >
            ⠿
          </button>
        )}
      </div>
      {ticket.description && <p className="mb-3 line-clamp-3 whitespace-pre-wrap break-words text-xs leading-relaxed text-[#68736b]">{ticket.description}</p>}
      <div className="flex items-center justify-between gap-2">
        <span className={`inline-flex items-center gap-1.5 rounded-sm border px-2 py-1 font-mono text-[9px] uppercase ${priorityStyles[ticket.priority]}`}>
          <span className="size-1.5 rounded-full bg-current" />
          {ticket.priority}
        </span>
        <time className="font-mono text-[9px] text-[#9aa39b]" dateTime={ticket.created_at}>
          {new Date(ticket.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
        </time>
      </div>
    </article>
  );
}
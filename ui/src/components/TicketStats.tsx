import type { TicketStats as TicketStatsData } from '../types/ticket';

interface TicketStatsProps {
  stats: TicketStatsData;
}

export default function TicketStats({ stats }: TicketStatsProps) {
  return (
    <section className="grid min-h-[92px] grid-cols-4 items-center bg-[#19251f] px-3 py-4 text-[#f5f6f1] sm:grid-cols-[1.3fr_repeat(3,1fr)_0.75fr] sm:px-[22px]" aria-label="Ticket totals">
      <div className="flex min-h-11 flex-col justify-center border-r border-white/15 sm:flex-row sm:items-center sm:gap-3">
        <span className="text-[23px] font-medium leading-none tabular-nums">{stats.total}</span>
        <span className="mt-1 font-mono text-[8px] text-[#b7c1b9] sm:mt-0">TOTAL TICKETS</span>
      </div>
      <div className="flex min-h-11 flex-wrap items-center justify-center gap-1.5 border-r border-white/15 px-1 sm:justify-start sm:gap-2.5 sm:px-5">
        <span className="hidden size-[7px] rounded-full bg-[#dd684b] sm:block" />
        <span className="text-xl font-medium leading-none tabular-nums">{stats.open}</span>
        <span className="w-full text-center font-mono text-[8px] text-[#b7c1b9] sm:w-auto">OPEN</span>
      </div>
      <div className="flex min-h-11 flex-wrap items-center justify-center gap-1.5 border-r border-white/15 px-1 sm:justify-start sm:gap-2.5 sm:px-5">
        <span className="hidden size-[7px] rounded-full bg-[#e3b548] sm:block" />
        <span className="text-xl font-medium leading-none tabular-nums">{stats.in_progress}</span>
        <span className="w-full text-center font-mono text-[8px] text-[#b7c1b9] sm:w-auto">IN PROGRESS</span>
      </div>
      <div className="flex min-h-11 flex-wrap items-center justify-center gap-1.5 px-1 sm:justify-start sm:gap-2.5 sm:px-5">
        <span className="hidden size-[7px] rounded-full bg-[#74a881] sm:block" />
        <span className="text-xl font-medium leading-none tabular-nums">{stats.closed}</span>
        <span className="w-full text-center font-mono text-[8px] text-[#b7c1b9] sm:w-auto">CLOSED</span>
      </div>
    </section>
  );
}
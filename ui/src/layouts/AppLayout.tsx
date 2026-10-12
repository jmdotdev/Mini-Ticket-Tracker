import type { ReactNode } from 'react';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <main className="min-h-screen bg-[#f3f5f1] bg-[radial-gradient(#d8dfd8_0.65px,transparent_0.65px)] [background-size:17px_17px] font-['Space_Grotesk',sans-serif] text-[#19251f]">
      <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-9">
      <header className="flex h-[72px] items-center justify-between border-b border-[#dce2dc] max-sm:h-[61px]">
        <a className="inline-flex items-center gap-2.5 text-sm font-semibold text-[#19251f] no-underline" href="/" aria-label="Mini Ticket Tracker home">
          <span className="grid size-[29px] place-items-center rounded-full bg-[#dd684b] text-xs font-bold text-white">mt</span>
          <span>minute desk</span>
        </a>
        <div className="flex items-center gap-2.5 font-mono text-[9px] text-[#68746c] max-sm:text-[8px]"><span className="size-[7px] rounded-full bg-[#5d986e] shadow-[0_0_0_3px_#5d986e20]" /> SUPPORT QUEUE <span className="text-[#b7c0b8]">/</span> 01</div>
      </header>
      {children}
      <footer className="flex justify-between gap-4 py-8 font-mono text-[8px] text-[#929b93] max-sm:text-[7px]"><span>MINUTE DESK <span className="px-1.5 text-[#dd684b]">●</span> KEEPING THE SMALL THINGS MOVING</span><span>BUILT FOR THE NEXT THING.</span></footer>
      </div>
    </main>
  );
}
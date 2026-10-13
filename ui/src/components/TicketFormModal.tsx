import { useEffect, useRef, useState } from 'react';
import TicketForm from './TicketForm';
import type { CreateTicketInput } from '../types/ticket';

interface TicketFormModalProps {
  saving: boolean;
  onCreate: (input: CreateTicketInput) => Promise<boolean>;
}

export default function TicketFormModal({ saving, onCreate }: TicketFormModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  function close() {
    setOpen(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex min-h-10 items-center gap-2 rounded-sm bg-[#dd684b] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#c85237] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#dd684b]"
      >
        <span aria-hidden="true" className="text-lg leading-none">+</span>
        New ticket
      </button>
      <dialog
        ref={dialogRef}
        onClose={close}
        onClick={(event) => {
          if (event.target === dialogRef.current) close();
        }}
        className="m-auto max-h-[calc(100%-2rem)] w-[min(500px,calc(100%-2rem))] overflow-y-auto border-0 bg-transparent p-0 backdrop:bg-[#19251f]/50"
        aria-labelledby="create-heading"
      >
        <TicketForm saving={saving} onCreate={onCreate} onClose={close} />
      </dialog>
    </>
  );
}
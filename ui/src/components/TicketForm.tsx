import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createTicketSchema } from '../schemas/ticket.schema';
import { TicketPriority, type CreateTicketInput } from '../types/ticket';
import type { z } from 'zod';

interface TicketFormProps {
  saving: boolean;
  onCreate: (input: CreateTicketInput) => Promise<boolean>;
  onClose: () => void;
}

type CreateTicketFormValues = z.input<typeof createTicketSchema>;

const initialDraft: CreateTicketFormValues = {
  title: '',
  description: '',
  priority: TicketPriority.Medium,
};

export default function TicketForm({ saving, onCreate, onClose }: TicketFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTicketFormValues, unknown, CreateTicketInput>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: initialDraft,
  });

  async function submit(input: CreateTicketInput) {
    if (await onCreate(input)) {
      reset(initialDraft);
      onClose();
    }
  }

  return (
    <section className="overflow-hidden border border-[#dce2dc] bg-[#fbfcfa] shadow-[5px_5px_0_#e4e9e2]" aria-labelledby="create-heading">
      <div className="relative min-h-30 overflow-hidden bg-[#e8eee7] px-6 py-5">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 grid size-8 place-items-center rounded-sm text-xl text-[#657168] hover:bg-white/60 focus-visible:outline-2 focus-visible:outline-[#dd684b]"
          aria-label="Close new ticket form"
        >
          ×
        </button>
        <h2 id="create-heading" className="mb-2 mt-5 text-[34px] font-medium leading-[0.99]">Add a<br />ticket.</h2>
        <p className="text-[11px] text-[#657168]">Give the next piece of work a place to land.</p>
      </div>
      <form className="px-6 py-6" onSubmit={handleSubmit(submit)} noValidate>
        <label className="mb-2 block font-mono text-[8px] text-[#657168]" htmlFor="ticket-title">WHAT NEEDS ATTENTION?</label>
        <input
          id="ticket-title"
          autoComplete="off"
          maxLength={160}
          placeholder="A short, clear title"
          {...register('title')}
          aria-invalid={Boolean(errors.title)}
          className="mb-1 w-full border-0 border-b border-[#dce2dc] bg-transparent px-0 py-2.5 text-xs outline-offset-2 placeholder:text-[#a3aca4] focus-visible:outline-2 focus-visible:outline-[#dd684b]"
        />
        {errors.title && <p className="mb-3 text-xs text-[#a63f2d]" role="alert">{errors.title.message}</p>}
        <label className="mb-2 mt-4 flex justify-between gap-2 font-mono text-[8px] text-[#657168]" htmlFor="ticket-description">A LITTLE MORE CONTEXT <span className="text-[#a4ada5]">OPTIONAL</span></label>
        <textarea
          id="ticket-description"
          rows={3}
          placeholder="What should the team know?"
          {...register('description')}
          aria-invalid={Boolean(errors.description)}
          className="mb-1 min-h-[65px] w-full resize-y border-0 border-b border-[#dce2dc] bg-transparent px-0 py-2.5 text-xs leading-relaxed outline-offset-2 placeholder:text-[#a3aca4] focus-visible:outline-2 focus-visible:outline-[#dd684b]"
        />
        {errors.description && <p className="mb-3 text-xs text-[#a63f2d]" role="alert">{errors.description.message}</p>}
        <label className="mb-2 mt-4 block font-mono text-[8px] text-[#657168]" htmlFor="ticket-priority">HOW URGENT?</label>
        <select
          id="ticket-priority"
          {...register('priority')}
          className="mb-5 w-full appearance-none border-0 border-b border-[#dce2dc] bg-transparent px-0 py-2 text-xs focus-visible:outline-2 focus-visible:outline-[#dd684b]"
        >
          <option value="low">Low priority</option>
          <option value="medium">Medium priority</option>
          <option value="high">High priority</option>
        </select>
        <button className="flex min-h-11 w-full items-center justify-between bg-[#dd684b] px-3.5 text-left text-xs font-semibold text-white transition-colors hover:bg-[#c85237] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#dd684b] disabled:cursor-wait disabled:opacity-65" type="submit" disabled={saving}>
          <span>{saving ? 'Adding ticket...' : 'Create ticket'}</span><span className="text-base">↗</span>
        </button>
      </form>
    </section>
  );
}
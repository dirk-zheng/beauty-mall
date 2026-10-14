import { useEffect, useMemo, useState } from 'react';
import { CalendarClock, CheckCircle2, Filter, Inbox, Loader2, MessageSquarePlus, RefreshCw, Search, UserRoundCheck } from 'lucide-react';
import { adminAPI } from '../api';
import { useAuth } from '../context/AuthContext';

const statusLabels = {
  new: 'New',
  contacted: 'Contacted',
  qualified: 'Qualified',
  sampling: 'Sampling',
  quoted: 'Quoted',
  won: 'Won',
  lost: 'Lost',
};

const channelLabels = { email: 'Email', phone: 'Phone', whatsapp: 'WhatsApp', meeting: 'Meeting', other: 'Other' };
const formatDate = (value) => value ? new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)) : 'Not scheduled';

function customerName(item) {
  return item.customer?.company || item.customer?.name || item.customer?.account || item.account || 'Unnamed lead';
}

function interest(item) {
  if (item.items?.length) return item.items.map((entry) => entry.name).join(', ');
  return item.productCategory || item.specifications || 'General OEM/ODM inquiry';
}

export default function AdminInquiries() {
  const { isAdmin } = useAuth();
  const [data, setData] = useState({ inquiries: [], staff: [], statuses: Object.keys(statusLabels) });
  const [selectedId, setSelectedId] = useState('');
  const [filters, setFilters] = useState({ search: '', status: 'all', owner: 'all' });
  const [followUp, setFollowUp] = useState({ content: '', channel: 'email', nextFollowUpAt: '' });
  const [state, setState] = useState({ loading: true, saving: false, error: '' });

  const load = async (keepSelection = true) => {
    setState((current) => ({ ...current, loading: true, error: '' }));
    try {
      const response = await adminAPI.getInquiries();
      setData(response);
      setSelectedId((current) => keepSelection && response.inquiries.some((item) => item.id === current) ? current : (response.inquiries[0]?.id || ''));
    } catch (error) {
      setState((current) => ({ ...current, error: error.message || 'Unable to load inquiries.' }));
    } finally {
      setState((current) => ({ ...current, loading: false }));
    }
  };

  useEffect(() => { load(false); }, []);

  const inquiries = useMemo(() => data.inquiries.filter((item) => {
    const query = filters.search.trim().toLowerCase();
    const matchesSearch = !query || [item.reference, customerName(item), item.customer?.email, item.customer?.country, interest(item)].some((value) => String(value || '').toLowerCase().includes(query));
    const matchesStatus = filters.status === 'all' || item.status === filters.status;
    const matchesOwner = filters.owner === 'all' || (filters.owner === 'unassigned' ? !item.assignedAccount : item.assignedAccount === filters.owner);
    return matchesSearch && matchesStatus && matchesOwner;
  }), [data.inquiries, filters]);

  const selected = inquiries.find((item) => item.id === selectedId) || inquiries[0];
  const counts = useMemo(() => ({
    total: data.inquiries.length,
    unassigned: data.inquiries.filter((item) => !item.assignedAccount).length,
    active: data.inquiries.filter((item) => !['won', 'lost'].includes(item.status)).length,
    won: data.inquiries.filter((item) => item.status === 'won').length,
  }), [data.inquiries]);

  const mutate = async (action) => {
    setState((current) => ({ ...current, saving: true, error: '' }));
    try {
      await action();
      await load(true);
    } catch (error) {
      setState((current) => ({ ...current, error: error.message || 'Unable to update inquiry.' }));
    } finally {
      setState((current) => ({ ...current, saving: false }));
    }
  };

  const addFollowUp = async (event) => {
    event.preventDefault();
    if (!selected || !followUp.content.trim()) return;
    await mutate(() => adminAPI.addInquiryFollowUp(selected.id, {
      ...followUp,
      nextFollowUpAt: followUp.nextFollowUpAt || null,
    }));
    setFollowUp({ content: '', channel: 'email', nextFollowUpAt: '' });
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 pt-28 text-slate-900">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.2em] text-primary">Sales workspace</p>
            <h1 className="mt-2 font-heading text-4xl font-bold">Inquiry pipeline</h1>
            <p className="mt-2 max-w-2xl text-slate-600">Assign every OEM/ODM lead, move it through a shared stage, and keep the next action visible.</p>
          </div>
          <button onClick={() => load(true)} disabled={state.loading} className="inline-flex items-center gap-2 self-start rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm">
            <RefreshCw size={16} className={state.loading ? 'animate-spin' : ''}/> Refresh
          </button>
        </div>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['All inquiries', counts.total, Inbox],
            ['Unassigned', counts.unassigned, UserRoundCheck],
            ['Open pipeline', counts.active, CalendarClock],
            ['Won', counts.won, CheckCircle2],
          ].map(([label, value, Icon]) => (
            <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between text-slate-500"><span className="text-sm font-medium">{label}</span><Icon size={19}/></div>
              <strong className="mt-3 block text-3xl">{value}</strong>
            </div>
          ))}
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-3 md:grid-cols-[1fr_180px_220px]">
            <label className="relative"><Search className="absolute left-3 top-3 text-slate-400" size={18}/><input value={filters.search} onChange={(event) => setFilters({ ...filters, search: event.target.value })} placeholder="Search reference, company, email or product" className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3"/></label>
            <label className="relative"><Filter className="absolute left-3 top-3 text-slate-400" size={17}/><select value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })} className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3"><option value="all">All stages</option>{data.statuses.map((status) => <option key={status} value={status}>{statusLabels[status]}</option>)}</select></label>
            {isAdmin() && <select value={filters.owner} onChange={(event) => setFilters({ ...filters, owner: event.target.value })} className="rounded-xl border border-slate-200 px-3 py-2.5"><option value="all">All owners</option><option value="unassigned">Unassigned</option>{data.staff.map((person) => <option key={person.account} value={person.account}>{person.name || person.account}</option>)}</select>}
          </div>
        </section>

        {state.error && <p className="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-700">{state.error}</p>}

        {state.loading && !data.inquiries.length ? <div className="grid min-h-64 place-items-center"><Loader2 className="animate-spin text-primary" size={36}/></div> : (
          <div className="mt-6 grid gap-6 lg:grid-cols-[360px_1fr]">
            <div className="space-y-3">
              {inquiries.map((item) => (
                <button key={item.id} onClick={() => setSelectedId(item.id)} className={'w-full rounded-2xl border p-4 text-left shadow-sm transition ' + (selected?.id === item.id ? 'border-primary bg-orange-50/50 ring-1 ring-primary' : 'border-slate-200 bg-white hover:border-slate-300')}>
                  <div className="flex items-start justify-between gap-3"><strong>{customerName(item)}</strong><span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-bold uppercase">{statusLabels[item.status] || item.status}</span></div>
                  <p className="mt-1 text-xs font-semibold text-primary">{item.reference}</p>
                  <p className="mt-3 line-clamp-2 text-sm text-slate-600">{interest(item)}</p>
                  <div className="mt-3 flex justify-between text-xs text-slate-400"><span>{item.assignedName || 'Unassigned'}</span><span>{formatDate(item.createdAt).split(',')[0]}</span></div>
                </button>
              ))}
              {!inquiries.length && <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">No inquiries match these filters.</div>}
            </div>

            {selected && <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
              <div className="flex flex-col justify-between gap-5 md:flex-row">
                <div><p className="text-xs font-bold uppercase tracking-widest text-primary">{selected.reference}</p><h2 className="mt-2 font-heading text-3xl font-bold">{customerName(selected)}</h2><p className="mt-2 text-sm text-slate-500">{selected.customer?.name} · {selected.customer?.country} · {selected.source || 'authenticated-rfq'}</p></div>
                <div className="grid min-w-56 gap-3">
                  {isAdmin() && <label className="text-xs font-bold uppercase tracking-wide text-slate-500">Owner<select value={selected.assignedAccount || ''} onChange={(event) => event.target.value && mutate(() => adminAPI.assignInquiry(selected.id, event.target.value))} disabled={state.saving} className="mt-1 block w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-normal normal-case text-slate-900"><option value="">Unassigned</option>{data.staff.map((person) => <option key={person.account} value={person.account}>{person.name || person.account}</option>)}</select></label>}
                  <label className="text-xs font-bold uppercase tracking-wide text-slate-500">Stage<select value={selected.status} onChange={(event) => mutate(() => adminAPI.updateInquiryStatus(selected.id, event.target.value))} disabled={state.saving || !selected.assignedAccount} className="mt-1 block w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-normal normal-case text-slate-900">{data.statuses.map((status) => <option key={status} value={status}>{statusLabels[status]}</option>)}</select></label>
                </div>
              </div>

              <div className="mt-7 grid gap-5 rounded-2xl bg-slate-50 p-5 md:grid-cols-2">
                <div><h3 className="text-xs font-bold uppercase tracking-wide text-slate-500">Contact</h3><p className="mt-2 text-sm">{selected.customer?.email || selected.account || '—'}</p><p className="mt-1 text-sm">{selected.customer?.whatsapp || 'No WhatsApp provided'}</p></div>
                <div><h3 className="text-xs font-bold uppercase tracking-wide text-slate-500">Commercial brief</h3><p className="mt-2 text-sm">{interest(selected)}</p><p className="mt-1 text-sm text-slate-500">{selected.estimatedQuantity ? selected.estimatedQuantity.toLocaleString() + ' units' : 'Quantity not provided'} · {selected.market || selected.deliveryDestination || 'Market not provided'}</p></div>
                <div className="md:col-span-2"><h3 className="text-xs font-bold uppercase tracking-wide text-slate-500">Requirements & notes</h3><p className="mt-2 whitespace-pre-wrap text-sm leading-6">{selected.notes || selected.specifications || selected.targetCustomerProfile || 'No additional notes.'}</p></div>
              </div>

              <form onSubmit={addFollowUp} className="mt-7 rounded-2xl border border-slate-200 p-5">
                <h3 className="flex items-center gap-2 font-bold"><MessageSquarePlus size={19}/> Log a follow-up</h3>
                {!selected.assignedAccount && <p className="mt-2 text-sm text-amber-700">Assign an owner before logging activity.</p>}
                <textarea value={followUp.content} onChange={(event) => setFollowUp({ ...followUp, content: event.target.value })} rows="3" placeholder="Outcome, customer concern, sample request, quotation feedback…" className="mt-4 w-full rounded-xl border border-slate-200 p-3"/>
                <div className="mt-3 grid gap-3 sm:grid-cols-[150px_1fr_auto]">
                  <select value={followUp.channel} onChange={(event) => setFollowUp({ ...followUp, channel: event.target.value })} className="rounded-xl border border-slate-200 px-3 py-2.5">{Object.entries(channelLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
                  <input type="datetime-local" value={followUp.nextFollowUpAt} onChange={(event) => setFollowUp({ ...followUp, nextFollowUpAt: event.target.value })} className="rounded-xl border border-slate-200 px-3 py-2.5"/>
                  <button disabled={state.saving || !selected.assignedAccount || !followUp.content.trim()} className="rounded-xl bg-primary px-5 py-2.5 font-semibold text-white disabled:opacity-40">Save follow-up</button>
                </div>
              </form>

              <section className="mt-7"><h3 className="font-bold">Follow-up history</h3><p className="mt-1 text-sm text-slate-500">Next action: {formatDate(selected.nextFollowUpAt)}</p><div className="mt-4 space-y-3">{[...(selected.followUps || [])].reverse().map((entry) => <div key={entry.id} className="rounded-xl border border-slate-200 p-4"><div className="flex justify-between gap-4 text-xs text-slate-500"><span>{channelLabels[entry.channel]} · {entry.actorName}</span><span>{formatDate(entry.createdAt)}</span></div><p className="mt-2 whitespace-pre-wrap text-sm">{entry.content}</p>{entry.nextFollowUpAt && <p className="mt-2 text-xs font-semibold text-primary">Next: {formatDate(entry.nextFollowUpAt)}</p>}</div>)}{!selected.followUps?.length && <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">No follow-up recorded yet.</p>}</div></section>
            </article>}
          </div>
        )}
      </div>
    </div>
  );
}
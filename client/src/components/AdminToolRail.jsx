import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpenText, ChevronLeft, ChevronRight, CircleHelp, Headphones, Inbox, ShieldCheck, UserCog, UsersRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const staffTools = [
  { path: '/admin/inquiries', label: 'Inquiry pipeline', icon: Inbox },
  { path: '/support/inbox', label: 'Conversation inbox', icon: Headphones },
];

const adminTools = [
  { path: '/admin/users', label: 'User lookup', icon: UsersRound },
  { path: '/admin/roles', label: 'Member roles', icon: UserCog },
  { path: '/admin/articles', label: 'Upload news-blog article', icon: BookOpenText },
  { path: '/admin/faqs', label: 'Write FAQ', icon: CircleHelp },
  { path: '/admin/privacy', label: 'Privacy requests', icon: ShieldCheck },
];

export default function AdminToolRail() {
  const { isAdmin, isSeller } = useAuth();
  const { pathname } = useLocation();
  const [expanded, setExpanded] = useState(false);
  const staff = isAdmin() || isSeller();
  if (!staff) return null;
  const tools = isAdmin() ? [...staffTools, ...adminTools] : staffTools;

  return (
    <aside className="fixed left-3 top-28 z-40" aria-label="Sales tools">
      <div className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white/95 p-2 shadow-xl shadow-slate-900/10 backdrop-blur">
        <button type="button" onClick={() => setExpanded((value) => !value)} className="group flex h-11 items-center rounded-xl bg-slate-900 text-white transition-colors hover:bg-slate-800" aria-expanded={expanded}>
          <span className="flex w-11 shrink-0 items-center justify-center">{expanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}</span>
          {expanded && <span className="whitespace-nowrap pr-4 text-sm font-semibold">Sales workspace</span>}
        </button>
        {expanded && tools.map(({ path, label, icon: Icon }) => (
          <Link key={path} to={path} title={label} className={'flex h-11 items-center rounded-xl transition-colors ' + (pathname === path ? 'bg-primary text-white' : 'text-slate-600 hover:bg-orange-50 hover:text-primary')}>
            <span className="flex w-11 shrink-0 items-center justify-center"><Icon size={20} /></span>
            <span className="whitespace-nowrap pr-4 text-sm font-medium">{label}</span>
          </Link>
        ))}
      </div>
    </aside>
  );
}
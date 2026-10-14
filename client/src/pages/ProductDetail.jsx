import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Check, ClipboardPlus, Leaf, PackageCheck, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { categoryNames, categoryThemeStyle } from '../data/products';
import { productSlug } from '../data/seoContent';

export default function ProductDetail() {
  const { slug } = useParams();
  const { state, addToRfqAssortment } = useStore();
  const { user } = useAuth();
  const [added, setAdded] = useState(false);
  const [error, setError] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const p = state.products.find((item) => productSlug(item) === slug);

  useEffect(() => { setActiveIndex(0); setAdded(false); setError(''); }, [slug]);

  if (!p) return <div className="min-h-screen pt-40 text-center"><h1 className="text-3xl font-bold">Product program not found</h1><Link to="/products" className="mt-4 inline-block text-[#b42346]">View all programs</Link></div>;

  const gallery = Array.isArray(p.gallery) && p.gallery.length ? p.gallery : [p.image];
  const activeImage = gallery[Math.min(activeIndex, gallery.length - 1)] || p.image;
  const add = async () => {
    setError('');
    try { await addToRfqAssortment(p); setAdded(true); } catch (err) { setError(err.message); }
  };

  return <div
    className="min-h-screen pt-24 text-[#21343a]"
    style={{ ...categoryThemeStyle(p.category), background: 'linear-gradient(180deg,var(--category-soft) 0, #f8f6f1 22rem)' }}
  >
    <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
      <Link to="/products" className="mb-7 inline-flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--category-dark)' }}><ArrowLeft size={16} /> Back to collection</Link>
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <div
            className="overflow-hidden rounded-[2.25rem] border bg-white shadow-[0_25px_65px_rgba(22,39,45,.12)]"
            style={{ borderColor: 'color-mix(in srgb, var(--category-accent) 22%, white)' }}
          >
            <div className="h-1.5" style={{ background: 'linear-gradient(90deg,var(--category-accent),var(--category-highlight))' }} />
            <img src={activeImage} alt={`${p.name} — view ${activeIndex + 1}`} className={`aspect-[4/5] w-full transition duration-300 ${p.imageFit === 'contain' ? 'bg-white object-contain p-5' : 'object-cover'}`} />
          </div>
          {gallery.length > 1 && <div className="mt-4 grid grid-cols-3 gap-3">{gallery.map((image, index) => <button
            type="button"
            key={image}
            onClick={() => setActiveIndex(index)}
            aria-label={`View ${index + 1} of ${p.name}`}
            aria-pressed={activeIndex === index}
            className="overflow-hidden rounded-2xl border-2 bg-white transition"
            style={{ borderColor: activeIndex === index ? 'var(--category-accent)' : 'transparent', opacity: activeIndex === index ? 1 : .72 }}
          ><img src={image} alt="" className="aspect-square w-full object-cover" /></button>)}</div>}
          <p className="mt-3 text-center text-xs text-[#718087]">Source-catalog reference image · Confirm commercial image rights before publication</p>
          {p.sourceUrl && <p className="mt-2 text-center text-xs text-[#718087]">Source: <a href={p.sourceUrl} target="_blank" rel="noreferrer" className="font-semibold underline" style={{ color: 'var(--category-accent)' }}>Global Cosmetics product catalog</a></p>}
        </div>
        <section className="lg:py-4">
          <p className="text-xs font-bold uppercase tracking-[.22em]" style={{ color: 'var(--category-accent)' }}>{categoryNames[p.category]} · {p.badge}</p>
          <h1 className="mt-4 font-heading text-4xl font-medium text-[#21343a] sm:text-5xl">{p.name}</h1>
          <p className="mt-3 text-lg font-semibold" style={{ color: 'var(--category-accent)' }}>{p.benefit}</p>
          <p className="mt-6 text-lg leading-8 text-[#52656c]">{p.description}</p>
          <div className="mt-7 grid grid-cols-2 gap-3 border-y border-[#21343a]/10 py-5">
            <div><span className="text-xs uppercase tracking-wider text-[#687980]">Format</span><strong className="mt-1 block">{p.sizes}</strong></div>
            <div><span className="text-xs uppercase tracking-wider text-[#687980]">Typical MOQ</span><strong className="mt-1 block">{p.moq}</strong></div>
          </div>
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <Link to={`/contact?product=${encodeURIComponent(p.name)}`} className="flex items-center justify-center rounded-full px-5 py-4 font-semibold text-white shadow-lg transition hover:-translate-y-0.5" style={{ background: 'var(--category-accent)', boxShadow: '0 12px 28px color-mix(in srgb, var(--category-accent) 25%, transparent)' }}>Request quote & sample</Link>
            {user
              ? <button onClick={add} disabled={added} className="flex items-center justify-center gap-2 rounded-full border bg-white px-5 py-4 font-semibold disabled:opacity-60" style={{ borderColor: 'color-mix(in srgb, var(--category-accent) 35%, white)', color: 'var(--category-dark)' }}><ClipboardPlus size={18} />{added ? 'Added to your edit' : 'Add to partner edit'}</button>
              : <Link to="/login" state={{ from: { pathname: `/products/${slug}` } }} className="flex items-center justify-center gap-2 rounded-full border bg-white px-5 py-4 font-semibold" style={{ borderColor: 'color-mix(in srgb, var(--category-accent) 35%, white)', color: 'var(--category-dark)' }}><ClipboardPlus size={18} /> Sign in for partner samples</Link>}
          </div>
          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
          <div className="mt-9">
            <h2 className="font-heading text-2xl font-medium">Program highlights</h2>
            <ul className="mt-4 space-y-3">{(p.specs || []).map((spec) => <li key={spec} className="flex gap-3 text-[#52656c]"><Check className="mt-1 shrink-0" style={{ color: 'var(--category-accent)' }} size={16} />{spec}</li>)}</ul>
            {p.applications && <div className="mt-6 rounded-2xl border p-5 text-sm leading-6" style={{ background: 'var(--category-soft)', borderColor: 'color-mix(in srgb, var(--category-accent) 18%, white)' }}><strong className="mb-1 block text-[#21343a]">Consumer use direction</strong>{p.applications}</div>}
          </div>
          <div className="mt-7 grid gap-3 border-y border-[#21343a]/10 py-6 sm:grid-cols-3" style={{ color: 'var(--category-dark)' }}><span className="flex items-center gap-2 text-xs"><Leaf size={17} /> Formula options</span><span className="flex items-center gap-2 text-xs"><Sparkles size={17} /> Sample support</span><span className="flex items-center gap-2 text-xs"><PackageCheck size={17} /> Custom packaging</span></div>
        </section>
      </div>
    </main>
  </div>;
}
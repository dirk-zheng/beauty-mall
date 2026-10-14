import { useMemo, useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { categories, getCategoryTheme } from '../data/products';
import ProductCard from '../components/ProductCard';

export default function Products() {
  const { state } = useStore();
  const [category, setCategory] = useState('all');
  const [query, setQuery] = useState('');
  const products = useMemo(
    () => state.products.filter((product) => (category === 'all' || product.category === category)
      && `${product.name} ${product.description} ${product.benefit || ''}`.toLowerCase().includes(query.toLowerCase())),
    [state.products, category, query],
  );
  const activeTheme = getCategoryTheme(category);

  return <div className="min-h-screen bg-[#f8f6f1] pt-24">
    <section className="relative overflow-hidden px-5 py-20 text-center" style={{ background: 'linear-gradient(120deg,#fbe8ed 0%,#fff7dc 50%,#e6f3f8 100%)' }}>
      <div className="absolute -left-24 top-4 h-64 w-64 rounded-full bg-[#b42346]/10 blur-3xl" />
      <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-[#146f9c]/12 blur-3xl" />
      <div className="relative">
        <p className="text-xs font-bold uppercase tracking-[.26em] text-[#b42346]">Aurelia B2B Collection</p>
        <h1 className="mt-4 font-heading text-5xl font-medium text-[#21343a] sm:text-6xl">Color-led care, built for brands.</h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#53676e]">A focused OEM/ODM portfolio for lip color, sunscreen and face cleansing, with format, testing and commercial requirements visible from the start.</p>
        <div className="mx-auto mt-7 flex max-w-md items-center justify-center gap-3">
          {[['#b42346', 'Lip makeup'], ['#146f9c', 'Sun care'], ['#237a6b', 'Face cleanser']].map(([color, label]) => <span key={label} className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[.14em] text-[#45585f]"><i className="h-3 w-3 rounded-full" style={{ background: color }} />{label}</span>)}
        </div>
      </div>
    </section>
    <main className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
      <div className="flex flex-col gap-5 border-b border-[#21343a]/10 pb-7 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">{categories.map((item) => {
          const theme = getCategoryTheme(item.id);
          const active = category === item.id;
          return <button
            key={item.id}
            onClick={() => setCategory(item.id)}
            className="rounded-full border px-5 py-2.5 text-sm font-semibold transition hover:-translate-y-0.5"
            style={active
              ? { background: theme.accent, borderColor: theme.accent, color: '#fff', boxShadow: `0 8px 22px ${theme.accent}2b` }
              : { background: '#fff', borderColor: `${theme.accent}35`, color: theme.dark }}
          >{item.name}</button>;
        })}</div>
        <label className="relative block min-w-[280px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: activeTheme.accent }} size={18} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products or benefits" className="w-full rounded-full border bg-white py-3 pl-11 pr-4" style={{ borderColor: `${activeTheme.accent}35` }} />
        </label>
      </div>
      <div className="my-8 flex items-center justify-between">
        <p className="text-sm text-[#607279]">{products.length} product programs</p>
        <span className="flex items-center gap-2 text-sm font-semibold" style={{ color: activeTheme.accent }}><SlidersHorizontal size={16} /> Curated by category</span>
      </div>
      {products.length
        ? <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">{products.map((product, index) => <ProductCard key={product.id} product={product} index={index} />)}</div>
        : <div className="py-24 text-center"><h2 className="font-heading text-2xl font-medium">Nothing matched that search</h2><p className="mt-2 text-[#607279]">Try another product, benefit or category.</p></div>}
      <section className="relative mt-20 overflow-hidden rounded-[2rem] bg-[#21343a] p-9 text-white sm:flex sm:items-center sm:justify-between">
        <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#b42346,#e9aa25,#146f9c)]" />
        <div><h2 className="font-heading text-3xl font-medium">Planning a beauty product launch?</h2><p className="mt-2 text-white/65">Share the market, quantity, target price and product direction. We will shape a development brief.</p></div>
        <a href="/contact" className="mt-5 inline-block rounded-full bg-white px-6 py-3 font-semibold text-[#21343a] sm:mt-0">Start an inquiry</a>
      </section>
    </main>
  </div>;
}
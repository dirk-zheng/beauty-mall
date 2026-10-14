import { Link } from 'react-router-dom';
import { ArrowRight, Droplets, FlaskConical, Heart, Leaf, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import ProductCard from '../components/ProductCard';

const promises = [
  [Leaf, 'Considered formulas', 'Purposeful ingredients chosen for performance, comfort and sensorial pleasure.'],
  [FlaskConical, 'Modern standards', 'Vegan formulas, responsible partners and clear ingredient communication.'],
  [Heart, 'Made for real rituals', 'Intuitive textures and edited color designed to fit naturally into your day.'],
  [Droplets, 'Skin-first beauty', 'Every formula begins with barrier comfort and a healthy-looking finish.'],
];

export default function HomePage() {
  const { state } = useStore();
  const featured = state.products.slice(0, 6);

  return <div className="min-h-screen bg-[#f8f6f1] pt-24 text-[#21343a]">
    <section className="relative min-h-[720px] overflow-hidden bg-[#edf3f3]">
      <div className="absolute inset-0" style={{ background: 'linear-gradient(120deg,#fbe8ed 0%,#fff7dc 48%,#e6f3f8 100%)' }} />
      <div className="absolute -left-20 top-16 h-72 w-72 rounded-full bg-[#b42346]/10 blur-3xl" />
      <div className="absolute -right-16 bottom-4 h-96 w-96 rounded-full bg-[#146f9c]/12 blur-3xl" />
      <div className="absolute inset-y-0 right-[4vw] hidden w-[48%] max-w-[630px] grid-cols-2 content-center gap-4 py-12 lg:grid">
        <div className="relative col-span-2 h-[260px] overflow-hidden rounded-[2rem] border border-[#b42346]/20 bg-white/90 shadow-[0_24px_60px_rgba(118,26,51,.12)] backdrop-blur">
          <span className="absolute left-5 top-5 z-10 rounded-full bg-[#fbe8ed] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.16em] text-[#b42346]">Lip color</span>
          <img src="/product-images/designer-lipstick.jpg" alt="Designer lipstick range" className="h-full w-full object-contain p-6" />
        </div>
        <div className="relative h-[285px] overflow-hidden rounded-[2rem] border border-[#146f9c]/20 bg-white/90 shadow-[0_22px_50px_rgba(20,111,156,.12)] backdrop-blur">
          <span className="absolute left-4 top-4 z-10 rounded-full bg-[#e6f3f8] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.16em] text-[#146f9c]">Sun care</span>
          <img src="/product-images/sunscreen-spray.jpg" alt="Sunscreen spray" className="h-full w-full object-contain p-5" />
        </div>
        <div className="relative h-[285px] overflow-hidden rounded-[2rem] border border-[#527f92]/20 bg-white/90 shadow-[0_22px_50px_rgba(49,87,103,.12)] backdrop-blur">
          <span className="absolute left-4 top-4 z-10 rounded-full bg-[#e8f1f4] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.16em] text-[#527f92]">Protective</span>
          <img src="/product-images/hand-sanitizer.jpg" alt="Hand sanitizer" className="h-full w-full object-contain p-5" />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 h-1.5 w-full bg-[linear-gradient(90deg,#b42346_0%,#b42346_33%,#e9aa25_33%,#e9aa25_66%,#146f9c_66%,#527f92_100%)]" />
      <div className="relative mx-auto flex min-h-[720px] max-w-7xl items-center px-5 sm:px-8">
        <div className="max-w-xl py-20">
          <p className="mb-5 text-xs font-bold uppercase tracking-[.28em] text-[#b42346]">Color-led care · Built for brands</p>
          <h1 className="font-heading text-5xl font-medium leading-[1.02] text-[#21343a] sm:text-7xl">Distinct products.<br/><span className="font-serif italic text-[#b42346]">One clear point of view.</span></h1>
          <p className="mt-7 max-w-lg text-lg leading-8 text-[#53676e]">Berry-rich lip color, bright sun care and cool protective essentials—developed as a cohesive OEM/ODM portfolio.</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link to="/products" className="inline-flex items-center gap-2 rounded-full bg-[#21343a] px-7 py-4 font-semibold text-white transition hover:bg-[#b42346]">View product portfolio <ArrowRight size={18} /></Link>
            <Link to="/about" className="rounded-full border border-[#21343a]/20 bg-white/75 px-7 py-4 font-semibold text-[#21343a] backdrop-blur">Discover our story</Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-4">
            {[['#b42346', 'Lip color'], ['#e9aa25', 'Sun care'], ['#527f92', 'Protective care']].map(([color, label]) => <span key={label} className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.13em] text-[#53676e]"><i className="h-3.5 w-3.5 rounded-full shadow-sm" style={{ background: color }} />{label}</span>)}
          </div>
        </div>
      </div>
    </section>

    <section className="border-y border-[#21343a]/8 bg-[#21343a] text-white">
      <div className="mx-auto grid max-w-7xl gap-px md:grid-cols-4">{promises.map(([Icon, title, description], index) => <div key={title} className="flex gap-4 border-white/10 p-7 md:border-r"><Icon className="shrink-0" style={{ color: ['#d85c70', '#e9aa25', '#70a9bd', '#9bc4d1'][index] }} /><div><h2 className="font-semibold">{title}</h2><p className="mt-1 text-sm leading-6 text-white/60">{description}</p></div></div>)}</div>
    </section>

    <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="text-xs font-bold uppercase tracking-[.24em] text-[#b42346]">The Aurelia edit</p><h2 className="mt-3 font-heading text-4xl font-medium text-[#21343a] sm:text-5xl">A palette drawn from the products.</h2><p className="mt-4 max-w-2xl leading-7 text-[#607279]">Crimson and gold for lip color, ocean blue and solar yellow for sun care, and calm blue-grey for protective formats.</p></div>
        <Link to="/products" className="inline-flex items-center gap-2 font-semibold text-[#146f9c]">View all products <ArrowRight size={17} /></Link>
      </div>
      <div className="mt-11 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{featured.map((product, index) => <ProductCard key={product.id} product={product} index={index} />)}</div>
    </section>

    <section className="bg-[#e8f1f4] py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2">
        <div className="overflow-hidden rounded-[2.5rem] border border-[#527f92]/20 bg-white shadow-[0_24px_60px_rgba(49,87,103,.12)]"><img src="/product-images/hand-wash.jpg" alt="Hand wash reference product" className="aspect-[4/5] w-full object-cover" /></div>
        <div className="lg:pl-10"><Sparkles className="text-[#527f92]" size={30} /><p className="mt-6 text-xs font-bold uppercase tracking-[.24em] text-[#527f92]">Protective-care assortment</p><h2 className="mt-3 font-heading text-4xl font-medium leading-tight text-[#21343a] sm:text-5xl">A cooler palette for clean, practical care.</h2><p className="mt-6 max-w-xl text-lg leading-8 text-[#53676e]">Blue-grey and soft mineral neutrals echo the hygiene packaging while keeping the range calm, credible and easy to navigate.</p><Link to="/services/skin-ritual" className="mt-8 inline-flex items-center gap-2 border-b border-[#527f92] pb-1 font-semibold text-[#315767]">Explore protective care <ArrowRight size={17} /></Link></div>
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
      <div className="grid overflow-hidden rounded-[2.5rem] text-white lg:grid-cols-[1.2fr_.8fr]" style={{ background: 'linear-gradient(125deg,#761a33 0%,#b42346 38%,#146f9c 100%)' }}>
        <div className="p-9 sm:p-14"><p className="text-xs font-bold uppercase tracking-[.24em] text-[#fff0c7]">For beauty retailers & creators</p><h2 className="mt-4 font-heading text-4xl font-medium">Bring the full color system into your range.</h2><p className="mt-5 max-w-xl leading-7 text-white/82">Build wholesale and private-label programs with clear category recognition and one cohesive premium identity.</p><Link to="/contact" className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-[#21343a]">Start a conversation <ArrowRight size={17} /></Link></div>
        <div className="grid grid-cols-2 gap-px bg-white/15 p-px">{[['3', 'Product families'], ['12', 'Product programs'], ['OEM/ODM', 'Development'], ['Global', 'Partnerships']].map(([value, label]) => <div key={label} className="flex flex-col justify-center bg-[#21343a]/55 p-7 backdrop-blur-sm"><strong className="font-heading text-2xl font-medium">{value}</strong><span className="mt-1 text-sm text-white/70">{label}</span></div>)}</div>
      </div>
    </section>
  </div>;
}
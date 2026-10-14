import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { productSlug } from '../data/seoContent';
import { categoryNames, categoryThemeStyle } from '../data/products';

export default function ProductCard({ product, index = 0 }) {
  const contain = product.imageFit === 'contain';

  return (
    <article className="group" style={categoryThemeStyle(product.category)}>
      <Link to={`/products/${productSlug(product)}`}>
        <div
          className="relative overflow-hidden rounded-[1.75rem] border transition duration-500 group-hover:-translate-y-1 group-hover:shadow-[0_22px_55px_rgba(22,39,45,.14)]"
          style={{ background: 'var(--category-surface)', borderColor: 'color-mix(in srgb, var(--category-accent) 22%, white)' }}
        >
          <div className="absolute inset-x-0 top-0 z-10 h-1" style={{ background: 'linear-gradient(90deg,var(--category-accent),var(--category-highlight))' }} />
          <img
            src={product.image}
            alt={product.name}
            className={contain
              ? 'aspect-[4/5] w-full bg-white object-contain p-4 transition duration-700 group-hover:scale-[1.025]'
              : `aspect-[4/5] w-full object-cover transition duration-700 group-hover:scale-105 ${index % 3 === 1 ? 'object-[55%_center]' : index % 3 === 2 ? 'object-[80%_center]' : 'object-[24%_center]'}`}
            onError={(event) => { event.currentTarget.src = '/no-image.png'; }}
          />
          <span
            className="absolute left-3 top-4 rounded-full border bg-white/92 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur"
            style={{ color: 'var(--category-accent)', borderColor: 'color-mix(in srgb, var(--category-accent) 24%, white)' }}
          >
            {product.badge || categoryNames[product.category]}
          </span>
          <span
            className="absolute bottom-3 right-3 grid h-11 w-11 place-items-center rounded-full text-white opacity-0 shadow-lg transition group-hover:opacity-100"
            style={{ background: 'var(--category-accent)' }}
          >
            <ArrowUpRight size={18} />
          </span>
        </div>
        <div className="mt-4">
          <p className="text-[11px] font-bold uppercase tracking-[.18em]" style={{ color: 'var(--category-accent)' }}>{categoryNames[product.category]}</p>
          <div className="mt-1 flex items-start justify-between gap-3">
            <h2 className="font-heading text-xl font-medium text-[#21343a]">{product.name}</h2>
            <span className="shrink-0 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--category-accent)' }}>Quote only</span>
          </div>
          <p className="mt-2 text-sm text-[#596a70]">{product.sizes} · {product.benefit}</p>
          <p className="mt-1 text-xs text-[#74848a]">Typical MOQ: {product.moq}</p>
        </div>
      </Link>
    </article>
  );
}
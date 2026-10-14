import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  return (
    <Link
      to={`/products/${product._id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-ink/10 bg-white/50 transition hover:border-ink/25 hover:shadow-lg"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-ink/5">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <span className="hangtag absolute left-3 top-3 rounded-full bg-bone/90 px-2 py-1 text-ink shadow-sm">
          {product.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="font-display text-lg leading-snug text-ink">{product.name}</h3>
        <p className="line-clamp-2 text-sm text-ink/60">{product.description}</p>
        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="hangtag rounded border border-ink/20 px-2 py-1 text-ink">
            ${product.price.toFixed(2)}
          </span>
          <span className="text-xs text-ink/50">★ {product.rating}</span>
        </div>
      </div>
    </Link>
  );
}

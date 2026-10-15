import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/products")
      .then(({ data }) => setFeatured(data.products.slice(0, 4)))
      .catch((err) => console.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-2 md:py-24">
        <div className="flex flex-col justify-center gap-6">
          <span className="hangtag w-fit rounded-full border border-ink/20 px-3 py-1 text-sage">
            No. 001 — Autumn Collection
          </span>
          <h1 className="font-display text-5xl leading-[1.05] text-ink md:text-6xl">
            Clothing,
            <br />
            <em className="italic text-clay">considered.</em>
          </h1>
          <p className="max-w-md text-ink/70">
            Veloura makes durable, quietly detailed essentials — cut to move with you
            and built to outlast a season's trend.
          </p>
          <div className="flex gap-4">
            <Link
              to="/products"
              className="rounded-full bg-ink px-6 py-3 font-body text-sm text-bone transition hover:bg-ink/85"
            >
              View all products
            </Link>
            <Link
              to="/products?category=Men"
              className="rounded-full border border-ink/20 px-6 py-3 font-body text-sm text-ink transition hover:border-ink/40"
            >
              Shop Men
            </Link>
          </div>
        </div>
        <div className="relative">
          <div className="aspect-[4/5] overflow-hidden rounded-3xl bg-ink/5">
            <img
              src="https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=900"
              alt="Veloura autumn collection"
              className="h-full w-full object-cover"
            />
          </div>
          <span className="hangtag absolute -bottom-4 left-6 rounded-full bg-amber px-4 py-2 text-ink shadow-md">
            New arrivals weekly
          </span>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-display text-2xl text-ink">Featured pieces</h2>
          <Link to="/products" className="text-sm text-sage hover:underline">
            See everything →
          </Link>
        </div>

        {loading ? (
          <p className="text-ink/50">Loading products…</p>
        ) : (
          <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

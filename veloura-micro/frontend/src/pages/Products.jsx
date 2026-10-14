import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";

const CATEGORIES = ["Men", "Women", "Unisex", "Accessories", "Footwear"];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "";

  useEffect(() => {
    setLoading(true);
    setError("");
    const params = {};
    if (search) params.search = search;
    if (category) params.category = category;
    if (sort) params.sort = sort;

    api
      .get("/products", { params })
      .then(({ data }) => setProducts(data.products))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [search, category, sort]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-display text-3xl text-ink">
            {search ? `Results for “${search}”` : "All products"}
          </h1>
          <p className="text-sm text-ink/50">{products.length} items</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={category}
            onChange={(e) => updateParam("category", e.target.value)}
            className="rounded-full border border-ink/20 bg-white/60 px-4 py-2 text-sm"
          >
            <option value="">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(e) => updateParam("sort", e.target.value)}
            className="rounded-full border border-ink/20 bg-white/60 px-4 py-2 text-sm"
          >
            <option value="">Sort: Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>

          {(search || category || sort) && (
            <button
              onClick={() => setSearchParams({})}
              className="rounded-full border border-ink/20 px-4 py-2 text-sm text-ink/60 hover:text-ink"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {loading && <p className="text-ink/50">Loading products…</p>}
      {error && <p className="text-clay">Couldn't load products: {error}</p>}

      {!loading && !error && products.length === 0 && (
        <div className="rounded-2xl border border-dashed border-ink/20 py-16 text-center">
          <p className="font-display text-xl text-ink">No matches yet</p>
          <p className="mt-2 text-sm text-ink/60">
            Try a different search term or browse all categories.
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { itemCount } = useCart();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(query.trim() ? `/products?search=${encodeURIComponent(query.trim())}` : "/products");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-bone/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-6 px-6 py-4">
        <Link to="/" className="font-display text-2xl tracking-tight text-ink">
          Veloura
        </Link>

        <form onSubmit={handleSearch} className="ml-4 flex-1">
          <div className="flex items-center gap-2 rounded-full border border-ink/15 bg-white/60 px-4 py-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0 text-ink/50">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search jackets, denim, accessories…"
              className="w-full bg-transparent text-sm font-body placeholder:text-ink/40 focus:outline-none"
            />
          </div>
        </form>

        <nav className="flex items-center gap-5 font-body text-sm">
          <Link to="/products" className="hidden text-ink/80 hover:text-ink sm:inline">
            All products
          </Link>
          <Link to="/cart" className="relative hangtag rounded-full bg-ink px-4 py-2 text-bone">
            Cart
            {itemCount > 0 && (
              <span className="ml-1 rounded-full bg-amber px-1.5 text-ink">{itemCount}</span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}

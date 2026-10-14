import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { cart, loading, subtotal, updateQuantity, removeItem } = useCart();
  const navigate = useNavigate();

  if (loading) return <p className="mx-auto max-w-4xl px-6 py-16 text-ink/50">Loading your cart…</p>;

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-20 text-center">
        <p className="font-display text-2xl text-ink">Your cart is empty</p>
        <p className="mt-2 text-ink/60">Find something you'll actually wear on repeat.</p>
        <Link
          to="/products"
          className="mt-6 inline-block rounded-full bg-ink px-6 py-3 text-sm text-bone"
        >
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="mb-8 font-display text-3xl text-ink">Your cart</h1>

      <div className="flex flex-col gap-4">
        {cart.items.map((item) => (
          <div
            key={item._id}
            className="flex items-center gap-4 rounded-2xl border border-ink/10 bg-white/50 p-4"
          >
            <img
              src={item.image}
              alt={item.name}
              className="h-20 w-20 rounded-xl object-cover"
            />
            <div className="flex-1">
              <p className="font-display text-lg text-ink">{item.name}</p>
              <p className="text-xs text-ink/50">Size {item.size}</p>
              <p className="hangtag mt-1 text-ink/70">${item.price.toFixed(2)}</p>
            </div>

            <div className="flex items-center rounded-full border border-ink/20">
              <button
                onClick={() => updateQuantity(item._id, item.quantity - 1)}
                className="px-3 py-1.5 text-ink/70 hover:text-ink"
              >
                −
              </button>
              <span className="w-8 text-center">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                className="px-3 py-1.5 text-ink/70 hover:text-ink"
              >
                +
              </button>
            </div>

            <button
              onClick={() => removeItem(item._id)}
              className="text-sm text-clay hover:underline"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col items-end gap-3 border-t border-ink/10 pt-6">
        <p className="font-display text-xl text-ink">
          Subtotal: <span className="hangtag">${subtotal.toFixed(2)}</span>
        </p>
        <button
          onClick={() => navigate("/checkout")}
          className="rounded-full bg-ink px-8 py-3 text-sm text-bone transition hover:bg-ink/85"
        >
          Checkout
        </button>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useCart } from "../context/CartContext";

const initialForm = {
  fullName: "",
  email: "",
  address: "",
  city: "",
  postalCode: "",
  phone: "",
};

export default function Checkout() {
  const { cart, cartId, subtotal, refreshCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-20 text-center">
        <p className="font-display text-2xl text-ink">Nothing to check out yet</p>
        <button
          onClick={() => navigate("/products")}
          className="mt-6 rounded-full bg-ink px-6 py-3 text-sm text-bone"
        >
          Browse products
        </button>
      </div>
    );
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPlacing(true);
    setError("");
    try {
      const { data } = await api.post("/orders", { cartId, customer: form });
      await refreshCart();
      navigate(`/order-success/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't place your order — try again.");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="mx-auto grid max-w-5xl gap-10 px-6 py-12 md:grid-cols-2">
      <div>
        <h1 className="mb-6 font-display text-3xl text-ink">Checkout</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            required
            name="fullName"
            placeholder="Full name"
            value={form.fullName}
            onChange={handleChange}
            className="rounded-xl border border-ink/20 bg-white/60 px-4 py-3 text-sm"
          />
          <input
            required
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="rounded-xl border border-ink/20 bg-white/60 px-4 py-3 text-sm"
          />
          <input
            required
            name="address"
            placeholder="Street address"
            value={form.address}
            onChange={handleChange}
            className="rounded-xl border border-ink/20 bg-white/60 px-4 py-3 text-sm"
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              required
              name="city"
              placeholder="City"
              value={form.city}
              onChange={handleChange}
              className="rounded-xl border border-ink/20 bg-white/60 px-4 py-3 text-sm"
            />
            <input
              required
              name="postalCode"
              placeholder="Postal code"
              value={form.postalCode}
              onChange={handleChange}
              className="rounded-xl border border-ink/20 bg-white/60 px-4 py-3 text-sm"
            />
          </div>
          <input
            required
            name="phone"
            placeholder="Phone number"
            value={form.phone}
            onChange={handleChange}
            className="rounded-xl border border-ink/20 bg-white/60 px-4 py-3 text-sm"
          />

          {error && <p className="text-sm text-clay">{error}</p>}

          <button
            type="submit"
            disabled={placing}
            className="mt-2 rounded-full bg-ink px-8 py-3 text-sm text-bone transition hover:bg-ink/85 disabled:opacity-50"
          >
            {placing ? "Placing order…" : `Place order — $${subtotal.toFixed(2)}`}
          </button>
        </form>
      </div>

      <div className="rounded-2xl border border-ink/10 bg-white/50 p-6 h-fit">
        <h2 className="mb-4 font-display text-xl text-ink">Order summary</h2>
        <div className="flex flex-col gap-3">
          {cart.items.map((item) => (
            <div key={item._id} className="flex justify-between text-sm">
              <span className="text-ink/70">
                {item.name} × {item.quantity} ({item.size})
              </span>
              <span className="hangtag">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-between border-t border-ink/10 pt-4 font-display text-lg">
          <span>Total</span>
          <span className="hangtag">${subtotal.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

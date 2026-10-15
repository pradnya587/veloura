import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import { useCart } from "../context/CartContext";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState("idle"); // idle | adding | added | error

  useEffect(() => {
    api
      .get(`/products/${id}`)
      .then(({ data }) => {
        setProduct(data);
        setSize(data.sizes?.[0] || "");
      })
      .catch((err) => console.error(err.message));
  }, [id]);

  const handleAddToCart = async () => {
    setStatus("adding");
    try {
      await addToCart(product._id, size, quantity);
      setStatus("added");
      setTimeout(() => setStatus("idle"), 1800);
    } catch (err) {
      console.error(err.message);
      setStatus("error");
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate("/cart");
  };

  if (!product) return <p className="mx-auto max-w-6xl px-6 py-16 text-ink/50">Loading…</p>;

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 md:grid-cols-2">
      <div className="aspect-[4/5] overflow-hidden rounded-3xl bg-ink/5">
        <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
      </div>

      <div className="flex flex-col gap-5">
        <span className="hangtag w-fit rounded-full border border-ink/20 px-3 py-1 text-sage">
          {product.category}
        </span>
        <h1 className="font-display text-4xl text-ink">{product.name}</h1>
        <p className="hangtag rounded border border-ink/20 px-3 py-1.5 w-fit text-lg text-ink">
          ${product.price.toFixed(2)}
        </p>
        <p className="text-ink/70">{product.description}</p>

        {product.sizes?.length > 0 && (
          <div>
            <p className="mb-2 text-sm font-medium text-ink/70">Size</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`rounded-full border px-4 py-1.5 text-sm transition ${
                    size === s
                      ? "border-ink bg-ink text-bone"
                      : "border-ink/20 text-ink/70 hover:border-ink/50"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-3">
          <p className="text-sm font-medium text-ink/70">Quantity</p>
          <div className="flex items-center rounded-full border border-ink/20">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="px-3 py-1.5 text-ink/70 hover:text-ink"
            >
              −
            </button>
            <span className="w-8 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="px-3 py-1.5 text-ink/70 hover:text-ink"
            >
              +
            </button>
          </div>
        </div>

        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={handleAddToCart}
            disabled={status === "adding"}
            className="flex-1 rounded-full border border-ink px-6 py-3 font-body text-sm text-ink transition hover:bg-ink/5 disabled:opacity-50"
          >
            {status === "added" ? "Added to cart ✓" : "Add to cart"}
          </button>
          <button
            onClick={handleBuyNow}
            disabled={status === "adding"}
            className="flex-1 rounded-full bg-ink px-6 py-3 font-body text-sm text-bone transition hover:bg-ink/85 disabled:opacity-50"
          >
            Buy now
          </button>
        </div>

        {status === "error" && (
          <p className="text-sm text-clay">Couldn't add that to your cart — try again.</p>
        )}

        <p className="text-xs text-ink/40">{product.stock} in stock · rated {product.rating}/5</p>
      </div>
    </div>
  );
}

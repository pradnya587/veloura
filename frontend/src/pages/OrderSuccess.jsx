import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";

export default function OrderSuccess() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    api
      .get(`/orders/${id}`)
      .then(({ data }) => setOrder(data))
      .catch((err) => console.error(err.message));
  }, [id]);

  return (
    <div className="mx-auto max-w-xl px-6 py-20 text-center">
      <span className="hangtag mx-auto w-fit rounded-full bg-sage/20 px-3 py-1 text-sage">
        Order confirmed
      </span>
      <h1 className="mt-4 font-display text-3xl text-ink">Thank you{order ? `, ${order.customer.fullName.split(" ")[0]}` : ""}.</h1>
      <p className="mt-3 text-ink/70">
        Your order {order && <span className="font-mono text-sm">#{order._id.slice(-6)}</span>} is
        confirmed and on its way to being packed with care.
      </p>
      {order && (
        <p className="mt-2 hangtag inline-block rounded border border-ink/20 px-3 py-1.5 text-ink">
          Total paid: ${order.totalAmount.toFixed(2)}
        </p>
      )}
      <div className="mt-8">
        <Link to="/products" className="rounded-full bg-ink px-6 py-3 text-sm text-bone">
          Keep browsing
        </Link>
      </div>
    </div>
  );
}

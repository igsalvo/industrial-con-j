"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, ChevronLeft, ChevronRight, Minus, Plus, ShoppingCart, Trash2, X } from "lucide-react";
import { ProductPhotoSlider } from "@/components/sections/product-photo-slider";
import { trackEvent } from "@/lib/analytics";

type Product = {
  id: string;
  name: string;
  photoUrl: string | null;
  photoUrls?: unknown;
  photoPositionX?: string | null;
  photoPositionY?: string | null;
  description: string;
  price: unknown;
  ctaLink: string | null;
};

type CartItem = Product & {
  quantity: number;
};

function formatPrice(price: unknown) {
  const value = Number(price);
  if (!Number.isFinite(value)) {
    return null;
  }

  return `$${value.toLocaleString("es-CL")}`;
}

export function ProductQuoteCarousel({ products }: { products: Product[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const totalAmount = cartItems.reduce((total, item) => {
    const price = Number(item.price);
    return Number.isFinite(price) ? total + price * item.quantity : total;
  }, 0);
  const formattedTotal = formatPrice(totalAmount);

  useEffect(() => {
    try {
      const storedItems = JSON.parse(window.localStorage.getItem("tiendiita-cart") || "[]") as CartItem[];
      if (Array.isArray(storedItems)) {
        setCartItems(storedItems.filter((item) => item && typeof item.id === "string" && Number(item.quantity) > 0));
      }
    } catch {
      setCartItems([]);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("tiendiita-cart", JSON.stringify(cartItems));
    window.dispatchEvent(new CustomEvent("tiendiita-cart-updated"));
  }, [cartItems]);

  useEffect(() => {
    const toggleCart = () => setCartOpen((isOpen) => !isOpen);
    window.addEventListener("tiendiita-cart-toggle", toggleCart);
    return () => window.removeEventListener("tiendiita-cart-toggle", toggleCart);
  }, []);

  const trackProducts = useMemo(() => {
    if (products.length <= 4) {
      return products;
    }

    return products.map((_, index) => products[(activeIndex + index) % products.length]);
  }, [activeIndex, products]);

  function move(offset: number) {
    if (products.length < 2) {
      return;
    }

    setActiveIndex((current) => (current + offset + products.length) % products.length);
  }

  function addToCart(product: Product) {
    trackEvent("click_tiendita", {
      link_text: "Agregar al carrito",
      content_type: "product",
      content_title: product.name,
      section: "tiendita_products"
    });
    setCartItems((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        return current.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
      }

      return [...current, { ...product, quantity: 1 }];
    });
    setCartOpen(true);
    setStatus("idle");
    setMessage("");
  }

  function removeFromCart(productId: string) {
    setCartItems((current) => current.filter((item) => item.id !== productId));
  }

  function updateQuantity(productId: string, nextQuantity: number) {
    setCartItems((current) =>
      current
        .map((item) => (item.id === productId ? { ...item, quantity: Math.max(0, nextQuantity) } : item))
        .filter((item) => item.quantity > 0)
    );
    setStatus("idle");
    setMessage("");
  }

  async function submitQuote(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    trackEvent("click_tiendita", {
      link_text: "Cotizar",
      content_type: "quote",
      content_title: cartItems.map((item) => item.name).join(", "),
      section: "tiendita_quote"
    });
    setStatus("submitting");
    setMessage("");

    if (cartItems.length === 0) {
      setStatus("error");
      setMessage("Agrega al menos un producto para cotizar.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/tiendiita/quote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        note: formData.get("note"),
        items: cartItems.map((item) => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: Number(item.price)
        }))
      })
    });
    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      setStatus("error");
      setMessage(payload.error || "No se pudo enviar la cotización.");
      return;
    }

    event.currentTarget.reset();
    setCartItems([]);
    setStatus("success");
    setMessage(payload.message || "Cotización enviada.");
  }

  if (products.length === 0) {
    return <p className="rounded-2xl border border-[color:var(--line)] p-5 text-sm text-[color:var(--muted)]">No hay productos publicados por ahora.</p>;
  }

  return (
    <section className="relative space-y-5">
      {cartOpen ? (
        <aside className="ml-auto max-w-xl rounded-2xl border border-white/10 bg-[#181a19] p-5 shadow-[0_20px_70px_rgba(0,0,0,0.35)]">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-black">Carrito de cotización</h2>
            <button type="button" className="btn-secondary !bg-transparent !p-2" onClick={() => setCartOpen(false)} aria-label="Cerrar carrito">
              <X size={18} />
            </button>
          </div>

          <div className="mt-5 space-y-3">
            {cartItems.length ? (
              cartItems.map((item) => (
                <div key={item.id} className="grid gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-4 sm:grid-cols-[1fr_auto] sm:items-center">
                  <div>
                    <p className="font-bold">{item.name}</p>
                    <p className="mt-1 text-sm text-[color:var(--muted)]">{formatPrice(item.price) || "Precio por confirmar"}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button type="button" className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-white/75 hover:text-[color:var(--accent)]" onClick={() => updateQuantity(item.id, item.quantity - 1)} aria-label={`Disminuir cantidad de ${item.name}`}>
                      <Minus size={15} />
                    </button>
                    <input
                      className="field h-10 w-16 px-2 text-center"
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(event) => updateQuantity(item.id, Number(event.target.value) || 0)}
                      aria-label={`Cantidad de ${item.name}`}
                    />
                    <button type="button" className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-white/75 hover:text-[color:var(--accent)]" onClick={() => updateQuantity(item.id, item.quantity + 1)} aria-label={`Aumentar cantidad de ${item.name}`}>
                      <Plus size={15} />
                    </button>
                    <button type="button" className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-white/75 hover:text-[color:var(--accent)]" onClick={() => removeFromCart(item.id)} aria-label={`Eliminar ${item.name}`}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="rounded-xl border border-white/10 p-4 text-sm text-[color:var(--muted)]">Tu carrito está vacío.</p>
            )}
          </div>

          <form onSubmit={submitQuote} className="mt-5 space-y-3">
            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--muted)]">Monto a cotizar</p>
              <p className="mt-2 text-2xl font-black">{formattedTotal || "$0"}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <input className="field" name="name" placeholder="Nombre" required />
              <input className="field" name="email" type="email" placeholder="Correo" required />
            </div>
            <textarea className="field min-h-24" name="note" placeholder="Mensaje opcional" />
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <button className="btn-primary gap-2" type="submit" disabled={status === "submitting" || cartItems.length === 0}>
                {status === "submitting" ? "Enviando..." : "Cotizar"}
                <CheckCircle2 size={17} />
              </button>
              {message ? <p className={`text-sm ${status === "error" ? "text-red-400" : "text-[color:var(--muted)]"}`}>{message}</p> : null}
            </div>
          </form>
        </aside>
      ) : null}

      <div className="flex items-center justify-between gap-3">
        <button type="button" className="btn-secondary !bg-transparent !p-3" onClick={() => move(-1)} disabled={products.length < 2} aria-label="Productos anteriores">
          <ChevronLeft size={20} />
        </button>
        <div className="flex gap-2">
          {products.map((product, index) => (
            <button
              key={product.id}
              type="button"
              className={`h-2 rounded-full transition ${index === activeIndex ? "w-7 bg-[color:var(--accent)]" : "w-2 bg-white/35"}`}
              onClick={() => setActiveIndex(index)}
              aria-label={`Ver producto ${index + 1}`}
            />
          ))}
        </div>
        <button type="button" className="btn-secondary !bg-transparent !p-3" onClick={() => move(1)} disabled={products.length < 2} aria-label="Productos siguientes">
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {trackProducts.slice(0, 4).map((product) => {
          const extraPhotos = Array.isArray(product.photoUrls) ? product.photoUrls.filter((photo): photo is string => typeof photo === "string" && photo.length > 0) : [];
          const photos = [product.photoUrl, ...extraPhotos].filter((photo): photo is string => Boolean(photo));
          const objectPosition = `${product.photoPositionX || "center"} ${product.photoPositionY || "center"}`;
          const price = formatPrice(product.price);

          return (
            <article key={product.id} className="card flex h-full min-w-0 flex-col overflow-hidden">
              <ProductPhotoSlider name={product.name} photos={photos} objectPosition={objectPosition} />
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-2xl font-bold leading-tight">{product.name}</h3>
                <p className="mt-3 line-clamp-4 text-sm leading-6 text-[color:var(--muted)]">{product.description}</p>
                {price ? <p className="mt-5 text-xl font-black">{price}</p> : null}
                <button type="button" className="btn-primary mt-auto w-full gap-2" onClick={() => addToCart(product)}>
                  Agregar al carrito
                  <ShoppingCart size={16} />
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

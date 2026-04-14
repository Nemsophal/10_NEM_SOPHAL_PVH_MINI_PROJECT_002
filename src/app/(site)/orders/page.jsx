"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.accessToken) {
      fetchOrders();
    }
  }, [session]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/orders", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

       const data = await response.json();

       // Transform API orders to include order date as Date object and ensure numeric values
       const transformedOrders = (data.orders || []).map((order) => ({
         ...order,
         orderDate: new Date(order.orderDate),
         total: typeof order.total === "string" ? parseFloat(order.total) : order.total,
         subtotal: typeof order.subtotal === "string" ? parseFloat(order.subtotal) : order.subtotal,
         shipping: typeof order.shipping === "string" ? parseFloat(order.shipping) : order.shipping,
         items: (order.items || []).map((item) => ({
           ...item,
           price: typeof item.price === "string" ? parseFloat(item.price) : item.price,
           subtotal: typeof item.subtotal === "string" ? parseFloat(item.subtotal) : item.subtotal,
         })),
       }));

       setOrders(transformedOrders);
      console.log("[Orders Page] Loaded", transformedOrders.length, "orders");
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-8">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-lime-400"></div>
            <p className="text-gray-600">Loading orders...</p>
          </div>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-6">
            <Link
              href="/"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              ← Back to Home
            </Link>
          </div>
          <h1 className="text-4xl font-bold text-gray-900">Ordered products</h1>
          <p className="mt-2 text-lg text-gray-600">
            {orders.length} order{orders.length !== 1 ? "s" : ""} from your account.
          </p>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-sm">
            <p className="text-gray-500">No orders found.</p>
            <Link
              href="/products"
              className="mt-4 inline-flex rounded-full bg-lime-400 px-6 py-2 text-sm font-semibold text-gray-900 transition hover:bg-lime-300"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md"
              >
                {/* Order Header */}
                <div className="border-b border-gray-100 p-6">
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-medium uppercase text-gray-500">Order</p>
                        <p className="text-lg font-bold text-gray-900">#{order.id}</p>
                      </div>
                      <div className="flex gap-8">
                        <div>
                          <p className="text-xs font-medium uppercase text-gray-500">User ID</p>
                          <p className="text-sm font-mono text-gray-700">{order.userId}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium uppercase text-gray-500">Line items</p>
                          <p className="text-sm font-semibold text-gray-900">{order.lineItems}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-4">
                      <div className="text-right">
                        <p className="text-xs font-medium uppercase text-gray-500">Order date</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {order.orderDate.toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric"
                          })}
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          setExpandedOrder(expandedOrder === order.id ? null : order.id)
                        }
                        className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 text-gray-600 transition hover:bg-gray-200"
                        aria-label="Toggle order details"
                      >
                        <svg
                          className={`h-6 w-6 transition-transform ${
                            expandedOrder === order.id ? "rotate-180" : ""
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 14l-7 7m0 0l-7-7m7 7V3"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Order Total */}
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 sm:hidden">
                  <span className="text-sm font-medium text-gray-600">Total</span>
                  <span className="text-2xl font-bold text-gray-900">
                    ${order.total.toFixed(2)}
                  </span>
                </div>

                <div className="hidden items-center justify-between border-b border-gray-100 px-6 py-4 sm:flex">
                  <span className="text-sm font-medium text-gray-600">Total</span>
                  <span className="text-2xl font-bold text-gray-900">
                    ${order.total.toFixed(2)}
                  </span>
                </div>

                {/* Order Details - Expandable */}
                {expandedOrder === order.id && (
                  <div className="border-t border-gray-100 p-6">
                    <h3 className="mb-6 text-lg font-semibold text-gray-900">Order Details</h3>
                    <div className="space-y-4">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex gap-4 rounded-lg border border-gray-100 p-4"
                        >
                          {/* Product Image */}
                          <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                              onError={(e) => {
                                e.currentTarget.src =
                                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23f3f4f6' width='100' height='100'/%3E%3Ctext x='50' y='50' font-size='40' fill='%23d1d5db' text-anchor='middle' dominant-baseline='central'%3E◇%3C/text%3E%3C/svg%3E";
                              }}
                            />
                          </div>

                          {/* Product Info */}
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">{item.name}</p>
                            <p className="mt-1 text-sm text-gray-600">Qty {item.quantity}</p>
                            <p className="mt-2 text-sm font-medium text-gray-900">
                              ${item.price.toFixed(2)} each
                            </p>
                          </div>

                          {/* Item Total */}
                          <div className="text-right">
                            <p className="text-lg font-bold text-gray-900">
                              ${item.subtotal.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}

                      {/* Order Summary */}
                      <div className="mt-6 border-t border-gray-100 pt-4">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Subtotal:</span>
                          <span className="font-semibold text-gray-900">
                            ${order.total.toFixed(2)}
                          </span>
                        </div>
                        <div className="mt-2 flex justify-between">
                          <span className="text-gray-600">Shipping:</span>
                          <span className="font-semibold text-gray-900">Free</span>
                        </div>
                        <div className="mt-4 flex justify-between border-t border-gray-100 pt-4">
                          <span className="font-semibold text-gray-900">Order Total:</span>
                          <span className="text-xl font-bold text-lime-400">
                            ${order.total.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-6 flex gap-3">
                        <button className="flex-1 rounded-lg bg-gray-100 px-4 py-2.5 text-sm font-semibold text-gray-900 transition hover:bg-gray-200">
                          Download Invoice
                        </button>
                        <Link
                          href="/products"
                          className="flex-1 rounded-lg bg-lime-400 px-4 py-2.5 text-center text-sm font-semibold text-gray-900 transition hover:bg-lime-300"
                        >
                          Shop Again
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}



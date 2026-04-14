"use client";

import { useState } from "react";
import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cart.store";
import { toast } from "sonner";

export default function ProductDetailPage({ params }) {
  const unwrappedParams = use(params);
  const productId = unwrappedParams?.productId || "tea-trica-bha-foam";
  const [selectedColor, setSelectedColor] = useState("green");
  const [selectedSize, setSelectedSize] = useState("m");
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const addItem = useCartStore((state) => state.addItem);

  const mockProduct = {
    productId: productId,
    productName: "Tea-Trica BHA Foam",
    price: 100.0,
    originalPrice: 114.0,
    rating: 5,
    description: "A deep cleansing foam with BHA and Tea tree unclogs pores and exfoliates dead skin cells, leaving a refreshed finish.",
    imageUrl: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=800&fit=crop",
    colors: [
      { name: "green", label: "Green" },
      { name: "gray", label: "Gray" },
    ],
    sizes: [
      { name: "s", label: "S (50ml)" },
      { name: "m", label: "M (100ml)" },
      { name: "l", label: "L (200ml)" },
    ],
  };

  const handleAddToCart = async () => {
    try {
      setIsAdding(true);

      if (!addItem) {
        toast.error("Cart system error");
        return;
      }

      const cartProduct = {
        productId: productId || "tea-trica-bha-foam",
        productName: `Tea-Trica BHA Foam - ${selectedColor} (${selectedSize})`,
        price: 100.0,
        imageUrl: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=800&fit=crop",
        brand: "CENTELLA",
        selectedColor,
        selectedSize,
      };

      for (let i = 0; i < quantity; i++) {
        addItem(cartProduct);
      }

      toast.success(`${quantity}x Tea-Trica BHA Foam added to cart!`);
      setQuantity(1);
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add item to cart");
    } finally {
      setIsAdding(false);
    }
  };

  const handleQuantityChange = (action) => {
    if (action === "increment") {
      setQuantity((prev) => prev + 1);
    } else if (action === "decrement" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link href="/products" className="text-sm text-gray-600 hover:text-gray-900">
          ← Back to Products
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="flex items-center justify-center rounded-2xl bg-gray-100 p-8">
          <div className="relative aspect-square w-full max-w-96 overflow-hidden rounded-xl">
            <Image
              src={mockProduct.imageUrl}
              alt={mockProduct.productName}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        <div className="flex flex-col justify-start">
          <div className="mb-6">
            <div className="flex items-center justify-between gap-4">
              <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                {mockProduct.productName}
              </h1>
              <div className="flex items-center gap-1 text-2xl">
                {Array.from({ length: mockProduct.rating }).map((_, i) => (
                  <span key={i} className="text-yellow-400">
                    ★
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-4xl font-bold text-blue-600">
                ${mockProduct.price.toFixed(2)}
              </span>
              <span className="text-lg text-gray-400 line-through">
                ${mockProduct.originalPrice.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="mb-8 space-y-6 border-t border-b border-gray-200 py-6">
            <div>
              <label className="mb-3 block text-sm font-semibold text-gray-900">
                Choose a color
              </label>
              <div className="flex gap-3">
                {mockProduct.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      selectedColor === color.name
                        ? "bg-lime-400 text-gray-900 ring-2 ring-lime-400 ring-offset-2"
                        : "border border-gray-300 text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    {color.label}
                  </button>
                ))}
              </div>
              {selectedColor && (
                <p className="mt-2 text-xs text-gray-500">
                  Selected: {selectedColor}
                </p>
              )}
            </div>

            <div>
              <label className="mb-3 block text-sm font-semibold text-gray-900">
                Choose a size
              </label>
              <div className="flex gap-3">
                {mockProduct.sizes.map((size) => (
                  <button
                    key={size.name}
                    onClick={() => setSelectedSize(size.name)}
                    className={`rounded-full px-6 py-2 text-sm font-medium transition ${
                      selectedSize === size.name
                        ? "border-2 border-blue-600 bg-blue-50 text-blue-600"
                        : "border border-gray-300 text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <p className="mb-8 leading-relaxed text-gray-600">
            {mockProduct.description}
          </p>

          <div className="mb-6 flex items-center gap-4">
            <div className="flex items-center rounded-full border border-gray-300">
              <button
                onClick={() => handleQuantityChange("decrement")}
                className="px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                −
              </button>
              <span className="px-4 py-2 font-semibold text-gray-900">
                {quantity}
              </span>
              <button
                onClick={() => handleQuantityChange("increment")}
                className="px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className="flex-1 flex items-center justify-center gap-2 rounded-full bg-blue-900 px-8 py-3 font-semibold text-white transition hover:bg-blue-800 disabled:opacity-50"
            >
              <span>🛍️</span>
              Add to cart
            </button>
          </div>

          <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
            <div className="flex items-start gap-3">
              <span className="text-2xl">↩️</span>
              <div>
                <p className="font-semibold text-gray-900">
                  Free 30-day returns
                </p>
                <p className="mt-1 text-sm text-gray-600">
                  See return policy details in cart.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}







import React from "react";
import Link from "next/link";
import ProductCardComponent from "../ProductCardComponent";
import Image from "next/image";

export default function LandingBestSellerSectionComponent({ items = [] }) {
  if (items.length === 0) {
    return (
      <section className="mx-auto w-full max-w-7xl py-16 lg:py-20">
        <div className="overflow-hidden rounded-2xl bg-gray-900 shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            <div className="relative h-96 lg:h-full min-h-96 bg-gray-800 overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=500&fit=crop"
                alt="Featured skincare product"
                fill
                className="object-cover hover:scale-105 transition duration-500"
              />
            </div>

            <div className="flex flex-col items-start justify-center p-8 lg:p-12">
              <p className="text-sm font-semibold uppercase tracking-widest text-lime-400 mb-4">
                OUR BEST SELLERS
              </p>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Discover Our Most Loved Products
              </h2>
              <p className="text-lg text-gray-300 mb-8 max-w-md">
                Explore the skincare, makeup, and fragrance products that our customers love the most.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Link
                  href="/login"
                  className="rounded-full bg-lime-400 px-8 py-3 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-lime-300 text-center"
                >
                  View Best Sellers
                </Link>
                <Link
                  href="/register"
                  className="rounded-full border border-gray-400 px-8 py-3 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10 text-center"
                >
                  Create Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-7xl py-16 lg:py-20">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
            Best selling products
          </h2>
          <p className="mt-2 text-gray-500">
            Tap + to add — state syncs with your cart in the header.
          </p>
        </div>
      </div>
      <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-6">
        {items.map((product, index) => (
          <ProductCardComponent product={product} key={index} />
        ))}
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import Link from "next/link";
import ProductCardComponent from "../ProductCardComponent";
import Image from "next/image";

const ESSENTIALS_TABS = ["All", "Moisturizer", "Serum", "Cleanser", "Toner"];
const PAGE_SIZE = 8;

function filterByTab(list, tab) {
    if (tab === "All") return list;
    const key = tab.toLowerCase();
    return list.filter(
        (p) => p.essentialsTag === key || p.categoryName?.toLowerCase() === key
    );
}

export default function LandingEssentialsGrid({ products = [] }) {
    const [tab, setTab] = useState("All");
    const [showAll, setShowAll] = useState(false);

    if (products.length === 0) {
        return (
            <section id="shop" className="mx-auto w-full max-w-7xl py-16 lg:py-20">
                <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900 to-blue-800 shadow-lg">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                        <div className="relative h-96 lg:h-full min-h-96 bg-blue-800 overflow-hidden order-2 lg:order-1">
                            <Image
                                src="https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=500&fit=crop"
                                alt="Skincare essentials collection"
                                fill
                                className="object-cover hover:scale-105 transition duration-500"
                            />
                        </div>

                        <div className="flex flex-col items-start justify-center p-8 lg:p-12 order-1 lg:order-2">
                            <p className="text-sm font-semibold uppercase tracking-widest text-lime-400 mb-4">
                                SKINCARE ESSENTIALS
                            </p>
                            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                                Build Your Perfect Routine
                            </h2>
                            <p className="text-lg text-blue-100 mb-8 max-w-md">
                                Explore our curated collection organized by routine step. Find everything you need for beautiful skin.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                                <Link
                                    href="/login"
                                    className="rounded-full bg-lime-400 px-8 py-3 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-lime-300 text-center"
                                >
                                    Browse Essentials
                                </Link>
                                <Link
                                    href="/register"
                                    className="rounded-full border border-gray-300 px-8 py-3 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10 text-center"
                                >
                                    Create Free Account
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    const filtered = filterByTab(products, tab);
    const visible = showAll ? filtered : filtered.slice(0, PAGE_SIZE);
    const canLoadMore = !showAll && filtered.length > PAGE_SIZE;

    return (
        <section id="shop" className="mx-auto w-full max-w-7xl py-16 lg:py-20">
            <div className="flex flex-col items-center text-center">
                <h2 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
                    Our skincare essentials
                </h2>
                <p className="mt-2 max-w-lg text-gray-500">
                    Filter by routine step — organized for quick discovery.
                </p>
            </div>

            <div
                className="mt-10 flex flex-wrap justify-center gap-2"
                role="tablist"
                aria-label="Product categories"
            >
                {ESSENTIALS_TABS.map((label) => {
                    const on = tab === label;
                    return (
                        <Button
                            key={label}
                            role="tab"
                            aria-selected={on}
                            onPress={() => { setTab(label); setShowAll(false); }}
                            className={`rounded-full px-5 py-2.5 text-sm font-medium transition ${
                                on ? "bg-lime-400 text-gray-900 shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                        >
                            {label}
                        </Button>
                    );
                })}
            </div>

            <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
                {visible.map((product) => (
                    <ProductCardComponent product={product} key={product.productId ?? product.id} />
                ))}
            </div>

            {filtered.length === 0 && (
                <p className="mt-12 text-center text-gray-500">No products in this tab &mdash; try &quot;All&quot;.</p>
            )}

            {canLoadMore && (
                <div className="mt-12 flex justify-center">
                    <Button
                        variant="secondary"
                        onPress={() => setShowAll(true)}
                        className="rounded-full border border-gray-200 bg-white px-10 py-3 text-sm font-semibold text-gray-800 shadow-sm transition hover:border-gray-300 hover:bg-gray-50"
                    >
                        Load more
                    </Button>
                </div>
            )}
        </section>
    );
}

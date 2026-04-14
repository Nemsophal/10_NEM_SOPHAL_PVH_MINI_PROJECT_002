"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import ShopCardComponent from "../../../components/shop/ShopCardComponent";

function Skeleton() {
    return (
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm animate-pulse">
                        <div className="aspect-square bg-gray-100" />
                        <div className="flex flex-col gap-2 p-4">
                            <div className="h-3 w-3/4 rounded bg-gray-200" />
                            <div className="h-3 w-1/2 rounded bg-gray-200" />
                            <div className="mt-2 h-8 rounded-xl bg-gray-200" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function ProductsPage() {
    const { status } = useSession();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (status === "loading") return;
        if (status !== "authenticated") {
            setLoading(false);
            return;
        }

        let isMounted = true;

        const fetchProducts = async () => {
            setLoading(true);
            setError(null);

            console.log("[Products] Fetching from /api/products");

            try {
                const res = await fetch("/api/products");
                console.log("[Products] Response status:", res.status);
                const data = await res.json();
                console.log("[Products] Response data:", data);
                if (!isMounted) return;
                if (data.error) {
                    throw new Error(data.error);
                }
                const productList = Array.isArray(data.products) ? data.products : [];
                console.log("[Products] Setting products count:", productList.length);
                setProducts(productList);
            } catch (err) {
                console.error("[Products] Error:", err);
                if (isMounted) setError(err.message);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchProducts();

        return () => {
            isMounted = false;
        };
    }, [status]);

    if (status === "loading" || loading) return <Skeleton />;

    if (error) {
        return (
            <div className="mx-auto max-w-7xl px-4 py-16 text-center">
                <p className="text-red-600">Error loading products: {error}</p>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <h1 className="mb-8 text-3xl font-semibold tracking-tight text-gray-900">Shop All Products</h1>
            {products.length === 0 ? (
                <p className="text-gray-500">No products found.</p>
            ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    {products.map((product) => (
                        <ShopCardComponent key={product.productId ?? product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
}

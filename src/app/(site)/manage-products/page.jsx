"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

function EditIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
      />
    </svg>
  );
}

function DeleteIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    </svg>
  );
}

export default function ManageProductsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [sortBy, setSortBy] = useState("name-asc");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.accessToken) {
      fetchProducts();
    }
  }, [session]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/products", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      setDeleting(productId);
      setProducts(products.filter((p) => p.productId !== productId));
      toast.success("Product deleted successfully");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
      setDeleting(null);
    }
  };

  const getSortedProducts = () => {
    const sorted = [...products];
    switch (sortBy) {
      case "name-asc":
        return sorted.sort((a, b) => a.productName.localeCompare(b.productName));
      case "name-desc":
        return sorted.sort((a, b) => b.productName.localeCompare(a.productName));
      case "price-asc":
        return sorted.sort((a, b) => a.price - b.price);
      case "price-desc":
        return sorted.sort((a, b) => b.price - a.price);
      default:
        return sorted;
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-8">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-lime-400"></div>
            <p className="text-gray-600">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  const sortedProducts = getSortedProducts();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Manage Products
            </h1>
            <p className="mt-2 text-gray-600">
              Create, update, and delete products in this demo (local state only).
            </p>
          </div>
          <Link
            href="/manage-products/create"
            className="inline-flex items-center justify-center rounded-full bg-lime-400 px-6 py-3 font-semibold text-gray-900 transition hover:bg-lime-300"
          >
            + Create product
          </Link>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Products</h2>
              <div>
                <label htmlFor="sort" className="mr-3 text-sm text-gray-600">
                  Sort
                </label>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 transition hover:border-gray-300"
                >
                  <option value="name-asc">Name (A-Z)</option>
                  <option value="name-desc">Name (Z-A)</option>
                  <option value="price-asc">Price (Low to High)</option>
                  <option value="price-desc">Price (High to Low)</option>
                </select>
              </div>
            </div>
          </div>

          {sortedProducts.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-500">No products found. Create your first product!</p>
              <Link
                href="/manage-products/create"
                className="mt-4 inline-flex rounded-full bg-lime-400 px-6 py-2 text-sm font-semibold text-gray-900 transition hover:bg-lime-300"
              >
                Create product
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 p-6 md:grid-cols-4 lg:gap-6">
              {sortedProducts.map((product) => (
               <div
                   key={product.productId}
                   className="group relative rounded-xl border border-gray-100 bg-white transition hover:shadow-md"
                 >
                   <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
                     {product.imageUrl ? (
                       <Image
                         src={product.imageUrl}
                         alt={product.productName || "Product image"}
                         fill
                         sizes="(max-width: 768px) 50vw, 25vw"
                         className="object-cover transition group-hover:scale-[1.02]"
                       />
                     ) : (
                       <div className="flex h-full items-center justify-center bg-gradient-to-br from-gray-100 to-lime-50/30 text-4xl text-gray-300">
                         ◇
                       </div>
                     )}

                     <div className="absolute right-3 top-3 flex gap-2 rounded-lg bg-white/95 p-2 shadow-md transition opacity-0 group-hover:opacity-100 backdrop-blur-sm">
                      <button
                        onClick={() =>
                          router.push(`/manage-products/${product.productId}/edit`)
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-md bg-blue-50 text-blue-600 transition hover:bg-blue-100 hover:text-blue-700 active:bg-blue-200"
                        title="Edit product"
                      >
                        <EditIcon />
                      </button>
                      <button
                        onClick={() => handleDelete(product.productId)}
                        disabled={deleting === product.productId}
                        className="flex h-9 w-9 items-center justify-center rounded-md bg-red-50 text-red-600 transition hover:bg-red-100 hover:text-red-700 active:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Delete product"
                      >
                        <DeleteIcon />
                      </button>
                    </div>
                   </div>

                   <div className="p-4">
                     <h3 className="line-clamp-2 text-sm font-semibold text-gray-900">
                       {product.productName}
                     </h3>
                     <p className="mt-2 text-base font-semibold text-gray-900">
                       ${product.price}
                     </p>
                   </div>

                   <div className="border-t border-gray-100 px-4 py-3 flex gap-2">
                    <button
                      onClick={() =>
                        router.push(`/manage-products/${product.productId}/edit`)
                      }
                      className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-blue-50 px-3 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-100 hover:text-blue-700 active:bg-blue-200"
                    >
                      <EditIcon />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(product.productId)}
                      disabled={deleting === product.productId}
                      className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100 hover:text-red-700 active:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <DeleteIcon />
                      <span>{deleting === product.productId ? "Deleting..." : "Delete"}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}






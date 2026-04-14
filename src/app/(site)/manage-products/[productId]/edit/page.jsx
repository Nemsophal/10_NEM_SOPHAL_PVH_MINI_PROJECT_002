"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";

export default function EditProductPage({ params }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const productId = unwrappedParams?.productId;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    imageUrl: "",
    colors: [],
    sizes: [],
    categoryId: "",
  });

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/products/${productId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }

        const data = await response.json();
        const product = data.product || data;

        setFormData({
          name: product.name || "Sample Product",
          price: product.price?.toString() || "0",
          description: product.description || "",
          imageUrl: product.imageUrl || "",
          colors: product.colors || [],
          sizes: product.sizes || [],
          categoryId: product.categoryId || "",
        });
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to load product");
        setFormData({
          name: "Sample Product",
          price: "0",
          description: "",
          imageUrl: "",
          colors: [],
          sizes: [],
          categoryId: "",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.price) {
      toast.error("Product name and price are required");
      return;
    }

    try {
      setSaving(true);
      const response = await fetch(`/api/products/manage`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: productId,
          name: formData.name,
          price: parseFloat(formData.price),
          description: formData.description,
          imageUrl: formData.imageUrl,
          colors: formData.colors || [],
          sizes: formData.sizes || [],
          categoryId: formData.categoryId || "",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update product");
      }

      toast.success("Product updated successfully!");
      router.push("/manage-products");
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error(error.message || "Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto w-full max-w-2xl px-4 py-8">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-lime-400"></div>
              <p className="text-gray-600">Loading product...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/manage-products"
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            ← Back to Products
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">Edit Product</h1>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="productName" className="block text-sm font-medium text-gray-900">
                Product Name *
              </label>
              <input
                type="text"
                id="productName"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 transition focus:border-lime-400 focus:outline-none focus:ring-2 focus:ring-lime-400/20"
                placeholder="e.g., T-Shirt"
              />
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-900">
                Price ($) *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                step="0.01"
                min="0"
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 transition focus:border-lime-400 focus:outline-none focus:ring-2 focus:ring-lime-400/20"
                placeholder="0.00"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-900">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 transition focus:border-lime-400 focus:outline-none focus:ring-2 focus:ring-lime-400/20"
                placeholder="Add a detailed description of your product..."
              />
            </div>

            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-900">
                Image URL
              </label>
              <input
                type="url"
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 transition focus:border-lime-400 focus:outline-none focus:ring-2 focus:ring-lime-400/20"
                placeholder="https://example.com/image.jpg"
              />
              {formData.imageUrl && (
                <div className="mt-3 aspect-square w-32 overflow-hidden rounded-lg bg-gray-100">
                  <Image
                    src={formData.imageUrl}
                    alt="Preview"
                    width={128}
                    height={128}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23f3f4f6' width='100' height='100'/%3E%3Ctext x='50' y='50' font-size='40' fill='%23d1d5db' text-anchor='middle' dominant-baseline='central'%3E◇%3C/text%3E%3C/svg%3E";
                    }}
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 rounded-lg bg-lime-400 px-4 py-3 font-semibold text-gray-900 transition hover:bg-lime-300 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <Link
                href="/manage-products"
                className="flex-1 rounded-lg border border-gray-200 px-4 py-3 text-center font-semibold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}




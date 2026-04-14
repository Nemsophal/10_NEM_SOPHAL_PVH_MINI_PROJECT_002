"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";

const COLORS = ["green", "gray", "red", "blue", "white"];
const SIZES = ["s", "m", "l", "xl", "xxl", "xxxl"];

// Create/Edit Product Modal
function ProductModal({ isOpen, onClose, onSubmit, initialData = null }) {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    imageUrl: "",
    colors: [],
    sizes: [],
    description: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: "",
        price: "",
        category: "",
        imageUrl: "",
        colors: [],
        sizes: [],
        description: "",
      });
    }
  }, [initialData, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleColorChange = (color) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter((c) => c !== color)
        : [...prev.colors, color],
    }));
  };

  const handleSizeChange = (size) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.price) {
      toast.error("Name and price are required");
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {initialData ? "Edit product" : "Create product"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <p className="mb-6 text-sm text-gray-600">
          Demo CRUD only (local state). Refresh resets changes.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name and Price Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-lime-400 focus:outline-none focus:ring-2 focus:ring-lime-400/20"
                placeholder="Kérastase"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900">
                Price
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                step="0.01"
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-lime-400 focus:outline-none focus:ring-2 focus:ring-lime-400/20"
                placeholder="64.00"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-900">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-lime-400 focus:outline-none focus:ring-2 focus:ring-lime-400/20"
            >
              <option value="">Select...</option>
              <option value="skincare">Skincare</option>
              <option value="makeup">Makeup</option>
              <option value="haircare">Haircare</option>
              <option value="fragrance">Fragrance</option>
            </select>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-gray-900">
              Image URL (optional)
            </label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleInputChange}
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-lime-400 focus:outline-none focus:ring-2 focus:ring-lime-400/20"
              placeholder="https://example.com/image.jpg"
            />
            {formData.imageUrl && (
              <div className="mt-3 h-20 w-20 overflow-hidden rounded-lg bg-gray-100">
                <Image
                  src={formData.imageUrl}
                  alt="Preview"
                  width={80}
                  height={80}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23f3f4f6' width='100' height='100'/%3E%3Ctext x='50' y='50' font-size='40' fill='%23d1d5db' text-anchor='middle' dominant-baseline='central'%3E◇%3C/text%3E%3C/svg%3E";
                  }}
                />
              </div>
            )}
          </div>

          {/* Colors */}
          <div>
            <label className="block text-sm font-medium text-gray-900">
              Colors
            </label>
            <div className="mt-3 flex flex-wrap gap-4">
              {COLORS.map((color) => (
                <label key={color} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.colors.includes(color)}
                    onChange={() => handleColorChange(color)}
                    className="h-4 w-4 rounded border-gray-300 text-lime-400"
                  />
                  <span className="text-sm text-gray-700 capitalize">
                    {color}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div>
            <label className="block text-sm font-medium text-gray-900">
              Sizes
            </label>
            <div className="mt-3 flex flex-wrap gap-4">
              {SIZES.map((size) => (
                <label key={size} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.sizes.includes(size)}
                    onChange={() => handleSizeChange(size)}
                    className="h-4 w-4 rounded border-gray-300 text-lime-400"
                  />
                  <span className="text-sm text-gray-700 uppercase">{size}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-900">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-lime-400 focus:outline-none focus:ring-2 focus:ring-lime-400/20"
              placeholder="Short description shown on the product card..."
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-full border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-full bg-lime-400 px-6 py-3 font-semibold text-gray-900 transition hover:bg-lime-300 disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : initialData
                  ? "Save changes"
                  : "Create product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Delete Confirmation Modal
function DeleteConfirmModal({ isOpen, onClose, onConfirm, productName }) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-6 flex items-center justify-center">
          <div className="rounded-full bg-red-50 p-4">
            <svg
              className="h-8 w-8 text-red-600"
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
          </div>
        </div>

        <h3 className="mb-3 text-center text-xl font-bold text-gray-900">
          Delete product?
        </h3>
        <p className="mb-6 text-center text-gray-600">
          Are you sure you want to delete <strong>{productName}</strong>? This
          action cannot be undone.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 rounded-full border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 rounded-full bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

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
  const [sortBy, setSortBy] = useState("name-asc");

  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState(null);

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

  const handleCreateProduct = async (formData) => {
    try {
      const response = await fetch("/api/products/manage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          price: parseFloat(formData.price),
          description: formData.description,
          imageUrl: formData.imageUrl,
          colors: formData.colors,
          sizes: formData.sizes,
          categoryId: formData.category,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create product");
      }

      const data = await response.json();
      setProducts([data.product, ...products]);
      toast.success("Product created successfully!");
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error(error.message || "Failed to create product");
      throw error;
    }
  };

  const handleEditProduct = async (formData) => {
    if (!editingProduct) return;

    try {
      const response = await fetch("/api/products/manage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingProduct.id || editingProduct.productId,
          name: formData.name,
          price: parseFloat(formData.price),
          description: formData.description,
          imageUrl: formData.imageUrl,
          colors: formData.colors,
          sizes: formData.sizes,
          categoryId: formData.category,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update product");
      }

      const data = await response.json();
      setProducts(
        products.map((p) =>
          (p.id === editingProduct.id || p.productId === editingProduct.id)
            ? data.product
            : p
        )
      );
      toast.success("Product updated successfully!");
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error(error.message || "Failed to update product");
      throw error;
    }
  };

  const handleDeleteProduct = async () => {
    if (!deletingProduct) return;

    try {
      const response = await fetch(
        `/api/products/manage?id=${deletingProduct.id || deletingProduct.productId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete product");
      }

      setProducts(
        products.filter(
          (p) =>
            p.id !== deletingProduct.id && p.productId !== deletingProduct.id
        )
      );
      toast.success("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error(error.message || "Failed to delete product");
      throw error;
    }
  };

  const getSortedProducts = () => {
    const sorted = [...products];
    switch (sortBy) {
      case "name-asc":
        return sorted.sort((a, b) => {
          const nameA = a.name || a.productName || "";
          const nameB = b.name || b.productName || "";
          return nameA.localeCompare(nameB);
        });
      case "name-desc":
        return sorted.sort((a, b) => {
          const nameA = a.name || a.productName || "";
          const nameB = b.name || b.productName || "";
          return nameB.localeCompare(nameA);
        });
      case "price-asc":
        return sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
      case "price-desc":
        return sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
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
          <button
            onClick={() => setCreateModalOpen(true)}
            className="inline-flex items-center justify-center rounded-full bg-lime-400 px-6 py-3 font-semibold text-gray-900 transition hover:bg-lime-300"
          >
            + Create product
          </button>
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
              <button
                onClick={() => setCreateModalOpen(true)}
                className="mt-4 inline-flex rounded-full bg-lime-400 px-6 py-2 text-sm font-semibold text-gray-900 transition hover:bg-lime-300"
              >
                Create product
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 p-6 md:grid-cols-4 lg:gap-6">
              {sortedProducts.map((product) => (
                <div
                  key={product.id || product.productId}
                  className="group relative rounded-xl border border-gray-100 bg-white transition hover:shadow-md"
                >
                  <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
                    {product.imageUrl ? (
                      <Image
                        src={product.imageUrl}
                        alt={product.name || product.productName || "Product"}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover transition group-hover:scale-[1.02]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gradient-to-br from-gray-100 to-lime-50/30 text-4xl text-gray-300">
                        ◇
                      </div>
                    )}

                    <div className="absolute right-3 top-3 flex gap-2 rounded-lg bg-white/95 p-2 shadow-md backdrop-blur-sm transition opacity-0 group-hover:opacity-100">
                      <button
                        onClick={() => {
                          setEditingProduct(product);
                          setEditModalOpen(true);
                        }}
                        className="flex h-9 w-9 items-center justify-center rounded-md bg-blue-50 text-blue-600 transition hover:bg-blue-100"
                        title="Edit product"
                      >
                        <EditIcon />
                      </button>
                      <button
                        onClick={() => {
                          setDeletingProduct(product);
                          setDeleteModalOpen(true);
                        }}
                        className="flex h-9 w-9 items-center justify-center rounded-md bg-red-50 text-red-600 transition hover:bg-red-100"
                        title="Delete product"
                      >
                        <DeleteIcon />
                      </button>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="line-clamp-2 text-sm font-semibold text-gray-900">
                      {product.name || product.productName}
                    </h3>
                    <p className="mt-2 text-base font-semibold text-gray-900">
                      ${product.price}
                    </p>
                  </div>

                  <div className="border-t border-gray-100 px-4 py-3 flex gap-2">
                    <button
                      onClick={() => {
                        setEditingProduct(product);
                        setEditModalOpen(true);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-blue-50 px-3 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-100"
                    >
                      <EditIcon />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => {
                        setDeletingProduct(product);
                        setDeleteModalOpen(true);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                    >
                      <DeleteIcon />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <ProductModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateProduct}
      />

      <ProductModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setEditingProduct(null);
        }}
        onSubmit={handleEditProduct}
        initialData={
          editingProduct
            ? {
                name: editingProduct.name || editingProduct.productName,
                price: editingProduct.price?.toString() || "",
                category: editingProduct.categoryId || "",
                imageUrl: editingProduct.imageUrl || "",
                colors: editingProduct.colors || [],
                sizes: editingProduct.sizes || [],
                description: editingProduct.description || "",
              }
            : null
        }
      />

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setDeletingProduct(null);
        }}
        onConfirm={handleDeleteProduct}
        productName={deletingProduct?.name || deletingProduct?.productName}
      />
    </div>
  );
}


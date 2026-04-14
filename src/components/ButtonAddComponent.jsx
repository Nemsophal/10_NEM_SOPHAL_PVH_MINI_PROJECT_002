'use client'

import { Button } from "@heroui/react";
import { toast } from "sonner";
import { useCartStore } from "@/store/cart.store";
import { useState } from "react";

export default function ButtonAddComponent({ product }) {
  const [isLoading, setIsLoading] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = async () => {
    if (!product) {
      toast.error("Product information missing");
      return;
    }

    setIsLoading(true);
    try {
      addItem(product);
      toast.success(`${product.productName} added to cart!`);
    } catch (error) {
      toast.error("Failed to add item to cart");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      isIconOnly
      isLoading={isLoading}
      onPress={handleAddToCart}
      aria-label="Add to cart"
      className={`size-11 rounded-full bg-lime-400 text-xl font-light text-gray-900 shadow-sm transition hover:bg-lime-300 active:scale-95`}
    >
      +
    </Button>
  );
}

"use client";

import { useCartStore } from "@/store/cart.store";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@heroui/react";
import { toast } from "sonner";

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const getTotalItems = useCartStore((state) => state.getTotalItems);
  const clearCart = useCartStore((state) => state.clearCart);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Shopping Cart</h1>
          <p className="mt-4 text-gray-500">Your cart is empty</p>
          <Link
            href="/products"
            className="mt-6 inline-flex rounded-full bg-lime-400 px-6 py-3 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-lime-300"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const handleRemove = (productId) => {
    removeItem(productId);
    toast.success("Item removed from cart");
  };

  const handleQuantityChange = (productId, quantity) => {
    updateQuantity(productId, parseInt(quantity));
  };

  const handleCheckout = async () => {
    try {
      toast.success("Proceeding to checkout...");
    } catch (error) {
      toast.error("Checkout failed. Please try again.");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Shopping Cart</h1>

       <div className="mt-12 grid gap-8 lg:grid-cols-3">
         <div className="lg:col-span-2">
           <div className="space-y-6">
             {items.map((item) => (
               <div
                 key={item.productId}
                 className="flex gap-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
               >
                 <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.productName}
                      width={96}
                      height={96}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-400">◇</div>
                  )}
                 </div>

                 <div className="flex flex-1 flex-col gap-3">
                   <div>
                     <h3 className="font-semibold text-gray-900">{item.productName}</h3>
                     <p className="text-sm text-gray-500">{item.brand}</p>
                   </div>

                   <div className="flex items-center justify-between">
                     <span className="text-lg font-semibold text-gray-900">${item.price}</span>

                     <select
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.productId, e.target.value)}
                      className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
                    >
                      {Array.from({ length: 10 }, (_, i) => i + 1).map((qty) => (
                        <option key={qty} value={qty}>
                          Qty: {qty}
                        </option>
                       ))}
                     </select>

                     <button
                       onClick={() => handleRemove(item.productId)}
                       className="text-sm font-medium text-red-600 transition hover:text-red-700"
                     >
                       Remove
                     </button>
                  </div>

                  <div className="text-sm font-semibold text-gray-900">
                    Total: ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
           </div>

           <button
             onClick={clearCart}
             className="mt-8 text-sm font-medium text-gray-600 transition hover:text-gray-900"
           >
             Clear Cart
           </button>
         </div>

         <div className="h-fit rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>

          <div className="mt-6 space-y-4 border-b border-gray-200 pb-6">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium text-gray-900">${getTotalPrice()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium text-gray-900">Free</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax</span>
              <span className="font-medium text-gray-900">Calculated at checkout</span>
            </div>
          </div>

          <div className="mt-6 flex justify-between">
            <span className="text-lg font-semibold text-gray-900">Total</span>
            <span className="text-lg font-semibold text-gray-900">${getTotalPrice()}</span>
          </div>

          <Button
            onPress={handleCheckout}
            className="mt-8 w-full rounded-full bg-lime-400 py-3 font-semibold text-gray-900 shadow-sm transition hover:bg-lime-300"
          >
            Proceed to Checkout
          </Button>

          <Link
            href="/products"
            className="mt-4 block text-center text-sm font-medium text-gray-600 transition hover:text-gray-900"
          >
            Continue Shopping
          </Link>
        </div>
       </div>

       <div className="mt-12 rounded-xl border border-gray-100 bg-gray-50 p-6">
         <p className="text-sm text-gray-600">
           <span className="font-semibold text-gray-900">{getTotalItems()}</span> items in cart • Total:{" "}
           <span className="font-semibold text-gray-900">${getTotalPrice()}</span>
         </p>
       </div>
     </div>
   );
}


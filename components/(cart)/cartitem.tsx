"use client";

import { useState } from "react";
import { useCart } from "../context/cartcontext";

interface CartItemProps {
  cartItem: {
    productId: string;
    model: string;
    price: number;
    thumbnail: string;
    title: string;
  };
}

export function CartItem({ cartItem }: CartItemProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { deleteAnItemFromCart, orderDetails } = useCart();
  const { productId, model, price, thumbnail, title } = cartItem;

  const handleDeleteItem = async () => {
    await deleteAnItemFromCart(productId, setIsLoading);
  };

  return (
    <li
      className={`flex items-center justify-between bg-white dark:bg-gray-800 shadow-sm rounded-xl p-4 transition-all duration-300 ${
        isLoading ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100"></div>
        <div className="flex flex-col">
          <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200">{title}</h4>
          <p className="text-xs text-gray-500">{model}</p>
          <div className="mt-2 flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">₹{price}</p>
          </div>
        </div>
      </div>

      {!orderDetails?._id && (
        <button
          onClick={handleDeleteItem}
          className="text-gray-500 hover:text-red-500 text-xl font-bold transition-colors"
          aria-label="Remove item"
        >
          &times;
        </button>
      )}
    </li>
  );
}

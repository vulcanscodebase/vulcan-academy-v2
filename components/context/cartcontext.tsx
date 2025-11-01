"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { toast } from "react-toastify";
import { useAuth } from "./authcontext";
import {
  addItemToCartApi,
  deleteItemFromCartApi,
  getCartApi,
} from "../api/cartApi";
import { requestHandler } from "@/utils/auth";

interface CartItem {
  productId: string;
  model: string;
  quantity: number;
}

interface Cart {
  items: CartItem[];
}

interface OrderDetails {
  _id?: string; // normalized id for Razorpay
  [key: string]: any;
}

interface CartContextType {
  isCartOpen: boolean;
  setIsCartOpen: (value: boolean) => void;
  loadingCart: boolean;
  cart: Cart | null;
  orderDetails: OrderDetails;
  isCartEmpty: () => boolean;
  isItemInCart: (itemId: string) => boolean;
  getTotalItems: () => number;
  setOrderDetails: (details: OrderDetails) => void;
  getCartItems: () => Promise<void>;
  addItemToCart: (productId: string, model: string, qty: number, setIsLoading?: (val: boolean) => void) => Promise<void>;
  deleteAnItemFromCart: (productId: string, setIsLoading?: (val: boolean) => void) => Promise<void>;
}

const CartContext = createContext<CartContextType>({} as CartContextType);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState<Cart | null>(null);
  const [orderDetails, setOrderDetailsState] = useState<OrderDetails>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("orderDetails");
      return stored ? JSON.parse(stored) : {};
    }
    return {};
  });
  const [loadingCart, setLoadingCart] = useState(false);
  const { token } = useAuth();

  // Persist orderDetails to localStorage
  const setOrderDetails = (details: OrderDetails) => {
    const normalized = {
      ...details,
      _id: details._id || details.orderId, // normalize id
    };
    setOrderDetailsState(normalized);
    if (typeof window !== "undefined") {
      localStorage.setItem("orderDetails", JSON.stringify(normalized));
    }
  };

  const isCartEmpty = () => !cart?.items?.length || cart.items.length === 0;
  const getTotalItems = () => cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;
  const isItemInCart = (itemId: string) => !!cart?.items?.find((item) => item.productId === itemId);

  const getCartItems = async () => {
    await requestHandler(
      getCartApi,
      setLoadingCart,
      (res) => setCart(res.cart),
      () => setCart({ items: [] })
    );
  };

  const addItemToCart = async (productId: string, model: string, qty: number, setIsLoading?: (val: boolean) => void) => {
    const data = { productId, model, quantity: qty };
    await requestHandler(
      () => addItemToCartApi(data),
      setIsLoading || setLoadingCart,
      (res) => {
        toast.success(res.message);
        getCartItems();
      },
      (errMsg) => toast.error(errMsg || "Error adding item to cart")
    );
  };

  const deleteAnItemFromCart = async (productId: string, setIsLoading?: (val: boolean) => void) => {
    await requestHandler(
      () => deleteItemFromCartApi(productId),
      setIsLoading || setLoadingCart,
      (res) => {
        toast.success(res.message);
        setCart(res.cart);
      },
      (errMsg) => toast.error(errMsg || "Error deleting item")
    );
  };

  useEffect(() => {
    if (token) getCartItems();
    else setCart(null);
  }, [token]);

  return (
    <CartContext.Provider
      value={{
        isCartOpen,
        setIsCartOpen,
        loadingCart,
        cart,
        orderDetails,
        isCartEmpty,
        isItemInCart,
        getTotalItems,
        setOrderDetails,
        getCartItems,
        addItemToCart,
        deleteAnItemFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

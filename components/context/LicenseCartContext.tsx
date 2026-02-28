"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface LicenseCartContextType {
  licensesInCart: number;
  isLicenseCartOpen: boolean;
  addLicenses: (qty?: number) => void;
  removeLicenses: (qty?: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
}

const LicenseCartContext = createContext<LicenseCartContextType | undefined>(undefined);

export const LicenseCartProvider = ({ children }: { children: ReactNode }) => {
  const [licensesInCart, setLicensesInCart] = useState<number>(0);
  const [isLicenseCartOpen, setIsLicenseCartOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Load cart from local storage on mount
  useEffect(() => {
    setIsMounted(true);
    const storedCart = localStorage.getItem("interview_license_cart");
    if (storedCart) {
      setLicensesInCart(parseInt(storedCart, 10));
    }
  }, []);

  // Save cart to local storage whenever it changes (only after mount)
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("interview_license_cart", licensesInCart.toString());
    }
  }, [licensesInCart, isMounted]);

  const addLicenses = (qty = 1) => {
    setLicensesInCart((prev) => prev + qty);
  };

  const removeLicenses = (qty = 1) => {
    setLicensesInCart((prev) => {
      const newQty = prev - qty;
      return newQty > 0 ? newQty : 0;
    });
  };

  const clearCart = () => {
    setLicensesInCart(0);
  };

  const toggleCart = () => {
    setIsLicenseCartOpen((prev) => !prev);
  };

  return (
    <LicenseCartContext.Provider
      value={{
        licensesInCart,
        isLicenseCartOpen,
        addLicenses,
        removeLicenses,
        clearCart,
        toggleCart,
      }}
    >
      {children}
    </LicenseCartContext.Provider>
  );
};

export const useLicenseCart = () => {
  const context = useContext(LicenseCartContext);
  if (context === undefined) {
    throw new Error("useLicenseCart must be used within a LicenseCartProvider");
  }
  return context;
};

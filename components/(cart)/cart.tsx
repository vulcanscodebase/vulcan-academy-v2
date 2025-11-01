"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../context/cartcontext";
import { useAuth } from "../context/authcontext";
import { requestHandler } from "@/utils/auth";
import { createOrderApi, getOrderDetailsApi } from "../api/orderApi";
import { toast } from "react-toastify";
import { Loader2, X } from "lucide-react";
import { CartItem } from "./cartitem";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";




const Cart = () => {
  const { user, setIsMenuOpen } = useAuth();
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    isCartEmpty,
    getCartItems,
    setOrderDetails,
    orderDetails
  } = useCart();

  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const router = useRouter();
  const cartRef = useRef<HTMLDivElement | null>(null);

  console.log("order details ",orderDetails)
  // Disable background scroll when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.classList.add("overflow-hidden");
    }else{
       document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isCartOpen]);

  //  Close cart when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setIsCartOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setIsCartOpen]);

  // Fetch items when cart opens
  useEffect(() => {
    if (isCartOpen) {
      getCartItems();
    }
  }, [isCartOpen]);

const handleGetOrderDetails = async (orderId: string) => {
  await requestHandler(
    async () => await getOrderDetailsApi(orderId),
    setLoadingCheckout,
    (res) => {
      setOrderDetails({
        ...res.order,
        _id: res.order?._id || res.order?.orderId,
      });
      getCartItems();
      router.push("/checkout");
      setIsCartOpen(false);
      setIsMenuOpen(false);
    },
    (errMsg) => {
      toast.error(errMsg);
    }
  );
};


  const handleCheckoutClick = async () => {
    if (!user) {
      router.push("/signin");
      return;
    }

    await requestHandler(
      async () => await createOrderApi(),
      setLoadingCheckout,
      (res) => {
        handleGetOrderDetails(res?.orderId);
      },
      (errMsg) => toast.error(errMsg)
    );
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-end bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            ref={cartRef}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
            className="h-full w-full sm:w-[400px] bg-white dark:bg-gray-900 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <CardHeader className="flex flex-row items-center justify-between border-b px-4 py-3">
              <CardTitle className="text-xl font-semibold">Your Cart</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCartOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </CardHeader>

            {/* Cart Content */}
            <CardContent className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
              {cart?.items?.length ? (
                cart.items?.map((item) => (
                  <CartItem key={item.productId} cartItem={item} />
                ))
              ) : (
                <p className="text-center text-gray-500 py-10">
                   Your cart is empty
                </p>
              )}
            </CardContent>

            {/* Footer */}
            <CardFooter className="border-t flex flex-col gap-3 px-4 py-3">
              <div className="flex justify-between text-lg font-medium">
                <span>Subtotal:</span>
                <span>₹{cart?.totalPrice || 0}</span>
              </div>

              <Button
                className="w-full bg-vulcan-accent-blue hover:bg-vulcan-accent-blue/90"
                onClick={handleCheckoutClick}
                disabled={isCartEmpty() || loadingCheckout}
              >
                {loadingCheckout ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  "Proceed to Checkout"
                )}
              </Button>
            </CardFooter>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Cart;

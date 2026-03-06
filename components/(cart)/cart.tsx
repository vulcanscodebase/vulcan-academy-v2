"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../context/cartcontext";
import { useAuth } from "../context/authcontext";
import { requestHandler } from "@/utils/auth";
import { createOrderApi, getOrderDetailsApi, applyCouponApi, initiateRazorPePaymentApi } from "../api/orderApi";
import { apiClient } from "../api";
import { toast } from "react-toastify";
import { Loader2, X, Tag } from "lucide-react";
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

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountAmount: number;
    discountType: string;
    discountValue: number;
  } | null>(null);

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

  // Reset coupon when cart changes
  useEffect(() => {
    if (appliedCoupon && cart?.totalPrice) {
      // Re-validate if subtotal changed
      handleValidateCoupon(appliedCoupon.code);
    }
  }, [cart?.totalPrice]);

  const handleValidateCoupon = async (code?: string) => {
    const codeToValidate = code || couponCode;
    if (!codeToValidate.trim()) return;

    try {
      setCouponLoading(true);
      const { data } = await apiClient.post("/orders/validate-coupon", {
        couponCode: codeToValidate,
        subtotal: cart?.totalPrice || 0,
      });

      if (data.success) {
        setAppliedCoupon({
          code: data.couponCode,
          discountAmount: data.discountAmount,
          discountType: data.discountType,
          discountValue: data.discountValue,
        });
        setCouponCode(data.couponCode);
        if (!code) toast.success("Coupon applied successfully!");
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Invalid coupon code";
      toast.error(msg);
      setAppliedCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    toast.info("Coupon removed.");
  };

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleCheckoutClick = async () => {
    if (!user) {
      router.push("/signin");
      return;
    }

    try {
      setLoadingCheckout(true);

      // Step 1: Create order from cart
      const createRes = await createOrderApi();
      const orderId = createRes.data?.orderId;
      if (!orderId) {
        toast.error("Failed to create order.");
        return;
      }

      // Step 2: Apply coupon if validated
      if (appliedCoupon) {
        try {
          await applyCouponApi(orderId, appliedCoupon.code);
        } catch (err) {
          console.error("Failed to apply coupon:", err);
        }
      }

      // Step 3: Initiate Razorpay payment
      const { data } = await initiateRazorPePaymentApi(orderId);

      const options = {
        key: "rzp_live_Lnv1KYLHzu92PM",
        amount: data?.order?.amount,
        currency: "INR",
        name: "Vulcans Academy",
        description: "Course Purchase",
        order_id: data?.order?.id,
        handler: function (response: any) {
          const payload = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          };

          apiClient
            .post("/orders/razorpay-callback", payload)
            .then(() => {
              toast.success("Payment successful!");
              setAppliedCoupon(null);
              setCouponCode("");
              getCartItems();
              setIsCartOpen(false);
              router.push("/user-profile");
            })
            .catch(() => toast.error("Payment verification failed"));
        },
        prefill: {
          name: (user as any)?.name || "",
          email: (user as any)?.email || "",
        },
        theme: { color: "#3399cc" },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
      setIsCartOpen(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || "Error processing payment.");
    } finally {
      setLoadingCheckout(false);
    }
  };

  const subtotal = cart?.totalPrice || 0;
  const discount = appliedCoupon?.discountAmount || 0;
  const totalToPay = Math.max(0, subtotal - discount);

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
              <CardTitle className="text-xl font-semibold">Shopping Cart</CardTitle>
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
              {/* Coupon Input */}
              {cart && (
                <div className="w-full">
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-700 font-medium">
                          {appliedCoupon.code}
                        </span>
                        <span className="text-xs text-green-600">
                          (-₹{appliedCoupon.discountAmount})
                        </span>
                      </div>
                      <button
                        onClick={handleRemoveCoupon}
                        className="text-red-500 hover:text-red-700 text-lg font-bold leading-none"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="Coupon code"
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleValidateCoupon();
                          }
                        }}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleValidateCoupon()}
                        disabled={!couponCode.trim() || couponLoading}
                        className="px-4"
                      >
                        {couponLoading ? (
                          <Loader2 className="animate-spin h-4 w-4" />
                        ) : (
                          "Apply"
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Price Summary */}
              <div className="w-full space-y-1">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Subtotal ({cart?.items?.length || 0} item{(cart?.items?.length || 0) !== 1 ? "s" : ""})</span>
                  <span>₹{subtotal}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold pt-1 border-t">
                  <span>Total to Pay</span>
                  <span className="text-vulcan-accent-blue">₹{totalToPay}</span>
                </div>
              </div>

              <Button
                className="w-full bg-vulcan-accent-blue hover:bg-vulcan-accent-blue/90"
                onClick={handleCheckoutClick}
                disabled={isCartEmpty() || loadingCheckout}
              >
                {loadingCheckout ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                    <>Proceed to Pay <span className="ml-2 bg-white/20 px-2 py-0.5 rounded text-sm">₹{totalToPay}</span></>
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


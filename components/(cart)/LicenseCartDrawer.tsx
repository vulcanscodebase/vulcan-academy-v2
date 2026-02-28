"use client";

import { useLicenseCart } from "../context/LicenseCartContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2, Plus, Minus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useAuth } from "../context/authcontext";
import { useRouter } from "next/navigation";
import { initiatePaymentApi, verifyPaymentApi } from "@/components/api/paymentApi";

export const LicenseCartDrawer = () => {
  const { isLicenseCartOpen, toggleCart, licensesInCart, addLicenses, removeLicenses, clearCart } = useLicenseCart();
  const { user } = useAuth();
  const router = useRouter();

  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const PRICE_PER_LICENSE = 349; // Simplified fixed price for now

  // Mount Razorpay Checkout SDK
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Handle Checkout Click
  const handleProceedToPay = async () => {
    if (licensesInCart === 0) return;

    if (!user) {
      toast.info("Please sign in to proceed with your purchase", {
        position: "top-center"
      });
      toggleCart();
      router.push("/signin");
      return;
    }

    setLoadingCheckout(true);
    try {
      // Step 1: Initiate payment via backend
      const res = await initiatePaymentApi(licensesInCart);
      
      if (!res.data.success) {
        throw new Error("Failed to initiate checkout");
      }

      const { orderId, amount, currency, key } = res.data.data;

      // Step 2: Open Razorpay interface
      const options = {
        key: key,
        amount: amount,
        currency: currency,
        name: "Vulcans Academy",
        description: "Interview Licenses Purchase",
        order_id: orderId,
        handler: async function (response: any) {
          try {
            const verifyRes = await verifyPaymentApi({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.data.success) {
              toast.success(`Payment successful! ${licensesInCart} licenses added to your account.`);
              clearCart();
              toggleCart();
              router.refresh(); // Refresh page to reflect new licenses count
            } else {
              toast.error("Payment verification failed.");
            }
          } catch (err: any) {
            console.error("Verification error:", err);
            toast.error("Payment verification failed.");
          }
        },
        prefill: {
          name: (user as any)?.name || "",
          email: (user as any)?.email || "",
          contact: (undefined as any)?.phone || "9999999999",
        },
        theme: {
          color: "#0d6efd", // vulcan-accent-blue approx
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        toast.error(`Payment failed: ${response.error.description}`);
      });
      
      // CLOSE THE CART OUT OF THE WAY BEFORE MOUNTING RAZORPAY!
      toggleCart();
      
      rzp.open();

    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong during checkout.");
    } finally {
      setLoadingCheckout(false);
    }
  };

  const calculateSubtotal = () => {
    return licensesInCart * PRICE_PER_LICENSE;
  };

  return (
    <Sheet open={isLicenseCartOpen} onOpenChange={toggleCart}>
      <SheetContent className="w-full sm:max-w-md bg-white border-l shadow-2xl flex flex-col p-0">
        <SheetHeader className="p-6 border-b border-gray-100 flex-shrink-0">
          <SheetTitle className="text-xl font-bold text-vulcan-primary">Shopping Cart</SheetTitle>
        </SheetHeader>

        {/* CART CONTENT - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
          {licensesInCart > 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex flex-col gap-4 relative overflow-hidden group transition-all duration-300 hover:shadow-md hover:border-vulcan-accent-blue/30">
              
              <div className="flex flex-col gap-1 py-1">
                <h4 className="font-bold text-vulcan-primary text-lg">Vulcan Prep 360</h4>
                <p className="text-sm text-slate-500 font-medium">Interview License</p>
                
                <div className="mt-3">
                  <span className="text-xl font-bold text-vulcan-primary">
                    ₹{PRICE_PER_LICENSE} <span className="text-sm font-normal text-slate-400">/ each</span>
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                <div className="flex items-center border rounded-md shadow-sm h-8 bg-gray-50">
                  <button 
                    onClick={() => removeLicenses(1)}
                    className="h-full px-2 text-gray-500 hover:text-vulcan-accent-blue hover:bg-white transition-colors rounded-l-md"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center text-sm font-medium text-vulcan-primary bg-white h-full flex items-center justify-center border-x">
                    {licensesInCart}
                  </span>
                  <button 
                    onClick={() => addLicenses(1)}
                    className="h-full px-2 text-gray-500 hover:text-vulcan-accent-blue hover:bg-white transition-colors rounded-r-md"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                
                <button 
                  onClick={() => clearCart()}
                  className="text-gray-400 hover:text-red-500 transition-colors p-1"
                  aria-label="Remove item"
                >
                  <Trash2 size={16} />
                </button>
              </div>

            </div>
          ) : (
             <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2">
               <h3 className="text-lg font-medium text-vulcan-primary">Your cart is empty</h3>
               <p className="text-gray-500 text-sm max-w-[200px]">Looks like you haven't added any interview licenses yet.</p>
             </div>
          )}
        </div>

        {/* CART FOOTER - Fixed Bottom */}
        <div className="p-6 bg-white border-t border-gray-100 flex-shrink-0 shadow-[0_-4px_20px_-15px_rgba(0,0,0,0.1)]">
           <div className="space-y-4 mb-6">
             <div className="flex justify-between items-center text-sm text-gray-600">
               <span>Subtotal ({licensesInCart} item{licensesInCart !== 1 && 's'})</span>
               <span className="font-medium text-vulcan-primary">₹{calculateSubtotal()}</span>
             </div>
             
             <div className="flex justify-between items-center text-lg font-bold">
               <span className="text-vulcan-primary">Total to Pay</span>
               <span className="text-vulcan-accent-blue">₹{calculateSubtotal()}</span>
             </div>
           </div>

           <Button 
             className="w-full bg-vulcan-accent-blue hover:bg-vulcan-primary text-white h-12 text-base font-medium shadow-md transition-all duration-300 group"
             disabled={licensesInCart === 0 || loadingCheckout}
             onClick={handleProceedToPay}
           >
             {loadingCheckout ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </span>
             ) : (
                <span className="flex items-center justify-center gap-2 w-full">
                  Proceed to Pay
                  <span className="bg-white/20 px-2 py-0.5 rounded text-sm min-w-16 whitespace-nowrap">
                    ₹{calculateSubtotal()}
                  </span>
                </span>
             )}
           </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

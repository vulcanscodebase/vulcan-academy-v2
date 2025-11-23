"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CartItem } from "./cartitem";
import { useCart } from "../context/cartcontext";
import { initiateRazorPePaymentApi } from "../api/orderApi";
import { toast } from "react-toastify";
import { apiClient } from "../api";
import { Loader } from "../ui/loader";
import { Coupon } from "./coupon";

export function Checkout() {
  const { orderDetails, setOrderDetails } = useCart();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Load Razorpay script
    const loadScript = (src: string) => {
      return new Promise<boolean>((resolve) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });
    };
    loadScript("https://checkout.razorpay.com/v1/checkout.js");
  }, []);

  useEffect(() => {
    if (!orderDetails?._id) {
      // try to restore from localStorage
      const stored = localStorage.getItem("orderDetails");
      if (stored) setOrderDetails(JSON.parse(stored));
      else router.push("/");
    }
  }, []);

  const handlePaymentCheckout = async () => {
    try {
      setLoading(true);
      const orderId = orderDetails?._id || orderDetails?.orderId;
      if (!orderId) {
        toast.error("Order ID is missing.");
        return;
      }

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
              router.push("/user-dash");
            })
            .catch(() => toast.error("Payment verification failed"));
        },
        prefill: {
          name: orderDetails.user?.name || "",
          email: orderDetails.user?.email || "",
          contact: orderDetails.user?.phone || "",
        },
        theme: { color: "#3399cc" },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      toast.error(err?.message || "Error initiating payment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-2xl p-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Order Summary</h1>

        <ul className="divide-y divide-gray-200 mb-6">
          {orderDetails?.items?.map((item: any) => (
            <CartItem key={item.productId} cartItem={item} />
          ))}
        </ul>
        
        <Coupon />

        <div className="mt-6 space-y-3 text-gray-700">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>Rs. {orderDetails?.subtotal || 0}</span>
          </div>
          <div className="flex justify-between">
            <span>Discount</span>
            <span>Rs. {orderDetails?.discount || 0}</span>
          </div>
          <div className="flex justify-between">
            <span>Taxes</span>
            <span>Rs. {orderDetails?.tax || 0}</span>
          </div>
          <div className="border-t pt-3 flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span>Rs. {Math.round(orderDetails?.totalPrice) || 0}</span>
          </div>
        </div>

        <button
          onClick={handlePaymentCheckout}
          disabled={orderDetails?.items?.length === 0 || loading}
          className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium disabled:opacity-50"
        >
          {loading ? <Loader /> : "Continue to Pay"}
        </button>
      </div>
    </section>
  );
}

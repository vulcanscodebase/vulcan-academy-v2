"use client";

import { useState, FormEvent } from "react";
import { toast } from "react-toastify";
import { requestHandler } from "@/utils/auth";
import { applyCouponApi } from "../api/orderApi";
import { useCart } from "../context/cartcontext";
import { Loader } from "../ui/loader";

export function Coupon() {
  const [appliedCoupon, setAppliedCoupon] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [couponBtnLoading, setCouponBtnLoading] = useState(false);

  const { orderDetails, setOrderDetails } = useCart();

  const handleApplyCoupon = async (e: FormEvent) => {
    e.preventDefault();
    if (!couponCode) 
      return;
    // console.log("Order Details before applying coupon:", orderDetails);

    await requestHandler(
      async () => await applyCouponApi(orderDetails._id, couponCode),
      setCouponBtnLoading,
      (res: any) => {
        setAppliedCoupon(true);
        setOrderDetails((prev: any) => ({
          ...prev,
          _id: res.orderId,
          ...res,
        }));
        toast.success("Coupon applied successfully!");
      },
      (errMsg: string) => {
        toast.error(errMsg || "Error applying coupon.");
        setAppliedCoupon(false);
      }
    );
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(false);
    setCouponCode("");
    setOrderDetails((prev: any) => ({
      ...prev,
      couponApplied: null,
      discount: 0,
    }));
    toast.info("Coupon removed.");
  };

  return (
    <div className="bg-gray-50 border rounded-xl p-4 mt-4 shadow-sm">
      {appliedCoupon ? (
        <div className="flex items-center justify-between bg-green-50 border border-green-300 rounded-lg p-3">
          <p className="text-green-700 text-sm">
            The Coupon{" "}
            <span className="font-semibold">
              {orderDetails?.couponApplied}
            </span>{" "}
            applied successfully!
          </p>
          <button
            onClick={handleRemoveCoupon}
            title="Remove coupon"
            className="text-red-500 hover:text-red-700 text-lg font-bold"
          >
            &times;
          </button>
        </div>
      ) : (
        <>
          <div
            onClick={() => setIsAccordionOpen(!isAccordionOpen)}
            className="flex items-center justify-between cursor-pointer"
          >
            <span className="font-medium text-gray-700">Coupon Code</span>
            <button className="text-gray-500">
              {isAccordionOpen ? "▲" : "▼"}
            </button>
          </div>

          {isAccordionOpen && (
            <form
              onSubmit={(e) => handleApplyCoupon(e)}
              className="flex items-center gap-2 mt-3"
            >
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter coupon code"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={!couponCode || couponBtnLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
              >
                {couponBtnLoading ? <Loader /> : "Apply"}
              </button>
            </form>
          )}
        </>
      )}
    </div>
  );
}

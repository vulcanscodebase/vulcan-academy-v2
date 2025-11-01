"use client";

import { Checkout } from "@/components/(cart)/checkout";

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-4">
        <Checkout />
      </div>
    </main>
  );
}

"use client";

import { useAuth } from "../context/authcontext";
import { useLicenseCart } from "../context/LicenseCartContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, ShoppingCart, History, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getUserTransactionsApi } from "../api/paymentApi";
import { requestHandler } from "@/utils/auth";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export function CreditsDashboard() {
  const { user } = useAuth();
  const { toggleCart, addLicenses } = useLicenseCart();
  
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecent = async () => {
      await requestHandler(
        async () => await getUserTransactionsApi(1, 4),
        setLoading,
        (res) => {
          setRecentTransactions(res.data || []);
        }
      );
    };
    fetchRecent();
  }, []);

  const balance = (user as any)?.licenses || 0;

  return (
    <div className="max-w-5xl mx-auto pt-10 pb-16 px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-vulcan-primary">Overview</h1>
          <p className="text-gray-500 mt-1">Manage your interview licenses and view recent activity.</p>
        </div>
        <Button 
          onClick={() => {
            addLicenses(1);
            toggleCart();
          }}
          className="bg-vulcan-accent-blue hover:bg-vulcan-primary text-white shadow-md transition-all gap-2"
        >
          <ShoppingCart className="w-4 h-4" />
          Buy More Licenses
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Balance Card */}
        <Card className="md:col-span-1 shadow-sm border-gray-100 bg-gradient-to-br from-white to-blue-50/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-vulcan-accent-blue" />
              Available Licenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold text-vulcan-primary">
              {balance}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Valid for Vulcan Prep 360 AI Interviews
            </p>
          </CardContent>
        </Card>

        {/* Quick Help Card */}
        <Card className="md:col-span-2 shadow-sm border-gray-100 flex flex-col justify-center bg-vulcan-deep-navy text-white relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-vulcan-accent-blue/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <CardHeader>
            <CardTitle className="text-lg">Need to prepare for an interview?</CardTitle>
            <CardDescription className="text-gray-300">
              Each license grants you full access to a complete AI mock interview session with personalized rubrics and detailed ATS feedback.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/interview/upload">
              <Button variant="secondary" className="bg-white text-slate-900 hover:bg-gray-100 border-0 font-medium z-10 relative">
                Start Interview
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Mini-Table */}
      <h2 className="text-xl font-bold text-vulcan-primary mb-4 flex items-center gap-2">
        <History className="w-5 h-5" />
        Recent Activity
      </h2>
      <Card className="shadow-sm border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : recentTransactions.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No transaction history found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50/80 text-gray-500 font-medium">
                <tr>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4">Amount Paid</th>
                  <th className="px-6 py-4 text-right">Credits Adjusted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {recentTransactions.map((tx: any) => (
                  <tr key={tx._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                      {format(new Date(tx.createdAt), "MMM d, yyyy h:mm a")}
                    </td>
                    <td className="px-6 py-4 font-medium text-vulcan-primary">
                      {tx.reason}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {tx.amount > 0 ? `₹${tx.amount.toLocaleString()}` : "-"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        tx.type === "CREDIT" || tx.amount > 0 
                          ? "bg-green-50 text-green-700" 
                          : "bg-red-50 text-red-700"
                      }`}>
                        {(tx.type === "CREDIT" || tx.amount > 0) ? "+" : "-"}{Math.abs(tx.balanceAfter - (tx.balanceAfter - (tx.amount > 0 ? tx.amount/349 : 1))) || 1}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 text-right">
          <Link href="/user-dash/transactions" className="text-sm font-medium text-vulcan-accent-blue hover:text-vulcan-primary transition-colors">
            View full history &rarr;
          </Link>
        </div>
      </Card>
    </div>
  );
}

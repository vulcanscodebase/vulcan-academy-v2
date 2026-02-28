"use client";

import { useEffect, useState } from "react";
import { getUserTransactionsApi } from "../api/paymentApi";
import { requestHandler } from "@/utils/auth";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Receipt, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export function TransactionsHistory() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTransactions = async (pageNumber: number) => {
    await requestHandler(
      async () => await getUserTransactionsApi(pageNumber, 15),
      setLoading,
      (res) => {
        setTransactions(res.data || []);
        setTotalPages(res.pagination?.pages || 1);
      }
    );
  };

  useEffect(() => {
    fetchTransactions(page);
  }, [page]);

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-16 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Transaction History</h1>
          <p className="text-gray-500 mt-2">View your complete credit ledger, including purchases and interview usage.</p>
        </div>

        <Card className="shadow-lg border-gray-200/50 bg-white/90 backdrop-blur-xl min-h-[400px] rounded-2xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center p-20">
              <Loader2 className="w-8 h-8 animate-spin text-vulcan-accent-blue" />
            </div>
          ) : transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-20 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex justify-center items-center text-gray-400 mb-4">
                <Receipt className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold text-vulcan-primary">No Transactions Yet</h3>
              <p className="text-gray-500 mt-1 max-w-sm">
                Your credit history will appear here once you purchase licenses or complete an interview session.
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50/80 text-gray-500 font-medium border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4">Transaction Date</th>
                      <th className="px-6 py-4">Description</th>
                      <th className="px-6 py-4">Status & Action</th>
                      <th className="px-6 py-4 text-right">Balance Impact</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {transactions.map((tx: any) => (
                      <tr key={tx._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-5 text-gray-600 font-medium whitespace-nowrap">
                          {format(new Date(tx.createdAt), "MMM d, yyyy")}
                          <span className="block text-xs font-normal text-gray-400 mt-0.5">
                            {format(new Date(tx.createdAt), "h:mm a")}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <span className="font-semibold text-vulcan-primary">{tx.reason}</span>
                          <span className="block text-xs text-gray-400 mt-0.5 font-mono">
                            ID: {tx._id.slice(-8).toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                            tx.type === "CREDIT" || tx.amount > 0
                              ? "bg-green-50 text-green-700 border-green-200" 
                              : "bg-red-50 text-red-700 border-red-200"
                          }`}>
                            {(tx.type === "CREDIT" || tx.amount > 0) ? "Purchased" : "Deducted"} 
                            {tx.amount > 0 && ` (₹${tx.amount.toLocaleString()})`}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-right font-medium">
                          <div className="flex items-center justify-end gap-1.5">
                            <span className={`${(tx.type === "CREDIT" || tx.amount > 0) ? "text-green-600" : "text-red-600"} text-base`}>
                              {(tx.type === "CREDIT" || tx.amount > 0) ? "+" : "-"}{Math.abs(tx.balanceAfter - (tx.balanceAfter - (tx.amount > 0 ? tx.amount/349 : 1))) || 1}
                            </span>
                          </div>
                          <span className="block text-xs text-gray-400 mt-0.5">
                            Balance: {tx.balanceAfter}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
                  <span className="text-sm text-gray-500">
                    Page <span className="font-medium text-vulcan-primary">{page}</span> of <span className="font-medium text-vulcan-primary">{totalPages}</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8"
                      disabled={page === 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8"
                      disabled={page === totalPages}
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </Card>
      </div>
    </div>
  );
}

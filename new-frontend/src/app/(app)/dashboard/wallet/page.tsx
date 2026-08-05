"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getTransactions, getWallet } from "@/services/payments.service";
import type { CreditTransactionSource } from "@/types/payment";

const SOURCE_LABEL: Record<CreditTransactionSource, string> = {
  RECHARGE: "Recharge",
  TEST_ATTEMPT: "Test fee",
  SELF_PRACTICE: "Practice fee",
  FREE_PRACTICE: "Free practice",
  REFUND: "Refund",
  ADMIN_ADJUSTMENT: "Adjustment",
};

export default function WalletPage() {
  const { data: wallet } = useQuery({ queryKey: ["wallet"], queryFn: getWallet });
  const { data: transactions, isLoading } = useQuery({ queryKey: ["transactions"], queryFn: getTransactions });

  return (
    <div className="mx-auto max-w-5xl">
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <h1 className="font-heading text-2xl font-semibold text-fg">{wallet?.balance ?? "—"} credits</h1>
          <Link href="/dashboard/recharge" className={buttonVariants()}>
            Recharge
          </Link>
        </div>

        <div className="mt-8 overflow-x-auto">
          <table className="w-full text-left text-[12px]">
            <thead>
              <tr className="text-[11.5px] font-semibold text-muted-fg">
                <th className="pb-3 pr-4 font-semibold">Date</th>
                <th className="pb-3 pr-4 font-semibold">Reason</th>
                <th className="pb-3 pr-4 font-semibold">Test</th>
                <th className="pb-3 pr-4 font-semibold">Amount</th>
                <th className="pb-3 font-semibold">Balance after</th>
              </tr>
            </thead>
            <tbody>
              {(transactions ?? []).map((tx) => (
                <tr key={tx.id} className="border-t border-border">
                  <td className="py-3 pr-4 text-fg">
                    {new Date(tx.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                  </td>
                  <td className="py-3 pr-4 text-fg">{SOURCE_LABEL[tx.source] ?? tx.source}</td>
                  <td className="py-3 pr-4 text-fg">{tx.test_title ?? "-"}</td>
                  <td className={`py-3 pr-4 ${tx.type === "CREDIT" ? "text-success-fg" : "text-danger-fg"}`}>
                    {tx.type === "CREDIT" ? "+" : "-"}
                    {tx.amount}
                  </td>
                  <td className="py-3 text-fg">{tx.balance_after}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {isLoading && <p className="py-4 text-sm text-muted-fg">Loading transactions…</p>}
          {!isLoading && transactions?.length === 0 && (
            <p className="py-4 text-sm text-muted-fg">No transactions yet.</p>
          )}
        </div>
      </Card>
    </div>
  );
}

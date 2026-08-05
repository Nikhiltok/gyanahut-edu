"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

import { PageHeader } from "@/components/common/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getTransactions, getWallet } from "@/services/payments.service";
import type { CreditTransaction } from "@/types/payment";

const SOURCE_LABEL: Record<CreditTransaction["source"], string> = {
  RECHARGE: "Wallet Recharge",
  TEST_ATTEMPT: "Mock Test",
  SELF_PRACTICE: "Self Practice",
  FREE_PRACTICE: "Free Practice",
  REFUND: "Refund",
  ADMIN_ADJUSTMENT: "Admin Adjustment",
};

export default function WalletPage() {
  const { data: wallet, isLoading: isWalletLoading } = useQuery({ queryKey: ["wallet"], queryFn: getWallet });
  const { data: transactions, isLoading: isTransactionsLoading } = useQuery({
    queryKey: ["transactions"],
    queryFn: getTransactions,
  });

  return (
    <div className="w-full space-y-6 p-8">
      <PageHeader title="My Wallet" subtitle="Recharge history and every credit spent or earned." />

      <Card className="max-w-xs">
        <CardContent className="space-y-3 py-4">
          <div>
            <p className="text-xs text-muted-foreground">Current Balance</p>
            {isWalletLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <p className="text-2xl font-semibold">{wallet?.balance ?? 0} credits</p>
            )}
          </div>
          <Button className="w-full" render={<Link href="/payments/recharge" />}>
            Recharge
          </Button>
        </CardContent>
      </Card>

      {isTransactionsLoading ? (
        <Skeleton className="h-40 w-full" />
      ) : (transactions ?? []).length === 0 ? (
        <p className="text-muted-foreground">No wallet activity yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Test</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Balance After</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(transactions ?? []).map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell>{new Date(tx.created_at).toLocaleString()}</TableCell>
                  <TableCell>{SOURCE_LABEL[tx.source] ?? tx.source}</TableCell>
                  <TableCell>{tx.test_title ?? "—"}</TableCell>
                  <TableCell>
                    <Badge variant={tx.type === "CREDIT" ? "default" : "secondary"}>
                      {tx.type === "CREDIT" ? "+" : "−"}
                      {tx.amount}
                    </Badge>
                  </TableCell>
                  <TableCell>{tx.balance_after}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

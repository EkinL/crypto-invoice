"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useConnection, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { BASE_SEPOLIA } from "@/lib/chain";
import { erc20Abi, getUsdcAddress } from "@/lib/usdc";
import {
  buildReceiptQuery,
  type PaymentReceipt,
  type PaymentStatus,
} from "@/lib/payments";

export function InvoiceActions({
  invoiceId,
  amountUsdc,
  vendorAddress,
}: {
  invoiceId: string;
  amountUsdc: bigint;
  vendorAddress: `0x${string}`;
}) {
  const { chainId, isConnected } = useConnection();
  const { mutateAsync: writeContractAsync } = useWriteContract();
  const isCorrectNetwork = chainId === BASE_SEPOLIA.chainId;
  const [status, setStatus] = useState<PaymentStatus>("idle");
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { data: receipt, error: receiptError } =
    useWaitForTransactionReceipt({
      hash: txHash ?? undefined,
      chainId: BASE_SEPOLIA.chainId,
      query: {
        enabled: Boolean(txHash),
      },
    });

  let helperText = "Connect wallet to enable payment.";
  if (isConnected && !isCorrectNetwork) {
    helperText = "Switch to Base Sepolia to enable payment.";
  }
  if (isConnected && isCorrectNetwork) {
    helperText = "Ready to pay with USDC.";
  }

  useEffect(() => {
    if (receipt && status === "pending") {
      setStatus("confirmed");
    }
  }, [receipt, status]);

  useEffect(() => {
    if (receiptError && status === "pending") {
      setStatus("error");
      setError(receiptError.message);
    }
  }, [receiptError, status]);

  const canPay =
    isConnected &&
    isCorrectNetwork &&
    status !== "signing" &&
    status !== "pending" &&
    status !== "confirmed";

  const receiptInfo: PaymentReceipt | null =
    status === "confirmed" && txHash
      ? { txHash, amountUsdc, recipient: vendorAddress }
      : null;

  const statusHref = receiptInfo
    ? `/invoice/${invoiceId}/status${buildReceiptQuery(receiptInfo)}`
    : `/invoice/${invoiceId}/status`;

  async function handlePay() {
    if (!canPay) return;
    setError(null);
    setStatus("signing");
    setTxHash(null);

    try {
      const hash = await writeContractAsync({
        address: getUsdcAddress(),
        abi: erc20Abi,
        functionName: "transfer",
        args: [vendorAddress, amountUsdc],
      });

      setTxHash(hash);
      setStatus("pending");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Transaction failed.");
    }
  }

  return (
    <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
      <div>
        <button
          disabled={!canPay}
          onClick={handlePay}
          className={`rounded-lg px-4 py-2 ${
            canPay
              ? "bg-black text-white"
              : "bg-gray-200 text-gray-600 cursor-not-allowed"
          }`}
          title={helperText}
        >
          {status === "signing"
            ? "Awaiting signature..."
            : status === "pending"
            ? "Waiting for confirmation..."
            : status === "confirmed"
            ? "Payment confirmed"
            : status === "error"
            ? "Retry payment"
            : "Pay in USDC"}
        </button>
        <div className="mt-1 text-xs text-gray-500">{helperText}</div>
        <div className="mt-1 text-xs text-gray-500">
          Payment state: {status}
        </div>
        {error && <div className="mt-1 text-xs text-red-600">{error}</div>}
      </div>

      <Link
        href={statusHref}
        className="rounded-lg px-4 py-2 border"
      >
        {status === "confirmed" ? "View receipt" : "View status"}
      </Link>
    </div>
  );
}

// src/lib/payments.ts
export type PaymentStatus =
  | "idle"
  | "signing"
  | "pending"
  | "confirmed"
  | "error";

export type PaymentReceipt = {
  txHash: `0x${string}`;
  amountUsdc: bigint;
  recipient: `0x${string}`;
};

function getParam(
  searchParams: Record<string, string | string[] | undefined>,
  key: string
): string | undefined {
  const value = searchParams[key];
  if (!value) return undefined;
  return Array.isArray(value) ? value[0] : value;
}

export function buildReceiptQuery(receipt: PaymentReceipt): string {
  const params = new URLSearchParams();
  params.set("tx", receipt.txHash);
  params.set("to", receipt.recipient);
  params.set("amount", receipt.amountUsdc.toString());
  return `?${params.toString()}`;
}

export function parseReceiptFromSearchParams(
  searchParams: Record<string, string | string[] | undefined>
): PaymentReceipt | null {
  const tx = getParam(searchParams, "tx");
  const to = getParam(searchParams, "to");
  const amount = getParam(searchParams, "amount");

  if (!tx || !to || !amount) return null;

  try {
    return {
      txHash: tx as `0x${string}`,
      recipient: to as `0x${string}`,
      amountUsdc: BigInt(amount),
    };
  } catch {
    return null;
  }
}

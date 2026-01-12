// app/invoice/[id]/status/page.tsx
import Link from "next/link";
import { txUrl } from "@/lib/chain";
import { getInvoiceById } from "@/lib/invoices";
import { parseReceiptFromSearchParams } from "@/lib/payments";
import { formatUsdc } from "@/lib/usdc";

export default async function InvoiceStatusPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const invoice = getInvoiceById(id);
  const receipt = parseReceiptFromSearchParams(resolvedSearchParams);

  if (!invoice) {
    return (
      <main className="max-w-3xl mx-auto p-6">
        <h1 className="text-xl font-semibold">Invoice not found</h1>
        <Link className="underline underline-offset-4" href="/">
          Back
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <header className="mb-6">
        <Link className="underline underline-offset-4" href={`/invoice/${invoice.id}`}>
          ← Back to invoice
        </Link>
        <h1 className="text-2xl font-bold mt-3">Payment status</h1>
        <p className="text-gray-600 mt-1">{invoice.reference}</p>
      </header>

      <section className="rounded-xl border p-4">
        <div className="text-sm">
          <div className="text-gray-500">Current status</div>
          <div className="font-medium">{invoice.status}</div>
        </div>

        {receipt ? (
          <div className="mt-4 text-sm">
            <div className="text-gray-500">Receipt (on-chain)</div>
            <div className="mt-2 grid gap-2">
              <div>
                <div className="text-gray-500">Tx hash</div>
                <div className="font-mono text-xs break-all">
                  {receipt.txHash}
                </div>
                <a
                  className="underline underline-offset-4 text-xs"
                  href={txUrl(receipt.txHash)}
                  target="_blank"
                  rel="noreferrer"
                >
                  View on BaseScan
                </a>
              </div>

              <div>
                <div className="text-gray-500">Amount</div>
                <div className="font-medium">
                  {formatUsdc(receipt.amountUsdc)} USDC
                </div>
              </div>

              <div>
                <div className="text-gray-500">Recipient</div>
                <div className="font-mono text-xs break-all">
                  {receipt.recipient}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-4 text-sm text-gray-700">
            Receipt & onchain verification will appear here in later steps.
          </div>
        )}
      </section>
    </main>
  );
}

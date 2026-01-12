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
      <main className="max-w-3xl mx-auto px-6 pt-10">
        <h1 className="text-xl font-semibold text-slate-900">
          Invoice not found
        </h1>
        <Link
          className="text-sm font-medium text-slate-700 underline underline-offset-4"
          href="/"
        >
          Back
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-6 pt-10">
      <header className="mb-6 animate-fade-up">
        <Link
          className="text-sm font-medium text-slate-700 underline underline-offset-4"
          href={`/invoice/${invoice.id}`}
        >
          ← Back to invoice
        </Link>
        <h1 className="text-3xl font-semibold mt-3 text-slate-900">
          Payment status
        </h1>
        <p className="text-slate-600 mt-1">{invoice.reference}</p>
      </header>

      <section className="rounded-2xl border border-[var(--panel-border)] bg-[var(--panel)] p-6 shadow-sm backdrop-blur animate-fade-up">
        <div className="text-sm">
          <div className="text-slate-500">Current status</div>
          <div className="font-medium text-slate-900">{invoice.status}</div>
        </div>

        {receipt ? (
          <div className="mt-4 text-sm">
            <div className="text-slate-500">Receipt (on-chain)</div>
            <div className="mt-2 grid gap-2">
              <div>
                <div className="text-slate-500">Tx hash</div>
                <div className="font-mono text-xs break-all">
                  {receipt.txHash}
                </div>
                <a
                  className="underline underline-offset-4 text-xs text-slate-700"
                  href={txUrl(receipt.txHash)}
                  target="_blank"
                  rel="noreferrer"
                >
                  View on BaseScan
                </a>
              </div>

              <div>
                <div className="text-slate-500">Amount</div>
                <div className="font-medium text-slate-900">
                  {formatUsdc(receipt.amountUsdc)} USDC
                </div>
              </div>

              <div>
                <div className="text-slate-500">Recipient</div>
                <div className="font-mono text-xs break-all">
                  {receipt.recipient}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-4 text-sm text-slate-700">
            Receipt & onchain verification will appear here in later steps.
          </div>
        )}
      </section>
    </main>
  );
}

// src/app/invoice/[id]/page.tsx
import Link from "next/link";
import { getInvoiceById } from "@/lib/invoices";
import { formatUsdc, usdcExplorerUrl } from "@/lib/usdc";
import { InvoiceActions } from "@/components/InvoiceActions";

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const invoice = getInvoiceById(id);

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
        <Link className="text-sm font-medium text-slate-700 underline underline-offset-4" href="/">
          ← Back
        </Link>
        <h1 className="text-3xl font-semibold mt-3 text-slate-900">
          {invoice.reference}
        </h1>
        <p className="text-slate-600 mt-1">{invoice.vendorName}</p>
      </header>

      <section className="rounded-2xl border border-[var(--panel-border)] bg-[var(--panel)] p-6 shadow-sm backdrop-blur animate-fade-up">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-slate-500">Status</div>
            <div className="font-medium text-slate-900">{invoice.status}</div>
          </div>

          <div>
            <div className="text-slate-500">Due date</div>
            <div className="font-medium text-slate-900">{invoice.dueDate}</div>
          </div>

          <div>
            <div className="text-slate-500">Amount</div>
            <div className="font-medium text-slate-900">
              {formatUsdc(invoice.amountUsdc)} {invoice.currency}
            </div>
            <div className="text-xs text-slate-500">
              (display: ${invoice.amountUsd})
            </div>
          </div>

          <div>
            <div className="text-slate-500">Vendor address</div>
            <div className="font-mono text-xs break-all">
              {invoice.vendorAddress}
            </div>

            <div className="mt-3 text-sm">
              <a
                className="underline underline-offset-4 text-slate-700"
                href={usdcExplorerUrl()}
                target="_blank"
                rel="noreferrer"
              >
                View USDC token on BaseScan
              </a>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="text-slate-500 text-sm">Description</div>
          <div className="mt-1 text-slate-800">{invoice.description}</div>
        </div>

        <InvoiceActions
          invoiceId={invoice.id}
          amountUsdc={invoice.amountUsdc}
          vendorAddress={invoice.vendorAddress}
        />
      </section>
    </main>
  );
}

// src/app/page.tsx
import { InvoiceCard } from "@/components/InvoiceCard";
import { listInvoices } from "@/lib/invoices";
import { usdcExplorerUrl } from "@/lib/usdc";

export default function HomePage() {
  const invoices = listInvoices();

  return (
    <main className="max-w-3xl mx-auto px-6 pt-10">
      <header className="mb-6 animate-fade-up">
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--panel-border)] bg-[var(--panel)] px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">
          USDC on Base Sepolia
        </div>
        <h1 className="text-3xl font-semibold mt-3 text-slate-900">
          Invoices
        </h1>
        <p className="text-slate-600 mt-1">
          MVP: list → detail → payment
        </p>

        <div className="mt-4 text-sm">
          <a
            className="underline underline-offset-4 text-slate-700"
            href={usdcExplorerUrl()}
            target="_blank"
            rel="noreferrer"
          >
            View USDC token on BaseScan
          </a>
        </div>
      </header>

      <div className="flex flex-col gap-4">
        {invoices.map((inv) => (
          <InvoiceCard key={inv.id} invoice={inv} />
        ))}
      </div>
    </main>
  );
}

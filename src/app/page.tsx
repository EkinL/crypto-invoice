// src/app/page.tsx
import { InvoiceCard } from "@/components/InvoiceCard";
import { listInvoices } from "@/lib/invoices";
import { usdcExplorerUrl } from "@/lib/usdc";

export default function HomePage() {
  const invoices = listInvoices();

  return (
    <main className="max-w-3xl mx-auto p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">
          Invoices (USDC on Base Sepolia)
        </h1>
        <p className="text-gray-600 mt-1">
          MVP: list → detail → (payment next)
        </p>

        <div className="mt-3 text-sm">
          <a
            className="underline underline-offset-4"
            href={usdcExplorerUrl()}
            target="_blank"
            rel="noreferrer"
          >
            View USDC token on BaseScan
          </a>
        </div>
      </header>

      <div className="flex flex-col gap-3">
        {invoices.map((inv) => (
          <InvoiceCard key={inv.id} invoice={inv} />
        ))}
      </div>
    </main>
  );
}

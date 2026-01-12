// src/components/InvoiceCard.tsx
import Link from "next/link";
import type { Invoice } from "@/lib/invoices";
import { formatUsdc } from "@/lib/usdc";

function badgeClass(status: Invoice["status"]) {
  switch (status) {
    case "PAID":
      return "bg-emerald-100 text-emerald-800";
    case "DUE":
      return "bg-amber-100 text-amber-800";
    case "INVALID":
      return "bg-rose-100 text-rose-800";
    case "PENDING_VERIFY":
      return "bg-sky-100 text-sky-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export function InvoiceCard({ invoice }: { invoice: Invoice }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-[var(--panel-border)] bg-[var(--panel)] p-5 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md animate-fade-up">
      <div className="absolute inset-0 bg-gradient-to-br from-teal-50/40 via-transparent to-amber-50/30 opacity-0 transition group-hover:opacity-100" />
      <div className="relative z-10 min-w-0">
        <div className="flex items-center gap-2">
          <div className="font-semibold text-slate-900">{invoice.reference}</div>
          <span
            className={`text-xs px-2 py-1 rounded-full ${badgeClass(
              invoice.status
            )}`}
          >
            {invoice.status}
          </span>
        </div>

        <div className="text-sm text-slate-600 mt-1">
          {invoice.vendorName} • Due {invoice.dueDate}
        </div>

        <div className="text-sm mt-2 text-slate-700 line-clamp-2">
          {invoice.description}
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-end gap-1 shrink-0">
        <div className="font-semibold tabular-nums text-slate-900">
          {formatUsdc(invoice.amountUsdc)} {invoice.currency}
        </div>
        <div className="text-xs text-slate-500 tabular-nums">
          (display: ${invoice.amountUsd})
        </div>

        <Link
          href={`/invoice/${invoice.id}`}
          className="text-sm font-medium text-slate-900 underline underline-offset-4 mt-1"
        >
          View
        </Link>
      </div>
    </div>
  );
}

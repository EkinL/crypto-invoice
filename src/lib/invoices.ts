// src/lib/invoices.ts
import { parseUsdc } from "@/lib/usdc";

export type InvoiceStatus = "DUE" | "PAID" | "INVALID" | "PENDING_VERIFY";

export type Invoice = {
  id: string;
  reference: string;
  vendorName: string;
  vendorAddress: `0x${string}`;
  amountUsd: string; // affichage humain
  amountUsdc: bigint; // base units (6 decimals)
  currency: "USDC";
  dueDate: string; // ISO date
  description: string;
  status: InvoiceStatus;
};

export const seededInvoices: Invoice[] = [
  {
    id: "inv_001",
    reference: "INV-2026-001",
    vendorName: "Acme Logistics",
    vendorAddress: "0x1111111111111111111111111111111111111111",
    amountUsd: "125.50",
    amountUsdc: parseUsdc("125.50"),
    currency: "USDC",
    dueDate: "2026-01-20",
    description: "Transport & livraison - Janvier",
    status: "DUE",
  },
  {
    id: "inv_002",
    reference: "INV-2026-002",
    vendorName: "Cloud Services Ltd",
    vendorAddress: "0x2222222222222222222222222222222222222222",
    amountUsd: "49.99",
    amountUsdc: parseUsdc("49.99"),
    currency: "USDC",
    dueDate: "2026-01-18",
    description: "Hébergement & stockage",
    status: "DUE",
  },
  {
    id: "inv_003",
    reference: "INV-2026-003",
    vendorName: "Design Studio",
    vendorAddress: "0x3333333333333333333333333333333333333333",
    amountUsd: "300.00",
    amountUsdc: parseUsdc("300.00"),
    currency: "USDC",
    dueDate: "2026-01-25",
    description: "Maquettes landing page",
    status: "DUE",
  },
  {
    id: "inv_004",
    reference: "INV-2026-004",
    vendorName: "Test Vendor",
    vendorAddress: "0x4444444444444444444444444444444444444444",
    amountUsd: "0.10",
    amountUsdc: parseUsdc("0.10"),
    currency: "USDC",
    dueDate: "2026-01-30",
    description: "Test invoice (0.10 USDC)",
    status: "DUE",
  },
];

export function listInvoices(): Invoice[] {
  return seededInvoices;
}

export function getInvoiceById(id: string): Invoice | undefined {
  const normalized = safeDecodeId(id);
  return (
    seededInvoices.find((inv) => inv.id === normalized) ||
    seededInvoices.find((inv) => inv.reference === normalized)
  );
}

function safeDecodeId(raw: string): string {
  try {
    return decodeURIComponent(raw).trim();
  } catch {
    return raw.trim();
  }
}

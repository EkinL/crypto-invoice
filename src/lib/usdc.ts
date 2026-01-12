// src/lib/usdc.ts
import { formatUnits, isAddress, parseUnits } from "viem";
import { tokenUrl } from "@/lib/chain";

// ✅ Source officielle (Circle Docs) : USDC Base Sepolia
// Override possible via NEXT_PUBLIC_USDC_ADDRESS
export const USDC_BASE_SEPOLIA_ADDRESS_DEFAULT =
  "0x036CbD53842c5426634e7929541eC2318f3dCF7e" as const;

export const USDC_DECIMALS = 6;

export function getUsdcAddress(): `0x${string}` {
  const override = process.env.NEXT_PUBLIC_USDC_ADDRESS;

  if (override && override.length > 0) {
    if (!isAddress(override)) {
      throw new Error(
        `Invalid NEXT_PUBLIC_USDC_ADDRESS: "${override}". Expected a 0x-prefixed EVM address.`
      );
    }
    return override as `0x${string}`;
  }

  return USDC_BASE_SEPOLIA_ADDRESS_DEFAULT;
}

export function usdcExplorerUrl() {
  return tokenUrl(getUsdcAddress());
}

// Helpers amounts (USDC = 6 decimals)
export function formatUsdc(amount: bigint): string {
  return formatUnits(amount, USDC_DECIMALS);
}

export function parseUsdc(amountHuman: string): bigint {
  return parseUnits(amountHuman, USDC_DECIMALS);
}

// ABI minimal ERC-20 (transfer, balanceOf, event Transfer)
export const erc20Abi = [
  {
    type: "function",
    name: "transfer",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "balance", type: "uint256" }],
  },
  {
    type: "event",
    name: "Transfer",
    inputs: [
      { indexed: true, name: "from", type: "address" },
      { indexed: true, name: "to", type: "address" },
      { indexed: false, name: "value", type: "uint256" },
    ],
    anonymous: false,
  },
] as const;

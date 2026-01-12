"use client";

import {
  useConnect,
  useConnection,
  useConnectors,
  useDisconnect,
  useSwitchChain,
} from "wagmi";
import { BASE_SEPOLIA } from "@/lib/chain";

function shortAddress(address?: string) {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function WalletBar() {
  const { address, chainId, isConnected, status } = useConnection();
  const connectors = useConnectors();
  const { mutate: connect, error: connectError, isPending } = useConnect();
  const { mutate: disconnect } = useDisconnect();
  const { mutate: switchChain, isPending: isSwitching } = useSwitchChain();

  const expectedChainId = BASE_SEPOLIA.chainId;
  const isCorrectNetwork = chainId === expectedChainId;
  const connector = connectors[0];

  const statusLabel = isConnected
    ? `Connected: ${shortAddress(address)}`
    : status === "connecting" || status === "reconnecting"
    ? "Connecting..."
    : "Not connected";

  const statusBadgeClass = isConnected
    ? "bg-emerald-100 text-emerald-800"
    : "bg-slate-100 text-slate-700";

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${statusBadgeClass}`}
          >
            {status === "connecting" || status === "reconnecting"
              ? "CONNECTING"
              : isConnected
              ? "CONNECTED"
              : "DISCONNECTED"}
          </span>
          <div className="font-medium text-slate-900">{statusLabel}</div>
        </div>
        {isConnected && !isCorrectNetwork && (
          <div className="text-amber-700">
            Wrong network. Switch to Base Sepolia.
          </div>
        )}
        {connectError && (
          <div className="text-red-600">{connectError.message}</div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {!isConnected ? (
          <button
            className="rounded-full px-4 py-2 border border-[var(--panel-border)] bg-[var(--panel)] text-sm font-medium shadow-sm hover:shadow-md transition"
            onClick={() => connector && connect({ connector })}
            disabled={!connector || isPending}
          >
            {isPending ? "Connecting..." : "Connect wallet"}
          </button>
        ) : (
          <>
            {!isCorrectNetwork && (
              <button
                className="rounded-full px-4 py-2 border border-amber-200 bg-amber-50 text-amber-900 text-sm font-medium hover:bg-amber-100 transition"
                onClick={() => switchChain({ chainId: expectedChainId })}
                disabled={isSwitching}
              >
                {isSwitching ? "Switching..." : "Switch network"}
              </button>
            )}
            <button
              className="rounded-full px-4 py-2 border border-[var(--panel-border)] bg-[var(--panel)] text-sm font-medium hover:shadow-md transition"
              onClick={() => disconnect()}
            >
              Disconnect
            </button>
          </>
        )}
      </div>
    </div>
  );
}

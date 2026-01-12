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

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-sm">
      <div className="flex flex-col gap-1">
        <div className="font-medium">{statusLabel}</div>
        {isConnected && !isCorrectNetwork && (
          <div className="text-red-600">
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
            className="rounded-lg px-3 py-2 border text-sm"
            onClick={() => connector && connect({ connector })}
            disabled={!connector || isPending}
          >
            {isPending ? "Connecting..." : "Connect wallet"}
          </button>
        ) : (
          <>
            {!isCorrectNetwork && (
              <button
                className="rounded-lg px-3 py-2 border text-sm"
                onClick={() => switchChain({ chainId: expectedChainId })}
                disabled={isSwitching}
              >
                {isSwitching ? "Switching..." : "Switch network"}
              </button>
            )}
            <button
              className="rounded-lg px-3 py-2 border text-sm"
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

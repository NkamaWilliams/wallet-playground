"use client";

import React from "react";
import { useWallet } from "@gillsdk/react";
import InstructionTester from "./builder/createIx";

export default function MainPage() {
  const { wallet, account, wallets, connect, disconnect, status } = useWallet();

  return (
    <div className="w-full flex flex-col items-center justify-start min-h-screen p-6 space-y-6">
      {/* Wallet Panel */}
      <div className="w-full max-w-md bg-gray-700 shadow-xl rounded-2xl p-6 space-y-4">
        <h1 className="text-2xl font-bold text-gray-50 text-center">
          Wallet List
        </h1>

        {/* Connected wallet info */}
        {wallet ? (
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-100">Connected Wallet: {wallet.name}</p>
            {account && (
              <p className="text-sm text-gray-200 break-all">
                Address: {account.address}
              </p>
            )}
            <button
              onClick={() => disconnect(wallet)}
              disabled={status === "disconnecting"}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded-lg transition"
            >
              {status === "disconnecting" ? "Disconnecting…" : "Disconnect Wallet"}
            </button>
          </div>
        ) : (
          <p className="text-sm text-gray-600 text-center">
            No wallet connected
          </p>
        )}

        {/* Available wallets for connection */}
        <div className="space-y-2">
          {wallets.length === 0 ? (
            <p className="text-sm text-gray-500 text-center">
              No Solana wallets detected.
            </p>
          ) : (
            wallets.map((w) => (
              <button
                key={w.name}
                onClick={() => connect(w)}
                disabled={status === "connecting" || wallet?.name === w.name}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition"
              >
                {status === "connecting" && wallet?.name !== w.name
                  ? `Connecting ${w.name}…`
                  : `Connect ${w.name}`}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Instruction Tester */}
      {wallet && <InstructionTester />}
    </div>
  );
}

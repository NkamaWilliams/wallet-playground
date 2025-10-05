"use client";

import { useWallet } from "@gillsdk/react";
import SignInTester from "./signIn/page";

export default function WalletConnectPanel() {
  const { account, wallet, wallets, connect, disconnect, status } = useWallet();

  return (
    <section className="max-w-2xl mx-auto space-y-6">
      {/* Wallet Info */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 border border-gray-200 dark:border-gray-800">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          Wallet Connection
        </h2>

        <div className="space-y-2 text-gray-700 dark:text-gray-300">
          <p>
            <span className="font-medium text-gray-900 dark:text-gray-100">Status:</span>{" "}
            <span className="capitalize">{status}</span>
          </p>
          <p>
            <span className="font-medium text-gray-900 dark:text-gray-100">Connected Wallet:</span>{" "}
            {wallet ? wallet.name : <span className="italic text-gray-500">None</span>}
          </p>
          <p>
            <span className="font-medium text-gray-900 dark:text-gray-100">Account:</span>{" "}
            {account ? account.address : <span className="italic text-gray-500">None</span>}
          </p>
        </div>
      </div>

      {/* Available Wallets */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 border border-gray-200 dark:border-gray-800">
        <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
          Available Wallets
        </h3>
        {wallets.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {wallets.map((w) => (
              <button
                key={w.name}
                onClick={() => connect(w)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                Connect {w.name}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">No wallets detected.</p>
        )}
      </div>

      {/* Disconnect + SignIn */}
      {wallet && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 border border-gray-200 dark:border-gray-800 space-y-4">
          <button
            onClick={() => disconnect(wallet)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            Disconnect
          </button>

          <SignInTester />
        </div>
      )}
    </section>
  );
}

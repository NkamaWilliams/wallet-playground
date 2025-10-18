"use client";

import { useWallet, useSignIn, SolanaSignInOutput } from "@gillsdk/react";
import { verifySignIn } from "@solana/wallet-standard-util";

export default function SignInTester() {
  const { wallet, wallets } = useWallet();

  if (!wallet) return null; 
  // console.log(wallets)

  const { mutation } = useSignIn(wallet, {
    domain: "localhost:3000",
    statement: "Sign in to Williams' Localhost Dapp up",
  });

  const handleSignIn = () => {
    const res = mutation.mutate();
    const verify = verifySignIn(
      {
        domain: "localhost:3000",
        statement: "Sign in to Williams' Localhost Dapp up",
      }, mutation.data);
    console.log("Verify", verify);
    console.log(res);
  }

  const verifySignin = () => {
    if (!mutation.data) return
    const verify = verifySignIn(
      {
        domain: "localhost:3000",
        statement: "Sign in to Williams' Localhost Dapp up",
      }, mutation.data);
    alert(verify ? "Sign In Message is valid" : "Sign In Message is invalid")
  }

  return (
    <section className="mt-8">
      <h2 className="text-xl font-semibold mb-3">Sign In Test</h2>

      <button
        disabled={mutation.isPending}
        onClick={handleSignIn}
        className={`px-4 py-2 rounded-lg shadow text-white ${
          mutation.isPending ? "bg-gray-500" : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {mutation.isPending ? "Signing In..." : "Test Sign In"}
      </button>

      <button
        disabled={mutation.isPending}
        onClick={verifySignin}
        className={`px-4 py-2 ml-2 rounded-lg shadow text-white ${
          mutation.isPending ? "bg-gray-500" : "bg-green-600 hover:bg-green-700"
        }`}
      >
        Verify Sign In Output
      </button>

      {mutation.error && (
        <p className="mt-4 text-red-600 font-medium">Error: {mutation.error.message}</p>
      )}

      {mutation.data && (
        <div className="mt-6 bg-gray-100 text-black rounded-lg p-4 text-sm">
          <h3 className="font-semibold mb-2">Sign In Result</h3>
          <pre className="whitespace-pre-wrap break-words">
            {JSON.stringify(mutation.data as SolanaSignInOutput, null, 2)}
          </pre>
        </div>
      )}
    </section>
  );
}

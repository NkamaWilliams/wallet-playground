"use client"
import React, { useState } from "react";
import {
  address,
  compileTransaction,
  createInstruction,
  createSolanaClient,
  getBase58Decoder,
  getExplorerLink,
  getTransactionEncoder,
  lamports,
} from "gill";
import { handleSend } from "../actions/send";
import { useWalletAccountTransactionSendingSigner } from "@solana/react";
import { useWallet, useSignAndSendTx } from "@gillsdk/react";
import { getAssociatedTokenAccountAddress, getMintToInstruction, getTransferTokensInstructions, TOKEN_PROGRAM_ADDRESS } from "gill/programs";

export default function InstructionTester() {
  const {account} = useWallet()

  if (!account) return

  const [destination, setDestination] = useState("")
  const [status, setStatus] = useState("idle")
  const [msg, setMsg] = useState("")
  const {mutation} = useSignAndSendTx(account!, "devnet");
  const signer = useWalletAccountTransactionSendingSigner(account!, "solana:devnet");

  const {rpc} = createSolanaClient({urlOrMoniker: "devnet"});
  
  const handleClick = async () => {
    const mint = address("9djQYHX62Fz5ZBuD1FzxH3VA7WsPVqLJ8b6hgH2HSLCq");
    const sourceAta = await getAssociatedTokenAccountAddress(mint, address(account.address));
    const destinationAta = await getAssociatedTokenAccountAddress(mint, address(destination));
    const {value: latestBlockhash} = await rpc.getLatestBlockhash().send();

    // const sendSol = createInstruction(signer)
    //   .withMemo("Just a small reward")
    //   .transferSol(lamports(1_000_000n), address(destination))
    //   .withPriorityFee(10_000)
    //   .withComputeLimit(500_000)
    //   .build({latestBlockhash});
    
    const sendSol = createInstruction(signer)
      .transferTokens({
        mint,
        destinationAta,
        sourceAta,
        amount: 10,
        destination: address(destination),
        authority: address(account.address),
        tokenProgram: TOKEN_PROGRAM_ADDRESS
      })
      .build({latestBlockhash});
      setStatus("processing");
    try {
      const compiledTx = compileTransaction(sendSol);
      const txBytes = getTransactionEncoder().encode(compiledTx);
      // const msg = await handleSend(address(destination));
      const res = await mutation.mutateAsync(new Uint8Array(txBytes));
      const message = getExplorerLink({transaction: getBase58Decoder().decode(res.signature)});
      setMsg(`Success! View your transaction here: ${message}`);
    } catch (e) {
      console.error(e);
      setMsg("Failed to send transaction. CHeck console for details");
    }
    setStatus("idle");
  }
  return (
    <div className="w-full flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-gray-700 shadow-xl rounded-2xl p-6 space-y-4">
        <h1 className="text-2xl font-bold text-gray-50 text-center">
          Solana Instruction Builder Test
        </h1>

        <p className="text-sm text-gray-50 text-center">
          Send a small SOL transfer using your private key (Devnet)
        </p>

        <input
          type="text"
          placeholder="Destination address"
          value={destination}
          onChange={e => setDestination(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-200"
        />

        <button
          disabled={status != "idle"}
          onClick={handleClick}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 disabled:text-gray-100 text-white font-medium py-2 rounded-lg transition"
        >
          Send Test Transaction
        </button>

        <p className="text-center text-sm font-medium p-2 rounded-lg text-wrap">{msg}</p>

        {/* {status && (
          <div
            className={`text-center text-sm font-medium p-2 rounded-lg ${
              status.startsWith("Success")
                ? "text-green-700 bg-green-50"
                : status.startsWith("Error")
                ? "text-red-700 bg-red-50"
                : "text-gray-700 bg-gray-50"
            }`}
          >
            {status}
          </div>
        )} */}
      </div>
    </div>
  );
}

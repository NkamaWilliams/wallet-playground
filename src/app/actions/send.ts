"use server";

import { loadKeypairSignerFromFile } from "gill/node";
import { createSolanaClient, address, createInstruction, lamports, signTransactionMessageWithSigners, getSignatureFromTransaction, sendAndConfirmTransactionFactory, getExplorerLink, Address } from "gill";

export async function handleSend(destination: Address): Promise<string> {
  console.log("Building transaction...");
  const feePayer = await loadKeypairSignerFromFile("./wallet.json");
  const { rpc, rpcSubscriptions } = createSolanaClient({ urlOrMoniker: "devnet" });
  console.log("Payer:", feePayer.address);
  try {
  const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();
  const tx = createInstruction(feePayer)
    .withMemo("Testing Instruction Builder")
    .withPriorityFee(10_000)
    .withComputeLimit(500_000)
    .transferSol(lamports(1_000_000n), destination)
    .build({ latestBlockhash });

  const signedTx = await signTransactionMessageWithSigners(tx);
  const sig = getSignatureFromTransaction(signedTx);

    console.log("Sending transaction...");
    const sendAndConfirmTransaction = sendAndConfirmTransactionFactory({ rpc, rpcSubscriptions });
    await sendAndConfirmTransaction(signedTx, { commitment: "confirmed" });
    const successMessage = `Success! Tx: ${getExplorerLink({ transaction: sig, cluster: "devnet" })}`;
    console.log(successMessage);
    return successMessage;
  } catch (err: any) {
    console.error(err);
    return `Error: ${err.message}`;
  }
}

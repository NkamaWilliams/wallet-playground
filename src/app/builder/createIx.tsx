"use client"
import React, { useState } from "react";
import {
  address,
  compileTransaction,
  createInstruction,
  createSolanaClient,
  createTransaction,
  generateKeyPairSigner,
  getBase58Decoder,
  getExplorerLink,
  getMinimumBalanceForRentExemption,
  getTransactionEncoder,
  signTransactionMessageWithSigners,
} from "gill";
import { useWalletAccountTransactionSigner } from "@solana/react";
import { useWallet, useSignAndSendTx } from "@gillsdk/react";
import { 
  getAssociatedTokenAccountAddress, 
  getCreateAccountInstruction, 
  getCreateAssociatedTokenIdempotentInstruction, 
  getCreateMetadataAccountV3Instruction, 
  getInitializeMintInstruction, 
  getMintSize, 
  getMintToInstruction, 
  getTokenMetadataAddress, 
  TOKEN_PROGRAM_ADDRESS 
} from "gill/programs";

export default function InstructionTester() {
  const {account} = useWallet()

  if (!account) return

  const [destination, setDestination] = useState("")
  const [status, setStatus] = useState("idle")
  const [msg, setMsg] = useState("")
  const {mutation} = useSignAndSendTx(account!, "devnet");
  const signer = useWalletAccountTransactionSigner(account!, "solana:devnet"); 
  const {rpc} = createSolanaClient({urlOrMoniker: "devnet"});

  const createMint = async () => {
    const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();

    const tokenProgram = TOKEN_PROGRAM_ADDRESS;
    const mint = await generateKeyPairSigner();
    console.log("mint:", mint.address);

    const space = getMintSize();

    const metadataAddress = await getTokenMetadataAddress(mint);
    const sourceAta = await getAssociatedTokenAccountAddress(mint, signer.address);
    /**
     * instead of manually crafting the `instructions` below and deriving addresses above:
     * you could use the `getCreateTokenInstructions()` function to simplify this code
     */
    const tx = createTransaction({
      feePayer: signer,
      version: 0,
      instructions: [
        getCreateAccountInstruction({
          space,
          lamports: getMinimumBalanceForRentExemption(space),
          newAccount: mint,
          payer: signer,
          programAddress: tokenProgram,
        }),
        getInitializeMintInstruction(
          {
            mint: mint.address,
            mintAuthority: signer.address,
            freezeAuthority: signer.address,
            decimals: 1,
          },
          {
            programAddress: tokenProgram,
          },
        ),
        getCreateMetadataAccountV3Instruction({
          collectionDetails: null,
          isMutable: true,
          updateAuthority: signer,
          mint: mint.address,
          metadata: metadataAddress,
          mintAuthority: signer,
          payer: signer,
          data: {
            sellerFeeBasisPoints: 0,
            collection: null,
            creators: null,
            uses: null,
            name: "super sweet token will",
            symbol: "SSTW",
            uri: "https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/Climate/metadata.json",
          },
        }),
        getCreateAssociatedTokenIdempotentInstruction({
          mint: mint.address,
          owner: signer.address,
          payer: signer,
          tokenProgram: TOKEN_PROGRAM_ADDRESS,
          ata: sourceAta,
        }),
        getMintToInstruction(
          {
            mint: mint.address,
            mintAuthority: signer,
            token: sourceAta,
            amount: 1_000_000_000,
          },
          {
            programAddress: TOKEN_PROGRAM_ADDRESS,
          },
        ),
      ],
      latestBlockhash,
    });
    try {
      const compiledTx = await signTransactionMessageWithSigners(tx);
      const txBytes = await getTransactionEncoder().encode(compiledTx);
      
      const res = await mutation.mutateAsync(new Uint8Array(txBytes));
      const message = getExplorerLink({transaction: getBase58Decoder().decode(res.signature)});
      setMsg(`Success! View your transaction here: ${message}`);
    } catch (e) {
      console.error(e);
      setMsg("Failed to send transaction. Check console for details");
    }
    setStatus("idle");
  }
  
  const handleClick = async () => {
    const mint = address("6VJUwFSJ3EXWUkvVK2q7vPzXfMjDAVBWUAKyWKwh5MAq");
    const sourceAta = await getAssociatedTokenAccountAddress(mint, address(account.address));
    const destinationAta = await getAssociatedTokenAccountAddress(mint, address(destination));
    const {value: latestBlockhash} = await rpc.getLatestBlockhash().send();

    // const sendSol = createInstruction(signer)
    //   .withMemo("Just a small reward")
    //   .transferSol(lamports(1_000_000n), address(destination))
    //   .withPriorityFee(10_000)
    //   .withComputeLimit(500_000)
    //   .build({latestBlockhash});

    const sendTokens = createInstruction(signer)
      .transferTokens({
        mint,
        destinationAta,
        sourceAta,
        amount: 10,
        destination: address(destination),
        tokenProgram: TOKEN_PROGRAM_ADDRESS
      })
      .build({latestBlockhash});
      setStatus("processing");
    try {
      // const compiledTx = await signTransactionMessageWithSigners(sendSol); // For Sol
      const compiledTx = compileTransaction(sendTokens); // For tokens
      const txBytes = getTransactionEncoder().encode(compiledTx);
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
      <div className="w-full max-w-md bg-gray-700 shadow-xl rounded-2xl p-6 space-y-4 text-wrap">
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

        <button
          disabled={status != "idle"}
          onClick={createMint}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 disabled:text-gray-100 text-white font-medium py-2 rounded-lg transition"
        >
          Send Create Mint Transaction
        </button>

        <p className="text-center text-sm font-medium p-2 rounded-lg text-wrap break-words w-full">{msg}</p>
      </div>
    </div>
  );
}

// Mint - 6VJUwFSJ3EXWUkvVK2q7vPzXfMjDAVBWUAKyWKwh5MAq
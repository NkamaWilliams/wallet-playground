import { address, compileTransaction, createSolanaClient, createTransaction, getExplorerLink, getTransactionEncoder } from "gill";
import { getAddMemoInstruction } from "gill/programs";
import { useWallet } from "./WalletContext";
import { Wallet } from "@wallet-standard/core";
import { u8ToBase58 } from "@/utils/conversion";

export default function Send({wallet}: {wallet: Wallet}){  
  const {signTransaction, signAndSendTransaction} = useWallet()

  const handleSend = async () => {
    if (!wallet) return;
    const { rpc } = createSolanaClient({urlOrMoniker: "devnet"});
    
    const {value: latestBlockhash} = await rpc.getLatestBlockhash().send();

    const addMemoIx = getAddMemoInstruction({
      memo: "Hello World",
    });

    const tx = createTransaction({
      feePayer: address(wallet.accounts[0].address),
      version: 0,
      instructions: [addMemoIx],
      latestBlockhash,
    });

    const message = compileTransaction(tx);
    const msgArr = getTransactionEncoder().encode(message);
    try{
      const signedTx = await signAndSendTransaction(Uint8Array.from(msgArr));
      if (signedTx){
        console.log(getExplorerLink({cluster: "devnet", transaction: u8ToBase58(signedTx) as string}));
      }
    } catch (e) {console.error(e)}

    // const signedTx = await signTransaction(Uint8Array.from(msgArr));
    // console.log("SIGNED TX:", signedTx);

    // if (signedTx){
    //   console.log("BASE64:", u8ToBase64(signedTx));
    //   const signature = await rpc.sendTransaction(u8ToBase64(signedTx)).send();
    // }

    // try {
    //   const compiledMsg = compileTransactionMessage(tx);
    //   const msgBytes = getCompiledTransactionMessageCodec().encode(compiledMsg);
    //   console.log("MSGBYTES:", msgBytes);
    //   const signedMsg = await signTransaction(Uint8Array.from(msgBytes));

    //   if (!signedMsg) {
    //     throw new Error("Failed to sign tx");
    //   }

    //   const sentTx = await rpc.sendTransaction(u8ToBase64(signedMsg)).send();
    //   console.log("Transaction sent:", getExplorerLink({transaction: sentTx}));
    // } catch (e) {
    //   console.error(e);
    // }
  }
    
  return(
    <button
      onClick={
        handleSend
      }
      className="px-6 py-3 text-white bg-purple-500 rounded-xl font-semibold hover:cursor-pointer hover:bg-blue-600 active:scale-95"
    >
      Send Memo Msg
    </button>
  )
}
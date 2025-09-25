"use client";

import { useWallet } from "./WalletContext";
import { Wallet } from "@wallet-standard/core";
import { useEffect, useState } from "react";
import Send from "./send";

export default function Home() {
  const {connect, disconnect, wallet, connected, wallets} = useWallet();
  const [viewWallets, setViewWallets] = useState<boolean>(false);

  const handleSelect = () => {
    if (!connected) {
      setViewWallets(prev => !prev);
    }
    else {
      disconnect();
    }
  }

  const handleChooseWallet = async (wallet: Wallet) => {
    connect(wallet);
    setViewWallets(false);
  }
  

  useEffect(() => {
    console.log(wallet);
  }, [wallet])

  return (
    <div className="min-h-screen p-8 pb-20 gap-16 sm:p-20 bg-black flex flex-col items-center justify-center">
      <p>Connected: {`${connected}`}</p>
      <button
        onClick={handleSelect}
        className="px-6 py-3 text-white bg-purple-500 rounded-xl font-semibold hover:cursor-pointer hover:bg-purple-600 active:scale-95"
      >
        {!connected ? "Select Wallet" : wallet?.accounts[0]?.address.slice(0, 9)+"..."}
      </button>

      {viewWallets && !connected &&
      <div className="w-2xs mt-2 rounded-xl">
        {wallets.length > 0 && wallets.map((w, idx) => 
          <div key={idx}>
          <button 
            // key={idx}
            className="w-full flex gap-2 px-3 py-2 justify-center items-center bg-gray-950 hover:cursor-pointer hover:bg-gray-800 active:bg-gray-900"
            onClick={() => handleChooseWallet(w)}
          >
            <img alt={w.name} src={w.icon} width={25} />
            <p className="font-medium text-lg">{w.name}</p>
          </button>
          {idx != wallets.length - 1 && <hr className="text-gray-800 bg-gray-950"/>}
          </div>
          )}
          {wallets.length == 0 && <p className="px-3 py-2 bg-gray-950 text-white font-semibold">No Wallets Found!</p>}
      </div>}
      
      <br />
      <br />
      
      {/* {!!accounts && <Tx />} */}
      {!!wallet && !!wallet.accounts && wallet.accounts.length > 0 && (
        <Send wallet={wallet}/>
      )}
    </div>
  );
}

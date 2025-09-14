"use client";

import { useWallet } from "@/hooks/useWallet";
import { useWalletDiscovery } from "@/hooks/useWalletDiscovery";
import { useEffect } from "react";

export default function Home() {
  const {selectWallet, selectedWallet, connected, wallets, disconnect} = useWallet();
  useEffect(() => {
    console.log(wallets);
    selectWallet(wallets[0]);
  }, [wallets]);
  return (
    <div className="min-h-screen p-8 pb-20 gap-16 sm:p-20">
      {
        wallets.map((wallet, idx) => 
          <p 
            key={idx}
            className="text-white"
          >{wallet.name}</p>
        )
      }
      <p>Connected: {`${connected}`}</p>
      <p>Account: {selectedWallet?.accounts[0].address}</p>

      <button 
        onClick={disconnect}
        className="py-3 px-8 my-2 hover:cursor-pointer hover:bg-white hover:text-black font-semibold border border-white rounded-xl"
      >Disconnect</button>
    </div>
  );
}

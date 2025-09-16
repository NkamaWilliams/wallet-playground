"use client"
import { useWalletHook } from "@/hooks/useWallet";
import { createContext, useContext } from "react";

type WalletContextProps = ReturnType<typeof useWalletHook>;

export const WalletContext = createContext<WalletContextProps | null> (null);

export default function WalletProvider({children}: {children: React.ReactNode}) {
  const useWalletVal = useWalletHook();
  return (
    <WalletContext.Provider value={useWalletVal}>
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet (){
  const ctx = useContext(WalletContext);
  if (!ctx) {
    throw new Error("useWallet must be used within the WalletProvider");
  }
  return ctx;
}
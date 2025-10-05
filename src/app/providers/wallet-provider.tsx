"use client";

import { WalletContextProvider } from "@gillsdk/react";

export default function WalletProviderWrapper({ children }: { children: React.ReactNode }) {
  return <WalletContextProvider>{children}</WalletContextProvider>;
}
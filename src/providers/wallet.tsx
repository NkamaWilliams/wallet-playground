"use client"
import { WalletContextProvider } from "@gillsdk/react"
import { ReactNode } from "react"

export default function GillWalletProvider({children}: {children: ReactNode}) {
  return (
    <WalletContextProvider>
      {children}
    </WalletContextProvider>
  )
}
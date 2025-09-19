import { getWallets, Wallet } from "@wallet-standard/core";
import { useEffect, useState } from "react";

const isSolanaWallet = (wallet: Wallet) =>  wallet.chains.some(chain => chain.startsWith("solana:"));

/**
 * 
 * @returns All discovered Solana wallets
 */
export function useWalletDiscovery() {
    const [wallets, setWallets] = useState<Wallet[]>([]);

    useEffect(() => {

        // Add all available initial wallets
        const api = getWallets();
        const currentWallets: readonly Wallet[] = api.get();
        console.log("Current Wallets:", currentWallets);
        const solanaWallets: Wallet[] = currentWallets.filter(isSolanaWallet);

        setWallets(solanaWallets);
    }, []);

    return {
        wallets
    }
}
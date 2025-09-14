// import { toUiWallet } from "@/utils/ui-wallet";
import { getWallets, Wallet } from "@wallet-standard/core";
// import { UiWallet } from "@wallet-standard/react";
import { useEffect, useState } from "react";

const isSolanaWallet = (wallet: Wallet) =>  wallet.chains.some(chain => chain.startsWith("solana:"));

/**
 * 
 * @returns All registered Solana wallets
 */
export function useWalletDiscovery() {
    const [wallets, setWallets] = useState<Wallet[]>([]);

    useEffect(() => {
        let mounted = true;

        // Add all available initial wallets
        const api = getWallets();
        const currentWallets: readonly Wallet[] = api.get();
        console.log("Current Wallets:", currentWallets);
        const solanaWallets: Wallet[] = currentWallets.filter(isSolanaWallet);

        setWallets(solanaWallets);

        // Add wallets that register later without having to reload page
        const onRegister = (wallet: Wallet | Wallet[]) => {
            if (!mounted){
                return;
            }
            const walletsArray = Array.isArray(wallet) ? wallet : [wallet];
            const newSolanaWallets = walletsArray.filter(isSolanaWallet);

            setWallets(prev => {
                const existingWallets = new Set(prev.map(w => w.name));
                return [...prev, ...newSolanaWallets.filter(w => !existingWallets.has(w.name))];
            })
        }

        // Remove wallets that unregister without having to reload page
        const onUnregister = (wallet: Wallet | Wallet[]) => {
            if (!mounted) {
                return;
            }
            const walletsArray = Array.isArray(wallet) ? wallet : [wallet];
            const oldSolanaWallets = walletsArray.filter(isSolanaWallet);

            setWallets(prev => {
                const unregisteredWallets = new Set(oldSolanaWallets.map(w => w.name));
                return [...prev.filter(w => !unregisteredWallets.has(w.name))];
            })
        }

        api.on("register", onRegister);
        api.on("unregister", onUnregister);
        return () => {
            mounted = false;
        }

    }, []);

    return {
        wallets
    }
}
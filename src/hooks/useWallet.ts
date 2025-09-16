import { useCallback, useState } from "react";
import { useWalletDiscovery } from "./useWalletDiscovery";
import type { StandardConnectFeature, StandardDisconnectFeature, Wallet, WalletAccount } from "@wallet-standard/core";
import { toUiWallet } from "@/utils/ui-wallet";

export function useWalletHook() {
    const { wallets } = useWalletDiscovery();
    const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
    const [accounts, setAccounts] = useState<readonly WalletAccount[]>([]);

    const connected = !!selectedWallet;

    const getConnectFeature = useCallback((wallet: Wallet) => {
        return wallet.features["standard:connect"] as StandardConnectFeature["standard:connect"] | undefined;
    }, [])

    const getDisconnectFeature = useCallback((wallet: Wallet) => {
        return wallet.features["standard:disconnect"] as StandardDisconnectFeature["standard:disconnect"] | undefined;
    }, [])

    /**
     * Connects to a given wallet and saves the outputted accounts
     * @param wallet 
     * @returns 
     */
    const connect = useCallback(async (wallet: Wallet | null) => {
        if (!wallet) {
            setSelectedWallet(null);
            return;
        }

        const connectFeature = getConnectFeature(wallet);
        if (connectFeature) {
            try {
                const output = await connectFeature.connect();
                setAccounts(output.accounts);
            } catch (err) {
                console.error(`An error occured trying to connect to wallet ${wallet.name}:`, err);
                return;
            }
        } else {
            console.warn(`No connect feature found on wallet ${wallet.name}`);
            return;
        }

        setSelectedWallet(wallet);
    }, [getConnectFeature])

    /**
     * Disconnects from wallet currently connected to
     * @returns 
     */
    const disconnect = useCallback(async () => {
        if (!connected || !selectedWallet) return;

        const disconnectFeature = getDisconnectFeature(selectedWallet);
        if (disconnectFeature) {
            try {
                await disconnectFeature.disconnect();
            } catch (err) {
                console.error(`An error occured trying to disconnect from wallet ${selectedWallet.name}:`, err);
                return;
            }
        } else {
            console.warn(`No disconnect feature found on wallet ${selectedWallet.name}`);
            return;
        }
        setSelectedWallet(null);
        setAccounts([]);
    }, [connected, selectedWallet, getDisconnectFeature]);

    return {
        wallets,
        wallet: selectedWallet,
        accounts,
        connected,
        connect,
        disconnect,
        uiWallet: selectedWallet ? toUiWallet(selectedWallet) : null
    }
}
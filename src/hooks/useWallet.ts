import { useState } from "react";
import { useWalletDiscovery } from "./useWalletDiscovery";
import { UiWallet } from "@wallet-standard/react";
import type { StandardConnectFeature, StandardDisconnectFeature, Wallet } from "@wallet-standard/core";

export function useWallet() {
    const {wallets} = useWalletDiscovery();
    const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
    const [connected, setConnected] = useState<boolean>(false);

    const selectWallet = async (wallet: Wallet | null) => {
        if (!wallet) {
            setSelectedWallet(null);
            setConnected(false);
            return;
        }
        const connectFeature = wallet.features["standard:connect"] as StandardConnectFeature["standard:connect"] | undefined;
        if (connectFeature) {
            console.log("Connect feature found:", connectFeature);
            await connectFeature.connect();
        } else {
            alert(`No connect feature found on wallet ${wallet.name}`);
        }
        setSelectedWallet(wallet);
        setConnected(true);
    }

    const disconnect = async () => {
        if (!connected || !selectedWallet) return;

        const disconnectFeature = selectedWallet?.features["standard:disconnect"] as StandardDisconnectFeature["standard:disconnect"] | undefined;
        if (disconnectFeature) {
            console.log("Disconnect feature found:", disconnectFeature);
            await disconnectFeature.disconnect();
        } else {
            alert(`No disconnect feature found on wallet ${selectedWallet.name}`)
        }
        setSelectedWallet(null);
        setConnected(false);
    }

    return {
        wallets,
        selectedWallet,
        selectWallet,
        connected,
        disconnect
    }
}
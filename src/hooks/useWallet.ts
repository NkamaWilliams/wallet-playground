import { useCallback, useState } from "react";
import { useWalletDiscovery } from "./useWalletDiscovery";
import type { StandardConnectFeature, StandardDisconnectFeature, Wallet, WalletAccount } from "@wallet-standard/core";
import { toUiWallet } from "@/utils/ui-wallet";
import { SolanaTransaction } from "@/wallet-types/transaction";
import { getTransactionCodec, getTransactionEncoder } from "gill";
import { SolanaSignAndSendTransactionFeature, SolanaSignTransactionFeature } from "@solana/wallet-standard-features";

export function useWalletHook() {
    const { wallets } = useWalletDiscovery();
    const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
    const [accounts, setAccounts] = useState<readonly WalletAccount[]>([]);

    const connected = !!selectedWallet;

    const getSignTransactionFeature = useCallback((wallet: Wallet) => {
        // return wallet.features["solana:signAndSendTransaction"] as SolanaSignAndSendTransactionFeature["solana:signAndSendTransaction"] | undefined;
        return wallet.features["solana:signTransaction"] as SolanaSignTransactionFeature["solana:signTransaction"] | undefined;
    }, [])

    const getSignAndSendTransactionFeature = useCallback((wallet: Wallet) => {
        // return wallet.features["solana:signAndSendTransaction"] as SolanaSignAndSendTransactionFeature["solana:signAndSendTransaction"] | undefined;
        return wallet.features["solana:signAndSendTransaction"] as SolanaSignAndSendTransactionFeature["solana:signAndSendTransaction"] | undefined;
    }, [])

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
            return;
        }
        setSelectedWallet(wallet)
        const connectFeature = getConnectFeature(wallet);
        if (connectFeature) {
            try {
                const output = await connectFeature.connect();
                console.log(output)
                setAccounts(output.accounts);
            } catch (err) {
                console.error(`An error occured trying to connect to wallet ${wallet.name}:`, err);
                setSelectedWallet(null);
            }
        } else {
            console.warn(`No connect feature found on wallet ${wallet.name}`);
            setSelectedWallet(null);
        }
        console.log(wallet);
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

    const signAndSendTransaction = useCallback(async (tx: Uint8Array) => {
        if (!connected || !selectedWallet) throw new Error("Select a wallet to use this function");

        const signTransactionFeature = getSignAndSendTransactionFeature(selectedWallet);
        console.log(signTransactionFeature);
        console.log("TX:", tx);
        const result = await signTransactionFeature?.signAndSendTransaction({
            account: accounts[0],
            transaction: tx,
            chain: "solana:devnet",
        });
        console.log("RESULT:", result);
        if (result) {
            return result[0].signature;
        }
    }, [connected, selectedWallet, accounts]);

    const signTransaction = useCallback(async (tx: Uint8Array) => {
        if (!connected || !selectedWallet) throw new Error("Select a wallet to use this function");

        const signTransactionFeature = getSignTransactionFeature(selectedWallet);
        console.log(signTransactionFeature);
        console.log("TX:", tx);
        const result = await signTransactionFeature?.signTransaction({
            account: accounts[0],
            transaction: tx,
            chain: "solana:devnet",
        });
        console.log("RESULT:", result);
        if (result) {
            return result[0].signedTransaction;
        }
    }, [connected, selectedWallet, accounts]);

    return {
        wallets,
        wallet: selectedWallet,
        accounts,
        connected,
        connect,
        disconnect,
        uiWallet: selectedWallet ? toUiWallet(selectedWallet) : null,
        signTransaction,
        signAndSendTransaction
    }
}
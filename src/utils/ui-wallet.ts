import { Wallet } from "@wallet-standard/core";
import type { UiWallet, UiWalletAccount } from "@wallet-standard/react";

/**
 * Converts an object of type {@link Wallet} into one of type {@link UiWallet}
 * @param wallet 
 * @returns UiWallet
 */
export function toUiWallet(wallet: Wallet): UiWallet {
    const accounts: UiWalletAccount[] = wallet.accounts.map(acc => {
        return {
            '~uiWalletHandle': Symbol(),
            address: acc.address,
            chains: acc.chains,
            icon: acc.icon,
            label: acc.label,
            publicKey: acc.publicKey
        } as UiWalletAccount
    });

    // const UI_WALLET_HANDLE = Symbol('UiWalletHandle');
    return {
        '~uiWalletHandle': Symbol(),
        chains: wallet.chains,
        icon: wallet.icon,
        name: wallet.name,
        version: wallet.version,
        features: Object.keys(wallet.features),
        accounts
    } as UiWallet
}
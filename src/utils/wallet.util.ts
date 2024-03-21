import {
  Wallet,
  HDNodeWallet,
  getBytes,
  zeroPadValue,
  toBeHex,
  getAddress,
} from "ethers";
import { TokenSigner } from "jsontokens";

import { Any } from "@/types/any.type";
import { WalletOptions } from "@/types/wallet.type";

export function createOrLoadWallet(
  options: WalletOptions,
): Wallet | HDNodeWallet {
  const { privateKey, encrypted } = options;

  if (privateKey) return new Wallet(privateKey);
  else if (encrypted)
    return Wallet.fromEncryptedJsonSync(encrypted.data, encrypted.password);
  else return Wallet.createRandom();
}

export function signWithES256K(
  wallet: Wallet | HDNodeWallet,
  data: Any,
): string {
  const signer = new TokenSigner("ES256K", wallet.privateKey.slice(2));
  return signer.sign(data);
}

export function signV2WithdrawCheck(
  wallet: Wallet | HDNodeWallet,
  targetAddress: string,
  contractAddress: string,
  amount: bigint,
  withdrawn: bigint,
) {
  const message =
    targetAddress +
    zeroPadValue(toBeHex(amount), 32).slice(2) +
    getAddress(contractAddress).slice(2) +
    zeroPadValue(toBeHex(withdrawn), 32).slice(2);
  return wallet.signMessageSync(getBytes(message));
}

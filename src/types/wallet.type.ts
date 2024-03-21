export type EncryptedWallet = {
  data: string;
  password: string;
};

export type WalletOptions =
  | { privateKey?: undefined; encrypted?: undefined }
  | { privateKey: string; encrypted?: undefined }
  | { privateKey?: undefined; encrypted: EncryptedWallet };

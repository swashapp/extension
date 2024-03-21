import { PreferencesStorage } from "./preferences.type";
import { PrivacyStorage } from "./privacy.type";

export type Before108Backup = {
  configs: { version: string; encryptedWallet: string; salt: string };
};

export type After108Backup = {
  configs: { version: string; salt: string };
  profile: { encryptedWallet: string };
};

export type LegacyBackupFormat = Before108Backup | After108Backup;

export type BackupFormat = {
  version: number;
  wallet: string;
  privacy?: PrivacyStorage;
  preferences?: {
    extension?: PreferencesStorage;
  };
};

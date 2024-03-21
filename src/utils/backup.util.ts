import { BaseError } from "@/base-error";
import { SystemMessage } from "@/enums/message.enum";
import {
  After108Backup,
  Before108Backup,
  LegacyBackupFormat,
} from "@/types/storage/backup.type";
import { EncryptedWallet } from "@/types/wallet.type";
import { isGreaterThan } from "@/utils/version.util";

export function getLegacyWallet(backup: LegacyBackupFormat): EncryptedWallet {
  let data: string;

  const password = backup?.configs?.salt;
  if (isGreaterThan(backup?.configs?.version, "1.0.8"))
    data = (backup as After108Backup)?.profile?.encryptedWallet;
  else data = (backup as Before108Backup)?.configs?.encryptedWallet;

  if (!password || !data)
    throw new BaseError(SystemMessage.INVALID_BACKUP_FILE);

  return { data, password };
}

import {
  getBytes,
  HDNodeWallet,
  solidityPackedKeccak256,
  Wallet,
} from "ethers";

import { BaseError } from "@/base-error";
import { AppCoordinator } from "@/core/app-coordinator";
import { BaseStorageManager } from "@/core/base/storage.manager";
import { SystemMessage } from "@/enums/message.enum";
import { WithdrawType } from "@/enums/withdraw.enum";
import { Any } from "@/types/any.type";
import { WalletOptions } from "@/types/wallet.type";
import { createOrLoadWallet, signWithES256K } from "@/utils/wallet.util";
import { getSolidityType } from "@/utils/web3.util";

export class WalletManager extends BaseStorageManager<string> {
  private static instance: WalletManager;
  private wallet!: Wallet | HDNodeWallet;

  private constructor(private coordinator: AppCoordinator) {
    super(Wallet.createRandom().privateKey);
    this.logger.debug("Wallet manager instance created");
  }

  public override async init() {
    await super.init();
    this.wallet = new Wallet(this.get());
  }

  public static async getInstance(
    coordinator: AppCoordinator,
  ): Promise<WalletManager> {
    if (!WalletManager.instance) {
      WalletManager.instance = new WalletManager(coordinator);
      await WalletManager.instance.init();
    }
    return WalletManager.instance;
  }

  public getAddress(): string {
    return this.wallet.address;
  }

  public getSigner(): Wallet | HDNodeWallet {
    return this.wallet;
  }

  public async assign(options: WalletOptions): Promise<void> {
    if (!this.coordinator.isReady()) {
      const address = this.wallet.address;
      this.wallet = createOrLoadWallet(options);
      await this.set(this.wallet.privateKey);
      this.logger.info(
        `Wallet updated from ${address} to ${this.wallet.address}`,
      );
    } else {
      this.logger.error("Reassign wallet not allowed");
      throw new BaseError(SystemMessage.NOT_ALLOWED_REASSIGN_WALLET);
    }
  }

  public signToken(data: { timestamp: number; device_key?: string }): string {
    this.logger.debug("Signing token with wallet");
    const payload: Any = {
      public_key: this.wallet.signingKey.compressedPublicKey,
      ...data,
    };
    return signWithES256K(this.wallet, payload);
  }

  public signCheck(type: WithdrawType, ...args: Any[]): string {
    this.logger.debug("Signing check message");
    const values: Any[] = [type, this.wallet.address];
    if (args) values.push(...args);

    return this.wallet.signMessageSync(
      getBytes(
        solidityPackedKeccak256(
          values.map((value) => getSolidityType(value)),
          values,
        ),
      ),
    );
  }
}

import {
  getBytes,
  HDNodeWallet,
  solidityPackedKeccak256,
  Wallet,
} from "ethers";
import { TokenSigner } from "jsontokens";

import { AppCoordinator } from "@/core/app-coordinator";
import { BaseStorageManager } from "@/core/base/storage.manager";
import { BaseError } from "@/core/base-error";
import { SystemMessage } from "@/enums/message.enum";
import { WithdrawType } from "@/enums/withdraw.enum";
import { Any } from "@/types/any.type";
import { getSolidityType } from "@/utils/web3.util";

export class WalletManager extends BaseStorageManager<string> {
  private static instance: WalletManager;

  private wallet!: Wallet | HDNodeWallet;
  private address!: string;

  private constructor(private coordinator: AppCoordinator) {
    super(WalletManager.name, Wallet.createRandom().privateKey);
  }

  public override async init() {
    await super.init();
    this.wallet = new Wallet(this.get());
    this.address = await this.wallet.getAddress();
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
    return this.address;
  }

  public async assign(options: {
    privateKey?: string;
    encrypted?: { data: string; password: string };
  }): Promise<void> {
    const { privateKey, encrypted } = options;

    if (this.coordinator.isInOnboarding()) {
      if (privateKey) this.wallet = new Wallet(privateKey);
      else if (encrypted)
        this.wallet = Wallet.fromEncryptedJsonSync(
          encrypted.data,
          encrypted.password,
        );
      else this.wallet = Wallet.createRandom();

      this.address = await this.wallet.getAddress();
      await this.set(this.wallet.privateKey);
    } else throw new BaseError(SystemMessage.NOT_ALLOWED_REASSIGN_WALLET);
  }

  public signToken(data: { timestamp: number; device_key?: string }): string {
    const payload: Any = {
      public_key: this.wallet.signingKey.compressedPublicKey,
      ...data,
    };
    const signer = new TokenSigner("ES256K", this.wallet.privateKey.slice(2));
    return signer.sign(payload);
  }

  public signCheck(type: WithdrawType, ...args: Any[]): string {
    const values: Any[] = [type, this.address];
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

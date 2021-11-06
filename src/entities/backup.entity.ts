import { Entity } from './entity';

export class BackupEntity extends Entity<string> {
  private static instance: BackupEntity;

  public static async getInstance(): Promise<BackupEntity> {
    if (!this.instance) {
      this.instance = new BackupEntity();
      await this.instance.init();
    }
    return this.instance;
  }

  private constructor() {
    super('_backup');
  }

  protected async init(): Promise<void> {
    await this.create('');
  }
}

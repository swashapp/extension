export class Mutex {
  private _locked = false;
  private waiting: (() => void)[] = [];

  public async lock(): Promise<void> {
    if (this._locked) {
      await new Promise<void>((resolve) => this.waiting.push(resolve));
    }
    this._locked = true;
  }

  public unlock(): void {
    if (this.waiting.length > 0) {
      const resolve = this.waiting.shift();
      if (resolve) resolve();
    } else {
      this._locked = false;
    }
  }
}

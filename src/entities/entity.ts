import browser from 'webextension-polyfill';

import { Any } from '../types/any.type';
import { commonUtils } from '../utils/common.util';

export abstract class Entity<Type> {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  protected cache: Type;
  protected readonly name;

  protected constructor(name: string) {
    console.log(`Initializing ${name} local storage`);
    this.name = name;
  }

  protected abstract init(): Promise<void>;

  protected async create(value: Type): Promise<void> {
    const _value = await browser.storage.local.get(this.name);
    if (!(this.name in _value)) {
      await browser.storage.local.set({ [this.name]: value });
      this.cache = value;
      console.log(`Entity ${this.name} is created`);
    } else {
      this.cache = _value[this.name];
      console.log(`Entity ${this.name} is loaded`);
    }
  }

  public async get(cache = true): Promise<Type> {
    if (!cache) {
      const record = await browser.storage.local.get(this.name);
      this.cache = record[this.name];
    }
    return this.cache;
  }

  public async save(value: Type): Promise<void> {
    if (!value) return;

    await browser.storage.local.set({ [this.name]: value });
    this.cache = value;
  }

  protected async saveCache(): Promise<void> {
    await browser.storage.local.set({ [this.name]: this.cache });
  }

  public async update(key: string, newValue: Any): Promise<void> {
    const value = await this.get();
    commonUtils.jsonUpdate(value, { [key]: newValue });
    await this.save(value);
  }
}

import browser from 'webextension-polyfill';

import { utils } from '../js/utils';
import { Any } from '../types/any.type';

export abstract class Entity<Type> {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  protected cache: Type;
  protected readonly name;

  protected constructor(name: string) {
    this.name = name;
  }

  protected abstract init(): Promise<void>;

  protected async create(value: Type): Promise<void> {
    const _value = await browser.storage.local.get(this.name);
    if (!(this.name in _value)) {
      await browser.storage.local.set({ [this.name]: value });
      this.cache = value;
    } else {
      this.cache = _value[this.name];
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
    await browser.storage.local.set({ [this.name]: value });
    this.cache = value;
  }

  protected async saveCache(): Promise<void> {
    await browser.storage.local.set({ [this.name]: this.cache });
  }

  public async update(key: string, newValue: Any): Promise<void> {
    const value = await this.get();
    utils.jsonUpdate(value, newValue);
    await this.save(value);
  }
}

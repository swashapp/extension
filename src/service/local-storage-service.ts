export enum STORAGE_KEY {
  TOUR = 'tour',
}

export class LocalStorageService {
  static save(key: STORAGE_KEY, value: { [key: string]: unknown }): void {
    const _value = LocalStorageService.load(key);
    localStorage.setItem(key, JSON.stringify({ ..._value, ...value }));
  }
  static load(key: STORAGE_KEY): { [key: string]: unknown } {
    return JSON.parse(localStorage.getItem(key) || '{}');
  }
}

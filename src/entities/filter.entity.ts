import { internalFilters } from '../core/internalFilters';
import { Filter } from '../types/storage/filter.type';

import { Entity } from './entity';

export class FilterEntity extends Entity<Filter[]> {
  private static instance: FilterEntity;

  public static async getInstance(): Promise<FilterEntity> {
    if (!this.instance) {
      this.instance = new FilterEntity();
      await this.instance.init();
    }
    return this.instance;
  }

  private constructor() {
    super('filters');
  }

  protected async init(): Promise<void> {
    await this.create(internalFilters);
  }

  public async upgrade(): Promise<void> {
    const filters = this.cache.filter((filter: Filter) => {
      return !filter.internal;
    });
    for (const f of internalFilters) {
      filters.push(f);
    }
    return this.save(filters);
  }
}

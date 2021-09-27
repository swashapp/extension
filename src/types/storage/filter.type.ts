import { FilterType } from '../../enums/filter.enum';

export type Filter = {
  type: FilterType;
  value: string;
  internal: boolean;
};

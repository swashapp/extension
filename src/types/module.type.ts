import { Any } from './any.type';

export type Module = {
  name: string;
  category: string;
  version: number;
  functions: string[];
  [key: string]: Any;
};

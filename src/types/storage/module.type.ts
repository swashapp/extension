import { Any } from '../any.type';

type Functions = 'browsing' | 'content';

export type Modules = {
  [key: string]: Module;
};

export type Module = {
  name: string;
  description: string;
  functions: Functions[];
  is_enabled: boolean;
  privacyLevel: number;
  anonymityLevel: number;
  category: string;
  version: number;
  browsing: Any;
  content: Any;
  context: Any;
};

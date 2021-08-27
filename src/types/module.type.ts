import { Stream } from '../enums/stream.enum';

import { Any } from './any.type';

export type Modules = {
  [key: string]: Module;
};

export type Module = {
  name: string;
  description: string;
  functions: Any | string[];
  is_enabled: boolean;
  privacyLevel: number;
  anonymityLevel: number;
  category: Stream;
  version: number;
  content: Any;
  context: Any;
};

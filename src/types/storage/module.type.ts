import { Any } from '../any.type';

export type ModuleFunction =
  | 'browsing'
  | 'content'
  | 'apiCall'
  | 'context'
  | 'task';

export type Modules = {
  [key: string]: Module;
};

export type Module = {
  name: string;
  description: string;
  functions: ModuleFunction[];
  is_enabled: boolean;
  privacyLevel: number;
  anonymityLevel: number;
  category: string;
  version: number;
  browsing?: Any;
  content?: Any;
  context?: Any;
  apiCall?: Any;
  task?: Any;
};

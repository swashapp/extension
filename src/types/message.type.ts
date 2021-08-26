import { Any } from './any.type';

export type MessageHeader = {
  id: string;
  module: string;
  function: string;
  collector: string;
  category: string;
  privacyLevel: number;
  anonymityLevel: number;
  version: string;
  agent: string;
  platform: Any;
  language: string;
  [key: string]: Any;
};

export type MessageIdentity = {
  uid: string;
  country: string;
  city: string;
  gender: string;
  age: string;
  income: string;
  agent: string;
  platform: Any;
  language: string;
};

export type Message = {
  origin?: string;
  header: MessageHeader;
  identity: MessageIdentity;
  data: Any;
};

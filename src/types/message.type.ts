import { StreamCategory } from "@/enums/stream.enum";

import { Any } from "./any.type";

export type MessageHeader = {
  id: string;
  module: string;
  function: string;
  collector: string;
  category: StreamCategory;
  privacyLevel: number;
  anonymityLevel: number;
  createdAt: number;
  version?: string;
};

export type MessageIdentity = {
  publisherId: string;
  sessionId?: string;
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

export type CollectedMessage = Omit<Message, "identity">;

export type MessageStats = {
  module: string;
  count: number;
  sent: number;
};

export type MessageRecord = {
  id: number;
  timestamp: number;
  message: Message;
};

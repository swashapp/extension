import { Message } from './message.type';

export type Stream = {
  produceNewEvent: (msg: Message) => void;
};

import { Stream } from '../../enums/stream.enum';

export type StreamConfigs = {
  [key in Stream]: { streamId: string };
};

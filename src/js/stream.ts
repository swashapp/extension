import { Message } from '../types/message.type';
import { Stream } from '../types/stream.type';

import { communityHelper } from './communityHelper';
import { databaseHelper } from './databaseHelper';

// Create the client and give the API key to use by default

const stream = function (streamId: string): Stream {
  const client = communityHelper.getStreamrClient();
  // Wrap event generation and producion into this method
  function produceNewEvent(msg: Message) {
    // Produce the event to the Stream

    client
      .publish(streamId, msg)
      .then(async () => {
        console.log('message published successfully');
        await databaseHelper.updateMessageCount(msg.header.module);
      })
      .catch((err) => {
        console.error(`"Error on publishing message: ${err}`);
      });
  }
  return {
    produceNewEvent,
  };
};

export { stream };

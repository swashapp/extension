// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { communityHelper } from './communityHelper';
import { databaseHelper } from './databaseHelper';
// Create the client and give the API key to use by default

const stream = function (streamId) {
  const client = communityHelper.getStreamrClient();
  // Wrap event generation and producion into this method
  function produceNewEvent(msg) {
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

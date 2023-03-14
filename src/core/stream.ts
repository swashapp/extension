import { ProxyDirection } from 'streamr-client';

import { Message } from '../types/message.type';
import { Stream } from '../types/stream.type';

import { databaseHelper } from './databaseHelper';
import { userHelper } from './userHelper';

// Create the client and give the API key to use by default

const stream = async function (
  streamId: string,
  proxies: string[],
  minProxies: number,
): Promise<Stream> {
  const client = userHelper.getStreamrClient();
  await client?.setProxies(
    streamId,
    proxies,
    ProxyDirection.PUBLISH,
    minProxies,
  );

  // Wrap event generation and production into this method
  function produceNewEvent(msg: Message) {
    // Produce the event to the Stream
    client
      ?.publish(streamId, msg)
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

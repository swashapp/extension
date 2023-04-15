import { ProxyDirection } from 'streamr-client';

import { Any } from '../types/any.type';
import { Message } from '../types/message.type';
import { StreamInfo } from '../types/storage/configs/stream.type';
import { Stream } from '../types/stream.type';

import { databaseHelper } from './databaseHelper';
import { userHelper } from './userHelper';

// Create the client and give the API key to use by default

const stream = async function (
  useClient: boolean,
  useApi: boolean,
  endpoint: string,
  streamInfo: StreamInfo,
): Promise<Stream> {
  let sessionId: string | null = '';
  let proxyEstablished = false;
  const { streamId, proxies, minProxies } = streamInfo;
  const header = 'Swash-Session-Token';
  const url = endpoint + encodeURIComponent(streamId);
  const client = userHelper.getStreamrClient();

  async function setProxy() {
    if (!proxyEstablished) {
      await client?.setProxies(
        streamId,
        proxies,
        ProxyDirection.PUBLISH,
        minProxies,
      );
      console.log(`Proxy set successfully for stream ${streamInfo.streamId}`);
      proxyEstablished = true;
    }
  }

  async function publish(msg: Message) {
    let session = {};
    if (sessionId) {
      session = {
        [header]: sessionId,
      };
    }

    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${await userHelper.generateJWT()}`,
        ...session,
      },
      body: JSON.stringify(msg),
    });

    if (resp.status === 200) {
      sessionId = resp.headers.get(header);
    } else throw new Error('Can not publish message');
  }

  function produceNewEvent(msg: Message) {
    if (useApi) {
      publish(msg)
        .then(async () => {
          console.log('message published successfully using api');
          await databaseHelper.updateMessageCount(msg.header.module);
        })
        .catch((err: Any) => {
          console.error(`"Error on publishing message using api: ${err}`);
        });
    }
    if (useClient) {
      setProxy().then(() => {
        client
          ?.publish(streamId, msg)
          .then(async () => {
            console.log('message published successfully using client');
            await databaseHelper.updateMessageCount(msg.header.module);
          })
          .catch((err: Any) => {
            console.error(`"Error on publishing message using client: ${err}`);
          });
      });
    }
  }
  return {
    produceNewEvent,
  };
};

export { stream };

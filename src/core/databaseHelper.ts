import { Connection, DATA_TYPE } from 'jsstore';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import JsStoreWorker from 'jsstore/dist/jsstore.worker.min';

import { MessageRecord } from '../types/db.type';
import { Message } from '../types/message.type';

// This will ensure that we are using only one instance.
// Otherwise due to multiple instance multiple worker will be created.
const databaseHelper = (function () {
  'use strict';

  const dbName = 'SwashDBV3';
  let connection: Connection;
  async function init() {
    if (!connection) {
      connection = new Connection(new Worker(JsStoreWorker));
      await initJsStore();
    }
  }
  function getDbSchema() {
    const tblMessage = {
      name: 'messages',
      columns: {
        id: {
          primaryKey: true,
          autoIncrement: true,
        },
        createTime: {
          notNull: true,
          dataType: DATA_TYPE.Number,
        },
        message: {
          notNull: true,
          dataType: DATA_TYPE.Object,
        },
      },
    };

    const tblStats = {
      name: 'stats',
      columns: {
        moduleName: {
          primaryKey: true,
        },
        messageCount: {
          notNull: true,
          dataType: DATA_TYPE.Number,
        },
        lastSent: {
          notNull: true,
          dataType: DATA_TYPE.Number,
        },
      },
    };

    return {
      name: dbName,
      tables: [tblMessage, tblStats],
    };
  }

  async function initJsStore() {
    const isDbCreated = await connection.initDb(getDbSchema());
    if (isDbCreated) {
      console.log('Message database created');
    } else {
      console.log('Message database opened');
    }
  }

  function updateMessageCount(moduleName: string) {
    const currentTime = Number(new Date().getTime());
    return connection
      .update({
        in: 'stats',
        set: {
          messageCount: {
            '+': 1,
          },
          lastSent: currentTime,
        },
        where: {
          moduleName: moduleName,
        },
      })
      .then(function (rowsUpdated) {
        if (rowsUpdated === 0) {
          const row = {
            moduleName: moduleName,
            lastSent: currentTime,
            messageCount: 1,
          };
          //since Id is autoincrement column, so the row will be automatically generated.
          connection
            .insert({
              into: 'stats',
              values: [row],
            })
            .then()
            .catch((err) => {
              console.error(err);
            });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }

  const getMessageCount = async (moduleName: string) => {
    const rows = await connection.select<{ messageCount: number }>({
      from: 'stats',
      where: {
        moduleName: moduleName,
      },
    });
    return rows && rows[0] && rows[0]['messageCount']
      ? rows[0]['messageCount']
      : 0;
  };

  const getTotalMessageCount = async (): Promise<number> => {
    const rows = await connection.select<{ 'sum(messageCount)': number }>({
      from: 'stats',
      aggregate: {
        sum: 'messageCount',
      },
    });
    return rows && rows[0] && rows[0]['sum(messageCount)']
      ? rows[0]['sum(messageCount)']
      : 0;
  };

  const getLastSentDate = async (): Promise<number> => {
    const rows = await connection.select<{ 'max(lastSent)': number }>({
      from: 'stats',
      aggregate: {
        max: 'lastSent',
      },
    });
    return rows && rows[0] && rows[0]['max(lastSent)']
      ? rows[0]['max(lastSent)']
      : 0;
  };

  function insertMessage(message: Message) {
    const currentTime = Number(new Date().getTime());
    const row = {
      createTime: currentTime,
      message: message,
    };
    //since Id is autoincrement column, so the row will be automatically generated.
    return connection
      .insert({
        into: 'messages',
        values: [row],
      })
      .then()
      .catch((err) => {
        console.error(err);
      });
  }

  async function getAllMessages() {
    return await connection.select({
      from: 'messages',
    });
  }

  async function getReadyMessages(time: number) {
    return await connection.select<MessageRecord>({
      from: 'messages',
      where: {
        createTime: {
          '<=': time,
        },
      },
    });
  }

  async function removeReadyMessages(time: number) {
    return connection
      .remove({
        from: 'messages',
        where: {
          createTime: {
            '<=': time,
          },
        },
      })
      .then()
      .catch((err) => {
        console.error(err);
      });
  }

  function removeMessage(id: number) {
    return connection
      .remove({
        from: 'messages',
        where: {
          id: id,
        },
      })
      .then()
      .catch((err) => {
        console.error(err);
      });
  }

  return {
    updateMessageCount,
    getMessageCount,
    getTotalMessageCount,
    getLastSentDate,
    init,
    insertMessage,
    getAllMessages,
    getReadyMessages,
    removeReadyMessages,
    removeMessage,
  };
})();
export { databaseHelper };

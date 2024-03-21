import { BaseDatabase } from "@/core/base/database.service";
import { MessageTables } from "@/core/data/database-tables";
import { Message, MessageRecord } from "@/types/message.type";
import { getTimestamp } from "@/utils/date.util";
import { Logger } from "@/utils/log.util";

export class MessageManager extends BaseDatabase {
  private static instance: MessageManager;

  private constructor() {
    super({
      name: "SwashDatapointsDB",
      version: 1,
      tables: MessageTables,
    });
  }

  public static async getInstance(): Promise<MessageManager> {
    if (!this.instance) {
      this.instance = new MessageManager();
      await this.instance.init();
    }
    return this.instance;
  }

  public async add(message: Message): Promise<number | undefined> {
    try {
      const ids = await this.connection.insert<MessageRecord>({
        into: "messages",
        values: JSON.parse(
          JSON.stringify([
            {
              timestamp: getTimestamp(),
              message: message,
            },
          ]),
        ),
      });
      return typeof ids === "number" ? ids : ids.length;
    } catch (error) {
      Logger.error("Error inserting message:", error);
      return;
    }
  }

  public async getGreaterThan(id: number): Promise<MessageRecord[]> {
    try {
      return await this.connection.select<MessageRecord>({
        from: "messages",
        where: {
          id: {
            ">": id,
          },
        },
      });
    } catch (error) {
      Logger.error("Error fetching all messages:", error);
      return [];
    }
  }

  public async getOlderThan(time: number): Promise<MessageRecord[]> {
    try {
      return await this.connection.select<MessageRecord>({
        from: "messages",
        where: {
          timestamp: {
            "<=": time,
          },
        },
      });
    } catch (error) {
      Logger.error("Error fetching ready messages:", error);
      return [];
    }
  }

  public async remove(id: number): Promise<void> {
    try {
      await this.connection.remove({
        from: "messages",
        where: {
          id,
        },
      });
    } catch (error) {
      Logger.error(`Error removing message with id ${id}:`, error);
    }
  }

  public async removeOlderThan(time: number): Promise<void> {
    try {
      await this.connection.remove({
        from: "messages",
        where: {
          timestamp: {
            "<=": time,
          },
        },
      });
    } catch (error) {
      Logger.error("Error removing ready messages:", error);
    }
  }

  public async increment(module: string): Promise<void> {
    const now = getTimestamp();
    try {
      const rowsUpdated = await this.connection.update({
        in: "stats",
        set: {
          count: {
            "+": 1,
          },
          last: now,
        },
        where: {
          module: module,
        },
      });

      if (rowsUpdated === 0) {
        const row = {
          module: module,
          count: 1,
          last: now,
        };
        await this.connection.insert({
          into: "stats",
          values: [row],
        });
      }
    } catch (error) {
      Logger.error("Error updating message count:", error);
    }
  }
}

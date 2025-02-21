import { BaseDatabase } from "@/core/base/database.service";
import { MessageTables } from "@/core/data/database-tables";
import { Message, MessageRecord } from "@/types/message.type";
import { getTimestamp } from "@/utils/date.util";

export class MessageManager extends BaseDatabase {
  private static instance: MessageManager;

  private constructor() {
    super({
      name: "SwashCollectedDataDB",
      version: 2,
      tables: MessageTables,
    });
  }

  public static async getInstance(): Promise<MessageManager> {
    if (!MessageManager.instance) {
      MessageManager.instance = new MessageManager();
      await MessageManager.instance.init();
      await MessageManager.instance.removeDailyStatsOlderThan(30);
    }
    return MessageManager.instance;
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
      this.logger.debug(`Inserted message with id ${ids}`);
      return typeof ids === "number" ? ids : ids.length;
    } catch (error) {
      this.logger.error("Error inserting message", error);
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
      this.logger.error("Error fetching messages greater than id", error);
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
      this.logger.error("Error fetching messages older than time", error);
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
      this.logger.debug(`Removed message with id ${id}`);
    } catch (error) {
      this.logger.error(`Error removing message with id ${id}`, error);
    }
  }

  public async removeOlderThan(time: number): Promise<void> {
    try {
      const count = await this.connection.remove({
        from: "messages",
        where: {
          timestamp: {
            "<=": time,
          },
        },
      });
      this.logger.debug(`Removed ${count} messages older than`, time);
    } catch (error) {
      this.logger.error(
        "Error removing messages older than specified time",
        error,
      );
    }
  }

  public async increment(module: string): Promise<void> {
    const now = getTimestamp();
    const day = new Date(now).toISOString().substring(0, 10);
    try {
      const rowsUpdatedOverall = await this.connection.update({
        in: "stats",
        set: {
          count: { "+": 1 },
          last: now,
        },
        where: { module: module },
      });

      if (rowsUpdatedOverall === 0) {
        await this.connection.insert({
          into: "stats",
          values: [
            {
              module: module,
              count: 1,
              last: now,
            },
          ],
        });
      }

      const rowsUpdatedDaily = await this.connection.update({
        in: "daily_stats",
        set: {
          count: { "+": 1 },
        },
        where: {
          day: day,
          module: module,
        },
      });

      if (rowsUpdatedDaily === 0) {
        await this.connection.insert({
          into: "daily_stats",
          values: [
            {
              day: day,
              module: module,
              count: 1,
            },
          ],
        });
      }

      this.logger.debug(
        `Updated message count for module ${module} (overall and daily)`,
      );
    } catch (error) {
      this.logger.error("Error updating message count", error);
    }
  }

  public async removeDailyStatsOlderThan(day: number): Promise<void> {
    const date = new Date();
    date.setDate(date.getDate() - day);
    const threshold = date.toISOString().substring(0, 10);

    try {
      await this.connection.remove({
        from: "daily_stats",
        where: {
          day: {
            "<": threshold,
          },
        },
      });
      this.logger.debug(`Removed daily_stats records older than ${threshold}`);
    } catch (error) {
      this.logger.error("Error cleaning old daily_stats", error);
    }
  }
}

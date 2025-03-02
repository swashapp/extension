import { BaseDatabase } from "@/core/base/database.service";
import { Mutex } from "@/core/base/mutex.lock";
import { MessageTables } from "@/core/data/database-tables";
import { Message, MessageRecord } from "@/types/message.type";
import { getTimestamp } from "@/utils/date.util";

export class MessageManager extends BaseDatabase {
  private static instance: MessageManager;
  private readonly incrementMutex = new Mutex();

  private constructor() {
    super({
      name: "SwashCollectedDataDB",
      version: 2,
      tables: MessageTables,
    });
  }

  private async incrementTotalStats(
    module: string,
    now: number,
  ): Promise<void> {
    try {
      const updated = await this.connection.update({
        in: "stats",
        set: {
          count: { "+": 1 },
          last: now,
        },
        where: { module: module },
      });
      if (updated === 0) {
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
      this.logger.debug(`Updated message stats for module ${module}`);
    } catch (error) {
      this.logger.error(
        `Message stats update failed for module ${module}`,
        error,
      );
    }
  }

  private async incrementDailyStats(
    module: string,
    day: string,
  ): Promise<void> {
    try {
      const updated = await this.connection.update({
        in: "daily_stats",
        set: {
          count: { "+": 1 },
        },
        where: {
          day: day,
          module: module,
        },
      });
      if (updated === 0) {
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
      this.logger.debug(`Updated daily message stats for module ${module}`);
    } catch (error) {
      this.logger.error(
        `Daily message stats update failed for module ${module}`,
        error,
      );
    }
  }

  public static async getInstance(): Promise<MessageManager> {
    if (!MessageManager.instance) {
      MessageManager.instance = new MessageManager();
      await MessageManager.instance.init();
      MessageManager.instance.removeDailyStatsOlderThan(30).then();
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
      this.logger.error("Message insertion failed", error);
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
      this.logger.error(
        `Message fetch for id greater than ${id} failed`,
        error,
      );
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
      this.logger.error(`Message fetch for older than ${time} failed`, error);
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
      this.logger.error(`Message removal for id ${id} failed`, error);
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
      this.logger.error(`Message removal for older than ${time} failed`, error);
    }
  }

  public async increment(module: string): Promise<void> {
    await this.incrementMutex.lock();
    const now = getTimestamp();
    const day = new Date(now).toISOString().substring(0, 10);
    try {
      await Promise.all([
        this.incrementTotalStats(module, now),
        this.incrementDailyStats(module, day),
      ]);

      this.logger.debug(
        `Updated message overall and daily stats for module ${module}`,
      );
    } catch (error) {
      this.logger.error(
        `Message overall and daily stats update failed for ${module}`,
        error,
      );
    } finally {
      this.incrementMutex.unlock();
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
      this.logger.debug(`Removed daily stats records older than ${threshold}`);
    } catch (error) {
      this.logger.error("Daily stats removal failed", error);
    }
  }
}

import { Connection } from "jsstore";
import workerInjector from "jsstore/dist/worker_injector";

import { Any } from "@/types/any.type";
import { Logger } from "@/utils/log.util";

interface DbSchema {
  name: string;
  version: number;
  tables: Array<Any>;
}

export abstract class BaseDatabase {
  protected connection!: Connection;
  protected readonly logger = new Logger(this.constructor.name);

  protected constructor(protected schema: DbSchema) {
    this.logger.info("Start initialization");
    this.connection = new Connection();
    this.logger.debug("Database connection instance created");
    this.connection.addPlugin(workerInjector);
    this.logger.info("Initialization completed");
  }

  public async init(): Promise<void> {
    try {
      this.logger.info("Connecting to database");
      this.logger.debug("Begin database connection process");
      await this.connection.initDb(this.schema);
      this.logger.info("Database connection established");
    } catch (error) {
      this.logger.error("Database connection failed", error);
    }
  }
}

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

  protected constructor(protected schema: DbSchema) {
    this.connection = new Connection();
    this.connection.addPlugin(workerInjector);
  }

  public async init(): Promise<void> {
    try {
      await this.connection.initDb(this.schema);
    } catch (err) {
      Logger.error(err);
    }
  }
}

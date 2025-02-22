import { DATA_TYPE } from "jsstore";

export const MessageTables = [
  {
    name: "messages",
    columns: {
      id: {
        primaryKey: true,
        autoIncrement: true,
        dataType: DATA_TYPE.Number,
      },
      timestamp: {
        notNull: true,
        dataType: DATA_TYPE.Number,
      },
      message: {
        notNull: true,
        dataType: DATA_TYPE.Object,
      },
    },
  },
  {
    name: "stats",
    columns: {
      module: {
        primaryKey: true,
        dataType: DATA_TYPE.String,
      },
      count: {
        notNull: true,
        dataType: DATA_TYPE.Number,
      },
      last: {
        notNull: true,
        dataType: DATA_TYPE.Number,
      },
    },
  },
  {
    name: "daily_stats",
    primaryKey: {
      keyPath: ["day", "module"],
      autoIncrement: false,
    },
    columns: {
      day: {
        notNull: true,
        dataType: DATA_TYPE.String,
      },
      module: {
        notNull: true,
        dataType: DATA_TYPE.String,
      },
      count: {
        notNull: true,
        dataType: DATA_TYPE.Number,
      },
    },
  },
];

export const ImageTables = [
  {
    name: "images",
    columns: {
      url: {
        primaryKey: true,
        dataType: DATA_TYPE.String,
      },
      blob: {
        dataType: DATA_TYPE.String,
      },
      copyright: {
        dataType: DATA_TYPE.Object,
      },
    },
  },
];

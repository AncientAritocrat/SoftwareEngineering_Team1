import { initIndexDb, getInstance } from "@vjmap/common";
import serialize from "serialize-javascript";
import type { MapAppConfig } from "~/types";

export type DbRecord = {
  id?: string;
  key: string;
  title?: string;
  mapid?: string;
  version?: string;
  MapApp?: string;
  thumbnail?: string;
  workspace?: string;
  config: string;
  updatetime?: string;
};

export class IndexDbStorage {
  dbName: string;
  tableName: string;
  isInitDb: boolean;
  constructor() {
    this.dbName = "vjmapVisiual";
    this.tableName = "config";
    this.isInitDb = false;
  }

  public async init() {
    if (this.isInitDb) return;
    await initIndexDb({
      dbName: this.dbName, // 数据库名称
      version: 1, // 版本号
      tables: [
        {
          tableName: this.tableName, // 表名
          option: { keyPath: "id", autoIncrement: true }, // 指明主键为id
          indexs: [
            // 数据库索引
            {
              key: "id",
              option: {
                unique: true,
              },
            },
            {
              key: "key",
            },
            {
              key: "title",
            },
            {
              key: "mapid",
            },
            {
              key: "version",
            },
            {
              key: "workspace",
            },
            {
              key: "thumbnail",
            },
            {
              key: "config",
            },
            {
              key: "updatetime",
            }
          ],
        },
      ],
    });
    this.isInitDb = true;
  }
  public getInst() {
    return getInstance(this.dbName);
  }
  public async getAll() {
    await this.init();
    return await this.getInst().queryAll<DbRecord>({
      tableName: this.tableName,
    });
  }

  public async getRecordByKey(key: string) {
    await this.init();
    return await this.getInst().query<DbRecord>({
      tableName: this.tableName,
      condition: (item) => item.key === key,
    });
  }

  public async getRecordByMapId(mapid: string) {
    await this.init();
    return await this.getInst().query<DbRecord>({
      tableName: this.tableName,
      condition: (item) => item.mapid === mapid,
    });
  }

  public async upsert(record: DbRecord) {
    await this.init();
    const records = await this.getRecordByKey(record.key);
    if (records.length == 0) {
      // 新增
      record.updatetime = new Date().getTime() + "";
      return await this.getInst().insert<DbRecord>({
        tableName: this.tableName,
        data: record,
      });
    } else {
      // 修改
      return await this.getInst().update<DbRecord>({
        tableName: this.tableName,
        condition: (item) => item.key === record.key,
        handle: (r) => {
          r.mapid = record.mapid;
          r.version = record.version;
          r.title = record.title;
          r.workspace = record.workspace;
          r.config = record.config;
          r.thumbnail = record.thumbnail;
          r.updatetime = new Date().getTime() + "";
          return r;
        },
      });
    }
  }

  public async deleteRecord(key: string) {
    await this.init();
    return await this.getInst().delete<DbRecord>({
      tableName: this.tableName,
      condition: (item) => item.key === key,
    });
  }

  public async deleteTable() {
    await this.init();
    return await this.getInst().delete_table(this.tableName);
  }

  public async deleteDb() {
    await this.init();
    return await this.getInst().delete_db(this.dbName);
  }

  static toMapAppConfig(configStr: string): MapAppConfig {
    if (!configStr) return {};
    try {
      // eslint-disable-next-line no-eval
      return eval(`(${configStr})`);
    } catch (err) {
      return {};
    }
  }

  static toConfigStr(mapConfig: MapAppConfig): string {
    return serialize(mapConfig, {
      space: 2,
      unsafe: true,
    }).replace(/"(\w+)":\s/g, "$1: ");
  }

  static guid(digit = 8): string {
    return "x".repeat(digit).replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 3) | 8;
      return v.toString(16);
    });
  }
}

const indexDbStorage = new IndexDbStorage();
export default indexDbStorage;

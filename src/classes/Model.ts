import ConvertKeys, { flatList, getQuery } from "../functions/convertKeys";
import IConfig from "../types/Config";
import IQuery, { IRequiredQuery } from "../types/Query";
import { promisify } from "util";
import mysql from 'mysql';
import handleError from "../functions/handleError";
import buildResults from "../functions/buildResults";
import IResults from "../types/Results";
import { resolveArray, resolveData } from "../functions/resolvers";
import buildInput from "../functions/buildInput";
import IFields from "../types/Fields";

export default class Model {
    private config: IConfig;
    private table: string;
    private sql: mysql.Connection;

    constructor(server: mysql.Connection, config: IConfig, table: string) {
        this.table = table;
        this.config = config;
        this.sql = server;
    }

    public async findOne<T = any>(inputQuery: IRequiredQuery): Promise<IResults<T>> {
        return new Promise(async (resolve, reject) => {
            try {
                let queries = await ConvertKeys(inputQuery, this.table)
                let query = getQuery(queries.length > 0 ?
                    `SELECT * FROM ${this.table} WHERE` :
                    `SELECT * FROM ${this.table}`, queries)
                let mySQM = this.getPromise(query);
                let results = await mySQM()
                let success = results.length > 0;
                let parsed = success ? resolveData<T>(results) : {} as T;
                let r = buildResults<T>(parsed, query, queries, this.config, results, success)
                return resolve(r)
            } catch (e) {
                let err = await handleError(e)
                return reject(err)
            }
        })
    }

    public async findAll<T = any>(inputQuery: IQuery): Promise<IResults<T[]>> {
        return new Promise(async (resolve, reject) => {
            try {
                let queries = await ConvertKeys(inputQuery, this.table)
                let query = getQuery(`SELECT * FROM ${this.table}`, queries)
                let mySQM = this.getPromise(query);
                let results = await mySQM()
                let success = results.length > 0;
                let parsed = success ? resolveArray<T>(results) : [] as T[];
                let r = buildResults<T[]>(parsed, query, queries, this.config, results, success)
                return resolve(r)
            } catch (e) {
                let err = await handleError(e)
                return reject(err)
            }
        })
    }

    public async delete(inputQuery: IQuery): Promise<IResults<unknown>> {
        return new Promise(async (resolve, reject) => {
            try {
                let queries = await ConvertKeys(inputQuery, this.table)
                let query = getQuery(queries.length > 0 ?
                    `DELETE FROM ${this.table} WHERE` :
                    `DELETE FROM ${this.table}`, queries)
                let mySQM = this.getPromise(query);
                let results = await mySQM()
                let success = results.affectedRows > 0;
                let r = buildResults<unknown>({}, query, queries, this.config, results, success)
                return resolve(r)
            } catch (e) {
                let err = await handleError(e)
                return reject(err)
            }
        })
    }

    public async updateOne(inputQuery: IRequiredQuery, newFields: IFields): Promise<IResults<unknown>> {
        return new Promise(async (resolve, reject) => {
            try {
                let [query, queries, args] = await buildInput(newFields, this.table, inputQuery);
                let mySQM = this.getPromise(query, ...args);
                let results = await mySQM()
                let success = results.affectedRows > 0;
                let r = buildResults<unknown>({}, query, flatList(queries), this.config, results, success)
                return resolve(r)
            } catch (e) {
                let err = await handleError(e)
                return reject(err)
            }
        })
    }

    public async createOne(newFields: IFields): Promise<IResults<unknown>> {
        return new Promise(async (resolve, reject) => {
            try {
                let [query, queries, args] = await buildInput(newFields, this.table, undefined, true);
                let mySQM = this.getPromise(query, ...args);
                let results = await mySQM()
                let success = results.affectedRows > 0;
                let r = buildResults<unknown>({}, query, flatList(queries), this.config, results, success)
                return resolve(r)
            } catch (e) {
                let err = await handleError(e)
                return reject(err)
            }
        })
    }
    private getPromise(query: string, ...props: any): ReturnType<typeof promisify> {
        let promises = promisify(this.sql.query).bind(this.sql, query, ...props);
        return promises;
    }
}
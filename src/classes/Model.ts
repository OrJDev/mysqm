import ConvertKeys, { flatList, mergeQuery } from "../functions/convertKeys";
import IConfig from "../types/Config";
import IQuery, { IRequiredQuery } from "../types/Query";
import { promisify } from "util";
import mysql from 'mysql';
import handleError from "../functions/handleError";
import buildResults from "../functions/buildResults";
import IResults from "../types/Results";
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

    public findOne<T = any>(inputQuery: IRequiredQuery): Promise<IResults<T>> {
        return new Promise(async (resolve, reject) => {
            try {
                let queries = await ConvertKeys(inputQuery),
                    query = mergeQuery(`SELECT * FROM ${this.table}`, queries),
                    results = await (this.getPromise(query))(),
                    success = results.length > 0,
                    parsed = (success ? results[0] : {}) as T;
                return resolve(buildResults<T>(parsed, query, queries, this.config, results, success))
            } catch (e) { return reject(handleError(e)) }
        })
    }

    public findAll<T = any>(inputQuery: IQuery): Promise<IResults<T[]>> {
        return new Promise(async (resolve, reject) => {
            try {
                let queries = await ConvertKeys(inputQuery),
                    query = mergeQuery(`SELECT * FROM ${this.table}`, queries),
                    results = await (this.getPromise(query))(),
                    success = results.length > 0,
                    parsed = success ? results : [] as T[];
                return resolve(buildResults<T[]>(parsed, query, queries, this.config, results, success))
            } catch (e) { return reject(handleError(e)) }
        })
    }

    public delete(inputQuery: IQuery): Promise<IResults<unknown>> {
        return new Promise(async (resolve, reject) => {
            try {
                let queries = await ConvertKeys(inputQuery),
                    query = mergeQuery(`DELETE FROM ${this.table}`, queries),
                    results = await (this.getPromise(query))(),
                    success = results.affectedRows > 0;
                return resolve(buildResults<unknown>(
                    {},
                    query,
                    queries,
                    this.config,
                    results,
                    success))
            } catch (e) { return reject(handleError(e)) }
        })
    }

    public updateOne(inputQuery: IRequiredQuery, newFields: IFields): Promise<IResults<unknown>> {
        return new Promise(async (resolve, reject) => {
            try {
                let [query, queries, args] = await buildInput(newFields, this.table, inputQuery),
                    results = await (this.getPromise(query, ...args))(),
                    success = results.affectedRows > 0;
                return resolve(buildResults<unknown>(
                    {},
                    query,
                    flatList(queries),
                    this.config,
                    results, success))
            } catch (e) { return reject(handleError(e)) }
        })
    }

    public createOne(newFields: IFields): Promise<IResults<unknown>> {
        return new Promise(async (resolve, reject) => {
            try {
                let [query, queries, args] = await buildInput(newFields, this.table, undefined, true),
                    results = await (this.getPromise(query, ...args))(),
                    success = results.affectedRows > 0;
                return resolve(buildResults<unknown>(
                    {},
                    query,
                    flatList(queries),
                    this.config,
                    results,
                    success))
            } catch (e) { return reject(handleError(e)) }
        })
    }
    private getPromise(query: string, ...props: any): any {
        let promises = promisify(this.sql.query).bind(this.sql, query, ...props);
        return promises;
    }
}
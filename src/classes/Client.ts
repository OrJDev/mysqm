import mysql, { ConnectionConfig } from "mysql";
import Model from "./Model";
import IConfig, { defaultConfig } from "../types/Config";
import IListener, { ICallBack, IEvents } from "../types/Listener";

export default class Client {
    private config: IConfig;
    private server: mysql.Connection;
    private events: Array<IListener> = [];
    constructor(mysqlConfig: ConnectionConfig, config: IConfig = defaultConfig) {
        this.config = config;
        this.server = mysql.createConnection(mysqlConfig);
        this.Init();
    }
    private Init() {
        this.server.connect((err, props) => {
            if (err) {
                throw err;
            } else {
                this.execEvent('connected', props);
            }
        });
    };

    public dissconnect() {
        this.server.end((err) => {
            if (err) {
                throw err;
            } else {
                this.execEvent('disconnected');
            }
        })
    }

    public on(event: IEvents, callback: ICallBack) {
        if (event === 'connected' || event == 'disconnected') {
            this.events.push({ type: event, callback })
        } else {
            this.server.on(event, callback);
        }
    }

    public useModel(table: string) {
        if (!table) throw new Error('Table name is required');
        return new Model(this.server, this.config, table);
    }

    private getEevent(event: IEvents): [boolean, ICallBack | undefined] {
        let item = this.events.find(e => e.type === event);
        return [item ? true : false, item?.callback]
    }
    private execEvent(event: IEvents, props?: any) {
        let [found, callback] = this.getEevent(event);
        if (!found) {
            return false;
        } else {
            if (typeof callback !== 'undefined') {
                callback(props)
                return true;
            }
            return false;
        }
    }
}
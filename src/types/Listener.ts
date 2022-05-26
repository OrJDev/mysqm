export default interface IListener {
    type: IEvents;
    callback: ICallBack;
}
export type ICallBack = (...args: any[]) => void;;
export type IEvents = 'connected' | 'disconnected' | 'result' | 'error' | 'end' | 'fields' | 'packet';


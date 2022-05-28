import IQuery from "../types/Query";
import ConvertKeyAt from "./convertKeyAt";
import handleError from "./handleError";

export default function ConvertKeys(element: IQuery): Promise<any[]> {
    return new Promise(async (resolve, reject) => {
        try {
            let queries: any[] = []
            if (element.where) {
                type IKey = keyof typeof element.where;
                let keys = Object.keys(element.where)
                for (let i = 0; i < keys.length; i++) {
                    let keyAt = keys[i];
                    let elementAt = element.where[keyAt as IKey]
                    let keyResults = await ConvertKeyAt(keyAt, elementAt);
                    keyResults.length > 0 && queries.push(keyResults)
                }
            }
            return resolve(queries)
        } catch (e) { return reject(handleError(e)) }
    })
}

export const flatList = (element: any[]) => element.reduce((acc, curr) => acc.concat(curr), []);
const joinList = (element: any[], query: string) => element.reduce((acc, curr, i) =>
    i !== 0 ?
        acc + ' && ' + curr :
        acc + ' ' + curr, query);
export const getQuery = (query: string, element?: any[]): string => joinList(
    element ? flatList(element) : [], query)
export const mergeQuery = (q: string, queries?: any[]): string => {
    let newQuery = queries && queries.length > 0 ? q + ' WHERE' : q;
    return getQuery(newQuery, queries)
}
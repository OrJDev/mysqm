import IQuery from "../types/Query";
import ConvertKeyAt from "./convertKeyAt";



export default function ConvertKeys(element: IQuery, table: string): Promise<any[]> {
    return new Promise(async (resolve, reject) => {
        try {
            let queries: any[] = []
            if (element.where) {
                let keys = Object.keys(element.where)
                for (let i = 0; i < keys.length; i++) {
                    let keyAt = keys[i];
                    let elementAt = element.where[keyAt as keyof typeof element.where]
                    let keyResults = await ConvertKeyAt(keyAt, elementAt);
                    if (keyResults.length) queries.push(keyResults)
                }
            }
            return resolve(queries)
        } catch (e) {
            return reject(e)
        }
    })
}

export const flatList = (element: any[]) => element.reduce((acc, curr) => acc.concat(curr), []);
const joinList = (element: any[], query: string) => element.reduce((acc, curr, i) =>
    i !== 0 ? acc + ' && ' + curr : acc + ' ' + curr, query);
export const getQuery = (query: string, element?: any[]) => joinList(flatList(element ?? []).flat(), query)
import { IQueryType } from "../types/Query";
import handleError from "./handleError";

export default function ConvertKeyAt(keyAt: any, elementAt: any): Promise<any[]> {
    let queries: any[] = []
    return new Promise((resolve, reject) => {
        try {
            let keys = Object.keys(elementAt);
            for (let i = 0; i < keys.length; i++) {
                let key = keys[i] as IQueryType;
                let query = getKeyAt(key, keyAt, elementAt)
                queries.push(query)
            }
            return resolve(queries)
        } catch (e) { return reject(handleError(e)) }
    })
}


function getKeyAt(elementKey: IQueryType, keyAt: any, elementAt: any): string {
    let sign = elementKey === 'bigger' ? '>' :
        elementKey === 'smaller' ? '<' :
            elementKey === 'eq' ? '=' :
                elementKey === 'neq' ? '<>' :
                    elementKey === 'bigeq' ? '>=' :
      /* if its none of that then it has to be 'smeq' which is smaller or eq*/ '<='
    return `${keyAt} ${sign} "${elementAt[elementKey]}"`
}
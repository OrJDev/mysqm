import { IQueryType } from "../types/Query";

export default function ConvertKeyAt(keyAt: any, elementAt: any): Promise<any[]> {
    let queries: any[] = []
    return new Promise((resolve, reject) => {
        try {
            Object.keys(elementAt).forEach((elementKey: any) => {
                switch (elementKey as IQueryType) {
                    case 'bigger':
                        queries.push(`${keyAt} > ${elementAt[elementKey]}`)
                        break;
                    case 'smaller':
                        queries.push(`${keyAt} < ${elementAt[elementKey]}`)
                        break;
                    case 'eq':
                        queries.push(`${keyAt} = "${elementAt[elementKey]}"`)
                        break;
                    case 'neq':
                        queries.push(`${keyAt} <> "${elementAt[elementKey]}"`)
                        break;
                    case 'bigeq':
                        queries.push(`${keyAt} >= ${elementAt[elementKey]}`)
                        break;
                    case 'smeq':
                        queries.push(`${keyAt} <= ${elementAt[elementKey]}`)
                        break;
                    default:
                        break;
                }
            })
            return resolve(queries)
        } catch (e) {
            return reject(e)
        }
    })
}
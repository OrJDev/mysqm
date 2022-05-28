import IFields, { IOptionalFields } from "../types/Fields";
import { IRequiredQuery } from "../types/Query";
import ConvertKeys, { getQuery } from "./convertKeys";
import handleError from "./handleError";

export default function buildInput(
    fields: IFields,
    table: string,
    inputQuery?: IRequiredQuery,
    create?: boolean
): Promise<[string, any[], any[]]> {
    return new Promise(async (resolve, reject) => {
        let valNames: Array<any> = [],
            values: Array<any> = [],
            names: Array<any> = [],
            args: Array<any> = [];
        try {
            for (const i in fields) {
                let field = fields[i]
                type IKey = keyof typeof field;
                let keys = Object.keys(field);
                for (let j = 0; j < keys.length; j++) {
                    let key = keys[j] as IOptionalFields;
                    if (key === 'special') args.push(field[key as IKey])
                    if (create) {
                        values.push(key === 'default' ? `"${field[key as IKey]}"` : '?')
                        names.push(i)
                    } else {
                        valNames.push(`${i} = ${key === 'default' ? `"${field[key as IKey]}"` : '?'}`)
                    }
                }
            }
            let queries = create ? [] : (await ConvertKeys(inputQuery!));
            let query = create ?
                `INSERT INTO ${table} (${names.join(',')}) VALUES (${values.join(',')})`
                :
                getQuery(`UPDATE ${table} SET ${valNames.join(", ")} WHERE`, queries);
            return resolve([
                query,
                queries,
                args
            ])
        }
        catch (e) { return reject(handleError(e)) }
    })
}
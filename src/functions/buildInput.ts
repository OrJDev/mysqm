import IFields, { IOptionalFields } from "../types/Fields";
import { IRequiredQuery } from "../types/Query";
import ConvertKeys, { getQuery } from "./convertKeys";

export default function buildInput(fields: IFields, table: string, inputQuery?: IRequiredQuery, create?: boolean):
    Promise<[string, any[], any[]]> {
    return new Promise(async (resolve, reject) => {
        let valNames: string[] = []
        let values: any[] = []
        let names: any[] = [];
        try {
            let args: any[] = []
            for (const i in fields) {
                let field = fields[i]
                type Key = keyof typeof field;
                Object.keys(field).forEach(key => {
                    switch (key as IOptionalFields) {
                        case 'default':
                            valNames.push(`${i} = "${field[key as Key]}"`)
                            break;
                        case 'special':
                            args.push(field[key as Key])
                            valNames.push(`${i} = ?`)
                            break;
                        default:
                            valNames.push(`${i} = "${field[key as Key]}"`)
                            break;
                    }
                    if (create) {
                        values.push(key === 'default' ? `"${field[key as Key]}"` : '?')
                        names.push(i)
                    }
                })
            }
            if (create) {
                return resolve([
                    `INSERT INTO ${table} (${names.join(',')}) VALUES (${values.join(',')})`,
                    [],
                    args
                ])
            } else {
                let queries = await ConvertKeys(inputQuery!, table)
                return resolve([
                    getQuery(`UPDATE ${table} SET ${valNames.join(", ")} WHERE`, queries),
                    queries,
                    args])
            }
        }
        catch (e) {
            return reject(e)
        }
    })

}
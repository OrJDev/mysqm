import IActions from "../types/Actions";

export function resolveData<T>(json: any): T {
    let newData: any = {};
    let thisData = json[0];
    for (const e in thisData) newData[e] = thisData[e];
    return newData
}

export function resolveArray<T>(arr: any): T[] {
    let newArray: T[] = [];
    for (const i in arr) {
        let newData: any = {};
        let thisData = arr[i];
        for (const e in thisData) newData[e] = thisData[e];
        if (Object.keys(newData).length != 0) newArray.push(newData);
    }
    return newArray as T[];
}

/**
 * @unimplemented
 */
export function resolveQuery(action: IActions, table: string, isElement?: boolean) {
    switch (action) {
        case 'select':
            return isElement ? `SELECT * FROM ${table} WHERE` : `SELECT * FROM ${table}`;
        case 'delete':
            return isElement ? `DELETE FROM ${table} WHERE` : `DELETE FROM ${table}`;
    }
}
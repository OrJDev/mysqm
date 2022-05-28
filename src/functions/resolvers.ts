export function resolveData<T>(json: any): T {
    if (typeof json !== 'object') return {} as T;
    let element: T = {} as T;
    if (Array.isArray(json)) element = json[0];
    else element = json;
    if (Object.keys(element).length === 0) { return {} as T; }
    else { return Object.assign({}, element) }
}

export function resolveArray<T>(arr: any): T[] {
    let newArray: T[] = [];
    for (const i in arr) { Object.keys(arr[i]).length > 0 && newArray.push(Object.assign({}, arr[i])) }
    return newArray as T[];
}
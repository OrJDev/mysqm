import IConfig from "../types/Config"
import IResults from "../types/Results";

export default function buildResults<T>(
    results: T,
    query: string,
    queries: any[],
    config: IConfig,
    response: any,
    success: boolean
): IResults<T> {
    let r: IResults<T> = { results, success };
    let queryOutput = { fields: queries, query }
    if (config.includeCount) {
        if (typeof results === 'object') {
            if (Array.isArray(results)) { r.count = results.length; }
            else { r.count = Object.keys(results).length; }
        } else if (typeof results === 'string') { r.count = results.length; }
        else { r.count = 0; }
    }
    if (config.includeQueries) { r.queries = queryOutput; }
    if (config.includeResponse) r.response = response;
    return r;
}
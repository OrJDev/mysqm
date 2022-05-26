import IConfig from "../types/Config"
import IResults from "../types/Results";

export default function buildResults<T>(results: T,
    query: string,
    queries: any[],
    config: IConfig,
    response: any,
    success: boolean
): Promise<IResults<T>> {
    return new Promise((resolve, reject) => {
        try {
            let r: IResults<T> = { results, success };
            if (config.includeCount) {
                if (typeof results === 'object') {
                    if (Array.isArray(results)) {
                        r.count = results.length;
                    } else {
                        r.count = Object.keys(results).length;
                    }
                } else if (typeof results === 'string') {
                    r.count = results.length;
                }
                else r.count = 0;
            }
            if (config.includeQueries) r.queries = {
                fields: queries,
                query
            }
            if (config.includeResponse) r.response = response;
            return resolve(r)
        } catch (e) {
            return reject(e)
        }
    })
}
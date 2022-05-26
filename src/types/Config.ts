export default interface IConfig {
    includeResponse?: boolean;
    includeQueries?: boolean;
    includeCount?: boolean;
}

export const defaultConfig: IConfig = {
    includeCount: true,
    includeQueries: true,
    includeResponse: true
}
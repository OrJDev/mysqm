export default interface IFields {
    [name: string]: {
        [fieldType in IOptionalFields]?: any;
    }
}

export type IOptionalFields = 'default' | 'special';
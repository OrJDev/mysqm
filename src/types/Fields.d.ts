export default interface IFields {
    [name: string]: {
        [fieldType in IOptionalFields]?: any;
    };
}
export declare type IOptionalFields = 'default' | 'special';
//# sourceMappingURL=Fields.d.ts.map
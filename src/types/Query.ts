export type IQueryType = 'eq' | 'bigger' | 'smaller' | 'neq' | 'bigeq' | 'smeq';
export type IElementType<T> = T extends 'bigger' ? number : T extends 'smaller' ? number : T extends 'eq' ? any : string;

export default interface IQuery {
    where?: {
        [name: string]: {
            [queryT in IQueryType]?: IElementType<queryT>;
        }
    }
}

export interface IRequiredQuery {
    where: {
        [name: string]: {
            [queryT in IQueryType]?: IElementType<queryT>;
        }
    }
}


export let test: IQuery = {
    where: {
        id: {
            'eq': 1
        }
    }
}

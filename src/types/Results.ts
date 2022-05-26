type IResults<T> = {
    response?: any;
    queries?: {
        query: string;
        fields: any[];
    };
    count?: number;
    results: T;
    success: boolean;
}

export default IResults;
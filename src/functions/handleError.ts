export default function handleError(err: any): any {
    if (typeof err === 'object' && !Array.isArray(err)) {
        // if (err.hasOwnProperty('sqlMessage')) {
        //     return `MySQL Error: ${err.code}`;
        // }
        if (err.hasOwnProperty('message')) {
            return err.message
        }
    }
    return err;
}
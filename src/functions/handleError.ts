export default function handleError(err: any) {
    return new Promise((resolve, reject) => {
        try {
            let code = getCode(err)
            resolve(code)
        } catch (e) {
            return reject(e)
        }
    })
}

function getCode(err: any) {
    if (typeof err === 'object' && !Array.isArray(err)) {
        if (err.hasOwnProperty('sqlMessage')) {
            return `MySQL Error: ${err.code}`;
        }
        return err;
    }
}
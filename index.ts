export async function coalesce(resolvers: any[], errorIfUndefined?: string): Promise<any>;
export async function coalesce(resolvers: any[], params?: any[], errorIfUndefined?: string): Promise<any>;
export async function coalesce(resolvers: any[], paramsOrError?: string | any[], errorIfUndefined?: string): Promise<any> {
    let params: any[];
    if (Array.isArray(paramsOrError)) params = paramsOrError;
    else {
        params = [];
        errorIfUndefined = paramsOrError;
    }
    try {
        for (let x = 0; x < resolvers.length; x++) {
            const resolver = resolvers[x];
            if (typeof resolver === 'undefined' || resolver === null) continue;
            if (typeof resolver === 'function') {
                const result = resolver(...params);
                if (typeof result === 'undefined' || result === null) continue;
                if (result.then) {
                    // Result is a promise
                    const promisedResult = await result;
                    if (typeof promisedResult === 'undefined' || promisedResult === null) continue;
                    else return promisedResult;
                }
                else return result;
            }
            if (resolver.then) {
                // The resolver itself is a promise
                const promisedResult = await resolver;
                if (typeof promisedResult === 'undefined' || promisedResult === null) continue;
                else return promisedResult;
            }
            else return resolver;
        }
    } catch (err) {
        throw `Failed to coalesce: ${err}`;
    }
    if (errorIfUndefined) throw errorIfUndefined;
    else return undefined;
}

export function coalesceSync(resolvers: any[], errorIfUndefined?: string);
export function coalesceSync(resolvers: any[], params?: any[], errorIfUndefined?: string)
export function coalesceSync(resolvers: any[], paramsOrError?: string | any[], errorIfUndefined?: string): any {
    let params: any[];
    if (Array.isArray(paramsOrError)) params = paramsOrError;
    else {
        params = [];
        errorIfUndefined = paramsOrError;
    }
    try {
        for (let x = 0; x < resolvers.length; x++) {
            const resolver = resolvers[x];
            if (typeof resolver === 'undefined' || resolver === null) continue;
            if (resolver.then) {
                // The resolver itself is a promise. Using incorrect function
                throw 'Resolver is a promise. Use coalesce function';
            }
            if (typeof resolver === 'function') {
                const result = resolver(...params);
                if (typeof result === 'undefined' || result === null) continue;
                return result;
            }
            else return resolver;
        }
    } catch (err) {
        throw `Failed to coalesce: ${err}`;
    }
    if (errorIfUndefined) throw errorIfUndefined;
    else return undefined;

}
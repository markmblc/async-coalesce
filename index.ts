
export async function coalesce(resolvers: any[], params: any[] = [], errorIfUndefined?: string): Promise<any> {
    try {
        for (let x = 0; x < resolvers.length; x++) {
            const resolver = resolvers[x];
            if (typeof resolver === 'undefined' || resolver === null) continue;
            if (typeof resolver === 'function') {
                const result = resolver(...params);
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

export function coalesceSync(resolvers: any[], params: any[] = [], errorIfUndefined?: string): any {
    try {
        for (let x = 0; x < resolvers.length; x++) {
            const resolver = resolvers[x];
            if (typeof resolver === 'undefined' || resolver === null) continue;
            if (typeof resolver === 'function') return resolver(...params);
            else return resolver;
        }
    } catch (err) {
        throw `Failed to coalesce: ${err}`;
    }
    if (errorIfUndefined) throw errorIfUndefined;
    else return undefined;

}
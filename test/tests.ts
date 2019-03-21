import { coalesce, coalesceSync } from '../index';
import 'mocha';

import assert = require('assert');

function asyncFunction1(val1: string, val2: number) {
    if (val1 === 'err') return Promise.reject('Error1!');
    if (val2 < 10) return Promise.resolve();
    return Promise.resolve(val1 + val2);
}
function asyncFunction2(val1: number, val2: number) {
    if (val1 > 10) return Promise.resolve();
    if (val1 > val2) return Promise.reject('Error1!');
    return Promise.resolve(val2 - val1);
}
function asyncFunction3(val1: number, val2: number) {
    if (val1 > val2) return Promise.reject('Error1!');
    return Promise.resolve(val2 - val1);
}
function function1(val1: number, val2: number) {
    return val1 < val2;
}
function function2(val1: string, val2: number) {
    if (val1 === 'err') throw 'Error!';
    return val2;
}
function function3(val1: number, val2: number) {
    if (val1 === 0) return null;
    return val1 < val2;
}
describe('multiple async functions', function () {
    it('should return first', async () => {
        const result = await coalesce([asyncFunction1, asyncFunction1], ['test', 10])
        assert.equal(result, 'test10');
    });

    it('should return second', async () => {
        const result = await coalesce([asyncFunction2, asyncFunction3], [10, 11])
        assert.equal(result, 1);
    });

    it('should error first', async () => {
        let error: string;
        try {
            const result = await coalesce([asyncFunction1, asyncFunction2], ['err', 11])
        } catch (err) {
            error = err;
        }

        assert(error.includes('Error'));
    })

    it('should error second', async () => {
        let error: string;
        try {
            const result = await coalesce([asyncFunction1, asyncFunction2], [6, 5])
        } catch (err) {
            error = err;
        }
        assert(error.includes('Error'));
    })

    it('should error on undefined', async () => {
        let error: string;
        try {
            const result = await coalesce([asyncFunction1, asyncFunction3], [12, 9], 'Undefined!');
        } catch (err) {
            error = err;
        }
        assert(error.includes('Error'));
    })

    it('should default', async () => {
        const result = await coalesce([asyncFunction1, asyncFunction1, 'default'], [12, 9])
        assert.equal(result, 'default');
    })
})

describe('mix', function () {
    it('should return second', async () => {
        const result = await coalesce([asyncFunction2, function1], [11, 12])
        assert.equal(result, 1);
    });

    it('should error first', async () => {
        let error: string;
        try {
            const result = await coalesce([function2, asyncFunction2], ['err', 11])
        } catch (err) {
            error = err;
        }
        assert(error.includes('Error'));
    })

    it('should error on undefined', async () => {
        let error: string;
        try {
            const result = await coalesce([asyncFunction2, asyncFunction1], [12, 9], 'Undefined!');
        } catch (err) {
            error = err;
        }
        assert(error.includes('Undefined'));
    })

    it('should default', async () => {
        const result = await coalesce([function3, asyncFunction1, 'default'], [0, 0])
        assert.equal(result, 'default');
    })
});
describe('sync', function () {
    it('should return second', (done) => {
        const result = coalesceSync([function3, function1], [0, 1])
        assert.equal(result, 1);
        done();
    });

    it('should error first', (done) => {
        let error: string;
        try {
            const result = coalesceSync([function2, function3], ['err', 11])
        } catch (err) {
            error = err;
        }
        assert(error.includes('Error'));
        done();
    })

    it('should error on undefined', (done) => {
        let error: string;
        try {
            const result = coalesceSync([function3, null], [0, 9], 'Undefined!');
        } catch (err) {
            error = err;
        }
        assert(error.includes('Undefined!'));
        done();
    })

    it('should default', (done) => {
        const result = coalesceSync([function3(0, 2), null, 'default'])
        assert.equal(result, 'default');
        done();
    })
});
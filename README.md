# async-coalesce [![NPM version](https://badge.fury.io/js/depart.svg)](https://badge.fury.io/js/depart) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

## coalesce

```typescript
async coalesce(resolvers: any[], params: any[] = [], errorIfUndefined?: string) => Promise<any>
```

This function is intended for resolving a value potentially defined in higher scopes. Typical use case would be for methods accepting a configuration object whose properties could also be defined in the class constructor or some other greater scope like below:

```typescript
const name = localVar | classVar | globalVar | 'default';
```

However, this function also handles resolving async functions which traditionally would be done like below:

```typescript
let result1: string;
let result2: number;
try {
    result1 = (await localMethod(localVar)) | (await classMethod(localVar)) | 'default';
    result2 = (await localMethod(localVar)) | (await classMethod(localVar)) | (await otherClassMethod(localVar));
} catch (err) {
    throw `Failed to coalesce (${err})`;
}
if (typeof result2 === 'undefined' || result2 === null) throw 'result2 is not defined';
```

This approach works, but can get quite verbose. This same line using `async-coalesce` is shown below

```typescript
const result1 = await coalesce([localMethod, classMethod, 'default'], [localVar]);
const result2 = await coalesce([localMethod, classMethod, otherClassMethod], [localVar], 'result2 is not defined');
```

We are not wrapping this in a try block because the coalesce function will throw the 'Failed to coalesce' exception with the reason if any of the functions error.

### Note

This function will still error if it is passed a parameter that is a property of an undefined value. For example:

```typescript
const obj1 = { 
    prop: 'hello, world'
}

const obj2;

const result1 = await coalesce([obj1.prop, obj2.prop, 'default'], [localVar]);

```

This will throw a "`Cannot access '.prop' on undefined`" error. It is recommended that referenced objects be instantiated with a default value.

```typescript
const obj2 = {};
```

## coalesceSync

```typescript
coalesceSync(resolvers: any[], params: any[] = [], errorIfUndefined?: string) => any
```

This function is also available for use in a constructor, or some other area were async/await does not work. It does not support async resolvers.

## License

[MIT](LICENSE)

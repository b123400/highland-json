
export type Options<T> = {
    stringify?: (value: T) => string,
};

export function stringify(stream: Highland.Stream<any>): Highland.Stream<string>;
export function stringify<T>(options: Options<T>): (stream: Highland.Stream<T>)=> Highland.Stream<string>;

export function stringifyWithOptions<T>(stream: Highland.Stream<T>, options: Options<T>): Highland.Stream<string>;

export type ObjectStream<T> = Highland.Stream<[string, T]> | Highland.Stream<object>;

export function stringifyObj(stream: ObjectStream<any>): Highland.Stream<string>;
export function stringifyObj<T>(options: Options<T>): (stream: ObjectStream<T>) => Highland.Stream<string>;

export function stringifyObjWithOptions<T>(stream: ObjectStream<T>, options: Options<T>): Highland.Stream<string>;

export function objectToStream<T>(obj: T): Highland.Stream<[keyof T, T[keyof T]]>;

export function patchStream<T>(stream: Highland.Stream<T>): Highland.Stream<T>;

// 将多层的对象属性变成可选
declare type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P]>;
};

// 构造一个对象类型
declare type Recordable<T = any> = Record<string, T>
// 普通函数类型
declare interface Fn<T = any, R = T> {
    (...arg: T[]): R;
}

declare interface PromiseFn<T = any, R = T> {
    (...args: T[]): Promise<R>
}

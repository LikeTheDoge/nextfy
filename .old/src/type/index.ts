export type Head<Tuple extends any[]> = Tuple extends [infer Result, ...any[]] ? Result : never

export type Tail<Tuple extends any[]> = ((...args: Tuple) => void) extends ((a: any, ...args: infer T) => void) ? T : never

export type ITypeOf<T> = {
    new(...args: any[]): T
}
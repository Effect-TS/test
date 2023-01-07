import type * as Gen from "@effect/test/Gen"

export type NonEmptyArrayGen = [Gen.Gen<any, any>, ...Array<Gen.Gen<any, any>>]

export type TupleGen<T extends NonEmptyArrayGen> = {
  [K in keyof T]: [T[K]] extends [Gen.Gen<any, infer A>] ? A : never
}

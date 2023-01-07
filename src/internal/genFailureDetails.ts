import type * as GenFailureDetails from "@effect/test/GenFailureDetails"

/** @internal */
const GenFailureDetailsSymbolKey = "@effect/test/GenFailureDetails"

/** @internal */
export const GenFailureDetailsTypeId: GenFailureDetails.GenFailureDetailsTypeId = Symbol.for(
  GenFailureDetailsSymbolKey
) as GenFailureDetails.GenFailureDetailsTypeId

/** @internal */
const proto = {
  [GenFailureDetailsTypeId]: {
    _A: (_: never) => _
  }
}

/** @internal */
export const make = <A>(
  initialInput: A,
  shrunkenInput: A,
  iterations: number
): GenFailureDetails.GenFailureDetails =>
  Object.create(proto, {
    initialInput: { value: initialInput, enumerable: true },
    shrunkenInput: { value: shrunkenInput, enumerable: true },
    iterations: { value: iterations, enumerable: true }
  })

import * as Effect from "@effect/io/Effect"
import type * as Assertion from "@effect/test/Assertion"
import * as errorMessage from "@effect/test/internal/errorMessage"
import * as testArrow from "@effect/test/internal/testArrow"
import * as testResult from "@effect/test/internal/testResult"
import * as testTrace from "@effect/test/internal/testTrace"
import type * as TestArrow from "@effect/test/TestArrow"
import type * as TestResult from "@effect/test/TestResult"
import { pipe } from "@fp-ts/data/Function"
import * as Option from "@fp-ts/data/Option"

/** @internal */
const AssertionSymbolKey = "@effect/test/Assertion"

/** @internal */
export const AssertionTypeId: Assertion.AssertionTypeId = Symbol.for(
  AssertionSymbolKey
) as Assertion.AssertionTypeId

/** @internal */
const assertionVariance = {
  _A: (_: unknown) => _
}

/** @internal */
class AssertionImpl<A> implements Assertion.Assertion<A> {
  readonly [AssertionTypeId] = assertionVariance
  constructor(readonly arrow: TestArrow.TestArrow<A, boolean>) {}
}

/** @internal */
export const anything = (): Assertion.Assertion<unknown> =>
  new AssertionImpl(
    pipe(
      testArrow.make<unknown, boolean>(() =>
        testTrace.boolean(
          true,
          pipe(
            errorMessage.was,
            errorMessage.combine("anything")
          )
        )
      )
    )
  )

/** @internal */
export const assertCompletes = (): TestResult.TestResult => assert(isTrue())(true)

/** @internal */
export const isFalse = (): Assertion.Assertion<boolean> =>
  new AssertionImpl(
    pipe(
      testArrow.make<boolean, boolean>((boolean) =>
        testTrace.boolean(
          !boolean,
          pipe(
            errorMessage.value(boolean),
            errorMessage.combine(errorMessage.was),
            errorMessage.combine(errorMessage.value(false))
          )
        )
      ),
      testArrow.withCode("isFalse")
    )
  )

/** @internal */
export const isTrue = (): Assertion.Assertion<boolean> =>
  new AssertionImpl(
    pipe(
      testArrow.make<boolean, boolean>((boolean) =>
        testTrace.boolean(
          boolean,
          pipe(
            errorMessage.value(boolean),
            errorMessage.combine(errorMessage.was),
            errorMessage.combine(errorMessage.value(true))
          )
        )
      ),
      testArrow.withCode("isTrue")
    )
  )

/** @internal */
export const nothing = (): Assertion.Assertion<unknown> =>
  new AssertionImpl(
    pipe(
      testArrow.make<unknown, boolean>(() => testTrace.succeed(false)),
      testArrow.withCode("nothing")
    )
  )

/** @internal */
export const assert = <A>(assertion: Assertion.Assertion<A>) => {
  return (
    value: A,
    codeString: Option.Option<string> = Option.none,
    assertionString: Option.Option<string> = Option.none
  ): TestResult.TestResult => {
    const completeString = pipe(
      codeString,
      Option.flatMap((code) =>
        pipe(
          assertionString,
          // TODO(Mike/Max): coloring
          Option.map((assertion) => `${code} did not satisfy ${assertion}`)
        )
      )
    )
    const arrow = pipe(
      testArrow.succeed(value),
      testArrow.withCode(pipe(codeString, Option.getOrElse(() => "input"))),
      testArrow.andThen(assertion.arrow),
      // TODO(Mike/Max): is this possible somehow (?)
      /* withLocation(sourceLocation) */
      testArrow.withCompleteCode(pipe(completeString, Option.getOrElse(() => "<CODE>")))
    )
    return testResult.make(arrow)
  }
}

/** @internal */
export const assertEffect = <A>(assertion: Assertion.Assertion<A>) => {
  return <R, E>(
    effect: Effect.Effect<R, E, A>,
    codeString: Option.Option<string> = Option.none,
    assertionString: Option.Option<string> = Option.none
  ): Effect.Effect<R, E, TestResult.TestResult> =>
    pipe(effect, Effect.map((value) => assert(assertion)(value, codeString, assertionString)))
}

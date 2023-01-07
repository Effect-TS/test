import type * as Effect from "@effect/io/Effect"
import * as Stream from "@effect/stream/Stream"
import type * as Gen from "@effect/test/Gen"
import { checkStream } from "@effect/test/internal/sample-utils"
import type * as TestResult from "@effect/test/TestResult"
import { pipe } from "@fp-ts/data/Function"

export const checkN = (n: number) => {
  return <R, A>(gen: Gen.Gen<R, A>) => {
    return <R2, E>(
      test: (value: A) => Effect.Effect<R2, E, TestResult.TestResult>
    ): Effect.Effect<R | R2, E, TestResult.TestResult> => {
      const stream = pipe(
        gen.sample,
        Stream.forever,
        Stream.collectSome,
        Stream.take(n)
      )
      return checkStream(stream)(test)
    }
  }
}

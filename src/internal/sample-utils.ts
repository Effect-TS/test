import * as Effect from "@effect/io/Effect"
import * as testServices from "@effect/io/internal/testing/testServices"
import * as Sink from "@effect/stream/Sink"
import * as Stream from "@effect/stream/Stream"
import * as assertion from "@effect/test/internal/assertion"
import * as genFailureDetails from "@effect/test/internal/genFailureDetails"
import * as _sample from "@effect/test/internal/sample"
import * as testResult from "@effect/test/internal/testResult"
import type * as Sample from "@effect/test/Sample"
import type * as TestResult from "@effect/test/TestResult"
import * as Chunk from "@fp-ts/data/Chunk"
import * as Either from "@fp-ts/data/Either"
import { constTrue, pipe } from "@fp-ts/data/Function"
import * as Option from "@fp-ts/data/Option"

/** @internal */
export const checkStream = <R, A>(
  self: Stream.Stream<R, never, Sample.Sample<R, A>>
) => {
  return <R2, E>(
    test: (value: A) => Effect.Effect<R2, E, TestResult.TestResult>
  ): Effect.Effect<R | R2, E, TestResult.TestResult> =>
    pipe(
      testServices.shrinks(),
      Effect.flatMap(shrinkStream(
        pipe(
          self,
          Stream.zipWithIndex,
          Stream.mapEffect(([initial, index]) =>
            pipe(
              initial,
              _sample.forEach((input) =>
                pipe(
                  test(input),
                  Effect.map(testResult.setGenFailureDetails(genFailureDetails.make(initial.value, input, index))),
                  Effect.either
                )
              )
            )
          )
        )
      ))
    )
}

/** @internal */
export const shrinkStream = <R, R2, E>(
  stream: Stream.Stream<R, never, Sample.Sample<R2, Either.Either<E, TestResult.TestResult>>>
) => {
  return (maxShrinks: number): Effect.Effect<R | R2, E, TestResult.TestResult> =>
    pipe(
      stream,
      // Drop until we get to a failure
      Stream.dropWhile((sample) =>
        pipe(
          sample.value,
          Either.match(constTrue, testResult.isFailure)
        )
      ),
      // Get the first failure
      Stream.take(1),
      Stream.flatMap((sample) =>
        pipe(
          sample,
          _sample.shrinkSearch(Either.match(constTrue, testResult.isFailure)),
          Stream.take(maxShrinks + 1)
        )
      ),
      // Collect all the shrunken values
      Stream.run(Sink.collectAll<Either.Either<E, TestResult.TestResult>>()),
      Effect.flatMap((shrinks) =>
        // Get the "last" failure, the smallest according to the shrinker:
        pipe(
          shrinks,
          Chunk.filter(Either.match(constTrue, testResult.isFailure)),
          Chunk.last,
          Option.match(
            () => Effect.succeed(assertion.assertCompletes()),
            Effect.fromEither
          )
        )
      )
    )
}

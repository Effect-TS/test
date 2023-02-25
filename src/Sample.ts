/**
 * @since 1.0.0
 */
import type * as Option from "@effect/data/Option"
import type { Predicate } from "@effect/data/Predicate"
import type * as Effect from "@effect/io/Effect"
import type * as Stream from "@effect/stream/Stream"
import * as internal from "@effect/test/internal/sample"

/**
 * @since 1.0.0
 * @category symbols
 */
export const SampleTypeId: unique symbol = internal.SampleTypeId

/**
 * @since 1.0.0
 * @category symbols
 */
export type SampleTypeId = typeof SampleTypeId

/**
 * A sample is a single observation from a random variable, together with a tree
 * of "shrinkings" used for minimization of "large" failures.
 *
 * @since 1.0.0
 * @category models
 */
export interface Sample<R, A> extends Sample.Variance<R, A> {
  readonly value: A
  readonly shrink: Stream.Stream<R, never, Option.Option<Sample<R, A>>>
}

/**
 * @since 1.0.0
 */
export declare namespace Sample {
  /**
   * @since 1.0.0
   * @category models
   */
  export interface Variance<R, A> {
    readonly [SampleTypeId]: {
      readonly _R: (_: never) => R
      readonly _A: (_: never) => A
    }
  }
}

/**
 * Filters this sample by replacing it with its shrink tree if the value does
 * not meet the specified predicate and recursively filtering the shrink tree.
 *
 * @since 1.0.0
 * @category filtering
 */
export const filter: <A>(
  predicate: Predicate<A>
) => <R>(self: Sample<R, A>) => Stream.Stream<R, never, Option.Option<Sample<R, A>>> = internal.filter

/**
 * @since 1.0.0
 * @category sequencing
 */
export const flatMap: <A, R2, A2>(f: (a: A) => Sample<R2, A2>) => <R>(self: Sample<R, A>) => Sample<R2 | R, A2> =
  internal.flatMap

/**
 * Executes the specified effectual function for each element of the sample.
 *
 * @since 1.0.0
 * @category traversing
 */
export const forEach: <A, R2, A2>(
  f: (a: A) => Effect.Effect<R2, never, A2>
) => <R>(self: Sample<R, A>) => Effect.Effect<R2 | R, never, Sample<R2 | R, A2>> = internal.forEach

/**
 * @since 1.0.0
 * @category mapping
 */
export const map: <A, B>(f: (a: A) => B) => <R>(self: Sample<R, A>) => Sample<R, B> = internal.map

/**
 * Constructs a `Sample` without shrinking.
 *
 * @since 1.0.0
 * @category constructors
 */
export const noShrink: <A>(value: A) => Sample<never, A> = internal.noShrink

/**
 * @since 1.0.0
 * @category constructors
 */
export const shrinkBigInt: (smallest: bigint) => (value: bigint) => Sample<never, bigint> = internal.shrinkBigInt

/**
 * @since 1.0.0
 * @category constructors
 */
export const shrinkFractional: (smallest: number) => (value: number) => Sample<never, number> =
  internal.shrinkFractional

/**
 * @since 1.0.0
 * @category constructors
 */
export const shrinkIntegral: (smallest: number) => (value: number) => Sample<never, number> = internal.shrinkIntegral

/**
 * Converts the shrink tree into a stream of shrinkings by recursively
 * searching the shrink tree, using the specified function to determine
 * whether a value is a failure. The resulting stream will contain all values
 * explored, regardless of whether they are successes or failures.
 *
 * @since 1.0.0
 * @category utils
 */
export const shrinkSearch: <A>(predicate: Predicate<A>) => <R>(self: Sample<R, A>) => Stream.Stream<R, never, A> =
  internal.shrinkSearch

/**
 * Unfolds a `Sample` from an initial value and a continuation function.
 *
 * @since 1.0.0
 * @category constructors
 */
export const unfold: <S, A, R>(start: S, f: (s: S) => readonly [A, Stream.Stream<R, never, S>]) => Sample<R, A> =
  internal.unfold

/**
 * Composes this sample with the specified sample to create a cartesian
 * product of values and shrinkings.
 *
 * @since 1.0.0
 * @category zipping
 */
export const zip: <R2, A2>(that: Sample<R2, A2>) => <R, A>(self: Sample<R, A>) => Sample<R2 | R, readonly [A, A2]> =
  internal.zip

/**
 * Composes this sample with the specified sample to create a cartesian
 * product of values and shrinkings.
 *
 * @since 1.0.0
 * @category zipping
 */
export const zipFlatten: <R2, A2>(
  that: Sample<R2, A2>
) => <R, A extends ReadonlyArray<any>>(self: Sample<R, A>) => Sample<R2 | R, readonly [...A, A2]> = internal.zipFlatten

/**
 * Composes this sample with the specified sample to create a cartesian
 * product of values and shrinkings with the specified function.
 *
 * @since 1.0.0
 * @category zipping
 */
export const zipWith: <R2, A2, A, A3>(
  that: Sample<R2, A2>,
  f: (a: A, a2: A2) => A3
) => <R>(self: Sample<R, A>) => Sample<R2 | R, A3> = internal.zipWith

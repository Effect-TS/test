/**
 * @since 1.0.0
 */
import type * as Effect from "@effect/io/Effect"
import type * as Stream from "@effect/stream/Stream"
import * as internal from "@effect/test/internal/gen"
import type { NonEmptyArrayGen, TupleGen } from "@effect/test/internal/types"
import type * as Sample from "@effect/test/Sample"
import type * as Option from "@fp-ts/data/Option"

/**
 * @since 1.0.0
 * @category symbols
 */
export const GenTypeId: unique symbol = internal.GenTypeId

/**
 * @since 1.0.0
 * @category symbols
 */
export type GenTypeId = typeof GenTypeId

/**
 * A `Gen<R, A>` represents a generator of values of type `A`, which requires an
 * environment `R`. Generators may be random or deterministic.
 *
 * @since 1.0.0
 * @category models
 */
export interface Gen<R, A> extends Gen.Variance<R, A> {
  readonly sample: Stream.Stream<R, never, Option.Option<Sample.Sample<R, A>>>
}

/**
 * @since 1.0.0
 */
export declare namespace Gen {
  /**
   * @since 1.0.0
   * @category models
   */
  export interface Variance<R, A> {
    readonly [GenTypeId]: {
      _R: (_: never) => R
      _A: (_: never) => A
    }
  }

  /**
   * Constraints to be applied on integer generators.
   *
   * @since 1.0.0
   * @category models
   */
  export interface IntegerConstraints {
    /**
     * Lower bound for the generated integers (included).
     *
     * Defaults to `-0x80000000`.
     */
    readonly min?: number
    /**
     * Upper bound for the generated integers (included).
     *
     * Defaults to `0x7fffffff`.
     */
    readonly max?: number
  }
}

/**
 * Returns `true` if the specified value is a `Gen`, `false` otherwise.
 *
 * @since 1.0.0
 * @category refinements
 */
export const isGen: (u: unknown) => u is Gen<unknown, unknown> = internal.isGen

/**
 * A constant generator of the specified value.
 *
 * @since 1.0.0
 * @category constructors
 */
export const constant: <A>(value: A) => Gen<never, A> = internal.constant

/**
 * A constant generator of the specified `Sample`.
 *
 * @since 1.0.0
 * @category constructors
 */
export const constantSample: <R, A>(sample: Sample.Sample<R, A>) => Gen<R, A> = internal.constantSample

/**
 * @since 1.0.0
 * @category sequencing
 */
export const flatMap: <A, R2, A2>(f: (a: A) => Gen<R2, A2>) => <R>(self: Gen<R, A>) => Gen<R2 | R, A2> =
  internal.flatMap

/**
 * Constructs a generator from an effect that constructs a value.
 *
 * @since 1.0.0
 * @category constructors
 */
export const fromEffect: <R, A>(effect: Effect.Effect<R, never, A>) => Gen<R, A> = internal.fromEffect

/**
 * Constructs a generator from an effect that constructs a sample.
 *
 * @since 1.0.0
 * @category constructors
 */
export const fromEffectSample: <R, A>(effect: Effect.Effect<R, never, Sample.Sample<R, A>>) => Gen<R, A> =
  internal.fromEffectSample

/**
 * A generator of integers inside the specified range: [start, end]. The
 * shrinker will shrink toward the lower end of the range ("smallest").
 *
 * @since 1.0.0
 * @category constructors
 */
export const integer: (constraints?: Gen.IntegerConstraints) => Gen<never, number> = internal.integer

/**
 * @since 1.0.0
 * @category mapping
 */
export const map: <A, B>(f: (a: A) => B) => <R>(self: Gen<R, A>) => Gen<R, B> = internal.map

/**
 * Like `forEach` + `identity` with a tuple type.
 *
 * @since 1.0.0
 * @category constructors
 */
export const tuple: <T extends NonEmptyArrayGen>(
  ...t: T
) => Gen<
  [T[number]] extends [{ [GenTypeId]: { _R: (_: never) => infer R } }] ? R : never,
  TupleGen<T>
> = internal.tuple

/**
 * A generator of uniformly distributed doubles between `[0, 1]`. The shrinker
 * will shrink toward `0`.
 *
 * @since 1.0.0
 * @category constructors
 */
export const uniform: () => Gen<never, number> = internal.uniform

/**
 * A generator which chooses one of the given generators according to their
 * weights. For example, the following generator will generate 90% `true` and
 * 10% `false` values.
 *
 * ```ts
 * const trueFalse = Gen.weighted(
 *   [Gen.constant(true), 9],
 *   [Gen.constant(false), 1],
 * )
 * ```
 *
 * @since 1.0.0
 * @category constructors
 */
export const weighted: <R, A>(...gens: Array<readonly [Gen<R, A>, number]>) => Gen<R, A> = internal.weighted

/**
 * Composes this generator with the specified generator to create a cartesian
 * product of elements.
 *
 * @since 1.0.0
 * @category zipping
 */
export const zip: <R2, A2>(that: Gen<R2, A2>) => <R, A>(self: Gen<R, A>) => Gen<R2 | R, readonly [A, A2]> = internal.zip

/**
 * Composes this generator with the specified generator to create a cartesian
 * product of elements.
 *
 * @since 1.0.0
 * @category zipping
 */
export const zipFlatten: <R2, A2>(
  that: Gen<R2, A2>
) => <R, A extends ReadonlyArray<any>>(self: Gen<R, A>) => Gen<R2 | R, readonly [...A, A2]> = internal.zipFlatten

/**
 * Composes this generator with the specified generator returning the result of
 * this generator.
 *
 * @since 1.0.0
 * @category zipping
 */
export const zipLeft: <R2, A2>(that: Gen<R2, A2>) => <R, A>(self: Gen<R, A>) => Gen<R2 | R, A> = internal.zipLeft

/**
 * Composes this generator with the specified generator returning the result of
 * that generator.
 *
 * @since 1.0.0
 * @category zipping
 */
export const zipRight: <R2, A2>(that: Gen<R2, A2>) => <R, A>(self: Gen<R, A>) => Gen<R2 | R, A2> = internal.zipRight

/**
 * Composes this generator with the specified generator to create a cartesian
 * product of elements with the specified function.
 *
 * @since 1.0.0
 * @category zipping
 */
export const zipWith: <R2, A2, A, A3>(
  that: Gen<R2, A2>,
  f: (a: A, a2: A2) => A3
) => <R>(self: Gen<R, A>) => Gen<R2 | R, A3> = internal.zipWith

/**
 * @since 1.0.0
 */
import * as internal from "@effect/test/internal/result"

/**
 * @since 1.0.0
 * @category models
 */
export type Result<A> = Fail | Die | Succeed<A>

/**
 * @since 1.0.0
 * @category models
 */
export interface Fail {
  readonly _tag: "Fail"
}

/**
 * @since 1.0.0
 * @category models
 */
export interface Die {
  readonly _tag: "Die"
  readonly defect: unknown
}

/**
 * @since 1.0.0
 * @category models
 */
export interface Succeed<A> {
  readonly _tag: "Succeed"
  readonly value: A
}

/**
 * @since 1.0.0
 * @category constructors
 */
export const die: (defect: unknown) => Result<never> = internal.die

/**
 * @since 1.0.0
 * @category constructors
 */
export const fail: Result<never> = internal.fail

/**
 * @since 1.0.0
 * @category constructors
 */
export const succeed: <A>(value: A) => Result<A> = internal.succeed

/**
 * @since 1.0.0
 * @category zipping
 */
export const zipWith: <B, A, C>(that: Result<B>, f: (a: A, b: B) => C) => (self: Result<A>) => Result<C> =
  internal.zipWith

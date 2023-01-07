/**
 * @since 1.0.0
 */
import * as internal from "@effect/test/internal/genFailureDetails"

/**
 * @since 1.0.0
 * @category symbols
 */
export const GenFailureDetailsTypeId: unique symbol = internal.GenFailureDetailsTypeId

/**
 * @since 1.0.0
 * @category symbols
 */
export type GenFailureDetailsTypeId = typeof GenFailureDetailsTypeId

/**
 * `GenFailureDetails` keeps track of relevant information related to a failure
 * in a generative test.
 *
 * @since 1.0.0
 * @category models
 */
export interface GenFailureDetails<A = unknown> extends GenFailureDetails.Variance<A> {
  readonly initialInput: A
  readonly shrunkenInput: A
  readonly iterations: number
}

/**
 * @since 1.0.0
 */
export declare namespace GenFailureDetails {
  /**
   * @since 1.0.0
   * @category models
   */
  export interface Variance<A> {
    readonly [GenFailureDetailsTypeId]: {
      _A: (_: never) => A
    }
  }
}

/**
 * @since 1.0.0
 * @category constructors
 */
export const make: <A>(initialInput: A, shrunkenInput: A, iterations: number) => GenFailureDetails<unknown> =
  internal.make

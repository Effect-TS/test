/**
 * @since 1.0.0
 */
import type * as Effect from "@effect/io/Effect"
import * as internal from "@effect/test/internal/assertion"
import type * as TestArrow from "@effect/test/TestArrow"
import type * as TestResult from "@effect/test/TestResult"
import type * as Option from "@fp-ts/data/Option"

/**
 * @since 1.0.0
 * @category symbols
 */
export const AssertionTypeId: unique symbol = internal.AssertionTypeId

/**
 * @since 1.0.0
 * @category symbols
 */
export type AssertionTypeId = typeof AssertionTypeId

/**
 * @since 1.0.0
 * @category models
 */
export interface Assertion<A> extends Assertion.Variance<A> {
  arrow: TestArrow.TestArrow<A, boolean>
}

/**
 * @since 1.0.0
 */
export declare namespace Assertion {
  /**
   * @since 1.0.0
   * @category models
   */
  export interface Variance<A> {
    readonly [AssertionTypeId]: {
      readonly _A: (_: A) => void
    }
  }

  /**
   * @since 1.0.0
   * @category models
   */
  export type Arguments = AssertionArgument /* | TypeArgument<A> */ | ValueArgument

  /**
   * @since 1.0.0
   * @category models
   */
  export interface AssertionArgument {
    readonly _tag: "AssertionArgument"
    readonly assertion: Assertion<unknown>
  }

  /**
   * @since 1.0.0
   * @category models
   */
  export interface ValueArgument {
    readonly _tag: "ValueArgument"
    readonly value: unknown
    readonly name: Option.Option<string>
  }
}

/**
 * @since 1.0.0
 * @category destructors
 */
export const assert: <A>(
  assertion: Assertion<A>
) => (
  value: A,
  codeString?: Option.Option<string>,
  assertionString?: Option.Option<string>
) => TestResult.TestResult = internal.assert

/**
 * @since 1.0.0
 * @category destructors
 */
export const assertEffect: <A>(
  assertion: Assertion<A>
) => <R, E>(
  effect: Effect.Effect<R, E, A>,
  codeString?: Option.Option<string>,
  assertionString?: Option.Option<string>
) => Effect.Effect<R, E, TestResult.TestResult> = internal.assertEffect

/**
 * Asserts that the given test was completed.
 *
 * @since 1.0.0
 * @category constructors
 */
export const assertCompletes: () => TestResult.TestResult = internal.assertCompletes

/**
 * Makes a new assertion that always succeeds.
 *
 * @since 1.0.0
 * @category constructors
 */
export const anything: () => Assertion<unknown> = internal.anything

/**
 * Makes a new assertion that requires a value be false.
 *
 * @since 1.0.0
 * @category constructors
 */
export const isFalse: () => Assertion<boolean> = internal.isFalse

/**
 * Makes a new assertion that requires a value be true.
 *
 * @since 1.0.0
 * @category constructors
 */
export const isTrue: () => Assertion<boolean> = internal.isTrue

/**
 * Makes a new assertion that always fails.
 *
 * @since 1.0.0
 * @category constructors
 */
export const nothing: () => Assertion<unknown> = internal.nothing

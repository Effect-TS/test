/**
 * @since 1.0.0
 */
import * as internal from "@effect/test/internal/errorMessage"

/**
 * @since 1.0.0
 * @category models
 */
export type ErrorMessage = Choice | Combine | CombineMessage | Custom | ThrowableEffect | Value

/**
 * @since 1.0.0
 * @category models
 */
export interface Choice {
  readonly _tag: "Choice"
  readonly success: string
  readonly failure: string
}

/**
 * @since 1.0.0
 * @category models
 */
export interface Combine {
  readonly _tag: "Combine"
  readonly left: ErrorMessage
  readonly right: ErrorMessage
  readonly spacing: number
}

/**
 * @since 1.0.0
 * @category models
 */
export interface CombineMessage {
  readonly _tag: "CombineMessage"
  readonly left: ErrorMessage
  readonly right: ErrorMessage
}

/**
 * @since 1.0.0
 * @category models
 */
export interface Custom {
  readonly _tag: "Custom"
  readonly string: string
}

/**
 * @since 1.0.0
 * @category models
 */
export interface ThrowableEffect {
  readonly _tag: "ThrowableEffect"
  readonly defect: unknown
}

/**
 * @since 1.0.0
 * @category models
 */
export interface Value {
  readonly _tag: "Value"
  readonly value: unknown
}

/**
 * @since 1.0.0
 * @category constructors
 */
export const choice: (success: string, failure: string) => ErrorMessage = internal.choice

/**
 * @since 1.0.0
 * @category mutations
 */
export const combine: (that: string | ErrorMessage) => (self: ErrorMessage) => ErrorMessage = internal.combine

/**
 * @since 1.0.0
 * @category mutations
 */
export const combineMessage: (that: ErrorMessage) => (self: ErrorMessage) => ErrorMessage = internal.combineMessage

/**
 * @since 1.0.0
 * @category constructors
 */
export const custom: (string: string) => ErrorMessage = internal.custom

/**
 * @since 1.0.0
 * @category constructors
 */
export const defect: (defect: unknown) => ErrorMessage = internal.defect

/**
 * @since 1.0.0
 * @category constructors
 */
export const pretty: (value: unknown) => ErrorMessage = internal.pretty

/**
 * @since 1.0.0
 * @category constructors
 */
export const text: (string: string) => ErrorMessage = internal.text

/**
 * @since 1.0.0
 * @category constructors
 */
export const value: (value: unknown) => ErrorMessage = internal.value

/**
 * @since 1.0.0
 * @category constructors
 */
export const did: ErrorMessage = internal.did

/**
 * @since 1.0.0
 * @category constructors
 */
export const equals: ErrorMessage = internal.equals

/**
 * @since 1.0.0
 * @category constructors
 */
export const had: ErrorMessage = internal.had

/**
 * @since 1.0.0
 * @category constructors
 */
export const was: ErrorMessage = internal.was

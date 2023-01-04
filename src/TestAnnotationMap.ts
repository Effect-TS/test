/**
 * @since 1.0.0
 */
import * as testAnnotationMap from "@effect/io/internal/testing/testAnnotationMap"
import type * as TestAnnotation from "@effect/test/TestAnnotation"

/**
 * @since 1.0.0
 * @category symbols
 */
export const TestAnnotationMapTypeId: unique symbol = testAnnotationMap
  .TestAnnotationMapTypeId as unknown as TestAnnotationMapTypeId

/**
 * @since 1.0.0
 * @category symbols
 */
export type TestAnnotationMapTypeId = typeof TestAnnotationMapTypeId

/**
 * An annotation map keeps track of annotations of different types.
 *
 * @since 1.0.0
 * @category models
 */
export interface TestAnnotationMap extends TestAnnotationMap.Proto {}

/**
 * @since 1.0.0
 */
export declare namespace TestAnnotationMap {
  /**
   * @since 1.0.0
   * @category models
   */
  export interface Proto {
    readonly [TestAnnotationMapTypeId]: TestAnnotationMapTypeId
  }
}

/**
 * Returns `true` if the specified value is a `TestAnnotationMap`, `false`
 * otherwise.
 *
 * @since 1.0.0
 * @category refinements
 */
export const isTestAnnotationMap = (u: unknown): u is TestAnnotationMap => {
  return typeof u === "object" && u != null && TestAnnotationMapTypeId in u
}

/**
 * Appends the specified annotation to the annotation map.
 *
 * @since 1.0.0
 * @category mutations
 */
export const annotate: <A>(
  key: TestAnnotation.TestAnnotation<A>,
  value: A
) => (self: TestAnnotationMap) => TestAnnotationMap = testAnnotationMap.annotate as any

/**
 * Combines two `TestAnnotationMap`s.
 *
 * @since 1.0.0
 * @category mutations
 */
export const combine: (that: TestAnnotationMap) => (self: TestAnnotationMap) => TestAnnotationMap = testAnnotationMap
  .combine as any

/**
 * The empty `TestAnnotationMap`.
 *
 * @since 1.0.0
 * @category constructors
 */
export const empty: TestAnnotationMap = testAnnotationMap.empty as any

/**
 * Retrieves the annotation of the specified type, or its default value if
 * there is none.
 *
 * @since 1.0.0
 * @category getters
 */
export const get: <A>(key: TestAnnotation.TestAnnotation<A>) => (self: TestAnnotationMap) => A = testAnnotationMap
  .get as any

/**
 * Constructs a new `TestAnnotationMap` from the specified map.
 *
 * @since 1.0.0
 * @category constructors
 */
export const make: (map: ReadonlyMap<TestAnnotation.TestAnnotation<unknown>, unknown>) => TestAnnotationMap =
  testAnnotationMap.make as any

/**
 * Overwrites the specified key/value pair in the `TestAnnotationMap`.
 *
 * @since 1.0.0
 * @category mutations
 */
export const overwrite: <A>(
  key: TestAnnotation.TestAnnotation<A>,
  value: A
) => (self: TestAnnotationMap) => TestAnnotationMap = testAnnotationMap.overwrite as any

/**
 * Updates the value associated with the specified key specified in the
 * `TestAnnotationMap`.
 *
 * @since 1.0.0
 * @category mutations
 */
export const update: <A>(
  key: TestAnnotation.TestAnnotation<A>,
  f: (value: A) => A
) => (self: TestAnnotationMap) => TestAnnotationMap = testAnnotationMap.update as any

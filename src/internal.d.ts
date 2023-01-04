import type * as annotations from "@effect/io/internal/testing/annotations"
import type * as testAnnotation from "@effect/io/internal/testing/testAnnotation"
import type * as testAnnotationMap from "@effect/io/internal/testing/testAnnotationMap"
import type * as _Annotations from "@effect/test/Annotations"
import type * as _TestAnnotation from "@effect/test/TestAnnotation"
import type * as _TestAnnotationMap from "@effect/test/TestAnnotationMap"

// Annotations

/** @internal */
export declare module "@effect/io/internal/testing/annotations" {
  interface Annotations extends _Annotations.Annotations {}
}

/** @internal */
export declare module "@effect/test/Annotations" {
  interface Annotations {
    readonly [annotations.AnnotationsTypeId]: annotations.AnnotationsTypeId
  }
}

// TestAnnotation

/** @internal */
export declare module "@effect/io/internal/testing/testAnnotation" {
  interface TestAnnotation<A> extends _TestAnnotation.TestAnnotation<A> {}
}

/** @internal */
export declare module "@effect/test/TestAnnotation" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface TestAnnotation<A> {
    readonly [testAnnotation.TestAnnotationTypeId]: testAnnotation.TestAnnotationTypeId
  }
}

// TestAnnotationMap

/** @internal */
export declare module "@effect/io/internal/testing/testAnnotationMap" {
  interface TestAnnotationMap extends _TestAnnotationMap.TestAnnotationMap {}
}

/** @internal */
export declare module "@effect/test/TestAnnotationMap" {
  interface TestAnnotationMap {
    readonly [testAnnotationMap.TestAnnotationMapTypeId]: testAnnotationMap.TestAnnotationMapTypeId
  }
}

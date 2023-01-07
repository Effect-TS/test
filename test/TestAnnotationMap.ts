import * as it from "@effect/test/test/utils/extend"
import * as TestAnnotation from "@effect/test/TestAnnotation"
import * as TestAnnotationMap from "@effect/test/TestAnnotationMap"
import { pipe } from "@fp-ts/data/Function"
import { assert, describe } from "vitest"

describe.concurrent("TestAnnotationMap", () => {
  it.it("get retrieves the annotation of the specified type", () => {
    const annotations = pipe(
      TestAnnotationMap.empty,
      TestAnnotationMap.annotate(TestAnnotation.ignored, 1)
    )
    const result1 = pipe(
      annotations,
      TestAnnotationMap.get(TestAnnotation.ignored)
    )
    const result2 = pipe(
      annotations,
      TestAnnotationMap.get(TestAnnotation.retried)
    )
    assert.strictEqual(result1, 1)
    assert.strictEqual(result2, 0)
  })
})

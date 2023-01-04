import { assert, describe, it } from "vitest"

describe.concurrent("Dummy", () => {
  it("dummy", () => {
    assert.isTrue(true)
  })
})

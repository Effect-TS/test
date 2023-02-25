/**
 * @since 1.0.0
 */
import * as Context from "@effect/data/Context"
import type { Either } from "@effect/data/Either"
import * as Effect from "@effect/io/Effect"
import type { Exit } from "@effect/io/Exit"
import type { RuntimeFiber } from "@effect/io/Fiber"
import type { RuntimeFlags } from "@effect/io/Fiber/Runtime/Flags"
import * as FiberRefs from "@effect/io/FiberRefs"
import * as Runtime from "@effect/io/Runtime"
import type { Scheduler } from "@effect/io/Scheduler"
import { TestContext } from "@effect/test/TestContext"

class TestRuntime<R> implements Runtime.Runtime<R> {
  private live: Runtime.Runtime<R>
  constructor(
    readonly context: Context.Context<R>,
    readonly runtimeFlags: RuntimeFlags,
    readonly fiberRefs: FiberRefs.FiberRefs
  ) {
    this.live = Runtime.make(context, runtimeFlags, fiberRefs)
  }

  runFork: <E, A>(effect: Effect.Effect<R, E, A>, scheduler?: Scheduler | undefined) => RuntimeFiber<E, A> = (
    effect,
    scheduler
  ) => Runtime.runFork(this.live)(Effect.provideSomeLayer(TestContext)(effect), scheduler)

  runCallback: <E, A>(
    effect: Effect.Effect<R, E, A>,
    onExit?: ((exit: Exit<E, A>) => void) | undefined
  ) => Runtime.Cancel<E, A> = (effect, onExit) =>
    Runtime.runCallback(this.live)(Effect.provideSomeLayer(TestContext)(effect), onExit)

  runSync: <E, A>(effect: Effect.Effect<R, E, A>) => A = (effect) =>
    Runtime.runSync(this.live)(Effect.provideSomeLayer(TestContext)(effect))

  runSyncExit: <E, A>(effect: Effect.Effect<R, E, A>) => Exit<E, A> = (effect) =>
    Runtime.runSyncExit(this.live)(Effect.provideSomeLayer(TestContext)(effect))

  runSyncEither: <E, A>(effect: Effect.Effect<R, E, A>) => Either<E, A> = (effect) =>
    Runtime.runSyncEither(this.live)(Effect.provideSomeLayer(TestContext)(effect))

  runPromise: <E, A>(effect: Effect.Effect<R, E, A>) => Promise<A> = (effect) =>
    Runtime.runPromise(this.live)(Effect.provideSomeLayer(TestContext)(effect))

  runPromiseExit: <E, A>(effect: Effect.Effect<R, E, A>) => Promise<Exit<E, A>> = (effect) =>
    Runtime.runPromiseExit(this.live)(Effect.provideSomeLayer(TestContext)(effect))

  runPromiseEither: <E, A>(effect: Effect.Effect<R, E, A>) => Promise<Either<E, A>> = (effect) =>
    Runtime.runPromiseEither(this.live)(Effect.provideSomeLayer(TestContext)(effect))
}

/**
 * @since 1.0.0
 * @category constructors
 */
export const make = <R>(
  context: Context.Context<R>,
  runtimeFlags: RuntimeFlags,
  fiberRefs: FiberRefs.FiberRefs
): TestRuntime<R> => new TestRuntime<R>(context, runtimeFlags, fiberRefs)

/**
 * @since 1.0.0
 * @category constructors
 */
export const testRuntime = make(
  Context.empty(),
  Runtime.defaultRuntimeFlags,
  FiberRefs.unsafeMake(new Map())
)

const { runCallback, runFork, runPromise, runPromiseEither, runPromiseExit, runSync, runSyncEither, runSyncExit } =
  testRuntime

export {
  /**
   * @since 1.0.0
   * @category execution
   */
  runCallback,
  /**
   * @since 1.0.0
   * @category execution
   */
  runFork,
  /**
   * @since 1.0.0
   * @category execution
   */
  runPromise,
  /**
   * @since 1.0.0
   * @category execution
   */
  runPromiseEither,
  /**
   * @since 1.0.0
   * @category execution
   */
  runPromiseExit,
  /**
   * @since 1.0.0
   * @category execution
   */
  runSync,
  /**
   * @since 1.0.0
   * @category execution
   */
  runSyncEither,
  /**
   * @since 1.0.0
   * @category execution
   */
  runSyncExit
}

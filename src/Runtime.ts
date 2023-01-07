/**
 * @since 1.0.0
 */
import * as Effect from "@effect/io/Effect"
import type { Exit } from "@effect/io/Exit"
import type { RuntimeFiber } from "@effect/io/Fiber"
import type { RuntimeFlags } from "@effect/io/Fiber/Runtime/Flags"
import * as FiberRefs from "@effect/io/FiberRefs"
import * as Runtime from "@effect/io/Runtime"
import type { Scheduler } from "@effect/io/Scheduler"
import * as TestEnvironment from "@effect/test/TestEnvironment"
import * as Context from "@fp-ts/data/Context"
import type { Either } from "@fp-ts/data/Either"

class TestRuntime<R> implements Runtime.Runtime<R> {
  private live: Runtime.Runtime<R>
  constructor(
    readonly context: Context.Context<R>,
    readonly runtimeFlags: RuntimeFlags,
    readonly fiberRefs: FiberRefs.FiberRefs
  ) {
    this.live = Runtime.make(context, runtimeFlags, fiberRefs)
  }

  unsafeFork: <E, A>(effect: Effect.Effect<R, E, A>, scheduler?: Scheduler | undefined) => RuntimeFiber<E, A> = (
    effect,
    scheduler
  ) => this.live.unsafeFork(Effect.provideSomeLayer(TestEnvironment.testEnvironment())(effect), scheduler)

  unsafeRun: <E, A>(
    effect: Effect.Effect<R, E, A>,
    onExit?: ((exit: Exit<E, A>) => void) | undefined
  ) => Runtime.Cancel<E, A> = (effect, onExit) =>
    this.live.unsafeRun(Effect.provideSomeLayer(TestEnvironment.testEnvironment())(effect), onExit)

  unsafeRunSync: <E, A>(effect: Effect.Effect<R, E, A>) => A = (effect) =>
    this.live.unsafeRunSync(Effect.provideSomeLayer(TestEnvironment.testEnvironment())(effect))

  unsafeRunSyncExit: <E, A>(effect: Effect.Effect<R, E, A>) => Exit<E, A> = (effect) =>
    this.live.unsafeRunSyncExit(Effect.provideSomeLayer(TestEnvironment.testEnvironment())(effect))

  unsafeRunSyncEither: <E, A>(effect: Effect.Effect<R, E, A>) => Either<E, A> = (effect) =>
    this.live.unsafeRunSyncEither(Effect.provideSomeLayer(TestEnvironment.testEnvironment())(effect))

  unsafeRunPromise: <E, A>(effect: Effect.Effect<R, E, A>) => Promise<A> = (effect) =>
    this.live.unsafeRunPromise(Effect.provideSomeLayer(TestEnvironment.testEnvironment())(effect))

  unsafeRunPromiseExit: <E, A>(effect: Effect.Effect<R, E, A>) => Promise<Exit<E, A>> = (effect) =>
    this.live.unsafeRunPromiseExit(Effect.provideSomeLayer(TestEnvironment.testEnvironment())(effect))

  unsafeRunPromiseEither: <E, A>(effect: Effect.Effect<R, E, A>) => Promise<Either<E, A>> = (effect) =>
    this.live.unsafeRunPromiseEither(Effect.provideSomeLayer(TestEnvironment.testEnvironment())(effect))
}

/**
 * @since 1.0.0
 * @category constructors
 */
export const make = <R>(
  context: Context.Context<R>,
  runtimeFlags: RuntimeFlags,
  fiberRefs: FiberRefs.FiberRefs
): Runtime.Runtime<R> => new TestRuntime<R>(context, runtimeFlags, fiberRefs)

/**
 * @since 1.0.0
 * @category constructors
 */
export const testRuntime = make(
  Context.empty(),
  Runtime.defaultRuntimeFlags,
  FiberRefs.unsafeMake(new Map())
)

const {
  unsafeFork,
  unsafeRun,
  unsafeRunPromise,
  unsafeRunPromiseEither,
  unsafeRunPromiseExit,
  unsafeRunSync,
  unsafeRunSyncEither,
  unsafeRunSyncExit
} = testRuntime

export {
  /**
   * @since 1.0.0
   * @category execution
   */
  unsafeFork,
  /**
   * @since 1.0.0
   * @category execution
   */
  unsafeRun,
  /**
   * @since 1.0.0
   * @category execution
   */
  unsafeRunPromise,
  /**
   * @since 1.0.0
   * @category execution
   */
  unsafeRunPromiseEither,
  /**
   * @since 1.0.0
   * @category execution
   */
  unsafeRunPromiseExit,
  /**
   * @since 1.0.0
   * @category execution
   */
  unsafeRunSync,
  /**
   * @since 1.0.0
   * @category execution
   */
  unsafeRunSyncEither,
  /**
   * @since 1.0.0
   * @category execution
   */
  unsafeRunSyncExit
}

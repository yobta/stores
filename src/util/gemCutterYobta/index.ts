export type YobtaGemProducer<S> = (
  consumer: YobtaGemConsumer<S>,
) => VoidFunction
export type YobtaGemConsumer<S> = (state: S) => void
interface YobtaJemCutter {
  <S>(
    producer: YobtaGemProducer<S>,
    consumer: YobtaGemConsumer<S>,
    next?: VoidFunction,
  ): VoidFunction
}
type State<S> = [
  YobtaGemProducer<S>,
  YobtaGemConsumer<S>,
  VoidFunction | undefined,
]
type Store<S> = Set<State<S>>

const store: Store<any> = new Set()

const propagate = (target: YobtaGemProducer<any>): void => {
  let callbacks = new Set<VoidFunction>()
  for (let [producer, consumer] of store) {
    if (producer === target) {
      callbacks.add(consumer as VoidFunction)
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  for (let [_, consumer, next] of store) {
    if (next && callbacks.has(consumer as VoidFunction)) {
      callbacks.add(next)
    }
  }
  for (let callback of callbacks) {
    callback()
  }
}

export const jemCutterYobta: YobtaJemCutter = (producer, consumer, next) => {
  let item: State<any> = [producer, consumer, next]
  store.add(item)
  let unsubscribe: VoidFunction | undefined
  unsubscribe = producer(() => {
    propagate(producer)
  })
  return () => {
    if (unsubscribe) unsubscribe()
    store.delete(item)
  }
}

export type YobtaGemProducer<S> = (
  consumer: YobtaGemConsumer<S>,
) => VoidFunction
export type YobtaGemConsumer<S> = (state: S) => void
interface YobtaJemCutter {
  <S>(
    producer: YobtaGemProducer<S>,
    consumer: YobtaGemConsumer<S>,
    next: VoidFunction,
  ): VoidFunction
  (producer: VoidFunction, consumer: YobtaGemConsumer<any>): VoidFunction
}
type State<S> =
  | [YobtaGemProducer<S> | VoidFunction, YobtaGemConsumer<S>, VoidFunction]
  | [VoidFunction, YobtaGemConsumer<any>]
type Store<S> = Set<State<S>>

const store: Store<any> = new Set()

const propagate = (target: YobtaGemProducer<any>): void => {
  let consumers = new Set<VoidFunction>()
  let nextProducers = new Set<YobtaGemProducer<any>>()
  for (let [producer, consumer, next] of store) {
    if (producer === target) {
      consumers.add(consumer as VoidFunction)
      if (next) nextProducers.add(next)
    }
  }
  for (let consumer of consumers) consumer()
  for (let producer of nextProducers) propagate(producer)
}

export const jemCutterYobta: YobtaJemCutter = (producer, consumer, next) => {
  let item: State<any> = [producer, consumer, next]
  store.add(item)
  let unsubscribe: VoidFunction | undefined
  if (next) {
    unsubscribe = producer(() => {
      propagate(producer)
    })
  }
  return () => {
    if (unsubscribe) unsubscribe()
    store.delete(item)
  }
}

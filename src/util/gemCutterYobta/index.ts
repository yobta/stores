export type YobtaGemProducer<S> = (
  consumer: YobtaGemConsumer<S>,
) => VoidFunction
export type YobtaGemConsumer<S> = (state: S) => void
interface YobtaJemCutter {
  <S>(
    producer: YobtaGemProducer<S>,
    consumer: YobtaGemConsumer<S>,
    next?: YobtaGemProducer<any>,
  ): VoidFunction
}
type State<S> = [
  YobtaGemProducer<S>,
  YobtaGemConsumer<S>,
  YobtaGemProducer<any> | undefined,
]
type Store<S> = Set<State<S>>

const store: Store<any> = new Set()

const propagate = (target?: YobtaGemProducer<any>): void => {
  if (target) {
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
}

export const jemCutterYobta: YobtaJemCutter = <S>(
  producer: YobtaGemProducer<S>,
  consumer: YobtaGemConsumer<S>,
  next?: YobtaGemProducer<any>,
) => {
  let item: State<any> = [producer, consumer, next]
  store.add(item)
  let unsubscribe = producer(() => {
    propagate(producer)
  })
  return () => {
    unsubscribe()
    store.delete(item)
  }
}

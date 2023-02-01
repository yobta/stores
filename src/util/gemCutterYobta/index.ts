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

const collect = (
  acc: Set<VoidFunction>,
  target: VoidFunction,
): Set<VoidFunction> => {
  for (let [producer, consumer, next] of store) {
    if (producer === target) {
      acc.add(consumer as VoidFunction)
      if (next) return collect(acc, next)
    }
  }
  return acc
}

const propagate = (target: VoidFunction): void => {
  let callbacks = collect(new Set(), target)
  for (let callback of callbacks) {
    callback()
  }
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

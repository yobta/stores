/* eslint-disable @typescript-eslint/no-unnecessary-condition */

export type YobtaPubsubSubscriber<Data, Overloads extends any[] = any[]> = (
  data: Data,
  ...overloads: Overloads
) => void
type BaseTopics = {
  [key: string]: any
  [key: symbol]: any
}

interface PubSubFactory {
  <Topics extends BaseTopics, Overloads extends any[] = any[]>(): {
    subscribe: <Topic extends keyof Topics>(
      topic: keyof Topics,
      subscriber: YobtaPubsubSubscriber<Topics[Topic], Overloads>,
    ) => VoidFunction
    publish: <Topic extends keyof Topics>(
      topic: Topic,
      data: Topics[Topic],
      ...overloads: Overloads
    ) => void
  }
}

/**
 * Creates an observable object.
 *
 * @example
 * const pubSub = pubSubYobta()
 * const unsubscribe = pubSub.subscribe('foo', console.log)
 * pubSub.publish('foo', 'bar')
 * unsubscribe()
 * @documentation {@link https://github.com/yobta/stores/tree/master/src/util/pubSubYobta/index.md}
 */
export const pubSubYobta: PubSubFactory = <
  Topics extends BaseTopics,
  Overloads extends any[] = any[],
>() => {
  let subscribers = {} as Record<
    keyof Topics,
    Set<YobtaPubsubSubscriber<any, Overloads>>
  >
  return {
    publish(topic: keyof Topics, data: any, ...overloads: Overloads) {
      let current = subscribers[topic]
      if (current) {
        current.forEach(notify => {
          notify(data, ...overloads)
        })
      }
    },
    subscribe(
      topic: keyof Topics,
      subscriber: YobtaPubsubSubscriber<any, Overloads>,
    ) {
      let current = subscribers[topic] || new Set()
      current.add(subscriber)
      subscribers[topic] = current
      return () => {
        current.delete(subscriber)
      }
    },
  }
}

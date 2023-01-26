/* eslint-disable @typescript-eslint/no-unnecessary-condition */

export type YobtaPubsubSubscriber<Args extends any[]> = (...args: Args) => void
type BaseTopics = {
  [key: string]: any[]
  [key: symbol]: any[]
}

interface PubSubFactory {
  <Topics extends BaseTopics>(): {
    getSize: <Topic extends keyof Topics>(topic: Topic) => number
    publish: <
      Topic extends keyof Topics,
      Args extends Topics[Topic] = Topics[Topic],
    >(
      topic: Topic,
      ...args: Args
    ) => void
    subscribe: <
      Topic extends keyof Topics,
      Args extends Topics[Topic] = Topics[Topic],
    >(
      topic: Topic,
      subscriber: YobtaPubsubSubscriber<Args>,
    ) => VoidFunction
    unsubscribe: <Topic extends keyof Topics>(
      topic: Topic,
      subscriber: YobtaPubsubSubscriber<any>,
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
export const pubSubYobta: PubSubFactory = <Topics extends BaseTopics>() => {
  let subscribers = {} as Record<keyof Topics, Set<YobtaPubsubSubscriber<any>>>
  return {
    getSize: topic => subscribers[topic]?.size || 0,
    publish(topic: keyof Topics, ...args: Topics[keyof Topics]) {
      let current = subscribers[topic]
      if (current) {
        current.forEach(notify => {
          notify(...args)
        })
      }
    },
    subscribe(topic: keyof Topics, subscriber: YobtaPubsubSubscriber<any>) {
      let current = subscribers[topic] || new Set()
      current.add(subscriber)
      subscribers[topic] = current
      return () => {
        current.delete(subscriber)
      }
    },
    unsubscribe(topic, subscriber) {
      subscribers[topic]?.delete(subscriber)
    },
  }
}

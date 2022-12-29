/* eslint-disable @typescript-eslint/no-unnecessary-condition */

export type YobtaPubsubSubscriber<R> = (data: R, ...overloads: any[]) => void
type BaseTopics = Record<string, unknown>

interface PubSubFactory {
  <Topics extends BaseTopics>(): {
    subscribe: <Topic extends keyof Topics>(
      topic: keyof Topics,
      subscriber: YobtaPubsubSubscriber<Topics[Topic]>,
    ) => VoidFunction
    publish: <Topic extends keyof Topics>(
      topic: Topic,
      data: Topics[Topic],
      ...overloads: any[]
    ) => void
  }
}

export const pubSubYobta: PubSubFactory = () => {
  let subscribers: Record<string, Set<YobtaPubsubSubscriber<any>>> = {}
  return {
    publish(topic: any, data, ...overloads) {
      let current = subscribers[topic]
      if (current) {
        current.forEach(notify => {
          notify(data, ...overloads)
        })
      }
    },
    subscribe(topic: any, subscriber) {
      let current = subscribers[topic] || new Set()
      current.add(subscriber)
      subscribers[topic] = current
      return () => {
        current.delete(subscriber)
      }
    },
  }
}

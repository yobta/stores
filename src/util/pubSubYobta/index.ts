/* eslint-disable @typescript-eslint/no-unnecessary-condition */

export type YobtaPubsubSubscriber<R> = (data: R) => void
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
    ) => void
  }
}

export const pubSubYobta: PubSubFactory = () => {
  let subscribers: Record<string, Set<YobtaPubsubSubscriber<any>>> = {}
  return {
    publish(topic: any, data: any) {
      let current = subscribers[topic]
      if (current) {
        current.forEach(notify => {
          notify(data)
        })
      }
    },
    subscribe(topic: any, subscriber: YobtaPubsubSubscriber<any>) {
      let current = subscribers[topic] || new Set<YobtaPubsubSubscriber<any>>()
      current.add(subscriber)
      subscribers[topic] = current
      return () => {
        current.delete(subscriber)
      }
    },
  }
}

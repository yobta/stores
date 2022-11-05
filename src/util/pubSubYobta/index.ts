/* eslint-disable @typescript-eslint/no-unnecessary-condition */

type Subscriber<R> = (data: R) => void
type BaseTopics = Record<string, unknown>

interface PubSubFactory {
  <Topics extends BaseTopics>(): {
    subscribe: <Topic extends keyof Topics>(
      topic: keyof Topics,
      subscriber: Subscriber<Topics[Topic]>,
    ) => VoidFunction
    publish: <Topic extends keyof Topics>(
      topic: Topic,
      data: Topics[Topic],
    ) => void
  }
}

export const pubSubYobta: PubSubFactory = () => {
  let subscribers: Record<string, Set<Subscriber<any>>> = {}
  return {
    publish(topic: any, data: any) {
      let current = subscribers[topic]
      if (current) {
        current.forEach(notify => {
          notify(data)
        })
      }
    },
    subscribe(topic: any, subscriber: Subscriber<any>) {
      let current = subscribers[topic] || new Set<Subscriber<any>>()
      current.add(subscriber)
      subscribers[topic] = current
      return () => {
        current.delete(subscriber)
      }
    },
  }
}

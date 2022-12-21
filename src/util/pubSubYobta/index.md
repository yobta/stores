&larr; [Home](../../../README.md)

# PubSub utility

PubSub factory creates a type-safe messaging utility for direct messaging between the application components.

###### example

```ts
interface Topics {
  foo: string
  bar: number
}

const pubSub = pubSubYobta<Topics>()

const unsubscribe = pubSub.subscribe('foo', console.log)

pubSub.publish('foo', 'bar')
pubSub.publish('bar', 1)
```

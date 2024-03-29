&larr; [Home](../../../README.md)

# PubSub Utility

Creates messaging utility for direct messaging between the application components. It allows components to subscribe to specific topics and receive updates when a matching topic is published.

Using a publish/subscribe pattern can help to decouple different components of an application and make them more modular, as they do not need to directly call each other's methods.

## Example

```js
import { createPubSub } from '@yobta/stores'

const pubSub = createPubSub()
const unsubscribe = pubSub.subscribe('foo', console.log)

pubSub.publish('foo', 'bar')
unsubscribe()
```

In the above example, we imported the `createPubSub` utility and created an instance of it. Next, a function is subscribed to the topic 'foo' and it logs whatever is passed as the data for this topic. You can see in the last line we are unsubscribing from the topic.

It is important to unsubscribe, when you are done using it, to avoid any potential memory leaks or performance issues.

You can also unsubscribe by passing the topic and the subscriber function to the unsubscribe method as shown in the second example:

```js
const subscriber = console.log
pubSub.subscribe('foo', subscriber)
pubSub.unsubscribe('foo', subscriber)
```

## Typing the Topics

```ts
type Topics = {
  foo: string[]
  bar: number[]
}

const pubSub = createPubSub<Topics>()
const unsubscribe = pubSub.subscribe('foo', console.log)

pubSub.publish('foo', 'bar') //OK
pubSub.publish('bar', 1) // OK
pubSub.publish('foo', 1) // Not OK
pubSub.publish('bar', 'foo') // Not OK
```

In this example, we have defined a type `Topics` that describes the types of data that can be associated with each topic. When creating an instance of the createPubSub utility, we pass in this type as a generic. This allows TypeScript to check that the topic and data types match, and provides better type checking at compile-time.

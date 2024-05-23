# Change Log

This project adheres to [Semantic Versioning](http://semver.org/).

## 0.2.9

Ignored pnpm-workspace.yaml

## 0.2.8

Ideomatic stack store
New modal store added
Dev deps updage

## 0.2.7

Changed serverState handling of the react hook

## 0.2.6

Changed plugin's types to allow overloads to avoid conflicting with stores

## 0.2.5

Memoise getServerSnapshot

## 0.2.4

Use last as default getServerSnapshot

## 0.2.2

Fix state getter type

## 0.2.1

Fix derived initialization
Add getServerSnapshot option to the store hook
Give normal names to functions

## 0.1.14

Improve multiple inheritance solution

## 0.1.13

derived store

## 0.1.12

Add unsubscribe method to pubsub utility

## 0.1.11

Improve pubsub typings

## 0.1.10

Hook Factory

## 0.1.9

Online store

## 0.1.8

Readable store utility

## 0.1.7

Fix effect utilities types

## 0.1.6

Revert store.on
Add store effect utility
Add transition effect ultility

## 0.1.5

Publishing failed

## 0.1.4

Update the stores api:

- remove: store.on
- add: store.onReady, store.onIdle

## 0.1.3

Export store types

## 0.1.2

Fix machine store typings

## 0.1.1

Breakng changes:
Rename observableYobte to createStore
Remove store init event
Remove setter from store next method
Map store becomes mutable
Renamed `useObservable` hook to `useStore`
Renamed `encoderYobta` to `jsonCodec`
Renames `mapEncoderYobta` to `mapCodec`
Machine store now takes map of arrays instead of sets

Improvements:
Add observable utility
Change store to compose middlewares
Update documentation
Add diffMap utility
Add compose utility
Add diff object utility
Add on => off to all stores

## 0.0.36

Fix build command

## 0.0.35

Fix broadcast channel serialization bug

## 0.0.34

Fix map store types and types exports

## 0.0.33

Fix encoders bugs
Improve specs
Add regression tests
Increase code coverage

## 0.0.32

Fix map store typings

## 0.0.31

Fix encoders incompatibility
Add fallback to encoders

## 0.0.30

Add omit method to map store
Omit and Assign methods mutate state for perfornace reasons
Update map store spec
Add readme for the map store

## 0.0.29

Fix store plugin typings

## 0.0.28

- Rename map store to plain object store
- Add real map store
- Add map encoder

## 0.0.27

- Observable is using set now for storing observers

## 0.0.26

- PubSub utility

## 0.0.25

- validation plugin

## 0.0.24

- broadcast channel plugin
- fix bugs
- update docs

## 0.0.22

- Improve plugin API

## 0.0.21

- Stack store

## 0.0.20

- Improve store lifecycle

## 0.0.19

- State machine store

## 0.0.18

- ESM Exports

## 0.0.17

- Export encoder

## 0.0.16

- Fix store start bug

## 0.0.15

- Rename storage to local storage
- Session storage

## 0.0.14

- Simplify typings for react observable hook

## 0.0.13

- Improve types export

## 0.0.12

- Map store

## 0.0.11

- Replace observable config with listeners
- Implement lazy listener
- Rename useStore to useObservable
- Replication plugin
- Storage plugin

## 0.0.10

- onStart and onStop store options

## 0.0.9

- Implement laziness as an option of observable store

## 0.0.8

- Fix typescript import issue
- Re-init git repository because it's not a fork of nanostores, I only need to clone the setup

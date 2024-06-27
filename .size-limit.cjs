module.exports = [
  {
    name: 'all',
    path: './lib/index.js',
    limit: '1886 B',
  },
  {
    name: 'react',
    ignore: ['react'],
    path: './lib/adapters/react/index.js',
    limit: '305 B',
  },
  {
    name: 'createHookFromStore',
    path: './lib/adapters/react/index.js',
    ignore: ['react'],
    import: '{ createHookFromStore }',
    limit: '157 B',
  },
  {
    name: 'useStore',
    ignore: ['react'],
    path: './lib/adapters/react/index.js',
    import: '{ useStore }',
    limit: '147 B',
  },
  {
    name: 'broadcastChannelPlugin',
    path: './lib/index.js',
    import: '{ broadcastChannelPlugin }',
    limit: '304 B',
  },
  {
    name: 'lazyPlugin',
    path: './lib/index.js',
    import: '{ lazyPlugin }',
    limit: '61 B',
  },
  {
    name: 'localStoragePlugin',
    path: './lib/index.js',
    import: '{ localStoragePlugin }',
    limit: '308 B',
  },
  {
    name: 'sessionStoragePlugin',
    path: './lib/index.js',
    import: '{ sessionStoragePlugin }',
    limit: '212 B',
  },
  {
    name: 'validationPlugin',
    path: './lib/index.js',
    import: '{ validationPlugin }',
    limit: '108 B',
  },
  {
    name: 'createConnectivityStore',
    path: './lib/index.js',
    import: '{ createConnectivityStore }',
    limit: '745 B',
  },
  {
    name: 'createDerivedStore',
    path: './lib/index.js',
    import: '{ createDerivedStore }',
    limit: '697 B',
  },
  {
    name: 'createMachineStore',
    path: './lib/index.js',
    import: '{ createMachineStore }',
    limit: '681 B',
  },
  {
    name: 'createMapStore',
    path: './lib/index.js',
    import: '{ createMapStore }',
    limit: '763 B',
  },
  {
    name: 'createModalStore',
    path: './lib/index.js',
    import: '{ createModalStore }',
    limit: '691 B',
  },
  {
    name: 'createPlainObjectStore',
    path: './lib/index.js',
    import: '{ createPlainObjectStore }',
    limit: '750 B',
  },
  {
    name: 'createStackStore',
    path: './lib/index.js',
    import: '{ createStackStore }',
    limit: '692 B',
  },
  {
    name: 'createStore',
    path: './lib/index.js',
    import: '{ createStore }',
    limit: '601 B',
  },
  {
    name: 'compose',
    path: './lib/index.js',
    import: '{ compose }',
    limit: '71 B',
  },
  {
    name: 'createObservable',
    path: './lib/index.js',
    import: '{ createObservable }',
    limit: '156 B',
  },
  {
    name: 'createPubSub',
    path: './lib/index.js',
    import: '{ createPubSub }',
    limit: '172 B',
  },
  {
    name: 'diffMap',
    path: './lib/index.js',
    import: '{ diffMap }',
    limit: '69 B',
  },
  {
    name: 'diffObject',
    path: './lib/index.js',
    import: '{ diffObject }',
    limit: '60 B',
  },
  {
    name: 'jsonCodec',
    path: './lib/index.js',
    import: '{ jsonCodec }',
    limit: '89 B',
  },
  {
    name: 'mapCodec',
    path: './lib/index.js',
    import: '{ mapCodec }',
    limit: '120 B',
  },
  {
    name: 'readable',
    path: './lib/index.js',
    import: '{ readable }',
    limit: '37 B',
  },
  {
    name: 'setCodec',
    path: './lib/index.js',
    import: '{ setCodec }',
    limit: '114 B',
  },
  {
    name: 'storeEffect',
    path: './lib/index.js',
    import: '{ storeEffect }',
    limit: '75 B',
  },
  {
    name: 'transitionEffect',
    path: './lib/index.js',
    import: '{ transitionEffect }',
    limit: '58 B',
  },
]

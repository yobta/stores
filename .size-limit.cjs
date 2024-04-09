module.exports = [
  {
    name: 'all',
    path: './lib/index.js',
    limit: '1870 B',
  },
  {
    name: 'react',
    ignore: ['react'],
    path: './lib/adapters/react/index.js',
    limit: '309 B',
  },
  {
    name: 'createHookFromStore',
    path: './lib/adapters/react/index.js',
    ignore: ['react'],
    import: '{ createHookFromStore }',
    limit: '160 B',
  },
  {
    name: 'useStore',
    ignore: ['react'],
    path: './lib/adapters/react/index.js',
    import: '{ useStore }',
    limit: '149 B',
  },
  {
    name: 'broadcastChannelPlugin',
    path: './lib/index.js',
    import: '{ broadcastChannelPlugin }',
    limit: '305 B',
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
    limit: '307 B',
  },
  {
    name: 'sessionStoragePlugin',
    path: './lib/index.js',
    import: '{ sessionStoragePlugin }',
    limit: '213 B',
  },
  {
    name: 'validationPlugin',
    path: './lib/index.js',
    import: '{ validationPlugin }',
    limit: '107 B',
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
    limit: '695 B',
  },
  {
    name: 'createMachineStore',
    path: './lib/index.js',
    import: '{ createMachineStore }',
    limit: '651 B',
  },
  {
    name: 'createMapStore',
    path: './lib/index.js',
    import: '{ createMapStore }',
    limit: '758 B',
  },
  {
    name: 'createModalStore',
    path: './lib/index.js',
    import: '{ createModalStore }',
    limit: '690 B',
  },
  {
    name: 'createPlainObjectStore',
    path: './lib/index.js',
    import: '{ createPlainObjectStore }',
    limit: '746 B',
  },
  {
    name: 'createStackStore',
    path: './lib/index.js',
    import: '{ createStackStore }',
    limit: '688 B',
  },
  {
    name: 'createStore',
    path: './lib/index.js',
    import: '{ createStore }',
    limit: '597 B',
  },
  {
    name: 'compose',
    path: './lib/index.js',
    import: '{ compose }',
    limit: '70 B',
  },
  {
    name: 'createObservable',
    path: './lib/index.js',
    import: '{ createObservable }',
    limit: '157 B',
  },
  {
    name: 'createPubSub',
    path: './lib/index.js',
    import: '{ createPubSub }',
    limit: '173 B',
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
    limit: '122 B',
  },
  {
    name: 'readable',
    path: './lib/index.js',
    import: '{ readable }',
    limit: '36 B',
  },
  {
    name: 'setCodec',
    path: './lib/index.js',
    import: '{ setCodec }',
    limit: '116 B',
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
    limit: '59 B',
  },
]

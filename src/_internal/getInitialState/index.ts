interface GetInitialState {
  <S>(state: S): S
  <S>(state: () => S): S
}

export const getInitialState: GetInitialState = state =>
  // @ts-ignore
  typeof state === 'function' ? state() : state

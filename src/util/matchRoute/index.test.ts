import { matchRoute } from './index.js'

const matches = [
  ['/user/:id', '/user/123'],
  ['/user/:id/:name', '/user/123/name'],
  ['/user/:id/', '/user/:123'],
  ['/user/:id/:name?', '/user/123'],
  ['/user/:id', '/user/123/'],
  ['/user/?asd=:id', '/user/?asd=:id'],
] as [string, string][]

const mismatches = [
  ['/user/:id', '/user1/123'],
  ['/user/:id', '/user/123/name'],
  ['/user/?:id', '/user/123'],
  ['/user/?asd=:id', '/user/123'],
] as [string, string][]

describe('matchRoute', () => {
  matches.forEach(args => {
    it(`checks match - '${args.join(' <-> ')}'`, () => {
      expect(matchRoute(...args)).toBe(true)
    })
  })
  mismatches.forEach(args => {
    it(`checks mismatch - '${args.join(' <!> ')}'`, () => {
      expect(matchRoute(...args)).toBe(false)
    })
  })
})

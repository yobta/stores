import type { MDXComponents } from 'mdx/types'

// https://nextjs.org/docs/app/building-your-application/configuring/mdx#getting-started

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // h1: ({ children }) => <h1 style={{ fontSize: "100px" }}>{children}</h1>,
    ...components,
  }
}

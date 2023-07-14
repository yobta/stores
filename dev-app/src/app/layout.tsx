import type { Metadata } from 'next'
import type { FunctionComponent } from 'react'

import { Body } from './Body'

import '../styles/globals.css'

type Props = {
  children: JSX.Element
}

// https://nextjs.org/docs/app/api-reference/functions/generate-metadata#the-metadata-object
export const metadata: Metadata = {
  title: {
    default: 'Hello',
    template: '%s | Yobta',
  },
}

const RootLayout: FunctionComponent<Props> = ({ children }) => {
  return (
    <html lang="en">
      <Body>{children}</Body>
    </html>
  )
}

export default RootLayout

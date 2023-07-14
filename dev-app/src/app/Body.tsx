'use client'
import clsx from 'clsx'
import { useSelectedLayoutSegments } from 'next/navigation'
import type { FunctionComponent } from 'react'

import { ErrorBoundary } from '../components/Errors/ErrorBoundary'
import { ErrorToast } from '../components/Errors/ErrorToast'
import { ConnectionToast } from '../components/Notifications/ConnectionToast'
import { NotificationToast } from '../components/Notifications/NotificationToast'

type Props = {
  children: JSX.Element
}

export const Body: FunctionComponent<Props> = ({ children }) => {
  const [segment] = useSelectedLayoutSegments()

  return (
    <body className={clsx(segment === '(md)' && 'yobta-info')}>
      <ErrorBoundary>
        {children}
        <ErrorToast />
        <NotificationToast />
        <ConnectionToast />
      </ErrorBoundary>
    </body>
  )
}

'use client'
import { Home } from '@yobta/ui'
import Link from 'next/link'
import type { FunctionComponent, ReactNode } from 'react'

import css from './layout.module.scss'

type Props = {
  children: ReactNode
}

const MdLayout: FunctionComponent<Props> = ({ children }) => {
  return (
    <>
      <Link className="yobta-menu-item" href="/">
        <Home />
        Home
      </Link>
      <main className={css.mdLayout}>{children}</main>
    </>
  )
}

export default MdLayout

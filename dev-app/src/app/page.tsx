import type { Metadata } from 'next'
import { revalidatePath } from 'next/cache'

import { FormDemo } from './FormDemo'

export const metadata: Metadata = {
  manifest: '/manifest.json',
  title: 'App Yobta',
}

const HomePage = async (): Promise<JSX.Element> => {
  revalidatePath('/')
  const serverState = await fetch(
    'https://nominatim.openstreetmap.org/search?q=Боровичи&format=json',
    {
      next: {
        tags: ['places'],
      },
    }
  ).then((res) => res.json())

  return (
    <>
      <main className="container max-w-lg mx-auto px-4">
        <h1 className="text-2xl my-4">Welcome Yobta</h1>
        <FormDemo serverState={serverState} />
      </main>
    </>
  )
}

export default HomePage

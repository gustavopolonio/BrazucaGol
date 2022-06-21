import { useSession } from 'next-auth/react'
import Head  from 'next/head'
import { GoalsAmountTables } from '../components/GoalsAmount'

import styles from './home.module.scss'

export default function Home() {
  const { data: session } = useSession()
  console.log('session', session)

  return (
    <>
      <Head>
        <title>Home | Brazucagol</title>
      </Head>

      <GoalsAmountTables />
    </>
  )
}
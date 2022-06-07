import Head  from 'next/head'
import { GoalsAmountTables } from '../components/GoalsAmount'

import styles from './home.module.scss'

export default function Home() {

  return (
    <>
      <Head>
        <title>Home | Brazucagol</title>
      </Head>

      <GoalsAmountTables />
    </>
  )
}
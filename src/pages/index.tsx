import Head  from 'next/head'
import { MenuSidebar } from '../components/MenuSidebar'
import { MyAccountSidebar } from '../components/MyAccountSidebar'
import { GoalsAmountTables } from '../components/GoalsAmount'
import { Footer } from '../components/Footer'

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
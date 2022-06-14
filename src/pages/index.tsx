import Head  from 'next/head'
import { GetServerSideProps } from 'next'
import { GoalsAmountTables } from '../components/GoalsAmount'
import { CountdownKickContainer } from '../components/CountdownKickContainer'

import styles from './home.module.scss'
import { getSession } from 'next-auth/react'
import { ClubsHighlightedes } from '../components/ClubsHighlightedes'
import { MenuSidebar } from '../components/MenuSidebar'
import { MyAccountSidebar } from '../components/MyAccountSidebar'

interface HomeProps {
  isAvatarActive: boolean | null
}

export default function Home({ isAvatarActive }: HomeProps) {

  return (
    <>
      <Head>
        <title>Home | Brazucagol</title>
      </Head>

      <CountdownKickContainer isAvatarActive={isAvatarActive} />
      <ClubsHighlightedes />

      <main className={styles.mainContainer}>
        <MenuSidebar />
        <GoalsAmountTables />
        <MyAccountSidebar />
      </main>

    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req })
  let isAvatarActive = session?.isAvatarActive
  
  if (!isAvatarActive) {
    isAvatarActive = null
  } 
  
  return {
    props: { isAvatarActive }
  }
}
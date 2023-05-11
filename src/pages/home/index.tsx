import Head from 'next/head'
import { GoalsAmountTables } from '../../components/GoalsAmount'
import { TopBar } from '../../components/TopBar'
import { Header } from '../../components/Header'
import { CountdownKickContainer } from '../../components/CountdownKickContainer'
import { ClubsHighlightedes } from '../../components/ClubsHighlightedes'
import { MainContainer } from '../../components/MainContainer'

export default function Home() {
  return (
    <>
      <Head>
        <title>Home | Brazucagol</title>
      </Head>

      <TopBar />
      <Header />
      <CountdownKickContainer />
      <ClubsHighlightedes />

      <MainContainer>
        <GoalsAmountTables />
      </MainContainer>
    </>
  )
}

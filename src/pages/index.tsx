import { GetServerSideProps } from 'next'
import Head  from 'next/head'
import { CountdownKick } from '../components/CountdownKick'
import { Header } from '../components/Header'
import { MenuSidebar } from '../components/MenuSidebar'
import { MyAccountSidebar } from '../components/MyAccountSidebar'
import { GoalsAmountTables } from '../components/GoalsAmount'
import { useIndividualGoals } from '../contexts/IndividualGoalsContext'
import { Footer } from '../components/Footer'
import { api } from '../services/api'

import styles from './home.module.scss'

interface Club {
  id: string,
  name: string,
  encodedName: string,
  logoLink: string,
  stadiumName: string,
  state: string
}
interface HomeProps {
  clubs: Club[]
}

export default function Home({ clubs }: HomeProps) {
  const { autoGoals, penaltyGoals, freeKickGoals, trailGoals, totalGoals } = useIndividualGoals()

  return (
    <>
      <Head>
        <title>Home | Brazucagol</title>
      </Head>

      <Header />

      <div className={styles.ballsContainer}>
        <CountdownKick title='AUTO' kickType='auto'>
          Gols de auto: {autoGoals}
        </CountdownKick>
        <CountdownKick title='PÊNALTI' kickType='penalty'>
          Gols de penalti: {penaltyGoals}
        </CountdownKick>
        <CountdownKick title='FALTA' kickType='free-kick'>
          Gols de falta: {freeKickGoals}
        </CountdownKick>
        <CountdownKick title='TRILHA' kickType='trail'>
          Gols de trilha: {trailGoals}
        </CountdownKick>
      </div>

      <p className={styles.temporary}><strong>Gols Totais: {totalGoals}</strong></p>

      <div className={styles.clubsContainer}>
        {clubs.map(club => (
          <div key={club.encodedName} className={styles.clubLogoContainer}>
            <img src={club.logoLink} alt={club.name} />
          </div>
        ))}
      </div>

      <main className={styles.mainContainer}>
        <MenuSidebar />

        <GoalsAmountTables />

        <MyAccountSidebar />
      </main>

      <Footer />
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {

  const response = await api.get('/')
  const clubs = response.data

  return {
    props: { clubs }
  }
}
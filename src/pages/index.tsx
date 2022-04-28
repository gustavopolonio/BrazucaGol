import { CountdownKick } from '../components/CountdownKick'
import { TopBar } from '../components/TopBar'
import { useIndividualGoals } from '../contexts/IndividualGoalsContext'

export default function Home() {
  const { autoGoals, penaltyGoals, freeKickGoals, trailGoals, totalGoals } = useIndividualGoals()

  return (
    <>
      <TopBar />
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
      <p><strong>Gols Totais: {totalGoals}</strong></p>
    </>
  )
}
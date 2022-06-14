import { useIndividualGoals } from "../../contexts/IndividualGoalsContext";
import { CountdownKick } from "../CountdownKick";
import { useSession } from 'next-auth/react'

import styles from './styles.module.scss'

interface CountdownKickContainerProps {
  isAvatarActive: boolean
}

export function CountdownKickContainer({ isAvatarActive }: CountdownKickContainerProps) {
  // const { data: session } = useSession()
  const { autoGoals, penaltyGoals, freeKickGoals, trailGoals, totalGoals } = useIndividualGoals()

  return (
    <>
      <p className={styles.temporary}><strong>Gols Totais: {totalGoals}</strong></p>

      {isAvatarActive && (
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
      )}
    </>
  )
}
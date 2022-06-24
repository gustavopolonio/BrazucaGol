import { useIndividualGoals } from "../../contexts/IndividualGoalsContext";
import { CountdownKick } from "../CountdownKick";
import { useSession } from 'next-auth/react'

import styles from './styles.module.scss'


export function CountdownKickContainer() {
  const { data: session } = useSession()
  const { autoGoals, penaltyGoals, freeKickGoals, trailGoals, totalGoals } = useIndividualGoals()

  return (
    <>
      {session?.isAvatarActive && (
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
import { BsFillArrowUpLeftCircleFill, BsFillArrowUpCircleFill, BsFillArrowUpRightCircleFill } from "react-icons/bs"
import { useIndividualGoals } from "../../contexts/IndividualGoalsContext"
import { Dispatch, SetStateAction } from 'react'

import styles from './styles.module.scss'

interface PenaltyKickProps {
  kickType: string,
  setTime: Dispatch<SetStateAction<number>>
}

export function PenaltyKick({ kickType, setTime }: PenaltyKickProps) {
  const { 
    autoGoals, 
    setAutoGoals, 
    penaltyGoals, 
    setPenaltyGoals, 
    freeKickGoals, 
    setFreeKickGoals,
    trailGoals,
    setTrailGoals
  } = useIndividualGoals()

  switch (kickType) {

    case 'penalty': // Calculate probability to do goal (90% of chance)
      const penaltyProbability = Math.random() * 100
      if (penaltyProbability < 90) { // Penalty goal
        setPenaltyGoals(penaltyGoals + 1)
      } else { // Penalty lost
      }
      // setTime(300)


    break

    case 'free-kick': // Calculate probability to do goal (70% of chance)
      const freeKickProbability = Math.random() * 100
      if (freeKickProbability < 70) { // Free kick goal
        setFreeKickGoals(freeKickGoals + 1)
      } else { // Free kick lost
      }
      setTime(300)
    break

    case 'trail': // Calculate probability to do goal (30% of chance)
      const trailProbability = Math.random() * 100
      if (trailProbability < 30) { // Trail goal
        setTrailGoals(trailGoals + 1)
      } else { // Trail lost
      }
      setTime(300)
    break

    default:
      setAutoGoals(autoGoals + 1)
      setTime(300)
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <img src="https://img.freepik.com/free-vector/goalkeeper-area-playing_1214-396.jpg?w=2000" alt="" />
        <div className={styles.kickSideButtonsContainer}>
          <button type='button'><BsFillArrowUpLeftCircleFill /></button>
          <button type='button'><BsFillArrowUpCircleFill /></button>
          <button type='button'><BsFillArrowUpRightCircleFill /></button>
        </div>  
      </div>
    </div>
  )
}
import { useState, useEffect, ReactNode } from 'react'
import { useIndividualGoals } from '../../contexts/IndividualGoalsContext'
import { IoIosFootball } from 'react-icons/io'
import { PenaltyKick } from '../PenaltyKick'

import styles from './styles.module.scss'

interface CountdownKickProps {
  title: string,
  kickType: string,
  children: ReactNode
}

export function CountdownKick({ title, kickType, children }: CountdownKickProps) {
  const [time, setTime] = useState(5)
  const [isKickReady, setIsKickReady] = useState(false)
  const [isModalKickOpen, setIsModalKickOpen] = useState(false)
  // const { 
  //   autoGoals, 
  //   setAutoGoals, 
  //   penaltyGoals, 
  //   setPenaltyGoals, 
  //   freeKickGoals, 
  //   setFreeKickGoals,
  //   trailGoals,
  //   setTrailGoals
  // } = useIndividualGoals()


  useEffect(() => {
    setTimeout(() => {
      if (time > 0) {
        setTime(time - 1)
      } else { // Time to kick
        setIsKickReady(true)

        // switch (kickType) {

        //   case 'penalty': // Calculate probability to do goal (90% of chance)
        //     const penaltyProbability = Math.random() * 100
        //     if (penaltyProbability < 90) { // Penalty goal
        //       setPenaltyGoals(penaltyGoals + 1)
        //     } else { // Penalty lost
        //     }
        //     // setTime(300)


        //   break

        //   case 'free-kick': // Calculate probability to do goal (70% of chance)
        //     const freeKickProbability = Math.random() * 100
        //     if (freeKickProbability < 70) { // Free kick goal
        //       setFreeKickGoals(freeKickGoals + 1)
        //     } else { // Free kick lost
        //     }
        //     setTime(300)
        //   break

        //   case 'trail': // Calculate probability to do goal (30% of chance)
        //     const trailProbability = Math.random() * 100
        //     if (trailProbability < 30) { // Trail goal
        //       setTrailGoals(trailGoals + 1)
        //     } else { // Trail lost
        //     }
        //     setTime(300)
        //   break

        //   default:
        //     setAutoGoals(autoGoals + 1)
        //     setTime(300)
        // }
       
      }
    }, 1000)
  }, [time])



  return (
    <div className={styles.ballContainer}>
      { !isKickReady ? 
        ( // Kick isnt ready
          <div className={styles.ballContent}>
            <p>{time}</p>
          </div>
        ) : ( // Kick is ready
          <button 
            type='button'
            className={`${styles.ballContent} ${styles.kickIsReady}`}
            onClick={() => setIsModalKickOpen(true)}
          >
            <IoIosFootball fontSize={90} />
          </button>
        ) 
      }

      <h1>{title}</h1>
      <p>{time}</p>
      {/* {children} */}

      { isModalKickOpen && <PenaltyKick kickType={kickType} setTime={setTime} /> }
    </div>
  )
}
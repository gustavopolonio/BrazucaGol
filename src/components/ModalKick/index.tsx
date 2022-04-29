import { BsFillArrowUpLeftCircleFill, BsFillArrowUpCircleFill, BsFillArrowUpRightCircleFill } from "react-icons/bs"
import { useIndividualGoals } from "../../contexts/IndividualGoalsContext"
import { Dispatch, SetStateAction, useState } from 'react'

import styles from './styles.module.scss'

interface PenaltyKickProps {
  kickType: string,
  setTime: Dispatch<SetStateAction<number>>,
  setIsModalKickOpen: Dispatch<SetStateAction<boolean>>,
  setIsKickReady: Dispatch<SetStateAction<boolean>>
}

export function ModalKick({ kickType, setTime, setIsModalKickOpen, setIsKickReady }: PenaltyKickProps) {
  const { 
    autoGoals, 
    setAutoGoals, 
    penaltyGoals, 
    setPenaltyGoals, 
    freeKickGoals, 
    setFreeKickGoals,
    trailGoals,
    setTrailGoals,
    totalGoals
  } = useIndividualGoals()

  const [showKickMessage, setShowKickMessage] = useState(false)
  const [messageAfterKick, setMessageAfterKick] = useState('')

  function displayMessageAfterKick(message: string) {
    setShowKickMessage(true)
    setMessageAfterKick(message)
  }

  function handleKickWasGoal() {
    switch (kickType) {

      case 'penalty': // Calculate probability to do goal (90% of chance)
        const penaltyProbability = Math.random() * 100
        if (penaltyProbability < 90) { // Penalty goal
          setPenaltyGoals(penaltyGoals + 1)
          displayMessageAfterKick('GOL !!!!')
        } else { // Penalty lost
          displayMessageAfterKick('ERROU :(')
        }

        setTimeout(() => {
          setIsKickReady(false)
          setIsModalKickOpen(false)
          setTime(5)
        }, 1800)
      break
  
      case 'free-kick': // Calculate probability to do goal (70% of chance)
        const freeKickProbability = Math.random() * 100
        console.log('freeKickProbability', freeKickProbability)
        if (freeKickProbability < 70) { // Free kick goal
          setFreeKickGoals(freeKickGoals + 1)
          displayMessageAfterKick('GOL !!!!')
        } else { // Free kick lost
          displayMessageAfterKick('ERROU :(')
        }

        setTimeout(() => {
          setIsKickReady(false)
          setIsModalKickOpen(false)
          setTime(5)
        }, 1800)
      break
  
      // case 'trail': // Calculate probability to do goal (30% of chance)
      //   const trailProbability = Math.random() * 100
      //   if (trailProbability < 30) { // Trail goal
      //     setTrailGoals(trailGoals + 1)
      //   } else { // Trail lost
      //   }
      //   setTime(300)
      // break
  
      // default:
      //   setAutoGoals(autoGoals + 1)
      //   setTime(300)
    }
  }


  return (
    <div className={styles.container}>
      { showKickMessage && (
        <div className={styles.goalMessageContent}>
          <strong>{messageAfterKick}</strong>
        </div>
      )}

      { kickType === 'penalty' && (
        <div className={styles.content}>
          <img src="https://img.freepik.com/free-vector/goalkeeper-area-playing_1214-396.jpg?w=2000" alt="" />
          <div className={styles.kickSideButtonsContainer}>
            <button onClick={handleKickWasGoal} type='button'><BsFillArrowUpLeftCircleFill /></button>
            <button onClick={handleKickWasGoal} type='button'><BsFillArrowUpCircleFill /></button>
            <button onClick={handleKickWasGoal} type='button'><BsFillArrowUpRightCircleFill /></button>
          </div>  
        </div>
      )}

      { kickType === 'free-kick' && (
        <div className={styles.content}>
          <img src="https://media.istockphoto.com/vectors/free-kick-vector-id472298675?k=20&m=472298675&s=612x612&w=0&h=52SwbGdqzSP85vBkC8ACz7YpmHkEthTzS4_l2scB7Ss=" alt="" />
          <div className={styles.kickSideButtonsContainer}>
            <button onClick={handleKickWasGoal} type='button'><BsFillArrowUpLeftCircleFill /></button>
            <button onClick={handleKickWasGoal} type='button'><BsFillArrowUpCircleFill /></button>
            <button onClick={handleKickWasGoal} type='button'><BsFillArrowUpRightCircleFill /></button>
          </div>  
        </div>
      ) }

      { kickType === 'trail' && (
        <div className={styles.content}>
          <div className={styles.trailContent}>
            <fieldset>
              <input type="radio" name='trail-goalkepper' checked />
            </fieldset>

            <fieldset>
              <input type="radio" name='trail-part-one' />
              <input type="radio" name='trail-part-one' />
              <input type="radio" name='trail-part-one' />
              <input type="radio" name='trail-part-one' />
            </fieldset>

            <fieldset>
              <input type="radio" name='trail-part-two' />
              <input type="radio" name='trail-part-two' />
              <input type="radio" name='trail-part-two' />
              <input type="radio" name='trail-part-two' />
            </fieldset>

            <fieldset>
              <input type="radio" name='trail-part-three' />
              <input type="radio" name='trail-part-three' />
              <input type="radio" name='trail-part-three' />
            </fieldset>
          </div>
        </div>
      ) }
      
    </div>
  )
}
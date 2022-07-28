import { BsFillArrowUpLeftCircleFill, BsFillArrowUpCircleFill, BsFillArrowUpRightCircleFill } from "react-icons/bs"
import { Dispatch, SetStateAction, useEffect, useState, useRef } from 'react'
import { TrailAnimation } from "../TrailAnimation"
import { useIndividualGoals } from "../../contexts/IndividualGoalsContext"
import { useBlockKicks } from "../../contexts/BlockKicksContext"

import styles from './styles.module.scss'
import { api } from "../../services/api"

interface ModalKickProps {
  kickType: string,
  setTimeToKick: Dispatch<SetStateAction<number>>,
  setIsModalKickOpen: Dispatch<SetStateAction<boolean>>,
  setIsKickReady: Dispatch<SetStateAction<boolean>>,
  setTimeKickWillBeReady: Dispatch<SetStateAction<number>>,
  timeWithVip: number
}

export function ModalKick({ 
  kickType, 
  setTimeToKick, 
  setIsModalKickOpen, 
  setIsKickReady, 
  setTimeKickWillBeReady, 
  timeWithVip 
}: ModalKickProps) {
  const { 
    penaltyGoals, 
    setPenaltyGoals, 
    freeKickGoals, 
    setFreeKickGoals,
    trailGoals,
    setTrailGoals,
    hourlyGoals,
    setHourlyGoals,
    roundGoals,
    setRoundGoals
  } = useIndividualGoals()

  const { blockNearAutoGoal, blockNearHourlyChange } = useBlockKicks()

  const [showKickMessage, setShowKickMessage] = useState(false)
  const [messageAfterKick, setMessageAfterKick] = useState('')

  function displayMessageAfterKick(message: string) {
    setShowKickMessage(true)
    setMessageAfterKick(message)
  }

  function setConfigsToRestartCountdown(timeoutTimer: number) {
    setTimeout(() => {
      setIsKickReady(false)
      setIsModalKickOpen(false)
      const currentTime = Math.floor(new Date().getTime() / 1000)
      setTimeKickWillBeReady(currentTime + timeWithVip)
      setTimeToKick(timeWithVip)
    }, timeoutTimer)
  }

  async function handleKickWasGoal(wasTrailGoal?: boolean) {
    let wasGoal = false

    switch (kickType) {

      case 'penalty': // Calculate probability to do goal (90% of chance)
        const penaltyProbability = Math.random() * 100
        if (penaltyProbability < 90) { // Penalty goal
          wasGoal = true
          displayMessageAfterKick('GOL !!!!')
        } else { // Penalty lost
          displayMessageAfterKick('ERROU :(')
        }

        setConfigsToRestartCountdown(1800)
        
        if (wasGoal) {
          const response = await api.post("/api/individual-goals", {
            kickData: {
              avatarPenaltyGoals: penaltyGoals + 1,
              avatarHourlyGoals: hourlyGoals + 1,
              avatarRoundGoals: roundGoals + 1
            }
          })

          // const test = await api.get("/api/individual-goals")
          // const { avatarHourlyGoals } = test.data.data
          // setHourlyGoals(avatarHourlyGoals)

          if (response.status === 201) {
            setPenaltyGoals(penaltyGoals + 1)
            setHourlyGoals(hourlyGoals + 1)
            setRoundGoals(roundGoals + 1)
          }
        }
      break
  
      case 'free-kick': // Calculate probability to do goal (70% of chance)
        const freeKickProbability = Math.random() * 100
        if (freeKickProbability < 70) { // Free kick goal
          wasGoal = true
          displayMessageAfterKick('GOL !!!!')
        } else { // Free kick lost
          displayMessageAfterKick('ERROU :(')
        }

        setConfigsToRestartCountdown(1800)

        if (wasGoal) {
          const response = await api.post("/api/individual-goals", {
            kickData: {
              avatarFreeKickGoals: freeKickGoals + 1,
              avatarHourlyGoals: hourlyGoals + 1,
              avatarRoundGoals: roundGoals + 1
            }
          })

          if (response.status === 201) {
            setFreeKickGoals(freeKickGoals + 1)
            setHourlyGoals(hourlyGoals + 1)
            setRoundGoals(roundGoals + 1)
          }
        }
      break
  
      case 'trail': // Calculate probability to do goal (30% of chance)
        if (wasTrailGoal) {
          displayMessageAfterKick('GOL !!!!')

          const response = await api.post("/api/individual-goals", {
            kickData: {
              avatarTrailGoals: trailGoals + 1,
              avatarHourlyGoals: hourlyGoals + 1,
              avatarRoundGoals: roundGoals + 1
            }
          })
          
          if (response.status === 201) {
            setTrailGoals(trailGoals + 1)
            setHourlyGoals(hourlyGoals + 1)
            setRoundGoals(roundGoals + 1)
          }

        } else {
          displayMessageAfterKick('ERROU :(')
        }

        setConfigsToRestartCountdown(800)
      break
  
      default:
        console.log('Default case in switch')
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
            { blockNearAutoGoal || blockNearHourlyChange ? (
              <>
                <button type='button' disabled style={{filter:'none'}}><BsFillArrowUpLeftCircleFill /></button>
                <button type='button' disabled style={{filter:'none'}}><BsFillArrowUpCircleFill /></button>
                <button type='button' disabled style={{filter:'none'}}><BsFillArrowUpRightCircleFill /></button>
              </>
            ) : (
              <>
                <button onClick={() => handleKickWasGoal()} type='button'><BsFillArrowUpLeftCircleFill /></button>
                <button onClick={() => handleKickWasGoal()} type='button'><BsFillArrowUpCircleFill /></button>
                <button onClick={() => handleKickWasGoal()} type='button'><BsFillArrowUpRightCircleFill /></button>
              </>
            ) }
          </div>  
        </div>
      )}

      { kickType === 'free-kick' && (
        <div className={styles.content}>
          <img src="https://media.istockphoto.com/vectors/free-kick-vector-id472298675?k=20&m=472298675&s=612x612&w=0&h=52SwbGdqzSP85vBkC8ACz7YpmHkEthTzS4_l2scB7Ss=" alt="" />
          <div className={styles.kickSideButtonsContainer}>
            { blockNearAutoGoal || blockNearHourlyChange ? (
              <>
                <button type='button' disabled style={{filter:'none'}}><BsFillArrowUpLeftCircleFill /></button>
                <button type='button' disabled style={{filter:'none'}}><BsFillArrowUpCircleFill /></button>
                <button type='button' disabled style={{filter:'none'}}><BsFillArrowUpRightCircleFill /></button>
              </>
            ) : (
              <>
                <button onClick={() => handleKickWasGoal()} type='button'><BsFillArrowUpLeftCircleFill /></button>
                <button onClick={() => handleKickWasGoal()} type='button'><BsFillArrowUpCircleFill /></button>
                <button onClick={() => handleKickWasGoal()} type='button'><BsFillArrowUpRightCircleFill /></button>
              </>
            ) }
          </div>  
        </div>
      ) }

      { kickType === 'trail' && (
        <TrailAnimation handleKickWasGoal={handleKickWasGoal} />
      ) }
      
    </div>
  )
}
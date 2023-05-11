import {
  BsFillArrowUpLeftCircleFill,
  BsFillArrowUpCircleFill,
  BsFillArrowUpRightCircleFill,
} from 'react-icons/bs'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { TrailAnimation } from './TrailAnimation'
import { useIndividualGoals } from '../../../../contexts/IndividualGoalsContext'
import { api } from '../../../../services/api'

import styles from './styles.module.scss'

interface ModalKickProps {
  kickType: string
  setTimeToKick: Dispatch<SetStateAction<number>>
  setIsModalKickOpen: Dispatch<SetStateAction<boolean>>
  setIsKickReady: Dispatch<SetStateAction<boolean>>
  setTimeKickWillBeReady: Dispatch<SetStateAction<number>>
  timeWithVip: number
  blockCloseModalKick: () => void
}

export function ModalKick({
  kickType,
  setTimeToKick,
  setIsModalKickOpen,
  setIsKickReady,
  setTimeKickWillBeReady,
  timeWithVip,
  blockCloseModalKick,
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
    setRoundGoals,
  } = useIndividualGoals()

  const [showKickMessage, setShowKickMessage] = useState(false)
  const [messageAfterKick, setMessageAfterKick] = useState('')

  useEffect(() => {
    async function postData() {
      try {
        await api.post('/api/individual-goals', {
          kickData: {
            avatarPenaltyGoals: penaltyGoals,
            avatarFreeKickGoals: freeKickGoals,
            avatarTrailGoals: trailGoals,
            avatarHourlyGoals: hourlyGoals,
            avatarRoundGoals: roundGoals,
          },
        })
      } catch (error) {
        console.log(error)
      }
    }

    postData()
  }, [penaltyGoals, freeKickGoals, trailGoals, hourlyGoals, roundGoals])

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
    blockCloseModalKick()
    let wasGoal = false

    switch (kickType) {
      case 'penalty': {
        // Calculate probability to do goal (90% of chance)
        const penaltyProbability = Math.random() * 100
        if (penaltyProbability < 90) {
          // Penalty goal
          wasGoal = true
          displayMessageAfterKick('GOL !!!!')
        } else {
          // Penalty lost
          displayMessageAfterKick('ERROU :(')
        }

        setConfigsToRestartCountdown(1800)

        if (wasGoal) {
          setPenaltyGoals((state) => state + 1)
          setHourlyGoals((state) => state + 1)
          setRoundGoals((state) => state + 1)
        }

        break
      }

      case 'free-kick': {
        // Calculate probability to do goal (70% of chance)
        const freeKickProbability = Math.random() * 100
        if (freeKickProbability < 70) {
          // Free kick goal
          wasGoal = true
          displayMessageAfterKick('GOL !!!!')
        } else {
          // Free kick lost
          displayMessageAfterKick('ERROU :(')
        }

        setConfigsToRestartCountdown(1800)

        if (wasGoal) {
          setFreeKickGoals((state) => state + 1)
          setHourlyGoals((state) => state + 1)
          setRoundGoals((state) => state + 1)
        }

        break
      }

      case 'trail': {
        // Calculate probability to do goal (30% of chance)
        if (wasTrailGoal) {
          displayMessageAfterKick('GOL !!!!')

          setTrailGoals((state) => state + 1)
          setHourlyGoals((state) => state + 1)
          setRoundGoals((state) => state + 1)
        } else {
          displayMessageAfterKick('ERROU :(')
        }

        setConfigsToRestartCountdown(1800)

        break
      }

      default:
        console.log('Default case in switch')
    }
  }

  return (
    <>
      {showKickMessage && (
        <div className={styles.goalMessageContent}>
          <strong>{messageAfterKick}</strong>
        </div>
      )}

      {kickType === 'penalty' && (
        <>
          <img
            className={styles.kickImage}
            src="https://img.freepik.com/free-vector/goalkeeper-area-playing_1214-396.jpg?w=2000"
            alt=""
          />
          <div className={styles.kickSideButtonsContainer}>
            <button onClick={() => handleKickWasGoal()} type="button">
              <BsFillArrowUpLeftCircleFill />
            </button>
            <button onClick={() => handleKickWasGoal()} type="button">
              <BsFillArrowUpCircleFill />
            </button>
            <button onClick={() => handleKickWasGoal()} type="button">
              <BsFillArrowUpRightCircleFill />
            </button>
          </div>
        </>
      )}

      {kickType === 'free-kick' && (
        <>
          <img
            className={styles.kickImage}
            src="https://media.istockphoto.com/vectors/free-kick-vector-id472298675?k=20&m=472298675&s=612x612&w=0&h=52SwbGdqzSP85vBkC8ACz7YpmHkEthTzS4_l2scB7Ss="
            alt=""
          />
          <div className={styles.kickSideButtonsContainer}>
            <button onClick={() => handleKickWasGoal()} type="button">
              <BsFillArrowUpLeftCircleFill />
            </button>
            <button onClick={() => handleKickWasGoal()} type="button">
              <BsFillArrowUpCircleFill />
            </button>
            <button onClick={() => handleKickWasGoal()} type="button">
              <BsFillArrowUpRightCircleFill />
            </button>
          </div>
        </>
      )}

      {kickType === 'trail' && (
        <TrailAnimation
          handleKickWasGoal={handleKickWasGoal}
          blockCloseModal={blockCloseModalKick}
        />
      )}
    </>
  )
}

import {
  BsFillArrowUpLeftCircleFill,
  BsFillArrowUpCircleFill,
  BsFillArrowUpRightCircleFill,
} from 'react-icons/bs'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { TrailAnimation } from './TrailAnimation'
import { useIndividualGoals } from '../../../../contexts/IndividualGoalsContext'
import { useUserPreferences } from '../../../../contexts/UserPreferencesContext'
import { api } from '../../../../services/api'
import Image from 'next/legacy/image'

import celebrationSound from '../../../../audios/celebration.mp3'
import lamentSound from '../../../../audios/lament.mp3'

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

  const { userPreferences } = useUserPreferences()
  const { goalSound } = userPreferences

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

  function playKickAudio(wasGoal: boolean) {
    let audio: HTMLAudioElement

    if (wasGoal) {
      audio = new Audio(celebrationSound)
    } else {
      audio = new Audio(lamentSound)
    }

    audio.play()
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

  function resetSessionStorageKickTime(
    kickType: 'penalty' | 'free-kick' | 'trail',
  ) {
    sessionStorage.setItem(
      `brazucagol:timeToKick=${kickType}`,
      String(timeWithVip),
    )
  }

  async function handleKickWasGoal(wasTrailGoal?: boolean) {
    blockCloseModalKick()
    let wasGoal = false

    switch (kickType) {
      case 'penalty': {
        resetSessionStorageKickTime(kickType)

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

        if (goalSound) {
          playKickAudio(wasGoal)
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
        resetSessionStorageKickTime(kickType)

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

        if (goalSound) {
          playKickAudio(wasGoal)
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

        if (goalSound) {
          playKickAudio(wasTrailGoal)
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
          <Image
            className={styles.kickImage}
            src="/assets/penalty-image-background.png"
            alt=""
            placeholder="blur"
            blurDataURL="/assets/penalty-image-background.png"
            width={368}
            height={276}
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
          <Image
            className={styles.kickImage}
            src="/assets/free-kick-image-background.png"
            alt=""
            placeholder="blur"
            blurDataURL="/assets/free-kick-image-background.png"
            width={368}
            height={276}
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
          resetSessionStorageKickTime={resetSessionStorageKickTime}
        />
      )}
    </>
  )
}

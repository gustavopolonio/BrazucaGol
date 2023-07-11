import { useState, useEffect } from 'react'
import { IoIosFootball, IoMdClose } from 'react-icons/io'
import { ModalKick } from './ModalKick'
import { useIndividualGoals } from '../../../contexts/IndividualGoalsContext'
import { useUserPreferences } from '../../../contexts/UserPreferencesContext'
import { formatTime } from '../../../utils/formatTime'
import { api } from '../../../services/api'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import * as Dialog from '@radix-ui/react-dialog'
import { signOut } from 'next-auth/react'
import { LoadingSpinner } from '../../LoadingSpinner'

import whistleSound from '../../../audios/whistle.mp3'
import celebrationSound from '../../../audios/celebration.mp3'

import styles from './styles.module.scss'
import 'react-circular-progressbar/dist/styles.css'

interface CountdownKickProps {
  title: string
  kickType: string
}

export function CountdownKick({ title, kickType }: CountdownKickProps) {
  const [isKickReady, setIsKickReady] = useState(false)
  const [isModalKickOpen, setIsModalKickOpen] = useState(false)
  const [isModalKickBlockedToClose, setIsModalKickBlockedToClose] =
    useState(false)

  const {
    autoGoals,
    setAutoGoals,
    hourlyGoals,
    setHourlyGoals,
    roundGoals,
    setRoundGoals,
  } = useIndividualGoals()

  const { userPreferences } = useUserPreferences()
  const { goalSound, kickAlert } = userPreferences

  const timeWithVip = 300 // Considering a kick of 5 min (300 sec)

  const [timeToKick, setTimeToKick] = useState<number>()
  const [timeKickWillBeReady, setTimeKickWillBeReady] = useState<number>()

  useEffect(() => {
    const timeToKickStored = sessionStorage.getItem(
      `brazucagol:timeToKick=${kickType}`,
    )
    // const timeToKickStored = null

    if (timeToKickStored !== null) {
      setTimeToKick(Number(timeToKickStored))

      if (Number(timeToKickStored) === 1) {
        setIsKickReady(true)
      } else {
        const enteredTime = Math.floor(new Date().getTime() / 1000)
        setTimeKickWillBeReady(enteredTime + Number(timeToKickStored))
      }
    } else {
      setTimeToKick(timeWithVip)

      const enteredTime = Math.floor(new Date().getTime() / 1000)
      setTimeKickWillBeReady(enteredTime + timeWithVip)
    }
  }, [kickType])

  useEffect(() => {
    const timer = setTimeout(async () => {
      const currentTime = Math.floor(new Date().getTime() / 1000)

      if (timeToKick > 1) {
        setTimeToKick(timeKickWillBeReady - currentTime)

        sessionStorage.setItem(
          `brazucagol:timeToKick=${kickType}`,
          String(timeKickWillBeReady - currentTime),
        )
      } else {
        // Time to kick
        if (kickType === 'auto') {
          setTimeKickWillBeReady(currentTime + timeWithVip)
          setTimeToKick(timeWithVip)

          if (goalSound) {
            const audio = new Audio(celebrationSound)
            audio.play()
          }

          try {
            const response = await api.post('/api/individual-goals', {
              kickData: {
                avatarAutoGoals: autoGoals + 1,
                avatarHourlyGoals: hourlyGoals + 1,
                avatarRoundGoals: roundGoals + 1,
              },
            })

            if (response.status === 201) {
              setAutoGoals((state) => state + 1)
              setHourlyGoals((state) => state + 1)
              setRoundGoals((state) => state + 1)
            }
          } catch (err) {
            signOut({ callbackUrl: '/' })
          }
        } else {
          if (kickAlert) {
            const audio = new Audio(whistleSound)
            audio.play()
          }
          setIsKickReady(true)
        }
      }
    }, 1000)
    return () => clearTimeout(timer)
  }, [timeToKick])

  function handleClickToKick() {
    setIsModalKickOpen(true)
    setIsModalKickBlockedToClose(false)
  }

  function blockCloseModalKick() {
    setIsModalKickBlockedToClose(true)
  }

  if (timeToKick === undefined) {
    return (
      <div className={styles.ballContainer}>
        <div className={styles.ballContent}>
          <LoadingSpinner
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
          />
        </div>
        <h1>{title}</h1>
      </div>
    )
  }

  return (
    <div className={styles.ballContainer}>
      {!isKickReady ? (
        // Kick isn't ready
        <div className={styles.ballContent}>
          <CircularProgressbar
            value={timeToKick}
            maxValue={timeWithVip}
            counterClockwise
            styles={buildStyles({
              pathColor: '#FF9914',
              strokeLinecap: 'butt',
            })}
          />
          <p>{formatTime(timeToKick, false)}</p>
        </div>
      ) : (
        // Kick is ready
        <Dialog.Root open={isModalKickOpen} onOpenChange={setIsModalKickOpen}>
          <Dialog.Trigger asChild>
            <button
              type="button"
              className={`${styles.ballContent} ${styles.kickIsReady}`}
              onClick={handleClickToKick}
            >
              <IoIosFootball fontSize={108} />
            </button>
          </Dialog.Trigger>

          <Dialog.Portal>
            <Dialog.Overlay className={styles.modalOverlay} />
            <Dialog.Content
              className={styles.modalContent}
              onInteractOutside={(e) =>
                isModalKickBlockedToClose && e.preventDefault()
              }
              onEscapeKeyDown={(e) =>
                isModalKickBlockedToClose && e.preventDefault()
              }
            >
              <ModalKick
                kickType={kickType}
                setTimeToKick={setTimeToKick}
                setIsModalKickOpen={setIsModalKickOpen}
                setIsKickReady={setIsKickReady}
                setTimeKickWillBeReady={setTimeKickWillBeReady}
                timeWithVip={timeWithVip}
                blockCloseModalKick={blockCloseModalKick}
              />
              <Dialog.Close
                className={styles.closeModalButton}
                onClick={(e) => isModalKickBlockedToClose && e.preventDefault()}
              >
                <IoMdClose size={28} />
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      )}
      <h1>{title}</h1>
    </div>
  )
}

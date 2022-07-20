import { useState, useEffect, ReactNode, useRef } from 'react'
import { IoIosFootball } from 'react-icons/io'
import { ModalKick } from '../ModalKick'
import { useIndividualGoals } from '../../contexts/IndividualGoalsContext'
import { useBlockKicks } from "../../contexts/BlockKicksContext"
import { formatTime } from '../../utils/formatTime'
import { api } from '../../services/api'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'

import styles from './styles.module.scss'
import 'react-circular-progressbar/dist/styles.css'

interface CountdownKickProps {
  title: string,
  kickType: string,
  children: ReactNode
}

export function CountdownKick({ title, kickType, children }: CountdownKickProps) {
  const [isKickReady, setIsKickReady] = useState(false)
  const [isModalKickOpen, setIsModalKickOpen] = useState(false)
  const { 
    autoGoals, 
    setAutoGoals, 
    hourlyGoals, 
    setHourlyGoals, 
    roundGoals, 
    setRoundGoals 
  } = useIndividualGoals()

  const { setBlockNearAutoGoal } = useBlockKicks()

  const timeWithVip = 15 // Considering a kick of 5 min (300 sec)

  const enteredTime = Math.floor(new Date().getTime() / 1000)
  const [timeKickWillBeReady, setTimeKickWillBeReady] = useState(enteredTime + timeWithVip)
  const [timeToKick, setTimeToKick] = useState(timeWithVip)

  useEffect(() => {
    const timer = setTimeout(async () => {
      const currentTime = Math.floor(new Date().getTime() / 1000)

      if (timeToKick <= 4) { // Block other kicks to prevent wrong count of goals
        if (kickType === 'auto') {
          setBlockNearAutoGoal(true)
        }
      }

      if (timeToKick > 1) {
        setTimeToKick(timeKickWillBeReady - currentTime)
      } else { // Time to kick
        if (kickType === 'auto') {
          setTimeKickWillBeReady(currentTime + timeWithVip)
          setTimeToKick(timeWithVip)

          const response = await api.post("/api/individual-goals", {
            kickData: {
              avatarAutoGoals: autoGoals + 1,
              avatarHourlyGoals: hourlyGoals + 1,
              avatarRoundGoals: roundGoals + 1
            }
          })

          if (response.status === 201) {
            setAutoGoals(autoGoals + 1)
            setHourlyGoals(hourlyGoals + 1)
            setRoundGoals(roundGoals + 1)
            setBlockNearAutoGoal(false)
          }
        } else {
          setIsKickReady(true)       
        }
      }
    }, 1000)
    return () => clearTimeout(timer)
  }, [timeToKick])

  function handleClickToKick() {
    setIsModalKickOpen(true)
  }

  return (
    <div className={styles.ballContainer}>
      { !isKickReady ? 
        ( // Kick isnt ready
          <div className={styles.ballContent}>
            <CircularProgressbar 
              value={timeToKick} 
              maxValue={timeWithVip}
              counterClockwise
              styles={buildStyles({
                pathColor: '#FF9914',
                strokeLinecap: 'butt'
              })}
            />
            <p>{formatTime(timeToKick, false)}</p>
          </div>
        ) : ( // Kick is ready
          <button 
            type='button'
            className={`${styles.ballContent} ${styles.kickIsReady}`}
            onClick={handleClickToKick}
          >
            <IoIosFootball fontSize={108} />
          </button>
        ) 
      }

      <h1>{title}</h1>
      {/* {children} */}

      { isModalKickOpen && 
        <ModalKick 
          kickType={kickType} 
          setTimeToKick={setTimeToKick} 
          setIsModalKickOpen={setIsModalKickOpen}
          setIsKickReady={setIsKickReady}
          setTimeKickWillBeReady={setTimeKickWillBeReady}
          timeWithVip={timeWithVip}
        /> 
      }
    </div>
  )
}
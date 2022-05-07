import { useState, useEffect, ReactNode, useRef } from 'react'
import { IoIosFootball } from 'react-icons/io'
import { ModalKick } from '../ModalKick'
import { useIndividualGoals } from '../../contexts/IndividualGoalsContext'
import { formatTime } from '../../utils/formatTime'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'

import styles from './styles.module.scss'
import 'react-circular-progressbar/dist/styles.css'

interface CountdownKickProps {
  title: string,
  kickType: string,
  children: ReactNode
}

export function CountdownKick({ title, kickType, children }: CountdownKickProps) {
  // const timeWithVip = 300
  // const [time, setTime] = useState(timeWithVip)
  const [isKickReady, setIsKickReady] = useState(false)
  const [isModalKickOpen, setIsModalKickOpen] = useState(false)
  const { autoGoals, setAutoGoals } = useIndividualGoals()

  const timeWithVip = 300 // Considering a kick of 5 min (300 sec)

  const enteredTime = Math.floor(new Date().getTime() / 1000)
  const [timeKickIsReady, setTimeKickIsReady] = useState(enteredTime + timeWithVip)
  const [time, setTime] = useState(timeWithVip)

  useEffect(() => {
    const timer = setTimeout(() => {
      const currentTime = Math.floor(new Date().getTime() / 1000)
      // console.log('timeKickIsReady', timeKickIsReady)'
      if (time > 1) {
        setTime(timeKickIsReady - currentTime)
      } else { // Time to kick
        if (kickType === 'auto') {
          setAutoGoals(autoGoals + 1)
          setTimeKickIsReady(currentTime + timeWithVip)
          setTime(timeWithVip)
        } else {
          setIsKickReady(true)       
        }
      }
    }, 1000)
    return () => clearTimeout(timer)
  }, [time])

  function handleClickToKick() {
    setIsModalKickOpen(true)
  }

  return (
    <div className={styles.ballContainer}>
      { !isKickReady ? 
        ( // Kick isnt ready
          <div className={styles.ballContent}>
            <CircularProgressbar 
              value={time} 
              maxValue={300}
              counterClockwise
              styles={buildStyles({
                pathColor: '#FF9914',
                strokeLinecap: 'butt'
              })}
            />
            <p>{formatTime(time)}</p>
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
          setTime={setTime} 
          setIsModalKickOpen={setIsModalKickOpen}
          setIsKickReady={setIsKickReady}
          setTimeKickIsReady={setTimeKickIsReady}
          timeWithVip={timeWithVip}
        /> 
      }
    </div>
  )
}
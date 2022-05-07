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

  const enteredTime = Math.floor(new Date().getTime() / 1000)
  const [timeKickIsReady, setTimeKickIsReady] = useState(enteredTime + 300)
  // const timeKickIsReady = enteredTime + 300 // Considering a kick of 5 min (300 sec)
  const [time, setTime] = useState(300)
  
  // useEffect(() => {
  //   setTimeKickIsReady(enteredTime + 300)
  // }, [])


  useEffect(() => {
    const timer = setTimeout(() => {
      const currentTime = Math.floor(new Date().getTime() / 1000)
      console.log('timeKickIsReady', timeKickIsReady)
      if (time > 0) {
        const test = timeKickIsReady - currentTime
        setTime(test)
      } else { // Time to kick
        if (kickType === 'auto') {
          setAutoGoals(autoGoals + 1)
          const timeKickIsReady = currentTime + 300
          setTime(timeKickIsReady - currentTime)
        } else {
          setIsKickReady(true)       
        }
      }
    }, 1000)
    return () => clearTimeout(timer)
  }, [time])


  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     if (time > 0) {
  //       setTime(time - 1)
  //     } else { // Time to kick
  //       if (kickType === 'auto') {
  //         setAutoGoals(autoGoals + 1)
  //         setTime(300)
  //       } else {
  //         setIsKickReady(true)       
  //       }
  //     }
  //   }, 1000)
  //   return () => clearTimeout(timer)
  // }, [time])

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
        /> 
      }
    </div>
  )
}
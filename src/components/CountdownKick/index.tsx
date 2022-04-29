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

  useEffect(() => {
    setTimeout(() => {
      if (time > 0) {
        setTime(time - 1)
      } else { // Time to kick
        setIsKickReady(true)       
      }
    }, 1000)
  }, [time])

  function handleClickToKick() {
    setIsModalKickOpen(true)
  }

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
            onClick={handleClickToKick}
          >
            <IoIosFootball fontSize={90} />
          </button>
        ) 
      }

      <h1>{title}</h1>
      <p>{time}</p>
      {/* {children} */}

      { isModalKickOpen && 
        <PenaltyKick 
          kickType={kickType} 
          setTime={setTime} 
          setIsModalKickOpen={setIsModalKickOpen}
          setIsKickReady={setIsKickReady}
        /> 
      }
    </div>
  )
}
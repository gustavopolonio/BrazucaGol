import { useState, useEffect, ReactNode } from 'react'
import { IoIosFootball } from 'react-icons/io'
import { ModalKick } from '../ModalKick'
import { useIndividualGoals } from '../../contexts/IndividualGoalsContext'

import styles from './styles.module.scss'

interface CountdownKickProps {
  title: string,
  kickType: string,
  children: ReactNode
}

export function CountdownKick({ title, kickType, children }: CountdownKickProps) {
  const [time, setTime] = useState(300)
  const [isKickReady, setIsKickReady] = useState(false)
  const [isModalKickOpen, setIsModalKickOpen] = useState(false)
  const { autoGoals, setAutoGoals } = useIndividualGoals()

  useEffect(() => {
    setTimeout(() => {
      if (time > 0) {
        setTime(time - 1)
      } else { // Time to kick
        if (kickType === 'auto') {
          setAutoGoals(autoGoals + 1)
          setTime(300)
        } else {
          setIsKickReady(true)       
        }
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
            <p>{Math.floor(time/60)}:{time%60 < 10 && `0`}{time%60}</p>
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
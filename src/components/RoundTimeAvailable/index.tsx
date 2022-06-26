import { useEffect, useState } from "react"
import { useIndividualGoals } from "../../contexts/IndividualGoalsContext"
import { useBlockKicks } from "../../contexts/BlockKicksContext"
import { formatTime } from "../../utils/formatTime"

import styles from './styles.module.scss'

export function RoundTimeAvailable() {
  const [roundTimeAvailable, setRoundTimeAvailable] = useState('')
  const { setHourlyGoals, setRoundGoals } = useIndividualGoals()
  const { setBlockNearHourlyChange, blockNearHourlyChange } = useBlockKicks()
  
  useEffect(() => {
    const timer = setTimeout(() => {
      const date = new Date()
    
      const dateInBraziliaTimeZone = date.toLocaleString('pt-BR', { 
        timeZone: 'America/Sao_Paulo',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
      })
    
      const [hours, minutes, seconds] = dateInBraziliaTimeZone.split(':')
      
      if (minutes === '00' && seconds === '00') { // Display restart Hourly Goals
        setHourlyGoals(0)
      }

      setBlockNearHourlyChange(false)
      if (
        (minutes === '00' && seconds === '02') || 
        (minutes === '00' && seconds === '01') || 
        (minutes === '00' && seconds === '00') || 
        (minutes === '59' && seconds === '60') || 
        (minutes === '59' && seconds === '59') || 
        (minutes === '59' && seconds === '58')
      ) {
        setBlockNearHourlyChange(true) // 2 sec before and after hourly and round updates I avoid all kicks (requests to faunadb)
      }

      const currentDateInSeconds = (Number(hours) * 60 * 60) + (Number(minutes) * 60) + Number(seconds)
    
      // Round start at 20:00:00 (Brasilia)
      const roundStartInSeconds = 20 * 60 * 60

      if (currentDateInSeconds === roundStartInSeconds) { // Display Restart Round Goals
        setRoundGoals(0)
      }
    
      if (currentDateInSeconds < roundStartInSeconds) {
        const roundTimeAvailableInSeconds = roundStartInSeconds - currentDateInSeconds 
        setRoundTimeAvailable(formatTime(roundTimeAvailableInSeconds, true))
      } else {
        const roundTimeAvailableInSeconds = 24 * 60 * 60 - ( currentDateInSeconds - roundStartInSeconds )
        setRoundTimeAvailable(formatTime(roundTimeAvailableInSeconds, true))
      }
  
    }, 1000)
    return () => clearTimeout(timer)
  }, [roundTimeAvailable])

  return (
    <strong className={styles.timeRound}>{roundTimeAvailable}</strong>
  )
}
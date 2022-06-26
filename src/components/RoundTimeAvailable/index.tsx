import { useEffect, useState } from "react"
import { useIndividualGoals } from "../../contexts/IndividualGoalsContext"
import { api } from "../../services/api"
import { formatTime } from "../../utils/formatTime"

import styles from './styles.module.scss'

export function RoundTimeAvailable() {
  const [roundTimeAvailable, setRoundTimeAvailable] = useState('')
  const { setHourlyGoals, setRoundGoals } = useIndividualGoals()
  
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
        // const restartHourlyGoals = async () => {
        //   const response = await api.get("/api/individual-goals")
        //   const { avatarHourlyGoals } = response.data.data
        //   console.log('avatarHourlyGoals', avatarHourlyGoals)
        //   setHourlyGoals(avatarHourlyGoals)
        // }
        // restartHourlyGoals()
        setHourlyGoals(0)
      }

      const currentDateInSeconds = (Number(hours) * 60 * 60) + (Number(minutes) * 60) + Number(seconds)
    
      // Round start at 20:00:00 (Brasilia)
      const roundStartInSeconds = 20 * 60 * 60

      if (currentDateInSeconds === roundStartInSeconds) { // Display Restart Round Goals
        // const restartRoundGoals = async () => {
        //   const response = await api.get("/api/individual-goals")
        //   const { avatarRoundGoals } = response.data.data
        //   setRoundGoals(avatarRoundGoals)
        // }
        // restartRoundGoals()
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
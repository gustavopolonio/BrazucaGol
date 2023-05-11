import { useEffect, useState } from 'react'
import { useIndividualGoals } from '../../../contexts/IndividualGoalsContext'
import { formatTime } from '../../../utils/formatTime'

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
        second: 'numeric',
      })

      const [hours, minutes, seconds] = dateInBraziliaTimeZone.split(':')

      if (
        (minutes === '59' && seconds === '59') ||
        (minutes === '00' && seconds === '00')
      ) {
        // Display restart Hourly Goals
        // Seconds was going 2 in 2 sec, so I put 59sec or 00sec
        setHourlyGoals(0)
      }

      const currentDateInSeconds =
        Number(hours) * 60 * 60 + Number(minutes) * 60 + Number(seconds)

      // Round start at 20:00:00 (Brasilia)
      const roundStartInSeconds = 20 * 60 * 60

      if (
        currentDateInSeconds === roundStartInSeconds - 1 ||
        currentDateInSeconds === roundStartInSeconds
      ) {
        // Display Restart Round Goals
        // Seconds was going 2 in 2 sec, so I put 59sec or 00sec
        setRoundGoals(0)
      }

      if (currentDateInSeconds < roundStartInSeconds) {
        const roundTimeAvailableInSeconds =
          roundStartInSeconds - currentDateInSeconds
        setRoundTimeAvailable(formatTime(roundTimeAvailableInSeconds, true))
      } else {
        const roundTimeAvailableInSeconds =
          24 * 60 * 60 - (currentDateInSeconds - roundStartInSeconds)
        setRoundTimeAvailable(formatTime(roundTimeAvailableInSeconds, true))
      }
    }, 1000)
    return () => clearTimeout(timer)
  }, [roundTimeAvailable])

  return <strong className={styles.timeRound}>{roundTimeAvailable}</strong>
}

import { RiSearchLine, RiLogoutCircleRLine } from 'react-icons/ri'
import { useState, useEffect } from 'react'

import styles from './styles.module.scss'

export function TopBar() {
  const [roundTimeAvailable, setRoundTimeAvailable] = useState('')

  function formatRoundTimeAvailable(timeInSeconds: number) {
    let hours: number | string = Math.floor(timeInSeconds / 3600)
    const rest = timeInSeconds % 3600
    let minutes: number | string = Math.floor(rest / 60)
    let seconds: number | string = rest % 60

    if (hours < 10) {
      hours = String(hours).padStart(2, '0')
    }
    if (minutes < 10) {
      minutes = String(minutes).padStart(2, '0')
    }
    if (seconds < 10) {
      seconds = String(seconds).padStart(2, '0')
    }

    return `${hours}:${minutes}:${seconds}`
  }

  const date = new Date()

  const dateInBraziliaTimeZone = date.toLocaleString('pt-BR', { 
    timeZone: 'America/Sao_Paulo',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  })

  const [hours, minutes, seconds] = dateInBraziliaTimeZone.split(':')
  const currentDateInSeconds = (Number(hours) * 60 * 60) + (Number(minutes) * 60) + Number(seconds)

  // Round start at 20:00:00 (Brasilia)
  const roundStartInSeconds = 20 * 60 * 60

  if (currentDateInSeconds < roundStartInSeconds) {
    const roundTimeAvailableInSeconds = roundStartInSeconds - currentDateInSeconds

    useEffect(() => {
      setRoundTimeAvailable(formatRoundTimeAvailable(roundTimeAvailableInSeconds))
    }, [])

  } else {
    const roundTimeAvailableInSeconds = currentDateInSeconds - roundStartInSeconds
    
    useEffect(() => {
      setRoundTimeAvailable(formatRoundTimeAvailable(roundTimeAvailableInSeconds))
    }, [])
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.searchBox}>
          <label htmlFor='username'>
            <input 
              type="text" 
              id='username' 
              name='username' 
              placeholder='Buscar nome do jogador' 
            />
            <RiSearchLine fontSize={20} color={'#F8F9FA'} />
          </label>
        </div>

        <div className={styles.seasonInfo}>
          <p>19 RODADA</p>
          <div className={styles.onlinePlayersBox}>
            <strong className={styles.onlinePlayers}>409</strong>
            <span>ONLINES</span>
            <strong className={styles.timeRound}>{roundTimeAvailable}</strong>
          </div>
          <p>9 TEMPORADA</p>
        </div>

        <button type='button' className={styles.authButton}>
          Sair
          <RiLogoutCircleRLine fontSize={20} color={'F8F9FA'} />
        </button>
      </div>
    </div>
  )
}
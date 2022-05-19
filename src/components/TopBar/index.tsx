import { RiSearchLine, RiLogoutCircleRLine } from 'react-icons/ri'
import { useState, useEffect } from 'react'
import { useSession, signOut } from "next-auth/react"
import Link from 'next/link'
import { formatTime } from '../../utils/formatTime'

import styles from './styles.module.scss'

export function TopBar() {
  const { data: session } = useSession()
  console.log('session', session)

  const [roundTimeAvailable, setRoundTimeAvailable] = useState('')
  
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
      const currentDateInSeconds = (Number(hours) * 60 * 60) + (Number(minutes) * 60) + Number(seconds)
    
      // Round start at 20:00:00 (Brasilia)
      const roundStartInSeconds = 20 * 60 * 60
    
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

        {session ? (
          <button type='button' onClick={() => signOut()} className={styles.authButtonLogOut}>
            Sair
            <RiLogoutCircleRLine fontSize={20} color={'F8F9FA'} />
          </button>
        ) : (
          <Link href="/auth/signin" passHref>
            <a className={styles.authButtonLogIn}>
              <RiLogoutCircleRLine fontSize={20} color={'F8F9FA'} />
              Entrar
            </a>
          </Link>
        )}
      </div>
    </div>
  )
}
import { RiSearchLine, RiLogoutCircleRLine } from 'react-icons/ri'
import { useSession, signOut } from "next-auth/react"
import { RoundTimeAvailable } from '../../components/RoundTimeAvailable'

import styles from './styles.module.scss'

interface TopBarProps {
  onOpenSignInModal: () => void
}

export function TopBar({ onOpenSignInModal }: TopBarProps) {
  const { data: session } = useSession()

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
            <RoundTimeAvailable />
          </div>
          <p>9 TEMPORADA</p>
        </div>

        {session ? (
          <button type='button' onClick={() => signOut()} className={styles.authButtonLogOut}>
            Sair
            <RiLogoutCircleRLine fontSize={20} color={'F8F9FA'} />
          </button>
        ) : (
          <button onClick={onOpenSignInModal} className={styles.authButtonLogIn}>
            <RiLogoutCircleRLine fontSize={20} color={'F8F9FA'} />
            Entrar
          </button>
        )}
      </div>
    </div>
  )
}
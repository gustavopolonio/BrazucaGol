import { RiSearchLine, RiLogoutCircleRLine } from 'react-icons/ri'
import { useSession, signOut } from 'next-auth/react'
import { RoundTimeAvailable } from './RoundTimeAvailable'
import { LoadingSpinner } from '../utils/LoadingSpinner'
import { useAvatarData } from '../../contexts/AvatarDataContext'
import { SignInModal } from './SignInModal'
import { useState } from 'react'

import styles from './styles.module.scss'

export function TopBar() {
  const { data: session } = useSession()
  const avatarData = useAvatarData()

  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false)

  function handleOpenModal() {
    setIsSignInModalOpen(true)
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.searchBox}>
          <label htmlFor="username">
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Buscar nome do jogador"
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

        {session?.isAvatarActive && (
          <strong className={styles.playerName}>
            Olá,&nbsp;
            {avatarData ? avatarData.name : <LoadingSpinner left="115%" />}
          </strong>
        )}

        {session ? (
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: '/' })}
            className={styles.authButtonLogOut}
          >
            Sair
            <RiLogoutCircleRLine fontSize={20} color={'F8F9FA'} />
          </button>
        ) : (
          <button onClick={handleOpenModal} className={styles.authButtonLogIn}>
            <RiLogoutCircleRLine fontSize={20} color={'F8F9FA'} />
            Entrar
          </button>
        )}
      </div>

      <SignInModal
        isModalOpen={isSignInModalOpen}
        onOpenModal={setIsSignInModalOpen}
      />
    </div>
  )
}

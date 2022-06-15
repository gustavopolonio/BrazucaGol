import { RiSearchLine, RiLogoutCircleRLine } from 'react-icons/ri'
import { useSession, signOut } from "next-auth/react"
import { useEffect, useState } from 'react'
import { parseCookies, destroyCookie } from 'nookies'
import { api } from '../../services/api'
import { RoundTimeAvailable } from '../../components/RoundTimeAvailable'

import styles from './styles.module.scss'

interface TopBarProps {
  onOpenSignInModal: () => void
}

interface AvatarQueryResponse {
  name: string,
  clubId: number,
  userId: {
    id: string
  }
}

export function TopBar({ onOpenSignInModal }: TopBarProps) {
  const { data: session } = useSession()
  const [avatarData, setAvatarData] = useState<AvatarQueryResponse>()

  const cookies = parseCookies()
  const canGiveFirstKick = cookies.giveFirstKick

  useEffect(() => {
    if (session?.isAvatarActive) {
      const getAvatarInfos = async () => {
        const response = await api.get("/api/avatar")
        setAvatarData(response.data.data.data)
      }
      getAvatarInfos()
    }
  }, [session])


  if (canGiveFirstKick === 'true') {
    const getAvatarInfos = async () => {
      const response = await api.get("/api/avatar")
      setAvatarData(response.data.data.data)
    }
    getAvatarInfos()
  }

  useEffect(() => {
    destroyCookie(null, 'giveFirstKick')
  }, [])


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

        { (session?.isAvatarActive || canGiveFirstKick === 'true') &&
          <strong>Olá, {avatarData?.name}</strong> 
        }

        {session ? (
          <button type='button' onClick={() => signOut({ callbackUrl: '/' })} className={styles.authButtonLogOut}>
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
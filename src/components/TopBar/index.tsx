import { RiSearchLine, RiLogoutCircleRLine } from 'react-icons/ri'
import { useSession, signOut } from 'next-auth/react'
import { RoundTimeAvailable } from './RoundTimeAvailable'
import { LoadingSpinner } from '../LoadingSpinner'
import { useAvatarData } from '../../contexts/AvatarDataContext'
import { SignInModal } from './SignInModal'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'

import styles from './styles.module.scss'

const searchForPlayerFormSchema = z.object({
  avatarName: z.string().trim(),
})

type SearchForPlayerFormData = z.infer<typeof searchForPlayerFormSchema>

export function TopBar() {
  const { data: session } = useSession()
  const avatarData = useAvatarData()
  const router = useRouter()

  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false)

  const { handleSubmit, register, reset } = useForm<SearchForPlayerFormData>({
    resolver: zodResolver(searchForPlayerFormSchema),
  })

  function handleOpenModal() {
    setIsSignInModalOpen(true)
  }

  function handleSearchForPlayer(data: SearchForPlayerFormData) {
    router.push(`/avatar/${data.avatarName}`)
    reset()
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <form
          className={styles.searchBox}
          onSubmit={handleSubmit(handleSearchForPlayer)}
        >
          <input
            {...register('avatarName')}
            placeholder="Buscar nome do jogador"
          />
          <button type="submit">
            <RiSearchLine fontSize={20} />
          </button>
        </form>

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

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { LoadingSpinner } from '../LoadingSpinner'
import { PlayerLevelAndGoals } from '../PlayerLevelAndGoals'
import { useAvatarData } from '../../contexts/AvatarDataContext'
import { useIndividualGoals } from '../../contexts/IndividualGoalsContext'
import Image from 'next/image'

import styles from './styles.module.scss'

import { Club } from '../../@types/index'

interface HeaderProps {
  clubs: Club[]
}

export function Header({ clubs }: HeaderProps) {
  const [avatarClub, setAvatarClub] = useState<Club>()
  const { data: session } = useSession()
  const avatarData = useAvatarData()
  const { totalGoals, hourlyGoals, roundGoals } = useIndividualGoals()

  console.log(session)

  useEffect(() => {
    const clubAux = clubs?.find((club) => club.id === avatarData?.clubId)
    setAvatarClub(clubAux)
  }, [avatarData, clubs])

  return (
    <header className={styles.header}>
      <h1 className={styles.logoContainer}>
        <span className={styles.bra}>BRA</span>
        <br />
        <span className={styles.zuca}>ZUCA</span>
        <br />
        <span className={styles.gol}>GOL</span>
      </h1>

      {session?.isAvatarActive && (
        <div className={styles.dataContainer}>
          <PlayerLevelAndGoals
            totalGoals={totalGoals}
            roundGoals={roundGoals}
            hourlyGoals={hourlyGoals}
          />

          <div className={styles.teamLogoContainer}>
            {avatarClub ? (
              <>
                <Image
                  src={avatarClub.logoLink}
                  alt={`Logo ${avatarClub.name}`}
                  width={108}
                  height={150}
                />
                <strong>{avatarClub.name}</strong>
              </>
            ) : (
              <LoadingSpinner
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
              />
            )}
          </div>
        </div>
      )}
    </header>
  )
}

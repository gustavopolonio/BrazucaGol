import { ElementType } from 'react'

import styles from './styles.module.scss'

interface PlayerDetailsProps {
  ranking: number
  Nivel: ElementType
  clubLogo: string
  playerName: string
  playerGoals: number
}

export function PlayerDetails({
  ranking,
  Nivel,
  clubLogo,
  playerName,
  playerGoals,
}: PlayerDetailsProps) {
  return (
    <li className={styles.playerDetailsContainer}>
      <div className={styles.borderBottom}></div>
      <div className={styles.playerIdentification}>
        <div className={styles.rankingPosition}>{ranking}</div>
        <Nivel />
        <a href="" className={styles.iconPlayerClub}>
          <img src={clubLogo} alt="" />
        </a>
        <a href="">{playerName}</a>
      </div>
      {playerGoals}
    </li>
  )
}

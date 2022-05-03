import { ReactElement } from 'react'

import styles from './styles.module.scss'

interface PlayerDetailsProps {
  ranking: number,
  nivel: ReactElement,
  clubLogo: string,
  playerName: string,
  playerGoals: number
}

export function PlayerDetails({ ranking, nivel, clubLogo, playerName, playerGoals }: PlayerDetailsProps) {

  return (
    <li className={styles.playerDetailsContainer}>
      <div className={styles.borderBottom}></div>
      <div className={styles.playerIdentification}>
        <div className={styles.rankingPosition}>{ranking}</div>
        {nivel}
        <a href="" className={styles.iconPlayerClub}>
          <img src={clubLogo} alt="" />
        </a>
        <a href="">
          {playerName}
        </a>
      </div>
      {playerGoals}
    </li>
  )
}
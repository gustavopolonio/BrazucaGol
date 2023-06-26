import Image from 'next/image'

import styles from './styles.module.scss'

import { Club } from '../../@types/index'

interface ClubsHighlightedesProps {
  clubs: Club[]
}

export function ClubsHighlightedes({ clubs }: ClubsHighlightedesProps) {
  return (
    <div className={styles.clubsContainer}>
      {clubs?.map((club) => (
        <div key={club.encodedName} className={styles.clubLogoContainer}>
          <Image src={club.logoLink} alt={club.name} fill />
        </div>
      ))}
    </div>
  )
}

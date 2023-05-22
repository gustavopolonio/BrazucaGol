import { useState, useEffect } from 'react'
import Image from 'next/image'

import styles from './styles.module.scss'

interface Club {
  id: number
  name: string
  encodedName: string
  logoLink: string
  stadiumName: string
  state: string
}

export function ClubsHighlightedes() {
  const [clubs, setClubs] = useState<Club[]>()

  useEffect(() => {
    fetch('https://api-brazilian-soccer-clubs.cyclic.app/')
      .then((response) => response.json())
      .then((data) => setClubs(data))
  }, [])

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

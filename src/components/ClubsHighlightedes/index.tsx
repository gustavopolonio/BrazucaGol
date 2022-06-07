import { useState, useEffect } from 'react'
import { api } from '../../services/api'

import styles from './styles.module.scss'

interface Club {
  id: number,
  name: string,
  encodedName: string,
  logoLink: string,
  stadiumName: string,
  state: string
}

export function ClubsHighlightedes() {
  const [clubs, setClubs] = useState<Club[]>()

  useEffect(() => {
    fetch('https://api-brazilian-soccer-clubs.herokuapp.com')
      .then(response => response.json())
      // .then(data => console.log(data))
  }, [])

  return (
    <div className={styles.clubsContainer}>
      {clubs?.map(club => (
        <div key={club.encodedName} className={styles.clubLogoContainer}>
          <img src={club.logoLink} alt={club.name} />
        </div>
      ))}
    </div>
  )
}
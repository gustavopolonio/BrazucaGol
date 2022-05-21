import { useState, useEffect } from 'react'
import { api } from '../../services/api'

import styles from './styles.module.scss'

interface Club {
  id: string,
  name: string,
  encodedName: string,
  logoLink: string,
  stadiumName: string,
  state: string
}

export function ClubsHighlightedes() {
  const [clubs, setClubs] = useState<Club[]>()

  // useEffect(() => {
  //   fetch('https://api-brazilian-soccer-clubs.herokuapp.com', {
  //     mode: 'cors'
  //   })
  //     .then(response => setClubs(response))
  //     // .then(data => setClubs(data))
  // }, [])



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
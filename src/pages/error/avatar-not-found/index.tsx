import Head from 'next/head'
import { useEffect, useRef } from 'react'

import styles from './styles.module.scss'

export default function AvatarNotFound() {
  const refAvatarNotFoundContainer = useRef(null)

  useEffect(() => {
    refAvatarNotFoundContainer.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  return (
    <>
      <Head>
        <title>Jogador não encontrado | Brazucagol</title>
      </Head>

      <div className={styles.container} ref={refAvatarNotFoundContainer}>
        <h2>Jogador não encontrado &#58;&#40;</h2>
        <span>Talvez ele já tenha se aposentado!</span>
      </div>
    </>
  )
}

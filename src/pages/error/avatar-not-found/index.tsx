import Head from 'next/head'

import styles from './styles.module.scss'

export default function AvatarNotFound() {
  return (
    <>
      <Head>
        <title>Jogador não encontrado | Brazucagol</title>
      </Head>

      <div className={styles.container}>
        <h2>Jogador não encontrado &#58;&#40;</h2>
        <span>Talvez ele já tenha se aposentado!</span>
      </div>
    </>
  )
}

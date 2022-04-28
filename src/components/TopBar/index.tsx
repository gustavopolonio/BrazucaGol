import { RiSearchLine, RiLogoutCircleRLine } from 'react-icons/ri'
import styles from './styles.module.scss'

export function TopBar() {

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.searchBox}>
          <label htmlFor='username'>
            <input 
              type="text" 
              id='username' 
              name='username' 
              placeholder='Buscar nome do jogador' 
            />
            <RiSearchLine fontSize={20} color={'#F8F9FA'} />
          </label>
        </div>

        <div className={styles.seasonInfo}>
          <p>19 RODADA</p>
          <div className={styles.onlinePlayersBox}>
            <strong className={styles.onlinePlayers}>409</strong>
            <span>ONLINES</span>
            <strong className={styles.timeRound}>18:00:11</strong>
          </div>
          <p>9 TEMPORADA</p>
        </div>

        <button type='button' className={styles.authButton}>
          Sair
          <RiLogoutCircleRLine fontSize={20} color={'F8F9FA'} />
        </button>
      </div>
    </div>
  )
}
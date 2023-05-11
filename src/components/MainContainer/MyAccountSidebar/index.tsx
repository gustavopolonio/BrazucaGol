import { BsPersonFill, BsFillGearFill } from 'react-icons/bs'
import { GiOpenBook, GiSoccerKick } from 'react-icons/gi'
import { FaExchangeAlt } from 'react-icons/fa'

import styles from './styles.module.scss'

export function MyAccountSidebar() {
  return (
    <aside className={styles.menuContainer}>
      <h2>Minha Conta</h2>

      <nav>
        <a href="">
          <div className={styles.messageInbox}>08</div>Recados
          <div className={styles.borderBottom}></div>
        </a>
        <a href="">
          <BsPersonFill />
          Aparência<div className={styles.borderBottom}></div>
        </a>
        <a href="">
          <GiOpenBook />
          Habilidades<div className={styles.borderBottom}></div>
        </a>
        <a href="">
          <FaExchangeAlt />
          Mudar de time<div className={styles.borderBottom}></div>
        </a>
        <a href="">
          <GiSoccerKick />
          Opções de chute<div className={styles.borderBottom}></div>
        </a>
        <a href="">
          <BsFillGearFill />
          Configurações<div className={styles.borderBottom}></div>
        </a>
        <strong>VIP 7 dias 08 minutos</strong>
      </nav>
    </aside>
  )
}

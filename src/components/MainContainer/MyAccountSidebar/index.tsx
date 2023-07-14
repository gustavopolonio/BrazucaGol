import { BsPersonFill, BsFillGearFill } from 'react-icons/bs'
import { GiOpenBook, GiSoccerKick } from 'react-icons/gi'
import { FaExchangeAlt } from 'react-icons/fa'
import Link from 'next/link'

import styles from './styles.module.scss'
import { useAvatarData } from '../../../contexts/AvatarDataContext'

export function MyAccountSidebar() {
  const avatar = useAvatarData()

  return (
    <aside className={styles.menuContainer}>
      <h2>Minha Conta</h2>

      <nav>
        <Link href="/messages">
          <div className={styles.messageInbox}>08</div>Recados
          <div className={styles.borderBottom}></div>
        </Link>

        <Link href={`/avatar/${avatar?.name}`}>
          <BsPersonFill />
          Meu perfil<div className={styles.borderBottom}></div>
        </Link>

        <Link href="" className="temporarily-disabled">
          <GiOpenBook />
          Habilidades<div className={styles.borderBottom}></div>
        </Link>

        <Link href="" className="temporarily-disabled">
          <FaExchangeAlt />
          Mudar de time<div className={styles.borderBottom}></div>
        </Link>

        <Link href="" className="temporarily-disabled">
          <GiSoccerKick />
          Opções de chute<div className={styles.borderBottom}></div>
        </Link>

        <Link href="/settings">
          <BsFillGearFill />
          Configurações<div className={styles.borderBottom}></div>
        </Link>

        <strong>VIP 7 dias 08 minutos</strong>
      </nav>
    </aside>
  )
}

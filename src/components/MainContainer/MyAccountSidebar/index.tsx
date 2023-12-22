import { BsPersonFill, BsFillGearFill } from 'react-icons/bs'
import { GiOpenBook, GiSoccerKick } from 'react-icons/gi'
import { FaExchangeAlt } from 'react-icons/fa'
import Link from 'next/link'
import { useAvatarData } from '../../../contexts/AvatarDataContext'
import { useUnreadChats } from '../../../contexts/UnreadChats'
import { fauna } from '../../../services/faunadb'
import { query as q } from 'faunadb'

import styles from './styles.module.scss'

export function MyAccountSidebar() {
  const avatar = useAvatarData()
  const { unreadChats, updateUnreadChats } = useUnreadChats()

  // Streaming unread chats
  const docRef = q.Select(
    ['ref'],
    q.Get(q.Match(q.Index('userChats_by_userId'), avatar.userId)),
  )

  const report = (e) => {
    console.log('REPORT')
    const data =
      'action' in e
        ? updateUnreadChats(e.document.data.unreadChats)
        : e.data.unreadChats
    console.log('DATA', data)
  }

  let stream
  const startStream = () => {
    stream = fauna.stream
      .document(docRef)
      .on('snapshot', (snapshot) => {
        report(snapshot)
      })
      .on('version', (version) => {
        report(version)
      })
      .on('error', (error) => {
        console.log(error)
        stream.close()
        setTimeout(startStream, 1000)
      })
      .start()
  }

  // startStream()

  return (
    <aside className={styles.menuContainer}>
      <h2>Minha Conta</h2>

      <nav>
        <Link href="/messages">
          <div className={styles.messageInbox}>
            {unreadChats.length < 10
              ? `0${unreadChats.length}`
              : unreadChats.length}
          </div>
          Recados
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

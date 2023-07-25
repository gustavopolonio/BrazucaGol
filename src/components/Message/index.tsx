import Image from 'next/image'
import { fromUnixTime, format } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { useSession } from 'next-auth/react'

import styles from './styles.module.scss'

interface MessageProps {
  text: string
  sentAt: number
  senderId: string
}

export function Message({ sentAt, text, senderId }: MessageProps) {
  console.log(text)
  const { data } = useSession()

  return (
    <li
      key={sentAt}
      className={`${styles.replyModalMessageContent} ${
        data.user.id === senderId ? styles.owner : undefined
      }`}
    >
      {!(data.user.id === senderId) && (
        <Image src="/assets/avatarPhoto.png" alt="" width={40} height={40} />
      )}
      <span className={styles.replyModalMessageText}>
        {text}
        <time>
          {format(fromUnixTime(sentAt / 1000), 'HH:mm', {
            locale: ptBR,
          })}
        </time>
      </span>
    </li>
  )
}

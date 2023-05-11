import { CountdownKick } from './CountdownKick'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

import styles from './styles.module.scss'

type HasKickType = string | null

export function CountdownKickContainer() {
  const { data: session } = useSession()
  const [hasKickTab, setHasKickTab] = useState<HasKickType>()

  useEffect(() => {
    setHasKickTab(localStorage.getItem('brazucagol:hasKickTab'))
  }, [])

  if (!hasKickTab) {
    return (
      <>
        {session?.isAvatarActive && (
          <div className={styles.ballsContainer}>
            <CountdownKick title="AUTO" kickType="auto" />
            <CountdownKick title="PÊNALTI" kickType="penalty" />
            <CountdownKick title="FALTA" kickType="free-kick" />
            <CountdownKick title="TRILHA" kickType="trail" />
          </div>
        )}
      </>
    )
  }
}

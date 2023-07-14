import { ReactNode } from 'react'
import { MenuSidebar } from './MenuSidebar'
import { MyAccountSidebar } from './MyAccountSidebar'
import { useSession } from 'next-auth/react'

import styles from './styles.module.scss'

interface MainContainerProps {
  children: ReactNode
}

export function MainContainer({ children }: MainContainerProps) {
  const { data: session } = useSession()

  return (
    <main className={styles.mainContainer}>
      <MenuSidebar />
      {children}
      {session && session?.isAvatarActive && <MyAccountSidebar />}
    </main>
  )
}

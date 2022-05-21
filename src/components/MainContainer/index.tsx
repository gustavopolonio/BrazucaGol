import { ReactNode } from 'react'
import { MenuSidebar } from "../MenuSidebar";
import { MyAccountSidebar } from "../MyAccountSidebar";

import styles from './styles.module.scss'

interface MainContainerProps {
  children: ReactNode
}

export function MainContainer({ children }: MainContainerProps) {

  return (
    <main className={styles.mainContainer}>
      <MenuSidebar />
      { children }
      <MyAccountSidebar />
    </main>
  )
}
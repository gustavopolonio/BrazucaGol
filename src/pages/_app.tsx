import { AppProps } from 'next/app'
import { SessionProvider } from "next-auth/react"
import { useState } from 'react'
import { IndividualGoalsProvider } from '../contexts/IndividualGoalsContext'
import { TopBar } from '../components/TopBar'
import { SignInModal } from '../components/SignInModal'
import Modal from 'react-modal'

import '../styles/global.scss'

Modal.setAppElement('#__next')

function MyApp({ Component, pageProps }: AppProps) {
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false)

  function handleOpenModal() {
    setIsSignInModalOpen(true)
  }

  function handleCloseModal() {
    setIsSignInModalOpen(false)
  }

  return (
    <SessionProvider session={pageProps.session}>
      <IndividualGoalsProvider>
        <TopBar onOpenSignInModal={handleOpenModal} />
        <Component {...pageProps} />
        <SignInModal isModalOpen={isSignInModalOpen} onCloseSignInModal={handleCloseModal} />
      </IndividualGoalsProvider>
    </SessionProvider>
  ) 
}

export default MyApp
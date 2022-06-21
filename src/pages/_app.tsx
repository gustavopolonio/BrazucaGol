import { AppProps } from 'next/app'
import { SessionProvider } from "next-auth/react"
import { useState } from 'react'
import Modal from 'react-modal'
import { IndividualGoalsProvider } from '../contexts/IndividualGoalsContext'
import { AvatarDataProvider } from '../contexts/AvatarDataContext'
import { TopBar } from '../components/TopBar'
import { Header } from '../components/Header'
import { SignInModal } from '../components/SignInModal'
import { Footer } from '../components/Footer'
import { CountdownKickContainer } from '../components/CountdownKickContainer'
import { ClubsHighlightedes } from '../components/ClubsHighlightedes'
import { MainContainer } from '../components/MainContainer'

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
        <AvatarDataProvider>
        
          <TopBar onOpenSignInModal={handleOpenModal} />
          <Header />
          <CountdownKickContainer />
          <ClubsHighlightedes />

          <MainContainer>
            <Component {...pageProps} />
          </MainContainer>

          <Footer />

          <SignInModal isModalOpen={isSignInModalOpen} onCloseSignInModal={handleCloseModal} />
        
        </AvatarDataProvider>
      </IndividualGoalsProvider>
    </SessionProvider>
  ) 
}

export default MyApp
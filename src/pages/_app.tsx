import { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import { useEffect } from 'react'
import { IndividualGoalsProvider } from '../contexts/IndividualGoalsContext'
import { AvatarDataProvider } from '../contexts/AvatarDataContext'
import { UserPreferencesProvider } from '../contexts/UserPreferencesContext'
import { Footer } from '../components/Footer'
import { TopBar } from '../components/TopBar'
import { Header } from '../components/Header'
import { CountdownKickContainer } from '../components/CountdownKickContainer'
import { ClubsHighlightedes } from '../components/ClubsHighlightedes'
import { MainContainer } from '../components/MainContainer'

import '../styles/global.scss'

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  useEffect(() => {
    const alreadyHasKickTab = localStorage.getItem('brazucagol:hasKickTab')

    if (alreadyHasKickTab === null) {
      localStorage.setItem('brazucagol:hasKickTab', 'true')
    } else {
      return
    }

    window.addEventListener('pagehide', () => {
      const alreadyHasKickTab = localStorage.getItem('brazucagol:hasKickTab')

      if (alreadyHasKickTab !== null) {
        localStorage.removeItem('brazucagol:hasKickTab')
      }
    })

    window.addEventListener('storage', () => {
      // Prevent hard localStorage delete
      const alreadyHasKickTab = localStorage.getItem('brazucagol:hasKickTab')

      if (alreadyHasKickTab === null) {
        localStorage.setItem('brazucagol:hasKickTab', 'true')
      }
    })

    return () => localStorage.removeItem('brazucagol:hasKickTab')
  }, [])

  return (
    <SessionProvider session={session}>
      <IndividualGoalsProvider>
        <AvatarDataProvider>
          <UserPreferencesProvider>
            <TopBar />
            <Header />
            <CountdownKickContainer />
            <ClubsHighlightedes />

            <MainContainer>
              <Component {...pageProps} />
            </MainContainer>

            <Footer />
          </UserPreferencesProvider>
        </AvatarDataProvider>
      </IndividualGoalsProvider>
    </SessionProvider>
  )
}

export default MyApp

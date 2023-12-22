import { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { IndividualGoalsProvider } from '../contexts/IndividualGoalsContext'
import { AvatarDataProvider } from '../contexts/AvatarDataContext'
import { UserPreferencesProvider } from '../contexts/UserPreferencesContext'
import { Footer } from '../components/Footer'
import { TopBar } from '../components/TopBar'
import { Header } from '../components/Header'
import { CountdownKickContainer } from '../components/CountdownKickContainer'
import { ClubsHighlightedes } from '../components/ClubsHighlightedes'
import { MainContainer } from '../components/MainContainer'
import { UnreadChatsProvider } from '../contexts/UnreadChats'

import '../styles/global.scss'

import { Club } from '../@types/index'

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const [clubs, setClubs] = useState<Club[]>()

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

  useEffect(() => {
    fetch('https://api-brazilian-soccer-clubs.cyclic.app/')
      .then((response) => response.json())
      .then((data) => setClubs(data))
  }, [])

  return (
    <SessionProvider session={session}>
      <IndividualGoalsProvider>
        <AvatarDataProvider>
          <UserPreferencesProvider>
            <UnreadChatsProvider>
              <TopBar />
              <Header clubs={clubs} />
              <CountdownKickContainer />
              <ClubsHighlightedes clubs={clubs} />

              <MainContainer>
                <Component {...pageProps} clubs={clubs} />
              </MainContainer>

              <Footer />
            </UnreadChatsProvider>
          </UserPreferencesProvider>
        </AvatarDataProvider>
      </IndividualGoalsProvider>
    </SessionProvider>
  )
}

export default MyApp

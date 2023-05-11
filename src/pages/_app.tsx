import { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import { useEffect } from 'react'
import { IndividualGoalsProvider } from '../contexts/IndividualGoalsContext'
import { AvatarDataProvider } from '../contexts/AvatarDataContext'
import { Footer } from '../components/Footer'

import '../styles/global.scss'

function MyApp({ Component, pageProps }: AppProps) {
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
    <SessionProvider session={pageProps.session}>
      <IndividualGoalsProvider>
        <AvatarDataProvider>
          <Component {...pageProps} />

          <Footer />
        </AvatarDataProvider>
      </IndividualGoalsProvider>
    </SessionProvider>
  )
}

export default MyApp

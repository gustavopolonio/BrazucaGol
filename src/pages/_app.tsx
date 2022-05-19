import { AppProps } from 'next/app'
import { SessionProvider } from "next-auth/react"
import { IndividualGoalsProvider } from '../contexts/IndividualGoalsContext'

import '../styles/global.scss'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <IndividualGoalsProvider>
        <Component {...pageProps} />
      </IndividualGoalsProvider>
    </SessionProvider>
  ) 
}

export default MyApp

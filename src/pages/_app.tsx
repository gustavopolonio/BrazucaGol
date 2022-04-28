import { AppProps } from 'next/app'
import { IndividualGoalsProvider } from '../contexts/IndividualGoalsContext'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <IndividualGoalsProvider>
      <Component {...pageProps} />
    </IndividualGoalsProvider>
  ) 
}

export default MyApp

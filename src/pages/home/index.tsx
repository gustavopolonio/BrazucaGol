import Head from 'next/head'
import { GoalsAmountTables } from '../../components/GoalsAmount'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { ActivateAvatarPopover } from '../../components/ActivateAvatarPopover'

export default function Home() {
  const { data: session } = useSession()

  useEffect(() => {
    if (session === null) {
      // Reset countdown kick time when logout
      sessionStorage.removeItem('brazucagol:timeToKick=trail')
      sessionStorage.removeItem('brazucagol:timeToKick=penalty')
      sessionStorage.removeItem('brazucagol:timeToKick=free-kick')
      sessionStorage.removeItem('brazucagol:timeToKick=auto')
    }
  }, [session])

  return (
    <>
      <Head>
        <title>Home | Brazucagol</title>
      </Head>

      <GoalsAmountTables />

      {session?.isAvatarActive === false && <ActivateAvatarPopover />}
    </>
  )
}

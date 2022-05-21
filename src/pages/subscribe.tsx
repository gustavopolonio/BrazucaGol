import { getSession } from 'next-auth/react'
import { GetServerSideProps } from 'next'
import Head from 'next/head'

export default function Subscribe() {

  return (
    <>
      <Head>
        <title>Cadastre-se | Brazucagol</title>
      </Head>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req })

  if (session?.isAvatarActive) {

    return {
      redirect: {
        permanent: false,
        destination: '/'
      }
    }
  }

  return {
    props: {}
  }
}
import { getSession } from 'next-auth/react'
import { GetServerSideProps } from 'next'

export default function Subscribe() {

  return (
    <h1>Subscribe page</h1>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
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